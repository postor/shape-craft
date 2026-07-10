import { useEffect, useRef, useState } from 'react';
import type { MutableRefObject } from 'react';
import type { CharacterAnimator } from '../../../lib/character-anim';
import type { AnimClip } from '../../../schema';

const BTN_SM =
  'inline-flex cursor-pointer items-center gap-1.5 border border-border bg-panel-2 px-2 py-1 text-[12px] text-text transition-colors hover:border-accent';
const BTN_TINY =
  'inline-flex cursor-pointer items-center gap-1 border border-border bg-panel-2 px-2 py-0.5 text-[11px] text-text transition-colors hover:border-accent';
const BTN_TINY_PRIMARY =
  'inline-flex cursor-pointer items-center gap-1 border border-accent bg-accent px-2 py-0.5 text-[11px] font-semibold text-[#06140a] transition-colors hover:border-accent';
const BTN_TINY_DANGER =
  'inline-flex cursor-pointer items-center gap-1 border border-danger bg-transparent px-2 py-0.5 text-[11px] text-danger transition-colors hover:border-danger';

const deg = (r: number) => Math.round((r * 180) / Math.PI);
const rad = (d: number) => (d * Math.PI) / 180;

export function CharacterAnimPanel({
  clips,
  bones,
  activeClip,
  collapsed,
  selectedKf,
  animator,
  getRootY,
  onClipsChange,
  onActiveClip,
  onToggleCollapse,
  onSelectKf,
}: {
  clips: AnimClip[];
  bones: string[];
  activeClip: string | null;
  collapsed: Set<number>;
  selectedKf: { clip: number; track: number; kf: number } | null;
  animator: MutableRefObject<CharacterAnimator | null>;
  getRootY: (y: number) => void;
  onClipsChange: (next: AnimClip[]) => void;
  onActiveClip: (name: string) => void;
  onToggleCollapse: (i: number) => void;
  onSelectKf: (kf: { clip: number; track: number; kf: number } | null) => void;
}) {
  const [playing, setPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [yaw, setYaw] = useState(0);
  const dragRef = useRef<{ ci: number; ti: number; kfIdx: number; el: HTMLElement } | null>(null);
  const builderJoint = useRef<Record<number, string>>({});

  useEffect(() => {
    const move = (ev: PointerEvent) => {
      const d = dragRef.current;
      if (!d) return;
      const r = d.el.getBoundingClientRect();
      const t = Math.min(1, Math.max(0, (ev.clientX - r.left) / r.width));
      const kfs = clips[d.ci].tracks[d.ti].keyframes;
      kfs[d.kfIdx].t = t;
      onClipsChange(clips);
    };
    const up = () => {
      dragRef.current = null;
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
  }, [clips, onClipsChange]);

  const togglePlay = () => {
    const next = !playing;
    setPlaying(next);
    animator.current?.setPlaying(next);
  };

  const onTimelineDown = (ci: number, ti: number, e: React.PointerEvent) => {
    const el = e.currentTarget as HTMLElement;
    const dot = (e.target as HTMLElement).closest('.kf-dot') as HTMLElement | null;
    let kfIdx: number;
    if (dot) {
      kfIdx = Number(dot.getAttribute('data-kf'));
    } else {
      const r = el.getBoundingClientRect();
      const t = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
      const kfs = clips[ci].tracks[ti].keyframes;
      kfs.push({ t, value: 0 });
      kfIdx = kfs.length - 1;
    }
    onSelectKf({ clip: ci, track: ti, kf: kfIdx });
    dragRef.current = { ci, ti, kfIdx, el };
  };

  const addTracks = (ci: number) => {
    const joint = builderJoint.current[ci] || bones[0] || 'joint.root';
    const tracks = clips[ci].tracks;
    for (const a of ['x', 'y', 'z'] as const) {
      const cb = document.getElementById(`builder-axis-${ci}-${a}`) as HTMLInputElement | null;
      if (cb?.checked && !tracks.some((t) => t.joint === joint && t.axis === a)) {
        tracks.push({ joint, axis: a, keyframes: [{ t: 0, value: 0 }, { t: 1, value: 0 }] });
      }
    }
    onClipsChange(clips);
  };

  return (
    <div>
      <datalist id="bone-list">
        {bones.map((n) => (
          <option key={n} value={n} />
        ))}
      </datalist>
      <div className="mb-2">
        <button className={BTN_TINY_PRIMARY} onClick={() => { const c = [...clips, { name: `custom${(clips.filter((x) => x.name.startsWith('custom')).length + 1)}`, label: `Custom ${clips.filter((x) => x.name.startsWith('custom')).length + 1}`, duration: 1, tracks: [] } as AnimClip]; onClipsChange(c); }}>
          ＋ 新增槽位
        </button>
      </div>

      <div className="flex flex-col gap-2.5">
        {clips.map((clip, i) => {
          const open = !collapsed.has(i);
          return (
            <div
              key={i}
              className={'rounded-lg border ' + (activeClip === clip.name ? 'border-accent' : 'border-border')}
            >
              <div className="flex flex-wrap items-center gap-1.5 p-2">
                <button className={BTN_TINY} onClick={() => { onActiveClip(clip.name); setPlaying(true); }}>
                  ▶
                </button>
                <input
                  className="w-[88px] rounded border border-border bg-panel-2 px-1.5 py-0.5 text-[12px] text-text"
                  value={clip.label}
                  onChange={(e) => {
                    clip.label = e.target.value;
                    onClipsChange(clips);
                  }}
                />
                <input
                  className="w-[70px] rounded border border-border bg-panel-2 px-1.5 py-0.5 text-[11px] text-muted"
                  value={clip.name}
                  title="槽位标识"
                  onChange={(e) => {
                    clip.name = e.target.value;
                    onClipsChange(clips);
                  }}
                />
                <button
                  className="rounded border-none bg-transparent px-1 text-[14px] leading-none text-danger hover:bg-danger hover:text-white"
                  title="删除槽位"
                  onClick={() => {
                    clips.splice(i, 1);
                    if (selectedKf?.clip === i) onSelectKf(null);
                    onClipsChange(clips);
                  }}
                >
                  ×
                </button>
                <button className={BTN_TINY} onClick={() => onToggleCollapse(i)}>
                  {open ? '收起' : '展开'}
                </button>
              </div>
              {open && (
                <div className="space-y-2 border-t border-border p-2">
                  <label className="flex items-center gap-2 text-[12px] text-muted">
                    时长(s)
                    <input
                      type="number"
                      step={0.1}
                      min={0.1}
                      className="w-[70px] rounded border border-border bg-panel-2 px-1.5 py-0.5 text-[12px] text-text"
                      value={clip.duration}
                      onChange={(e) => {
                        clip.duration = Math.max(0.1, parseFloat(e.target.value) || 1);
                        onClipsChange(clips);
                      }}
                    />
                  </label>
                  <div className="rounded border border-border p-2">
                    <div className="pb-1 text-[11px] text-muted">引用节点</div>
                    <input
                      list="bone-list"
                      defaultValue={bones[0] ?? ''}
                      className="mb-1.5 w-full rounded border border-border bg-panel-2 px-1.5 py-0.5 text-[12px] text-text"
                      onChange={(e) => {
                        builderJoint.current[i] = e.target.value;
                      }}
                    />
                    <div className="flex flex-wrap items-center gap-2">
                      {(['x', 'y', 'z'] as const).map((a) => (
                        <label key={a} className="flex items-center gap-1 text-[12px] text-muted">
                          <input id={`builder-axis-${i}-${a}`} type="checkbox" />
                          {a.toUpperCase()}
                        </label>
                      ))}
                      <button className={BTN_TINY_PRIMARY} onClick={() => addTracks(i)}>
                        ＋ 添加轨道
                      </button>
                    </div>
                    <p className="mt-1 text-[10px] text-muted">勾选轴后，为该节点一次生成多条轨道</p>
                  </div>

                  {clip.tracks.map((tr, ti) => (
                    <div key={ti} className="rounded border border-border p-2">
                      <div className="flex items-center gap-2 text-[12px] text-text">
                        <span className="truncate">
                          {tr.joint}·{tr.axis}
                        </span>
                        <button
                          className="ml-auto rounded border-none bg-transparent px-1 text-[14px] leading-none text-danger hover:bg-danger hover:text-white"
                          title="删除轨道"
                          onClick={() => {
                            clip.tracks.splice(ti, 1);
                            if (selectedKf?.clip === i && selectedKf?.track === ti) onSelectKf(null);
                            onClipsChange(clips);
                          }}
                        >
                          ×
                        </button>
                      </div>
                      <div
                        className="relative mt-1.5 h-7 cursor-copy rounded bg-panel-2"
                        onPointerDown={(e) => onTimelineDown(i, ti, e)}
                      >
                        <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-border" />
                        <span className="absolute bottom-0 left-0 text-[9px] text-muted">0</span>
                        <span className="absolute bottom-0 right-0 text-[9px] text-muted">1</span>
                        {tr.keyframes.map((kf, ki) => (
                          <span
                            key={ki}
                            data-kf={ki}
                            className={
                              'kf-dot absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full ' +
                              (selectedKf && selectedKf.clip === i && selectedKf.track === ti && selectedKf.kf === ki
                                ? 'bg-accent ring-2 ring-white'
                                : 'bg-[#8fe6a0]')
                            }
                            style={{ left: `${(kf.t * 100).toFixed(2)}%` }}
                            title={`t=${kf.t.toFixed(2)} · ${deg(kf.value)}°`}
                          />
                        ))}
                      </div>
                    </div>
                  ))}

                  {selectedKf && selectedKf.clip === i && (() => {
                    const tr = clip.tracks[selectedKf.track];
                    if (!tr) return null;
                    const kf = tr.keyframes[selectedKf.kf];
                    if (!kf) return null;
                    return (
                      <div className="rounded border border-accent bg-[rgba(76,175,80,0.1)] p-2">
                        <div className="pb-1 text-[11px] text-accent">
                          选中关键帧：{tr.joint} · {tr.axis}
                        </div>
                        <label className="flex items-center gap-2 text-[12px] text-muted">
                          值°
                          <input
                            type="number"
                            step={1}
                            className="w-[70px] rounded border border-border bg-panel-2 px-1.5 py-0.5 text-[12px] text-text"
                            value={deg(kf.value)}
                            onChange={(e) => {
                              kf.value = rad(parseFloat(e.target.value) || 0);
                              onClipsChange(clips);
                            }}
                          />
                        </label>
                        <button
                          className={BTN_TINY_DANGER + ' mt-1.5'}
                          onClick={() => {
                            if (tr.keyframes.length > 1) tr.keyframes.splice(selectedKf.kf, 1);
                            if (selectedKf) onSelectKf({ ...selectedKf, kf: Math.min(selectedKf.kf, tr.keyframes.length - 1) });
                            onClipsChange(clips);
                          }}
                        >
                          删除关键帧
                        </button>
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-2.5 flex flex-wrap items-center gap-3 border-t border-border pt-2.5">
        <button className={BTN_SM} onClick={togglePlay}>
          {playing ? '⏸ 暂停' : '▶ 播放'}
        </button>
        <label className="flex items-center gap-2 text-[12px] text-muted">
          速度 Speed
          <input
            type="range"
            min={0.1}
            max={3}
            step={0.1}
            value={speed}
            onChange={(e) => {
              const v = parseFloat(e.target.value) || 1;
              setSpeed(v);
              animator.current?.setSpeed(v);
            }}
            className="w-[110px] accent-accent"
          />
        </label>
        <label className="flex items-center gap-2 text-[12px] text-muted">
          朝向角度 Yaw
          <input
            type="range"
            min={-180}
            max={180}
            step={1}
            value={yaw}
            onChange={(e) => {
              const v = parseFloat(e.target.value);
              setYaw(v);
              getRootY(rad(v));
            }}
            className="w-[110px] accent-accent"
          />
        </label>
      </div>
      <p className="mt-2 text-[11px] leading-relaxed text-muted">
        脚本槽位 = 一段动画。先选“引用节点”，勾选 X/Y/Z 一次生成多条轨道；在轨道时间轴上
        <strong>点空白加关键帧、点圆点选中并拖动改时间</strong>，选中后在下方填角度（度）即可驱动该节点旋转。
      </p>
    </div>
  );
}
