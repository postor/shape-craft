export interface Vec3Like {
  x: number;
  y: number;
  z: number;
}

export function numInput(label: string, value: number, on: (v: number) => void): HTMLElement {
  const wrap = document.createElement('label');
  wrap.className = 'field';
  wrap.innerHTML = `<span>${label}</span>`;
  const inp = document.createElement('input');
  inp.type = 'number';
  inp.step = '0.1';
  inp.value = String(value);
  inp.addEventListener('input', () => on(parseFloat(inp.value) || 0));
  wrap.appendChild(inp);
  return wrap;
}

export function vec3Fields(prefix: string, v: Vec3Like, on: (v: Vec3Like) => void): HTMLElement {
  const box = document.createElement('div');
  box.className = 'vec3';
  const labels = ['X', 'Y', 'Z'];
  (['x', 'y', 'z'] as const).forEach((axis, i) => {
    box.appendChild(numInput(`${prefix} ${labels[i]}`, v[axis], (val) => on({ ...v, [axis]: val })));
  });
  return box;
}

export function transformGroup(title: string, v: Vec3Like, on: (v: Vec3Like) => void): HTMLElement {
  const g = document.createElement('div');
  g.className = 'group';
  g.innerHTML = `<div class="group-title">${title}</div>`;
  g.appendChild(vec3Fields(title, v, on));
  return g;
}

export interface ScaleGroupOptions {
  lockDefault?: boolean;
}

/**
 * Scale editor with a "锁定比例" (lock aspect ratio) checkbox that is ON by
 * default. When locked, editing one axis scales the other two by the same
 * factor so the object keeps its proportions. Reused by every editor that
 * exposes per-element scaling (asset editor, map instance editor, scene
 * object editor, character part editor).
 */
export function scaleGroup(v: Vec3Like, on: (v: Vec3Like) => void, opts: ScaleGroupOptions = {}): HTMLElement {
  const g = document.createElement('div');
  g.className = 'group';
  g.innerHTML = '<div class="group-title">缩放 Scale</div>';

  const lockWrap = document.createElement('label');
  lockWrap.className = 'field full checkbox';
  lockWrap.innerHTML = '<span>锁定比例 Lock ratio</span>';
  const lock = document.createElement('input');
  lock.type = 'checkbox';
  lock.checked = opts.lockDefault ?? true;
  lockWrap.appendChild(lock);
  g.appendChild(lockWrap);

  let prev: Vec3Like = { ...v };
  const inputs: Record<string, HTMLInputElement> = {};
  const labels = ['X', 'Y', 'Z'];
  const box = document.createElement('div');
  box.className = 'vec3';
  (['x', 'y', 'z'] as const).forEach((axis, i) => {
    const w = document.createElement('label');
    w.className = 'field';
    w.innerHTML = `<span>${labels[i]}</span>`;
    const inp = document.createElement('input');
    inp.type = 'number';
    inp.step = '0.1';
    inp.value = String(v[axis]);
    inp.addEventListener('input', () => {
      const val = parseFloat(inp.value) || 0;
      let next: Vec3Like;
      if (lock.checked) {
        if (prev[axis] !== 0) {
          const factor = val / prev[axis];
          next = { x: prev.x * factor, y: prev.y * factor, z: prev.z * factor };
        } else {
          next = { x: val, y: val, z: val };
        }
        (['x', 'y', 'z'] as const).forEach((a) => {
          if (a !== axis) inputs[a].value = String(next[a]);
        });
      } else {
        next = { ...prev, [axis]: val };
      }
      prev = { ...next };
      on(next);
    });
    inputs[axis] = inp;
    w.appendChild(inp);
    box.appendChild(w);
  });
  g.appendChild(box);
  return g;
}
