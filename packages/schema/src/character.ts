/**
 * Character authoring — skeleton rigs + axis-animation system.
 *
 * A character is an `AssetPart` tree where the bones are `node` parts (pure
 * transform containers, no geometry) and the visible limbs are mesh parts
 * parented under the relevant bone. Each bone gets a stable, human-readable
 * `name` (e.g. "joint.hipL") so the animation system can find it at runtime.
 *
 * Animations are "script slots": an {@link AnimClip} is a list of {@link
 * AnimTrack}s, each track references a bone (by name) and an axis (x/y/z) and
 * drives that bone's rotation over time. Adding a new animation for any rig is
 * just a matter of registering another clip in {@link CHARACTER_CLIPS}.
 */
import { AssetCategory, AssetPart, createPart, defaultMaterial, recenterPartTree, vec3 } from './index.ts';

export type CharacterType = 'humanoid' | 'quadruped' | 'flying';

export const CHARACTER_TYPES: CharacterType[] = ['humanoid', 'quadruped', 'flying'];

export const CHARACTER_TYPE_LABEL: Record<CharacterType, string> = {
  humanoid: 'Humanoid 人形',
  quadruped: 'Quadruped 四足',
  flying: 'Flying 飞行',
};

/** A visible limb mesh mounted on a bone (offset from the bone pivot). */
export interface CharacterMeshSpec {
  shape: 'box' | 'sphere' | 'cylinder' | 'cone';
  size: { x: number; y: number; z: number };
  color: string;
  /** Mesh center offset relative to the bone pivot. */
  offset?: { x: number; y: number; z: number };
  /** Rest rotation of the mesh (radians). */
  rotation?: { x: number; y: number; z: number };
}

/**
 * A single bone in the rig. `position` is the pivot location in the parent
 * bone's local space. `rest` is the bone's neutral rotation (radians) — the
 * animation system adds deltas on top of this rest pose.
 */
export interface CharacterJointSpec {
  name: string;
  parent: string | null;
  position: { x: number; y: number; z: number };
  rest?: { x: number; y: number; z: number };
  mesh?: CharacterMeshSpec;
}

export interface CharacterRig {
  type: CharacterType;
  joints: CharacterJointSpec[];
}

// ---------------------------------------------------------------------------
// Rig builders
// ---------------------------------------------------------------------------

function meshPart(m: CharacterMeshSpec, name: string): AssetPart {
  return createPart({
    name,
    shape: m.shape,
    size: vec3(m.size.x, m.size.y, m.size.z),
    position: vec3(m.offset?.x ?? 0, m.offset?.y ?? 0, m.offset?.z ?? 0),
    rotation: vec3(m.rotation?.x ?? 0, m.rotation?.y ?? 0, m.rotation?.z ?? 0),
    material: defaultMaterial(m.color),
  });
}

function bonePart(j: CharacterJointSpec): AssetPart {
  const bone = createPart({
    name: j.name,
    shape: 'node',
    position: vec3(j.position.x, j.position.y, j.position.z),
    rotation: vec3(j.rest?.x ?? 0, j.rest?.y ?? 0, j.rest?.z ?? 0),
  });
  if (j.mesh) bone.children.push(meshPart(j.mesh, `${j.name}.mesh`));
  return bone;
}

/**
 * Build the `AssetPart` tree for a rig. Bones are `node` parts; the visible
 * limb meshes hang as their children. Parents are resolved by name, so joints
 * may be declared in any order.
 */
export function buildCharacterRoot(rig: CharacterRig): AssetPart {
  const byName = new Map<string, AssetPart>();
  for (const j of rig.joints) byName.set(j.name, bonePart(j));

  for (const j of rig.joints) {
    if (!j.parent) continue;
    const parent = byName.get(j.parent);
    const child = byName.get(j.name);
    if (parent && child) parent.children.push(child);
  }

  const root = createPart({
    name: `Character:${rig.type}`,
    shape: 'node',
  });
  const orphans = rig.joints.filter((j) => !j.parent);
  for (const j of orphans) {
    const child = byName.get(j.name);
    if (child) root.children.push(child);
  }
  return recenterPartTree(root);
}

