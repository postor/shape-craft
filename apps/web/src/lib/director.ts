/**
 * Director — programmatically assembles the "火车大劫案 Train Robbery" scene
 * and its animation, then persists it through the data layer so it can be opened
 * in the scene / animation editors.
 *
 * Story beats (duration ~22s, looped):
 *  1. A steam train rolls along the rail (locomotive + 3 cars).
 *  2. Six bandits on horseback (cavalry) charge up from behind and ride
 *     alongside the cars, with two mounted defenders escorting.
 *  3. Defenders standing on the car roofs return fire (idle aim pose).
 *  4. A defender is shot and tumbles off the train onto the ground.
 *  5. One bandit's horse is shot: it veers off the track, topples and is
 *     left behind as the train escapes.
 *
 * All cavalry face +X (the travel direction); their walk clip then reads as a
 * forward gallop. The camera includes several rider-following shots.
 */
import {
  type SceneObject,
  type AnimChannel,
  type AnimKf,
  type AnimState,
  type Vec3,
  createSceneObject,
  createFlatTerrain,
  groundOffsetY,
  createAnimationForScene,
} from '@shape-craft/schema';
import { createAsset } from '../lib/api.ts';
import { createScene } from '../lib/scene-api.ts';
import { createAnimation } from '../lib/anim-api.ts';
import {
  locomotiveAsset,
  trainCarAsset,
  railAsset,
  treeAsset,
  cavalryBanditAsset,
  cavalryDefenderAsset,
  defenderAsset,
} from '@shape-craft/schema';
import { listScenes } from '../lib/scene-api.ts';
import { listAnimationsByScene } from '../lib/anim-api.ts';

export const DEMO_NAME = '火车大劫案 Train Robbery';
const DURATION = 24;
/** Rotation that makes the (default +Z facing) cavalry model face +X. */
const FACE_X = Math.PI / 2;

let _uid = 0;
function uid(p: string): string {
  _uid += 1;
  return `${p}_${Date.now().toString(36)}_${_uid.toString(36)}`;
}
function v(x: number, y: number, z: number): Vec3 {
  return { x, y, z };
}

