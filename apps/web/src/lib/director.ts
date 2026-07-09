/**
 * Director — programmatically assembles the "火车大劫案 Train Robbery" scene
 * and its animation, then persists it through the data layer so it can be opened
 * in the scene / animation editors.
 *
 * Staging (duration 34s, looped):
 *  - 所有骑马队伍（劫匪 + 护卫骑兵）从地图左下角出发，斜向冲向地图中心。
 *  - 火车沿铁轨（z=0）从左侧驶入，约 t=15 双方在地图中心附近相遇，战斗打响。
 *  - 相遇后展开三段慢放特写（见相机 beats）。
 *
 * Cinematic beats:
 *  0. 马队出发：相机跟随骑马队伍从角落斜向冲向中心。
 *  1. 假装攻击慢放：近景特写一名劫匪持枪“攻击”的慢动作。
 *  2. 火车上的人被击中掉落慢放：镜头 zoom 到车厢，一名护卫中枪坠车。
 *  3. 骑马人被击中翻倒慢放：近景特写一匹马中枪整体翻倒掉队。
 *  4. 火车驶离，劫匪掉队。
 *
 * Slow-motion is achieved by STRETCHING each dramatic event over several
 * seconds while the camera zooms in and holds.
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
const DURATION = 34;
/** Battle begins near map center at this time (riders arrive from the corner). */
const MEET_T = 15;
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