// ---------------------------------------------------------------------------
// Animation clips (script slots)
// ---------------------------------------------------------------------------

export type AnimName = 'idle' | 'sit' | 'walk' | 'fly';

export interface AnimKeyframe {
  /** Normalized time in [0, 1] across the whole clip. */
  t: number;
  /** Rotation value in radians to add on top of the bone's rest pose. */
  value: number;
}

export interface AnimTrack {
  /** Bone name (matches CharacterJointSpec.name). */
  joint: string;
  axis: 'x' | 'y' | 'z';
  keyframes: AnimKeyframe[];
}

export interface AnimClip {
  name: string;
  label: string;
  /** Loop duration in seconds. */
  duration: number;
  tracks: AnimTrack[];
}

const D = (deg: number) => (deg * Math.PI) / 180;

// ---- Humanoid rig ---------------------------------------------------------

const HUMANOID_RIG: CharacterRig = {
  type: 'humanoid',
  joints: [
    {
      name: 'joint.pelvis',
      parent: null,
      position: vec3(0, 0.95, 0),
      mesh: { shape: 'box', size: vec3(0.42, 0.22, 0.26), color: '#3f6fb0', offset: vec3(0, 0, 0) },
    },
    {
      name: 'joint.spine',
      parent: 'joint.pelvis',
      position: vec3(0, 0.11, 0),
      mesh: { shape: 'box', size: vec3(0.5, 0.55, 0.3), color: '#4caf50', offset: vec3(0, 0.27, 0) },
    },
    {
      name: 'joint.head',
      parent: 'joint.spine',
      position: vec3(0, 0.62, 0),
      mesh: { shape: 'sphere', size: vec3(0.17, 0.17, 0.17), color: '#f1c27d', offset: vec3(0, 0.2, 0) },
    },
    {
      name: 'joint.shoulderL',
      parent: 'joint.spine',
      position: vec3(-0.32, 0.42, 0),
      mesh: { shape: 'box', size: vec3(0.14, 0.42, 0.14), color: '#4caf50', offset: vec3(0, -0.21, 0) },
    },
    {
      name: 'joint.elbowL',
      parent: 'joint.shoulderL',
      position: vec3(0, -0.42, 0),
      mesh: { shape: 'box', size: vec3(0.12, 0.42, 0.12), color: '#f1c27d', offset: vec3(0, -0.21, 0) },
    },
    {
      name: 'joint.shoulderR',
      parent: 'joint.spine',
      position: vec3(0.32, 0.42, 0),
      mesh: { shape: 'box', size: vec3(0.14, 0.42, 0.14), color: '#4caf50', offset: vec3(0, -0.21, 0) },
    },
    {
      name: 'joint.elbowR',
      parent: 'joint.shoulderR',
      position: vec3(0, -0.42, 0),
      mesh: { shape: 'box', size: vec3(0.12, 0.42, 0.12), color: '#f1c27d', offset: vec3(0, -0.21, 0) },
    },
    {
      name: 'joint.hipL',
      parent: 'joint.pelvis',
      position: vec3(-0.16, -0.1, 0),
      mesh: { shape: 'box', size: vec3(0.18, 0.46, 0.18), color: '#2f6f9f', offset: vec3(0, -0.23, 0) },
    },
    {
      name: 'joint.kneeL',
      parent: 'joint.hipL',
      position: vec3(0, -0.46, 0),
      mesh: { shape: 'box', size: vec3(0.16, 0.46, 0.16), color: '#1f4f7f', offset: vec3(0, -0.23, 0) },
    },
    {
      name: 'joint.hipR',
      parent: 'joint.pelvis',
      position: vec3(0.16, -0.1, 0),
      mesh: { shape: 'box', size: vec3(0.18, 0.46, 0.18), color: '#2f6f9f', offset: vec3(0, -0.23, 0) },
    },
    {
      name: 'joint.kneeR',
      parent: 'joint.hipR',
      position: vec3(0, -0.46, 0),
      mesh: { shape: 'box', size: vec3(0.16, 0.46, 0.16), color: '#1f4f7f', offset: vec3(0, -0.23, 0) },
    },
  ],
};

