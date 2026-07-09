/**
 * Custom script runtime for ShapeCraft.
 *
 * A script slot (`ScriptSlot`) holds source code written in a Unity-flavoured
 * style: the author defines `function update(t, dt) {}` (and optionally
 * `function start() {}`). The engine compiles each slot ONCE into a factory,
 * then calls `update(t, dt)` every frame while the asset is previewed.
 *
 * Injected bindings (available as free variables inside the script):
 *   - `t`      total elapsed seconds since the script started
 *   - `dt`     delta seconds for the current frame (Time.deltaTime)
 *   - `self`   the THREE.Object3D of the part the script is bound to
 *   - `scene`  the asset's root Object3D (add/remove your own meshes here)
 *   - `THREE`  the three.js namespace (new meshes, materials, math, …)
 *
 * State that must survive across frames can be stored on `self.userData`
 * (analogous to a MonoBehaviour's instance fields).
 *
 * Design note: this is intentionally a free, Turing-complete scripting surface
 * (not a fixed domain API) so the LLM — or the user — can express ANY effect
 * (fountain, firework, rotation, oscillation, spawn-and-explode, …) without the
 * schema prescribing every knob. Execution is plain `new Function`; on the
 * local, user-key frontend this is acceptable. A sandbox/timeout layer can be
 * added later if scripts ever run against untrusted input.
 */
import * as THREE from 'three';
import type { ScriptSlot } from '../schema';

interface Compiled {
  slot: ScriptSlot;
  self: THREE.Object3D | null;
  update: ((t: number, dt: number) => void) | null;
  start: (() => void) | null;
  started: boolean;
  failed: boolean;
}

export class ScriptRuntime {
  private compiled: Compiled[] = [];
  private t = 0;

  /**
   * @param root    the asset root Object3D (its holder graph already built)
   * @param scripts the slots to bind (each references a part by id)
   */
  constructor(root: THREE.Object3D, scripts: ScriptSlot[]) {
    // Map partId -> holder Object3D. First match wins (holders deep in an
    // instance subtree are tagged with the instance id, so we prefer the
    // top-level part holder).
    const byId = new Map<string, THREE.Object3D>();
    root.traverse((o) => {
      const pid = o.userData?.partId as string | undefined;
      if (pid && !byId.has(pid)) byId.set(pid, o);
    });

    for (const s of scripts) {
      const self = byId.get(s.partId) ?? null;
      let update: ((t: number, dt: number) => void) | null = null;
      let start: (() => void) | null = null;
      try {
        const factory: any = new Function(
          't',
          'dt',
          'self',
          'scene',
          'THREE',
          `${s.code}\n;return { update: (typeof update === 'function' ? update : null), start: (typeof start === 'function' ? start : null) };`,
        );
        const api: any = factory(0, 0, self, root, THREE);
        update = api?.update ?? null;
        start = api?.start ?? null;
      } catch (e) {
        console.error('[script] compile error in', s.name, e);
      }
      this.compiled.push({ slot: s, self, update, start, started: false, failed: false });
    }
  }

  /** Advance every bound script by `dt` seconds. */
  tick(dt: number): void {
    this.t += dt;
    for (const c of this.compiled) {
      if (!c.update || c.failed) continue;
      if (!c.started) {
        c.started = true;
        try {
          c.start?.();
        } catch (e) {
          console.error('[script] start() error in', c.slot.name, e);
        }
      }
      try {
        c.update(this.t, dt);
      } catch (e) {
        console.error('[script] runtime error in', c.slot.name, '— disabling slot', e);
        c.failed = true;
      }
    }
  }

  /** Reset the clock and re-run `start()` on the next tick (e.g. on replay). */
  reset(): void {
    this.t = 0;
    for (const c of this.compiled) c.started = false;
  }
}