/** Build one object track from compact keyframe specs. */
function objTrack(
  objectId: string,
  label: string,
  kfs: { t: number; pos: Vec3; rot?: Vec3; state?: AnimState }[],
): AnimChannel {
  return {
    id: uid('track'),
    kind: 'object',
    objectId,
    label,
    keyframes: kfs.map(
      (k): AnimKf => ({
        time: k.t,
        position: { ...k.pos },
        rotation: k.rot ?? v(0, 0, 0),
        scale: v(1, 1, 1),
        ...(k.state ? { state: k.state } : {}),
      }),
    ),
  };
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export interface DirectorResult {
  sceneId: string;
  animationId: string;
}

/** Return the existing demo (if any) or build it fresh. Idempotent. */
export async function getOrBuildTrainRobbery(): Promise<DirectorResult> {
  const scenes = await listScenes();
  const existing = scenes.find((s) => s.name === DEMO_NAME);
  if (existing) {
    const anims = await listAnimationsByScene(existing.id);
    if (anims.length) return { sceneId: existing.id, animationId: anims[0].id };
  }
  return buildTrainRobbery();
}

export async function buildTrainRobbery(): Promise<DirectorResult> {
  // ---- 1. Create the assets ----
  const locoA = await createAsset(locomotiveAsset());
  const carA = await createAsset(trainCarAsset());
  const railA = await createAsset(railAsset());
  const treeA = await createAsset(treeAsset());
  const banditA = await createAsset(cavalryBanditAsset());
  const mountDefA = await createAsset(cavalryDefenderAsset());
  const defenderA = await createAsset(defenderAsset());

  const locoG = groundOffsetY(locoA.root);
  const carG = groundOffsetY(carA.root);
  const treeG = groundOffsetY(treeA.root);
  const horseG = groundOffsetY(banditA.root);
  const personG = groundOffsetY(defenderA.root);

  // geometry constants measured from the prefab builders
  const ROOF_TOP = 2.51;
  const personY = ROOF_TOP + personG; // defender feet rest on a car roof

  // ---- 2. Scene layout ----
  const locoX = (t: number) => lerp(-24, 24, t / DURATION);
  const carX = (i: number, t: number) => locoX(t) - 7 * i;

  // Cavalry configurations (all face +X and gallop along the track).
  // Indices 2 and 5 are the ones shot off their horses (full topple).
  const banditCfg = [
    { lane: 4, x0: -34, x1: 8 },
    { lane: -4, x0: -36, x1: 2 },
    { lane: 4, x0: -30, x1: 12 },
    { lane: -4, x0: -38, x1: -4 },
    { lane: 4, x0: -32, x1: 6 },
    { lane: -4, x0: -40, x1: -2 },
    { lane: 4, x0: -28, x1: 14 },
  ];
  const TOPPLE: Record<number, number> = { 2: 11, 5: 17 };
  const mountDefCfg = [
    { lane: 4, x0: -18, x1: 30 },
    { lane: -4, x0: -28, x1: 20 },
  ];

  const objects: SceneObject[] = [];

  const railObj = createSceneObject(railA.id, '铁轨 Rail');
  railObj.position = v(0, groundOffsetY(railA.root), 0);
  objects.push(railObj);

  const locoObj = createSceneObject(locoA.id, '火车头 Locomotive');
  locoObj.position = v(locoX(0), locoG, 0);
  objects.push(locoObj);

  const carObjs: SceneObject[] = [];
  for (let i = 1; i <= 3; i++) {
    const o = createSceneObject(carA.id, `车厢 Car ${i}`);
    o.position = v(carX(i, 0), carG, 0);
    carObjs.push(o);
    objects.push(o);
  }

  // defenders on car roofs (index 1 = the one who gets shot)
  const defenderObjs: SceneObject[] = [];
  for (let i = 1; i <= 3; i++) {
    const o = createSceneObject(defenderA.id, `护卫 Defender ${i}`);
    o.position = v(carX(i, 0), personY, 0);
    defenderObjs.push(o);
    objects.push(o);
  }

  // bandits on horses (index 2 = the one whose horse is shot)
  const banditObjs: SceneObject[] = [];
  for (let i = 0; i < banditCfg.length; i++) {
    const c = banditCfg[i];
    const o = createSceneObject(banditA.id, `劫匪 Bandit ${i + 1}`);
    o.position = v(lerp(c.x0, c.x1, 0), horseG, c.lane);
    o.rotation = v(0, FACE_X, 0);
    banditObjs.push(o);
    objects.push(o);
  }

  // mounted defenders escorting the train
  const mountDefObjs: SceneObject[] = [];
  for (let i = 0; i < mountDefCfg.length; i++) {
    const c = mountDefCfg[i];
    const o = createSceneObject(mountDefA.id, `护卫骑兵 Defender Rider ${i + 1}`);
    o.position = v(lerp(c.x0, c.x1, 0), horseG, c.lane);
    o.rotation = v(0, FACE_X, 0);
    mountDefObjs.push(o);
    objects.push(o);
  }

  // trees scattered away from the track
  const treeSpots: [number, number, number][] = [
    [-22, 11, 0.9], [14, 12, 1.1], [-8, 13, 0.8], [20, 10, 1.0],
    [-30, 13, 1.2], [4, 14, 0.85], [-16, 12, 1.0], [26, 12, 1.05],
    [-2, -13, 0.95], [10, -12, 1.1], [-26, -12, 1.0], [30, -11, 0.9],
  ];
  for (let i = 0; i < treeSpots.length; i++) {
    const [x, z, s] = treeSpots[i];
    const o = createSceneObject(treeA.id, `树 Tree ${i + 1}`);
    o.position = v(x, treeG, z);
    o.rotation = v(0, (i * 1.3) % (Math.PI * 2), 0);
    o.scale = v(s, s, s);
    objects.push(o);
  }

  // ---- terrain: desert flats with distant rolling hills ----
  const terrain = createFlatTerrain(64, 48, '#c2a878');
  const side = terrain.segments + 1;
  for (let j = 0; j < side; j++) {
    for (let i = 0; i < side; i++) {
      const x = -terrain.size / 2 + (i / terrain.segments) * terrain.size;
      const z = -terrain.size / 2 + (j / terrain.segments) * terrain.size;
      let h = 0;
      h += Math.max(0, Math.abs(x) - 22) * 0.22;
      h += Math.max(0, Math.abs(z) - 9) * 0.16;
      if (h > 0) h += Math.sin(x * 0.22) * Math.cos(z * 0.18) * 0.5;
      terrain.heights[j * side + i] = h;
    }
  }

  const savedScene = await createScene({
    name: DEMO_NAME,
    size: terrain.size,
    waterLevel: -4,
    terrain,
    objects,
  });

  // ---- 3. Animation ----
  const anim = createAnimationForScene(savedScene.id, savedScene.name, savedScene.size, '火车大劫案 · 动画');
  anim.duration = DURATION;

  // helper: bandit x at time t — used for rider-following / event cams
  const bAt = (i: number, t: number) => lerp(banditCfg[i].x0, banditCfg[i].x1, t / DURATION);

  // Camera + target tracks (replace the auto-added single keyframes).
  // Four clear close-up beats: defender falls off car1 (t≈8), bandit topples
  // (t≈11), defender falls off car2 (t≈14), bandit topples (t≈17).
  const cam = anim.tracks.find((t) => t.kind === 'camera')!;
  const tgt = anim.tracks.find((t) => t.kind === 'cameraTarget')!;
  cam.keyframes = [
    { time: 0, position: v(-36, 16, -16), rotation: v(0, 0, 0), scale: v(1, 1, 1) },
    { time: 5, position: v(-22, 9, 18), rotation: v(0, 0, 0), scale: v(1, 1, 1) },
    // close-up: defender shot off car 1
    { time: 8, position: v(carX(1, 8) - 2, 4, 9), rotation: v(0, 0, 0), scale: v(1, 1, 1) },
    // follow-cam: bandit 3 flips over
    { time: 11, position: v(bAt(2, 11) - 4, 3.5, 13), rotation: v(0, 0, 0), scale: v(1, 1, 1) },
    // close-up: defender shot off car 2
    { time: 14, position: v(carX(2, 14) - 2, 4, 9), rotation: v(0, 0, 0), scale: v(1, 1, 1) },
    // follow-cam: bandit 6 flips over
    { time: 17, position: v(bAt(5, 17) - 4, 3.5, banditCfg[5].lane + 9), rotation: v(0, 0, 0), scale: v(1, 1, 1) },
    { time: 20, position: v(20, 8, 16), rotation: v(0, 0, 0), scale: v(1, 1, 1) },
    { time: DURATION, position: v(36, 16, 22), rotation: v(0, 0, 0), scale: v(1, 1, 1) },
  ];
  tgt.keyframes = [
    { time: 0, position: v(-24, 2, 0), rotation: v(0, 0, 0), scale: v(1, 1, 1) },
    { time: 5, position: v(-16, 2, 0), rotation: v(0, 0, 0), scale: v(1, 1, 1) },
    { time: 8, position: v(carX(1, 8), 1.8, 2), rotation: v(0, 0, 0), scale: v(1, 1, 1) },
    { time: 11, position: v(bAt(2, 11), 1.5, 4), rotation: v(0, 0, 0), scale: v(1, 1, 1) },
    { time: 14, position: v(carX(2, 14), 1.8, 2), rotation: v(0, 0, 0), scale: v(1, 1, 1) },
    { time: 17, position: v(bAt(5, 17), 1.5, banditCfg[5].lane), rotation: v(0, 0, 0), scale: v(1, 1, 1) },
    { time: 20, position: v(6, 2, 0), rotation: v(0, 0, 0), scale: v(1, 1, 1) },
    { time: DURATION, position: v(24, 2, 0), rotation: v(0, 0, 0), scale: v(1, 1, 1) },
  ];

  // Train motion tracks (linear translation; props have no walk state).
  anim.tracks.push(
    objTrack(locoObj.id, '火车头', [
      { t: 0, pos: v(locoX(0), locoG, 0) },
      { t: DURATION, pos: v(locoX(DURATION), locoG, 0) },
    ]),
  );
  for (let i = 1; i <= 3; i++) {
    anim.tracks.push(
      objTrack(carObjs[i - 1].id, `车厢 ${i}`, [
        { t: 0, pos: v(carX(i, 0), carG, 0) },
        { t: DURATION, pos: v(carX(i, DURATION), carG, 0) },
      ]),
    );
  }

  // Defenders — two are shot and tumble off the train (car 1 @ t8, car 2 @ t14).
  for (let i = 1; i <= 3; i++) {
    const o = defenderObjs[i - 1];
    const Te = i === 1 ? 8 : i === 2 ? 14 : -1;
    if (Te > 0) {
      const landX = carX(i, Te + 1.2);
      anim.tracks.push(
        objTrack(o.id, `护卫 ${i}（中枪坠车）`, [
          { t: 0, pos: v(carX(i, 0), personY, 0), state: 'idle' },
          { t: Te - 0.5, pos: v(carX(i, Te - 0.5), personY, 0), state: 'idle' },
          { t: Te, pos: v(carX(i, Te), personY - 0.3, 1.0), rot: v(0, 0, 0.6), state: 'idle' },
          { t: Te + 1.2, pos: v(landX, personG, 3), rot: v(0, 0, Math.PI / 2), state: 'idle' },
          { t: DURATION, pos: v(landX - 1, personG, 3), rot: v(0, 0, Math.PI / 2), state: 'idle' },
        ]),
      );
    } else {
      anim.tracks.push(
        objTrack(o.id, `护卫 ${i}`, [
          { t: 0, pos: v(carX(i, 0), personY, 0), state: 'idle' },
          { t: DURATION, pos: v(carX(i, DURATION), personY, 0), state: 'idle' },
        ]),
      );
    }
  }

  // Bandits — charge up and ride alongside; two are shot and flip right over.
  for (let i = 0; i < banditCfg.length; i++) {
    const c = banditCfg[i];
    const o = banditObjs[i];
    const xAt = (t: number) => lerp(c.x0, c.x1, t / DURATION);
    const Te = TOPPLE[i];
    if (Te !== undefined) {
      anim.tracks.push(
        objTrack(o.id, `劫匪 ${i + 1}（中枪翻倒）`, [
          { t: 0, pos: v(xAt(0), horseG, c.lane), rot: v(0, FACE_X, 0), state: 'walk' },
          { t: Te - 0.6, pos: v(xAt(Te - 0.6), horseG, c.lane), rot: v(0, FACE_X, 0), state: 'walk' },
          { t: Te, pos: v(xAt(Te), horseG, c.lane + 1.5), rot: v(0, FACE_X, -0.5), state: 'none' },
          { t: Te + 1.1, pos: v(xAt(Te) + 2, horseG * 0.45, c.lane + 4), rot: v(0, FACE_X, Math.PI), state: 'none' },
          { t: DURATION, pos: v(xAt(Te) + 2, horseG * 0.45, c.lane + 5), rot: v(0, FACE_X, Math.PI), state: 'none' },
        ]),
      );
    } else {
      anim.tracks.push(
        objTrack(o.id, `劫匪 ${i + 1}`, [
          { t: 0, pos: v(xAt(0), horseG, c.lane), rot: v(0, FACE_X, 0), state: 'walk' },
          { t: DURATION, pos: v(xAt(DURATION), horseG, c.lane), rot: v(0, FACE_X, 0), state: 'walk' },
        ]),
      );
    }
  }

  // Mounted defenders escort the train (face +X, gallop along).
  for (let i = 0; i < mountDefCfg.length; i++) {
    const c = mountDefCfg[i];
    const o = mountDefObjs[i];
    const xAt = (t: number) => lerp(c.x0, c.x1, t / DURATION);
    anim.tracks.push(
      objTrack(o.id, `护卫骑兵 ${i + 1}`, [
        { t: 0, pos: v(xAt(0), horseG, c.lane), rot: v(0, FACE_X, 0), state: 'walk' },
        { t: DURATION, pos: v(xAt(DURATION), horseG, c.lane), rot: v(0, FACE_X, 0), state: 'walk' },
      ]),
    );
  }

  const savedAnim = await createAnimation({
    name: anim.name,
    sceneId: savedScene.id,
    duration: anim.duration,
    tracks: anim.tracks,
  });

  return { sceneId: savedScene.id, animationId: savedAnim.id };
}