// ---- Quadruped rig --------------------------------------------------------

const QUADRUPED_RIG: CharacterRig = {
  type: 'quadruped',
  joints: [
    {
      name: 'joint.body',
      parent: null,
      position: vec3(0, 0.75, 0),
      mesh: { shape: 'box', size: vec3(0.44, 0.4, 1.0), color: '#b5732f', offset: vec3(0, 0, 0) },
    },
    {
      name: 'joint.neck',
      parent: 'joint.body',
      position: vec3(0, 0.1, 0.55),
      mesh: { shape: 'box', size: vec3(0.22, 0.22, 0.4), color: '#c98a3f', offset: vec3(0, 0.05, 0.15) },
    },
    {
      name: 'joint.head',
      parent: 'joint.neck',
      position: vec3(0, 0.1, 0.4),
      mesh: { shape: 'box', size: vec3(0.26, 0.26, 0.34), color: '#a5642a', offset: vec3(0, 0.05, 0.1) },
    },
    {
      name: 'joint.legFL',
      parent: 'joint.body',
      position: vec3(-0.2, -0.18, 0.38),
      mesh: { shape: 'box', size: vec3(0.12, 0.45, 0.12), color: '#8a531f', offset: vec3(0, -0.22, 0) },
    },
    {
      name: 'joint.kneeFL',
      parent: 'joint.legFL',
      position: vec3(0, -0.45, 0),
      mesh: { shape: 'box', size: vec3(0.1, 0.42, 0.1), color: '#6f4220', offset: vec3(0, -0.2, 0) },
    },
    {
      name: 'joint.legFR',
      parent: 'joint.body',
      position: vec3(0.2, -0.18, 0.38),
      mesh: { shape: 'box', size: vec3(0.12, 0.45, 0.12), color: '#8a531f', offset: vec3(0, -0.22, 0) },
    },
    {
      name: 'joint.kneeFR',
      parent: 'joint.legFR',
      position: vec3(0, -0.45, 0),
      mesh: { shape: 'box', size: vec3(0.1, 0.42, 0.1), color: '#6f4220', offset: vec3(0, -0.2, 0) },
    },
    {
      name: 'joint.legBL',
      parent: 'joint.body',
      position: vec3(-0.2, -0.18, -0.38),
      mesh: { shape: 'box', size: vec3(0.13, 0.5, 0.13), color: '#8a531f', offset: vec3(0, -0.25, 0) },
    },
    {
      name: 'joint.kneeBL',
      parent: 'joint.legBL',
      position: vec3(0, -0.5, 0),
      mesh: { shape: 'box', size: vec3(0.11, 0.46, 0.11), color: '#6f4220', offset: vec3(0, -0.22, 0) },
    },
    {
      name: 'joint.legBR',
      parent: 'joint.body',
      position: vec3(0.2, -0.18, -0.38),
      mesh: { shape: 'box', size: vec3(0.13, 0.5, 0.13), color: '#8a531f', offset: vec3(0, -0.25, 0) },
    },
    {
      name: 'joint.kneeBR',
      parent: 'joint.legBR',
      position: vec3(0, -0.5, 0),
      mesh: { shape: 'box', size: vec3(0.11, 0.46, 0.11), color: '#6f4220', offset: vec3(0, -0.22, 0) },
    },
    {
      name: 'joint.tail',
      parent: 'joint.body',
      position: vec3(0, 0.05, -0.55),
      mesh: { shape: 'box', size: vec3(0.1, 0.1, 0.5), color: '#a5642a', offset: vec3(0, 0, -0.22) },
    },
  ],
};

// ---- Flying rig -----------------------------------------------------------

