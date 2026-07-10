import { PageShell, Spinner, EmptyState } from '../components';
import { useScenes, sceneMutations } from '../../lib/hooks';
import { createEmptyScene, type SceneInput } from '../../schema/scene';
import { MagicCard, BlurFade, PlainButton, BorderBeam } from '../magicui';
import type { SceneComponent } from '../../schema/scene';

function SceneCard({ scene, onEdit, onRename, onDelete }: {
  scene: SceneComponent;
  onEdit: () => void;
  onRename: () => void;
  onDelete: () => void;
}) {
  return (
    <MagicCard className="relative flex flex-col overflow-hidden rounded-[10px] border border-border bg-panel p-0" gradientFrom="#34d399" gradientTo="#38bdf8">
      <BorderBeam colorFrom="#34d399" colorTo="#38bdf8" />
      <div className="flex h-[140px] items-center justify-center bg-[#0b0d12]">
        {scene.thumbnail ? <img className="h-full w-full object-cover" src={scene.thumbnail} alt={scene.name} /> : <div className="text-[28px] tracking-[2px] text-muted">{scene.objects.length} 对象</div>}
      </div>
      <div className="flex flex-col gap-1 p-3">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate font-medium">{scene.name}</span>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <button className="inline-flex cursor-pointer items-center gap-1.5 border border-border bg-panel-2 px-2.5 py-1.5 text-[13px] text-text transition-colors hover:border-accent" onClick={onEdit}>编辑</button>
          <button className="inline-flex cursor-pointer items-center gap-1.5 border border-border bg-panel-2 px-2.5 py-1.5 text-[13px] text-text transition-colors hover:border-accent" onClick={onRename}>重命名</button>
          <button className="inline-flex cursor-pointer items-center gap-1.5 border border-danger bg-transparent px-2.5 py-1.5 text-[13px] text-danger transition-colors hover:border-danger" onClick={onDelete}>删除</button>
        </div>
      </div>
    </MagicCard>
  );
}

export function SceneLibraryView() {
  const { scenes, loading } = useScenes();

  async function handleCreate() {
    const base = createEmptyScene();
    const input: SceneInput = {
      name: base.name,
      size: base.size,
      waterLevel: base.waterLevel,
      terrain: base.terrain,
      objects: base.objects,
      thumbnail: base.thumbnail,
    };
    const created = await sceneMutations.create(input);
    location.hash = `#/scenes/${created.id}`;
  }

  function handleRename(scene: SceneComponent) {
    const name = window.prompt('重命名场景', scene.name);
    if (name && name.trim()) void sceneMutations.update(scene.id, { ...scene, name: name.trim() });
  }
  async function handleDelete(scene: SceneComponent) {
    if (window.confirm(`确认删除「${scene.name}」？`)) await sceneMutations.remove(scene.id);
  }

  return (
    <PageShell active="scene">
      <div className="flex items-center justify-between p-6">
        <h2 className="text-2xl font-semibold">场景库</h2>
        <PlainButton onClick={() => void handleCreate()}>＋ 新建场景</PlainButton>
      </div>

      {loading ? (
        <Spinner label="加载场景中…" />
      ) : scenes.length === 0 ? (
        <EmptyState title="还没有场景" hint="点击「新建场景」开始创作。" />
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4 p-6">
          {scenes.map((scene, i) => (
            <BlurFade key={scene.id} delay={Math.min(i * 0.03, 0.3)}>
              <SceneCard
                scene={scene}
                onEdit={() => (location.hash = `#/scenes/${scene.id}`)}
                onRename={() => handleRename(scene)}
                onDelete={() => void handleDelete(scene)}
              />
            </BlurFade>
          ))}
        </div>
      )}
    </PageShell>
  );
}