interface XZ {
  x: number;
  z: number;
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

/** Yaw so the (+Z facing) model looks along the (dx,dz) travel direction. */
function yawOf(a: XZ, b: XZ): number {
  return Math.atan2(b.x - a.x, b.z - a.z);
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
  // Train enters along the rail (z=0) from the left and passes through the map
  // center around MEET_T so it meets the charging riders there.
  const locoX = (t: number) => lerp(-6, 24, t / DURATION);
  const carX = (i: number, t: number) => locoX(t) - 7 * i;

  // Path of a rider: corner start -> center meet (battle) -> exit.
  // All riders spawn near the SAME corner and converge on map center.
  const pathAt = (s: XZ, m: XZ, e: XZ, t: number): XZ => {
    if (t <= MEET_T) {
      const k = t / MEET_T;
      return { x: lerp(s.x, m.x, k), z: lerp(s.z, m.z, k) };
    }
    const k = (t - MEET_T) / (DURATION - MEET_T);
    return { x: lerp(m.x, e.x, k), z: lerp(m.z, e.z, k) };
  };

  // Bandit cavalry — all start at the bottom-left corner (~-30,-18) and fan out
  // slightly, converging on the center formation `m`, then riding out to `e`.
  // index 1 = pretend-attack slow-mo; index 2 & 5 = shot and flip over.
  const banditCfg: { s: XZ; m: XZ; e: XZ }[] = [
    { s: { x: -30, z: -16 }, m: { x: -3, z: 4 }, e: { x: 26, z: 8 } },
    { s: { x: -32, z: -18 }, m: { x: 2, z: -4 }, e: { x: 26, z: -8 } },
    { s: { x: -29, z: -20 }, m: { x: 5, z: 5 }, e: { x: 18, z: 11 } },
    { s: { x: -33, z: -15 }, m: { x: -5, z: -3 }, e: { x: 24, z: -6 } },
    { s: { x: -31, z: -19 }, m: { x: 7, z: 2 }, e: { x: 27, z: 7 } },
    { s: { x: -30, z: -22 }, m: { x: 1, z: -6 }, e: { x: 22, z: -10 } },
    { s: { x: -28, z: -17 }, m: { x: -6, z: 1 }, e: { x: 28, z: 4 } },
  ];
  const ATTACK = 1; // bandit index that mimes the slow-mo attack
  const TOPPLE: Record<number, number> = { 2: 26, 5: 31 }; // bandit idx -> event time

  // Mounted defenders — also ride in from the same corner to intercept.
  const mountDefCfg: { s: XZ; m: XZ; e: XZ }[] = [
    { s: { x: -31, z: -14 }, m: { x: -1, z: 2 }, e: { x: 30, z: 4 } },
    { s: { x: -33, z: -16 }, m: { x: 3, z: -2 }, e: { x: 30, z: -4 } },
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

  // defenders on car roofs (indices 0 & 1 are shot and fall; index 2 survives)
  const defenderObjs: SceneObject[] = [];
  for (let i = 1; i <= 3; i++) {
    const o = createSceneObject(defenderA.id, `护卫 Defender ${i}`);
    o.position = v(carX(i, 0), personY, 0);
    defenderObjs.push(o);
    objects.push(o);
  }

  // bandits on horses — spawned at their corner start, facing their charge dir
  const banditObjs: SceneObject[] = [];
  for (let i = 0; i < banditCfg.length; i++) {
    const c = banditCfg[i];
    const o = createSceneObject(banditA.id, `劫匪 Bandit ${i + 1}`);
    o.position = v(c.s.x, horseG, c.s.z);
    o.rotation = v(0, yawOf(c.s, c.m), 0);
    banditObjs.push(o);
    objects.push(o);
  }

  // mounted defenders intercepting from the corner
  const mountDefObjs: SceneObject[] = [];
  for (let i = 0; i < mountDefCfg.length; i++) {
    const c = mountDefCfg[i];
    const o = createSceneObject(mountDefA.id, `护卫骑兵 Defender Rider ${i + 1}`);
    o.position = v(c.s.x, horseG, c.s.z);
    o.rotation = v(0, yawOf(c.s, c.m), 0);
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

  const bPath = (i: number, t: number) => pathAt(banditCfg[i].s, banditCfg[i].m, banditCfg[i].e, t);

  // Camera + target tracks (replace the auto-added single keyframes).
  // Beats:
  //   0-15  follow the cavalry charging diagonally from the corner to center
  //   15    wide shot of the meeting at map center (train + riders)
  //   17-20 attack slow-mo HOLD (close on bandit 2)
  //   21-25 defender-fall slow-mo zoom HOLD (car 1)
  //   26-30 bandit-flip close-up slow-mo HOLD (bandit 3)
  //   34    pull back, train escapes
  const cam = anim.tracks.find((t) => t.kind === 'camera')!;
  const tgt = anim.tracks.find((t) => t.kind === 'cameraTarget')!;
  const lead0 = bPath(0, 0);
  const lead8 = bPath(0, 8);
  const attackM = banditCfg[ATTACK].m;
  const flip2 = pathAt(banditCfg[2].s, banditCfg[2].m, banditCfg[2].e, 26);
  cam.keyframes = [
    { time: 0, position: v(lead0.x - 12, 12, lead0.z - 16), rotation: v(0, 0, 0), scale: v(1, 1, 1) },
    { time: 8, position: v(lead8.x - 10, 7, lead8.z - 12), rotation: v(0, 0, 0), scale: v(1, 1, 1) },
    { time: 15, position: v(-2, 14, 26), rotation: v(0, 0, 0), scale: v(1, 1, 1) },
    // attack slow-mo: camera holds tight on the miming bandit
    { time: 17, position: v(attackM.x + 3, 3, attackM.z + 6), rotation: v(0, 0, 0), scale: v(1, 1, 1) },
    { time: 20, position: v(attackM.x + 3, 3, attackM.z + 6), rotation: v(0, 0, 0), scale: v(1, 1, 1) },
    // defender-fall slow-mo zoom: camera holds on car 1
    { time: 21, position: v(carX(1, 21) - 1, 3.5, 7), rotation: v(0, 0, 0), scale: v(1, 1, 1) },
    { time: 25, position: v(carX(1, 21) - 1, 3.5, 7), rotation: v(0, 0, 0), scale: v(1, 1, 1) },
    // bandit-flip close-up slow-mo: camera holds on the toppling horse
    { time: 26, position: v(flip2.x - 3, 3, flip2.z + 8), rotation: v(0, 0, 0), scale: v(1, 1, 1) },
    { time: 30, position: v(flip2.x - 3, 3, flip2.z + 8), rotation: v(0, 0, 0), scale: v(1, 1, 1) },
    { time: DURATION, position: v(40, 16, 22), rotation: v(0, 0, 0), scale: v(1, 1, 1) },
  ];
  tgt.keyframes = [
    { time: 0, position: v(lead0.x, 2, lead0.z), rotation: v(0, 0, 0), scale: v(1, 1, 1) },
    { time: 8, position: v(lead8.x, 2, lead8.z), rotation: v(0, 0, 0), scale: v(1, 1, 1) },
    { time: 15, position: v(0, 2, 0), rotation: v(0, 0, 0), scale: v(1, 1, 1) },
    { time: 17, position: v(attackM.x, 2.2, attackM.z), rotation: v(0, 0, 0), scale: v(1, 1, 1) },
    { time: 20, position: v(attackM.x, 2.2, attackM.z), rotation: v(0, 0, 0), scale: v(1, 1, 1) },
    { time: 21, position: v(carX(1, 21), 2, 2), rotation: v(0, 0, 0), scale: v(1, 1, 1) },
    { time: 25, position: v(carX(1, 21), 1.5, 3), rotation: v(0, 0, 0), scale: v(1, 1, 1) },
    { time: 26, position: v(flip2.x, 2, flip2.z), rotation: v(0, 0, 0), scale: v(1, 1, 1) },
    { time: 30, position: v(flip2.x, 1.5, flip2.z), rotation: v(0, 0, 0), scale: v(1, 1, 1) },
    { time: DURATION, position: v(30, 2, 0), rotation: v(0, 0, 0), scale: v(1, 1, 1) },
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

  // Defenders — two are shot and tumble off the train (slow-motion falls).
  const fallPlan: { idx: number; Te: number; Fd: number }[] = [
    { idx: 0, Te: 21, Fd: 4 }, // car 1, slow-mo zoom (21-25)
    { idx: 1, Te: 27, Fd: 2.5 }, // car 2, secondary
  ];
  for (let i = 1; i <= 3; i++) {
    const o = defenderObjs[i - 1];
    const plan = fallPlan.find((f) => f.idx === i - 1);
    if (plan) {
      const xFall = carX(i, plan.Te);
      anim.tracks.push(
        objTrack(o.id, `护卫 ${i}（中枪坠车）`, [
          { t: 0, pos: v(carX(i, 0), personY, 0), state: 'idle' },
          { t: plan.Te - 0.5, pos: v(carX(i, plan.Te - 0.5), personY, 0), state: 'idle' },
          { t: plan.Te, pos: v(xFall, personY - 0.2, 0.6), rot: v(0, 0, 0.4), state: 'idle' },
          { t: plan.Te + 0.5, pos: v(xFall, personY - 0.8, 1.5), rot: v(0, 0, 0.9), state: 'idle' },
          { t: plan.Te + 1.5, pos: v(xFall, personG + 0.6, 2.5), rot: v(0, 0, 1.3), state: 'idle' },
          { t: plan.Te + plan.Fd, pos: v(xFall - 0.5, personG, 3), rot: v(0, 0, Math.PI / 2), state: 'idle' },
          { t: DURATION, pos: v(xFall - 1.5, personG, 3), rot: v(0, 0, Math.PI / 2), state: 'idle' },
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

  // Bandits — charge from the corner; one mimes a slow-mo attack, two are shot
  // and flip. Approach yaw points along the diagonal; at the center they turn to
  // face the train (+X) for the fight.
  for (let i = 0; i < banditCfg.length; i++) {
    const c = banditCfg[i];
    const o = banditObjs[i];
    const approachYaw = yawOf(c.s, c.m);
    if (i === ATTACK) {
      // slow-mo pretend attack near center: lean forward while camera holds.
      anim.tracks.push(
        objTrack(o.id, `劫匪 ${i + 1}（假装攻击·慢放）`, [
          { t: 0, pos: v(c.s.x, horseG, c.s.z), rot: v(0, approachYaw, 0), state: 'walk' },
          { t: MEET_T, pos: v(c.m.x, horseG, c.m.z), rot: v(0, FACE_X, 0), state: 'walk' },
          { t: 17, pos: v(c.m.x + 0.5, horseG, c.m.z), rot: v(0.22, FACE_X, 0), state: 'walk' },
          { t: 19, pos: v(c.m.x + 1.5, horseG, c.m.z), rot: v(0.35, FACE_X, 0), state: 'walk' },
          { t: 20, pos: v(c.m.x + 2.5, horseG, c.m.z), rot: v(0, FACE_X, 0), state: 'walk' },
          { t: DURATION, pos: v(c.e.x, horseG, c.e.z), rot: v(0, FACE_X, 0), state: 'walk' },
        ]),
      );
    } else if (TOPPLE[i] !== undefined) {
      const Te = TOPPLE[i];
      const Fd = i === 2 ? 4 : 2;
      const pf = pathAt(c.s, c.m, c.e, Te); // where the horse is when hit
      anim.tracks.push(
        objTrack(o.id, `劫匪 ${i + 1}（中枪翻倒·慢放）`, [
          { t: 0, pos: v(c.s.x, horseG, c.s.z), rot: v(0, approachYaw, 0), state: 'walk' },
          { t: MEET_T, pos: v(c.m.x, horseG, c.m.z), rot: v(0, FACE_X, 0), state: 'walk' },
          { t: Te - 0.6, pos: v(pf.x, horseG, pf.z), rot: v(0, FACE_X, 0), state: 'walk' },
          { t: Te, pos: v(pf.x, horseG, pf.z + 0.5), rot: v(0, FACE_X, -0.3), state: 'none' },
          { t: Te + 1.0, pos: v(pf.x + 1.5, horseG * 0.8, pf.z + 2), rot: v(0, FACE_X, -0.9), state: 'none' },
          { t: Te + 2.5, pos: v(pf.x + 3, horseG * 0.5, pf.z + 3.5), rot: v(0, FACE_X, -1.6), state: 'none' },
          { t: Te + Fd, pos: v(pf.x + 3, horseG * 0.45, pf.z + 4), rot: v(0, FACE_X, Math.PI), state: 'none' },
          { t: DURATION, pos: v(pf.x + 3, horseG * 0.45, pf.z + 4), rot: v(0, FACE_X, Math.PI), state: 'none' },
        ]),
      );
    } else {
      anim.tracks.push(
        objTrack(o.id, `劫匪 ${i + 1}`, [
          { t: 0, pos: v(c.s.x, horseG, c.s.z), rot: v(0, approachYaw, 0), state: 'walk' },
          { t: MEET_T, pos: v(c.m.x, horseG, c.m.z), rot: v(0, FACE_X, 0), state: 'walk' },
          { t: DURATION, pos: v(c.e.x, horseG, c.e.z), rot: v(0, FACE_X, 0), state: 'walk' },
        ]),
      );
    }
  }

  // Mounted defenders — charge in from the same corner to intercept.
  for (let i = 0; i < mountDefCfg.length; i++) {
    const c = mountDefCfg[i];
    const o = mountDefObjs[i];
    const approachYaw = yawOf(c.s, c.m);
    anim.tracks.push(
      objTrack(o.id, `护卫骑兵 ${i + 1}`, [
        { t: 0, pos: v(c.s.x, horseG, c.s.z), rot: v(0, approachYaw, 0), state: 'walk' },
        { t: MEET_T, pos: v(c.m.x, horseG, c.m.z), rot: v(0, FACE_X, 0), state: 'walk' },
        { t: DURATION, pos: v(c.e.x, horseG, c.e.z), rot: v(0, FACE_X, 0), state: 'walk' },
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