const FLYING_RIG: CharacterRig = {
  type: 'flying',
  joints: [
    {
      name: 'joint.body',
      parent: null,
      position: vec3(0, 1.0, 0),
      mesh: { shape: 'box', size: vec3(0.3, 0.28, 0.7), color: '#5b8def', offset: vec3(0, 0, 0) },
    },
    {
      name: 'joint.neck',
      parent: 'joint.body',
      position: vec3(0, 0.14, 0.4),
      mesh: { shape: 'box', size: vec3(0.12, 0.12, 0.6), color: '#7aa7f0', offset: vec3(0, 0.07, 0.22) },
    },
    {
      name: 'joint.head',
      parent: 'joint.neck',
      position: vec3(0, 0.14, 0.56),
      mesh: { shape: 'sphere', size: vec3(0.18, 0.16, 0.18), color: '#f1c27d', offset: vec3(0, 0.06, 0.05) },
    },
    {
      name: 'joint.beak',
      parent: 'joint.head',
      position: vec3(0, 0.02, 0.16),
      mesh: { shape: 'cone', size: vec3(0.08, 0.26, 0.08), color: '#e8913a', offset: vec3(0, 0, 0.13), rotation: vec3(Math.PI / 2, 0, 0) },
    },
    {
      name: 'joint.wingL',
      parent: 'joint.body',
      position: vec3(-0.18, 0.05, 0),
      mesh: { shape: 'box', size: vec3(0.6, 0.06, 0.34), color: '#3f6fb0', offset: vec3(-0.32, 0, 0) },
    },
    {
      name: 'joint.wingTipL',
      parent: 'joint.wingL',
      position: vec3(-0.64, 0, 0),
      mesh: { shape: 'box', size: vec3(0.6, 0.05, 0.3), color: '#355c93', offset: vec3(-0.3, 0, 0) },
    },
    {
      name: 'joint.wingR',
      parent: 'joint.body',
      position: vec3(0.18, 0.05, 0),
      mesh: { shape: 'box', size: vec3(0.6, 0.06, 0.34), color: '#3f6fb0', offset: vec3(0.32, 0, 0) },
    },
    {
      name: 'joint.wingTipR',
      parent: 'joint.wingR',
      position: vec3(0.64, 0, 0),
      mesh: { shape: 'box', size: vec3(0.6, 0.05, 0.3), color: '#355c93', offset: vec3(0.3, 0, 0) },
    },
    {
      name: 'joint.legL',
      parent: 'joint.body',
      position: vec3(-0.1, -0.12, 0.05),
      mesh: { shape: 'box', size: vec3(0.1, 0.42, 0.1), color: '#e0a23a', offset: vec3(0, -0.21, 0) },
    },
    {
      name: 'joint.footL',
      parent: 'joint.legL',
      position: vec3(0, -0.42, 0),
      mesh: { shape: 'box', size: vec3(0.14, 0.08, 0.24), color: '#caa', offset: vec3(0, -0.04, 0.06) },
    },
    {
      name: 'joint.legR',
      parent: 'joint.body',
      position: vec3(0.1, -0.12, 0.05),
      mesh: { shape: 'box', size: vec3(0.1, 0.42, 0.1), color: '#e0a23a', offset: vec3(0, -0.21, 0) },
    },
    {
      name: 'joint.footR',
      parent: 'joint.legR',
      position: vec3(0, -0.42, 0),
      mesh: { shape: 'box', size: vec3(0.14, 0.08, 0.24), color: '#caa', offset: vec3(0, -0.04, 0.06) },
    },
    {
      name: 'joint.tail',
      parent: 'joint.body',
      position: vec3(0, 0, -0.4),
      mesh: { shape: 'cone', size: vec3(0.14, 0.5, 0.14), color: '#5b8def', offset: vec3(0, 0, -0.28), rotation: vec3(Math.PI / 2, 0, 0) },
    },
  ],
};

export const CHARACTER_RIGS: Record<CharacterType, CharacterRig> = {
  humanoid: HUMANOID_RIG,
  quadruped: QUADRUPED_RIG,
  flying: FLYING_RIG,
};

// ---------------------------------------------------------------------------
// Animation clips
// ---------------------------------------------------------------------------

const kf = (t: number, value: number): AnimKeyframe => ({ t, value });

