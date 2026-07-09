/**
 * Animation schema for ShapeCraft.
 *
 * An Animation (动画) binds to an existing Scene (场景). It contains a list of
 * tracks, each driving one thing over time:
 *
 *  - `camera`:      the playback camera position (the thing the viewer sees).
 *  - `cameraTarget`: a free (empty) node the camera looks at (orbit pivot).
 *  - `object`:      a placed SceneObject — moved/rotated/scaled per keyframe.
 *
 * Every track has keyframes at a given `time` (seconds, within `duration`).
 * Between keyframes the values are linearly interpolated. A keyframe may also
 * carry an optional `state` (e.g. 'walk' / 'fly' / 'idle') describing the
 * character's behaviour across the segment leading into it — used to drive the
 * per-bone axis animation of a bound character/asset.
 *
 * When an animation is created for a scene, the camera + cameraTarget tracks are
 * auto-added so there is always a viewpoint to preview. The user can then add
 * more tracks and bind them to objects in the scene. Each placed object may
 * belong to at most one track (enforced in the editor UI).
 */
import type { Vec3 } from './index.ts';
import { vec3 } from './index.ts';

export type TrackKind = 'camera' | 'cameraTarget' | 'object';

/** Segment behaviour between a keyframe and the next (drives character clips). */
export type AnimState = 'none' | 'walk' | 'fly' | 'idle' | 'sit';

export interface AnimKf {
  /** Time in seconds within the clip duration [0, duration]. */
  time: number;
  position: Vec3;
  rotation: Vec3;
  scale: Vec3;
  /**
   * Behaviour for the segment *leading into* this keyframe. Empty / 'none'
   * means "just interpolate position" — no per-bone character animation.
   */
  state?: AnimState;
}

export interface AnimChannel {
  id: string;
  kind: TrackKind;
  /** For `kind === 'object'`: the SceneObject id bound to this track. */
  objectId?: string;
  /** For `kind === 'object'`: label shown in the track list. */
  label?: string;
  keyframes: AnimKf[];
}

export interface AnimComponent {
  id: string;
  name: string;
  /** Scene this animation plays on. */
  sceneId: string;
  /** Total length in seconds (looped on playback). */
  duration: number;
  tracks: AnimChannel[];
  createdAt: string;
  updatedAt: string;
  thumbnail?: string;
}

/** Payload accepted when creating/updating an animation. */
export type AnimInput = Omit<AnimComponent, 'id' | 'createdAt' | 'updatedAt'>;

let idCounter = 0;
function animUid(prefix = 'anim'): string {
  idCounter += 1;
  return `${prefix}_${Date.now().toString(36)}_${idCounter.toString(36)}`;
}

export function createKeyframe(time: number, position: Vec3, state?: AnimState): AnimKf {
  return {
    time,
    position: { ...position },
    rotation: vec3(),
    scale: vec3(1, 1, 1),
    ...(state ? { state } : {}),
  };
}

/**
 * Build a fresh animation for a scene, auto-adding the camera + cameraTarget
 * tracks framed to the scene's size. The camera starts at the same vantage the
 * scene editor uses, and looks at the origin.
 */
export function createAnimationForScene(
  sceneId: string,
  sceneName: string,
  sceneSize: number,
  name?: string,
): AnimComponent {
  const now = new Date().toISOString();
  const r = sceneSize * 0.75;
  const camStart = vec3(r, sceneSize * 0.65, r);
  const target = vec3(0, 0, 0);
  return {
    id: animUid('anim'),
    name: name ?? `${sceneName} 动画`,
    sceneId,
    duration: 8,
    tracks: [
      {
        id: animUid('track'),
        kind: 'camera',
        keyframes: [createKeyframe(0, camStart)],
      },
      {
        id: animUid('track'),
        kind: 'cameraTarget',
        keyframes: [createKeyframe(0, target)],
      },
    ],
    createdAt: now,
    updatedAt: now,
  };
}

/** Sort helper: keep keyframes in ascending time order, clamped to duration. */
export function sortKeyframes(track: AnimChannel): void {
  track.keyframes.sort((a, b) => a.time - b.time);
}

/** Linear interpolation of a single scalar keyframe channel at time `t`. */
function lerpKf(a: { time: number; value: number }, b: { time: number; value: number }, t: number): number {
  const span = b.time - a.time || 1;
  const f = Math.max(0, Math.min(1, (t - a.time) / span));
  return a.value + (b.value - a.value) * f;
}

/** Sample a track's transform at time `t`, returning the interpolated pose. */
export interface SampledPose {
  position: Vec3;
  rotation: Vec3;
  scale: Vec3;
  /** State of the segment leading into the surrounding keyframe (if any). */
  state: AnimState;
}

export function sampleTrack(track: AnimChannel, t: number): SampledPose {
  const kfs = track.keyframes;
  if (kfs.length === 0) {
    return { position: vec3(), rotation: vec3(), scale: vec3(1, 1, 1), state: 'none' };
  }
  if (kfs.length === 1 || t <= kfs[0].time) {
    const k = kfs[0];
    return { position: { ...k.position }, rotation: { ...k.rotation }, scale: { ...k.scale }, state: k.state ?? 'none' };
  }
  if (t >= kfs[kfs.length - 1].time) {
    const k = kfs[kfs.length - 1];
    return { position: { ...k.position }, rotation: { ...k.rotation }, scale: { ...k.scale }, state: k.state ?? 'none' };
  }
  // Find the surrounding pair.
  for (let i = 0; i < kfs.length - 1; i++) {
    const a = kfs[i];
    const b = kfs[i + 1];
    if (t >= a.time && t <= b.time) {
      const state = b.state ?? 'none';
      return {
        position: vec3(
          lerpKf({ time: a.time, value: a.position.x }, { time: b.time, value: b.position.x }, t),
          lerpKf({ time: a.time, value: a.position.y }, { time: b.time, value: b.position.y }, t),
          lerpKf({ time: a.time, value: a.position.z }, { time: b.time, value: b.position.z }, t),
        ),
        rotation: vec3(
          lerpKf({ time: a.time, value: a.rotation.x }, { time: b.time, value: b.rotation.x }, t),
          lerpKf({ time: a.time, value: a.rotation.y }, { time: b.time, value: b.rotation.y }, t),
          lerpKf({ time: a.time, value: a.rotation.z }, { time: b.time, value: b.rotation.z }, t),
        ),
        scale: vec3(
          lerpKf({ time: a.time, value: a.scale.x }, { time: b.time, value: b.scale.x }, t),
          lerpKf({ time: a.time, value: a.scale.y }, { time: b.time, value: b.scale.y }, t),
          lerpKf({ time: a.time, value: a.scale.z }, { time: b.time, value: b.scale.z }, t),
        ),
        state,
      };
    }
  }
  const last = kfs[kfs.length - 1];
  return { position: { ...last.position }, rotation: { ...last.rotation }, scale: { ...last.scale }, state: last.state ?? 'none' };
}

/** The unique object track bound to a given scene object (or null). */
export function trackForObject(anim: AnimComponent, objectId: string): AnimChannel | null {
  return anim.tracks.find((t) => t.kind === 'object' && t.objectId === objectId) ?? null;
}
