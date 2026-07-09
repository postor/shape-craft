import * as THREE from 'three';

/**
 * Build a metric ruler group: three colored axis lines (x=red, y=green, z=blue)
 * extending `length` meters from the origin, with one tick mark (and a numeric
 * label in meters) every `step` meters. Useful as an on-scene reference so the
 * user can read how many meters an asset occupies along each axis.
 */
export function createAxisRuler(length = 10, step = 1, tickSize = 0.12): THREE.Group {
  const group = new THREE.Group();
  group.name = 'axis-ruler';

  const axes: Array<{
    color: number;
    dir: THREE.Vector3;
    text: (v: number) => string;
  }> = [
    { color: 0xe5484d, dir: new THREE.Vector3(1, 0, 0), text: (v) => `${v}m` },
    { color: 0x46a758, dir: new THREE.Vector3(0, 1, 0), text: (v) => `${v}m` },
    { color: 0x4f8cff, dir: new THREE.Vector3(0, 0, 1), text: (v) => `${v}m` },
  ];

  for (const axis of axes) {
    const main = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        axis.dir.clone().multiplyScalar(length),
      ]),
      new THREE.LineBasicMaterial({ color: axis.color, transparent: true, opacity: 0.85 }),
    );
    group.add(main);

    for (let v = step; v <= length + 1e-6; v += step) {
      const at = axis.dir.clone().multiplyScalar(v);
      // Two orthogonal directions for the tick (perpendicular to the axis).
      const ortho = axis.dir.clone().cross(new THREE.Vector3(1, 1, 1));
      if (ortho.lengthSq() < 1e-6) ortho.set(1, 0, 0);
      ortho.normalize();
      const ortho2 = axis.dir.clone().cross(ortho).normalize();
      const tick = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([
          at.clone().add(ortho.clone().multiplyScalar(-tickSize)),
          at.clone().add(ortho.clone().multiplyScalar(tickSize)),
          at.clone().add(ortho2.clone().multiplyScalar(-tickSize)),
          at.clone().add(ortho2.clone().multiplyScalar(tickSize)),
        ]),
        new THREE.LineBasicMaterial({ color: axis.color, transparent: true, opacity: 0.7 }),
      );
      group.add(tick);

      const label = makeLabelSprite(axis.text(v), axis.color);
      label.position.copy(at).add(axis.dir.clone().multiplyScalar(0));
      // Nudge the label slightly off the axis so it does not overlap the tick.
      label.position.add(ortho.clone().multiplyScalar(tickSize * 1.6));
      label.position.add(ortho2.clone().multiplyScalar(tickSize * 1.6));
      group.add(label);
    }
  }

  return group;
}

function makeLabelSprite(text: string, color: number): THREE.Sprite {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, size, size);
  ctx.font = 'bold 64px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#' + color.toString(16).padStart(6, '0');
  ctx.fillText(text, size / 2, size / 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  const material = new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(0.5, 0.5, 0.5);
  return sprite;
}

/**
 * Create a small HUD pinned to a corner of the viewport that shows how many
 * meters the current asset occupies along x / y / z. Returns an `update`
 * callback to refresh the readout (call it after the scene is rebuilt).
 */
export function createDimensionOverlay(
  host: HTMLElement,
): (dims: { x: number; y: number; z: number }) => void {
  const el = document.createElement('div');
  el.className = 'dimension-overlay';
  host.appendChild(el);
  return (dims) => {
    const fmt = (n: number) => (Number.isFinite(n) ? n.toFixed(2) : '0.00');
    el.innerHTML =
      `<span class="dim dim-x">X ${fmt(dims.x)}m</span>` +
      `<span class="dim dim-y">Y ${fmt(dims.y)}m</span>` +
      `<span class="dim dim-z">Z ${fmt(dims.z)}m</span>`;
  };
}