/** Humanoid idle: subtle breathing + arm sway. */
const HUMANOID_IDLE: AnimClip = {
  name: 'idle',
  label: 'Stand 站立',
  duration: 3,
  tracks: [
    { joint: 'joint.spine', axis: 'x', keyframes: [kf(0, 0), kf(0.5, D(2)), kf(1, 0)] },
    { joint: 'joint.shoulderL', axis: 'x', keyframes: [kf(0, D(3)), kf(0.5, D(1)), kf(1, D(3))] },
    { joint: 'joint.shoulderR', axis: 'x', keyframes: [kf(0, D(3)), kf(0.5, D(5)), kf(1, D(3))] },
    { joint: 'joint.head', axis: 'y', keyframes: [kf(0, D(-4)), kf(0.5, D(4)), kf(1, D(-4))] },
  ],
};

/** Humanoid sit: bend hips forward, knees up, spine lean back. */
const HUMANOID_SIT: AnimClip = {
  name: 'sit',
  label: 'Sit 坐',
  duration: 2.5,
  tracks: [
    { joint: 'joint.pelvis', axis: 'x', keyframes: [kf(0, D(8)), kf(1, D(8))] },
    { joint: 'joint.spine', axis: 'x', keyframes: [kf(0, D(-12)), kf(1, D(-12))] },
    { joint: 'joint.hipL', axis: 'x', keyframes: [kf(0, D(85)), kf(1, D(85))] },
    { joint: 'joint.hipR', axis: 'x', keyframes: [kf(0, D(85)), kf(1, D(85))] },
    { joint: 'joint.kneeL', axis: 'x', keyframes: [kf(0, D(-95)), kf(1, D(-95))] },
    { joint: 'joint.kneeR', axis: 'x', keyframes: [kf(0, D(-95)), kf(1, D(-95))] },
    { joint: 'joint.shoulderL', axis: 'x', keyframes: [kf(0, D(14)), kf(1, D(14))] },
    { joint: 'joint.shoulderR', axis: 'x', keyframes: [kf(0, D(14)), kf(1, D(14))] },
  ],
};

/**
 * Humanoid walk: one full gait cycle per clip duration.
 * Legs and arms share the same period; each arm is anti-phase to the
 * same-side leg (left leg forward ⇒ left arm back), giving natural
 * contralateral coordination. Knees bend during each leg's forward swing.
 */
const HUMANOID_WALK: AnimClip = {
  name: 'walk',
  label: 'Walk 走',
  duration: 1.4,
  tracks: [
    // Left leg forward at t=0, back at t=0.5; right leg mirrors it.
    { joint: 'joint.hipL', axis: 'x', keyframes: [kf(0, D(28)), kf(0.25, 0), kf(0.5, D(-22)), kf(0.75, 0), kf(1, D(28))] },
    { joint: 'joint.hipR', axis: 'x', keyframes: [kf(0, D(-22)), kf(0.25, 0), kf(0.5, D(28)), kf(0.75, 0), kf(1, D(-22))] },
    // Knee lifts during the forward swing (left: t 0.5→1, right: t 0→0.5).
    { joint: 'joint.kneeL', axis: 'x', keyframes: [kf(0, 0), kf(0.5, 0), kf(0.75, D(-35)), kf(1, 0)] },
    { joint: 'joint.kneeR', axis: 'x', keyframes: [kf(0, 0), kf(0.25, D(-35)), kf(0.5, 0), kf(1, 0)] },
    // Arms anti-phase to same-side legs: left arm back while left leg forward.
    { joint: 'joint.shoulderL', axis: 'x', keyframes: [kf(0, D(-26)), kf(0.25, 0), kf(0.5, D(26)), kf(0.75, 0), kf(1, D(-26))] },
    { joint: 'joint.shoulderR', axis: 'x', keyframes: [kf(0, D(26)), kf(0.25, 0), kf(0.5, D(-26)), kf(0.75, 0), kf(1, D(26))] },
    { joint: 'joint.elbowL', axis: 'x', keyframes: [kf(0, D(12)), kf(1, D(12))] },
    { joint: 'joint.elbowR', axis: 'x', keyframes: [kf(0, D(12)), kf(1, D(12))] },
    { joint: 'joint.spine', axis: 'y', keyframes: [kf(0, D(-4)), kf(0.5, D(4)), kf(1, D(-4))] },
  ],
};

