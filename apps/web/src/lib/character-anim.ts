import * as THREE from 'three';
import type { AnimClip } from '@shape-craft/schema';

interface AxisDelta {
  x: number;
  y: number;
  z: number;
}

/**
 * Runtime player for the skeleton axis-animation system.
 *
 * It binds to the live Three.js scene graph built from a character rig,
 * snapshots each bone's rest rotation, and every frame applies the active
 * clip's script tracks (per-bone, per-axis rotation deltas) on top of that
 * rest pose. Clips loop over their duration, so any clip can be swapped at
 * runtime to change the character's behaviour.
 */
export class CharacterAnimator {
  private clips = new Map<string, AnimClip>();
  private restRot = new Map<string, THREE.Euler>();
  private bones = new Map<string, THREE.Object3D>();
  private current: AnimClip | null = null;
  private time = 0;
  private playing = true;
  private speed = 1;

  constructor(rootGroup: THREE.Object3D) {
    this.rebind(rootGroup);
  }

  /** Re-read bone rest poses from a (rebuilt) scene graph. */
  rebind(rootGroup: THREE.Object3D) {
    this.bones.clear();
    this.restRot.clear();
    rootGroup.traverse((o) => {
      const name = o.userData.partName as string | undefined;
      if (name && (o as THREE.Group).isGroup) {
        this.bones.set(name, o);
        this.restRot.set(name, o.rotation.clone());
      }
    });
    if (this.current) this.current = this.clips.get(this.current.name) ?? this.current;
  }

  setClips(clips: AnimClip[]) {
    this.clips.clear();
    for (const c of clips) this.clips.set(c.name, c);
  }

  /** Register a clip (script slot) without dropping the others. */
  addClip(clip: AnimClip) {
    this.clips.set(clip.name, clip);
  }

  getClipNames(): string[] {
    return [...this.clips.keys()];
  }

  play(name: string) {
    const clip = this.clips.get(name) ?? null;
    if (clip && clip !== this.current) {
      this.current = clip;
      this.time = 0;
    } else if (clip) {
      this.current = clip;
    }
    this.playing = true;
  }

  setPlaying(p: boolean) {
    this.playing = p;
  }

  isPlaying(): boolean {
    return this.playing;
  }

  setSpeed(s: number) {
    this.speed = Math.max(0.05, s);
  }

  getSpeed(): number {
    return this.speed;
  }

  /** Advance the animation by `dt` seconds and apply it to the scene. */
  update(dt: number) {
    if (!this.current) return;
    if (this.playing) this.time += dt * this.speed;
    this.apply(this.current, this.time);
  }

  private apply(clip: AnimClip, time: number) {
    // Accumulate per-bone axis deltas for this frame.
    const deltas = new Map<string, AxisDelta>();
    const local = ((time % clip.duration) + clip.duration) % clip.duration;
    for (const tr of clip.tracks) {
      const value = sampleTrack(tr, local, clip.duration);
      let d = deltas.get(tr.joint);
      if (!d) {
        d = { x: 0, y: 0, z: 0 };
        deltas.set(tr.joint, d);
      }
      d[tr.axis] += value;
    }
    for (const [joint, d] of deltas) {
      const bone = this.bones.get(joint);
      const rest = this.restRot.get(joint);
      if (!bone || !rest) continue;
      bone.rotation.set(rest.x + d.x, rest.y + d.y, rest.z + d.z);
    }
  }
}

/** Linear interpolation of a track's keyframes at normalized-local time. */
function sampleTrack(
  tr: { keyframes: { t: number; value: number }[] },
  local: number,
  duration: number,
): number {
  const kfs = tr.keyframes;
  if (kfs.length === 0) return 0;
  if (kfs.length === 1) return kfs[0].value;

  // Times are normalized [0,1]; scale to absolute seconds.
  const at = local; // local is already within [0, duration]
  const first = kfs[0];
  const last = kfs[kfs.length - 1];
  const t0 = first.t * duration;
  const t1 = last.t * duration;
  if (at <= t0) return first.value;
  if (at >= t1) return last.value;

  for (let i = 0; i < kfs.length - 1; i++) {
    const a = kfs[i];
    const b = kfs[i + 1];
    const ta = a.t * duration;
    const tb = b.t * duration;
    if (at >= ta && at <= tb) {
      const span = tb - ta || 1;
      const f = (at - ta) / span;
      return a.value + (b.value - a.value) * f;
    }
  }
  return last.value;
}
