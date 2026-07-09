/**
 * Parameter-controlled self-test harness.
 *
 * Enabled by a `test=<groups>` query param in the hash or search string, e.g.
 *   #/animations?test=all&log=1
 *   #/animations?test=schema
 *   #/animations?test=api
 *
 * Groups (comma separated):
 *   - schema : pure animation-schema logic (no network).
 *   - api    : full CRUD round-trip through the animation API (needs backend
 *              or falls back to localStorage).
 *   - all    : every group.
 *
 * Results are printed to the console (mirrored into the on-page #__console when
 * `log=1`) and stored on `window.__selftest` so an external driver (e.g. the
 * browseros MCP) can read a machine-checkable summary.
 */
import {
  createAnimationForScene,
  sampleTrack,
  trackForObject,
  createEmptyScene,
  vec3,
  type AnimComponent,
} from '@shape-craft/schema';
import { createScene, deleteScene } from './scene-api.ts';
import {
  createAnimation,
  getAnimation,
  listAnimationsByScene,
  updateAnimation,
  deleteAnimation,
} from './anim-api.ts';

export interface TestResult {
  name: string;
  group: string;
  ok: boolean;
  detail?: string;
}

interface TestCtx {
  results: TestResult[];
  group: string;
}

function check(ctx: TestCtx, name: string, cond: boolean, detail?: string) {
  const r: TestResult = { name, group: ctx.group, ok: cond, detail };
  ctx.results.push(r);
  const tag = cond ? 'PASS' : 'FAIL';
  console.log(`[selftest] ${tag} · ${ctx.group} · ${name}${detail ? ' — ' + detail : ''}`);
}

function approx(a: number, b: number, eps = 1e-6): boolean {
  return Math.abs(a - b) <= eps;
}

// ---------------------------------------------------------------------------
// schema group (pure)
// ---------------------------------------------------------------------------

function runSchema(ctx: TestCtx) {
  ctx.group = 'schema';
  const anim = createAnimationForScene('scene_x', 'Demo', 24);

  check(ctx, 'auto camera+target tracks', anim.tracks.length === 2);
  check(ctx, 'has camera track', anim.tracks.some((t) => t.kind === 'camera'));
  check(ctx, 'has cameraTarget track (empty node)', anim.tracks.some((t) => t.kind === 'cameraTarget'));
  check(ctx, 'target starts at origin', (() => {
    const tgt = anim.tracks.find((t) => t.kind === 'cameraTarget')!;
    const p = tgt.keyframes[0].position;
    return p.x === 0 && p.y === 0 && p.z === 0;
  })());

  // sampleTrack interpolation on a 2-keyframe object track.
  const track = {
    id: 't1',
    kind: 'object' as const,
    objectId: 'obj1',
    keyframes: [
      { time: 0, position: vec3(0, 0, 0), rotation: vec3(), scale: vec3(1, 1, 1) },
      { time: 2, position: vec3(10, 0, 0), rotation: vec3(), scale: vec3(1, 1, 1), state: 'walk' as const },
    ],
  };
  const mid = sampleTrack(track, 1);
  check(ctx, 'midpoint interpolation (x≈5)', approx(mid.position.x, 5), `x=${mid.position.x}`);
  check(ctx, 'segment state carried (walk)', mid.state === 'walk', `state=${mid.state}`);
  const before = sampleTrack(track, -1);
  check(ctx, 'clamp before first kf', approx(before.position.x, 0));
  const after = sampleTrack(track, 99);
  check(ctx, 'clamp after last kf', approx(after.position.x, 10));

  // trackForObject uniqueness lookup.
  anim.tracks.push(track);
  check(ctx, 'trackForObject finds bound track', trackForObject(anim, 'obj1')?.id === 't1');
  check(ctx, 'trackForObject null for unbound', trackForObject(anim, 'nope') === null);
}

// ---------------------------------------------------------------------------
// api group (round-trip; backend or localStorage fallback)
// ---------------------------------------------------------------------------

async function runApi(ctx: TestCtx) {
  ctx.group = 'api';
  let sceneId: string | undefined;
  let animId: string | undefined;
  try {
    const scene = await createScene({
      ...createEmptyScene('SelfTest Scene'),
    } as never);
    sceneId = scene.id;
    check(ctx, 'create scene', !!scene.id);

    const draft = createAnimationForScene(scene.id, scene.name, scene.size, 'SelfTest Anim');
    const created: AnimComponent = await createAnimation({
      name: draft.name,
      sceneId: draft.sceneId,
      duration: draft.duration,
      tracks: draft.tracks,
    });
    animId = created.id;
    check(ctx, 'create animation', !!created.id);
    check(ctx, 'animation bound to scene', created.sceneId === scene.id);
    check(ctx, 'persisted camera+target tracks', created.tracks.length === 2);

    const byScene = await listAnimationsByScene(scene.id);
    check(ctx, 'listByScene returns it', byScene.some((a) => a.id === created.id));

    const updated = await updateAnimation(created.id, {
      name: 'SelfTest Anim v2',
      sceneId: scene.id,
      duration: 12,
      tracks: created.tracks,
    });
    check(ctx, 'update duration', updated.duration === 12, `duration=${updated.duration}`);

    const fetched = await getAnimation(created.id);
    check(ctx, 'get after update', fetched?.name === 'SelfTest Anim v2');
  } catch (err) {
    check(ctx, 'api round-trip (no exception)', false, String(err));
  } finally {
    if (animId) await deleteAnimation(animId).catch(() => {});
    if (sceneId) await deleteScene(sceneId).catch(() => {});
    check(ctx, 'cleanup done', true);
  }
}

// ---------------------------------------------------------------------------
// Driver
// ---------------------------------------------------------------------------

/** Read the `test` param from the hash query or the real query string. */
export function getTestGroups(): string[] {
  const qs = (location.hash.split('?')[1] || '') + '&' + (location.search.replace(/^\?/, '') || '');
  const m = /(?:^|&)test=([^&]+)/.exec(qs);
  if (!m) return [];
  const raw = decodeURIComponent(m[1]).toLowerCase();
  const groups = raw.split(',').map((s) => s.trim()).filter(Boolean);
  return groups.includes('all') ? ['schema', 'api'] : groups;
}

export async function runSelfTests(groups: string[]): Promise<TestResult[]> {
  const ctx: TestCtx = { results: [], group: '' };
  console.log(`[selftest] START groups=[${groups.join(', ')}]`);
  if (groups.includes('schema')) runSchema(ctx);
  if (groups.includes('api')) await runApi(ctx);
  const passed = ctx.results.filter((r) => r.ok).length;
  const failed = ctx.results.length - passed;
  console.log(`[selftest] DONE total=${ctx.results.length} passed=${passed} failed=${failed}`);
  (window as unknown as { __selftest: unknown }).__selftest = {
    groups,
    total: ctx.results.length,
    passed,
    failed,
    results: ctx.results,
  };
  return ctx.results;
}

/** Auto-run when a `test=` param is present. Returns true if it ran. */
export function maybeRunSelfTests(): boolean {
  const groups = getTestGroups();
  if (groups.length === 0) return false;
  void runSelfTests(groups);
  return true;
}