/** Quadruped idle: gentle head + tail sway. */
const QUADRUPED_IDLE: AnimClip = {
  name: 'idle',
  label: 'Stand 站立',
  duration: 3,
  tracks: [
    { joint: 'joint.head', axis: 'x', keyframes: [kf(0, D(-3)), kf(0.5, D(3)), kf(1, D(-3))] },
    { joint: 'joint.tail', axis: 'y', keyframes: [kf(0, D(-6)), kf(0.5, D(6)), kf(1, D(-6))] },
    { joint: 'joint.body', axis: 'x', keyframes: [kf(0, D(1)), kf(0.5, D(-1)), kf(1, D(1))] },
  ],
};

/** Quadruped walk: diagonal leg pairs (FL+BR, FR+BL) out of phase. */
const QUADRUPED_WALK: AnimClip = {
  name: 'walk',
  label: 'Walk 走',
  duration: 1.6,
  tracks: [
    { joint: 'joint.legFL', axis: 'x', keyframes: [kf(0, D(24)), kf(0.5, D(-20)), kf(1, D(24))] },
    { joint: 'joint.kneeFL', axis: 'x', keyframes: [kf(0, 0), kf(0.2, D(-30)), kf(0.45, 0), kf(1, 0)] },
    { joint: 'joint.legBR', axis: 'x', keyframes: [kf(0, D(24)), kf(0.5, D(-20)), kf(1, D(24))] },
    { joint: 'joint.kneeBR', axis: 'x', keyframes: [kf(0, 0), kf(0.2, D(-30)), kf(0.45, 0), kf(1, 0)] },
    { joint: 'joint.legFR', axis: 'x', keyframes: [kf(0, D(-20)), kf(0.5, D(24)), kf(1, D(-20))] },
    { joint: 'joint.kneeFR', axis: 'x', keyframes: [kf(0, D(-30)), kf(0.7, 0), kf(0.9, D(-30)), kf(1, D(-30))] },
    { joint: 'joint.legBL', axis: 'x', keyframes: [kf(0, D(-20)), kf(0.5, D(24)), kf(1, D(-20))] },
    { joint: 'joint.kneeBL', axis: 'x', keyframes: [kf(0, D(-30)), kf(0.7, 0), kf(0.9, D(-30)), kf(1, D(-30))] },
    { joint: 'joint.tail', axis: 'y', keyframes: [kf(0, D(-4)), kf(0.5, D(4)), kf(1, D(-4))] },
    { joint: 'joint.head', axis: 'x', keyframes: [kf(0, D(-2)), kf(0.5, D(2)), kf(1, D(-2))] },
  ],
};

/** Flying idle: wings folded back along the body (like a perched bird) + breathing. */
const FLYING_IDLE: AnimClip = {
  name: 'idle',
  label: 'Stand 站立',
  duration: 3,
  tracks: [
    { joint: 'joint.wingL', axis: 'y', keyframes: [kf(0, D(-82)), kf(0.5, D(-78)), kf(1, D(-82))] },
    { joint: 'joint.wingTipL', axis: 'y', keyframes: [kf(0, D(-45)), kf(0.5, D(-42)), kf(1, D(-45))] },
    { joint: 'joint.wingR', axis: 'y', keyframes: [kf(0, D(82)), kf(0.5, D(78)), kf(1, D(82))] },
    { joint: 'joint.wingTipR', axis: 'y', keyframes: [kf(0, D(45)), kf(0.5, D(42)), kf(1, D(45))] },
    { joint: 'joint.body', axis: 'x', keyframes: [kf(0, D(2)), kf(0.5, D(-2)), kf(1, D(2))] },
  ],
};

/** Flying walk: wings folded, walking on feet (leg swing) + light bob. */
const FLYING_WALK: AnimClip = {
  name: 'walk',
  label: 'Walk 走',
  duration: 1.8,
  tracks: [
    { joint: 'joint.wingL', axis: 'y', keyframes: [kf(0, D(-82)), kf(1, D(-82))] },
    { joint: 'joint.wingTipL', axis: 'y', keyframes: [kf(0, D(-45)), kf(1, D(-45))] },
    { joint: 'joint.wingR', axis: 'y', keyframes: [kf(0, D(82)), kf(1, D(82))] },
    { joint: 'joint.wingTipR', axis: 'y', keyframes: [kf(0, D(45)), kf(1, D(45))] },
    { joint: 'joint.legL', axis: 'x', keyframes: [kf(0, D(22)), kf(0.5, D(-18)), kf(1, D(22))] },
    { joint: 'joint.legR', axis: 'x', keyframes: [kf(0, D(-18)), kf(0.5, D(22)), kf(1, D(-18))] },
    { joint: 'joint.body', axis: 'x', keyframes: [kf(0, D(3)), kf(0.5, D(-3)), kf(1, D(3))] },
    { joint: 'joint.head', axis: 'x', keyframes: [kf(0, D(-3)), kf(0.5, D(3)), kf(1, D(-3))] },
    { joint: 'joint.tail', axis: 'y', keyframes: [kf(0, D(-5)), kf(0.5, D(5)), kf(1, D(-5))] },
  ],
};

/** Flying fly: wings spread + flap, legs tucked up at a tilt (bird in flight). */
const FLYING_FLY: AnimClip = {
  name: 'fly',
  label: 'Fly 飞翔',
  duration: 0.9,
  tracks: [
    { joint: 'joint.wingL', axis: 'z', keyframes: [kf(0, D(50)), kf(0.5, D(-35)), kf(1, D(50))] },
    { joint: 'joint.wingTipL', axis: 'z', keyframes: [kf(0, D(20)), kf(0.5, D(-15)), kf(1, D(20))] },
    { joint: 'joint.wingR', axis: 'z', keyframes: [kf(0, D(-50)), kf(0.5, D(35)), kf(1, D(-50))] },
    { joint: 'joint.wingTipR', axis: 'z', keyframes: [kf(0, D(-20)), kf(0.5, D(15)), kf(1, D(-20))] },
    // Tuck the legs up and back, trailing behind the body like a soaring bird.
    { joint: 'joint.legL', axis: 'x', keyframes: [kf(0, D(68)), kf(1, D(68))] },
    { joint: 'joint.legL', axis: 'z', keyframes: [kf(0, D(-12)), kf(1, D(-12))] },
    { joint: 'joint.legR', axis: 'x', keyframes: [kf(0, D(68)), kf(1, D(68))] },
    { joint: 'joint.legR', axis: 'z', keyframes: [kf(0, D(12)), kf(1, D(12))] },
    { joint: 'joint.body', axis: 'x', keyframes: [kf(0, D(6)), kf(0.5, D(-2)), kf(1, D(6))] },
  ],
};

/** All clips available per character type (script slots registry). */
export const CHARACTER_CLIPS: Record<CharacterType, AnimClip[]> = {
  humanoid: [HUMANOID_IDLE, HUMANOID_SIT, HUMANOID_WALK],
  quadruped: [QUADRUPED_IDLE, QUADRUPED_WALK],
  flying: [FLYING_IDLE, FLYING_WALK, FLYING_FLY],
};

/** Build a fresh character asset (with skeleton) for a given type. */
export function buildCharacterAsset(type: CharacterType, name?: string): {
  name: string;
  category: AssetCategory;
  description: string;
  root: AssetPart;
  characterType: CharacterType;
} {
  const rig = CHARACTER_RIGS[type];
  const defaultName = type === 'humanoid' ? 'Humanoid' : type === 'quadruped' ? 'Quadruped' : 'Flying';
  return {
    name: name ?? defaultName,
    category: 'character',
    description: `Character · ${type}`,
    root: buildCharacterRoot(rig),
    characterType: type,
  };
}
