import { PageShell, Spinner, EmptyState } from '../components';
import { useMaps, mapMutations } from '../../lib/hooks';
import { MAP_TEMPLATES, createMapFromTemplate, type MapInput } from '../../schema/map';
import { MagicCard, BlurFade, PlainButton, BorderBeam } from '../magicui';
import type { MapComponent } from '../../schema';

function MapCard({ map, onEdit, onDuplicate, onRename, onDelete }: {
  map: MapComponent;
  onEdit: () => void;
  onDuplicate: () => void;
  onRename: () => void;
  onDelete: () => void;
}) {
  return (
    <MagicCard className="relative flex flex-col overflow-hidden rounded-[10px] border border-border bg-panel p-0" gradientFrom="#22d3ee" gradientTo="#a78bfa">
      <BorderBeam colorFrom="#22d3ee" colorTo="#a78bfa" />
      <div className="flex h-[140px] items-center justify-center bg-[#0b0d12]">
        {map.thumbnail ? <img className="h-full w-full object-cover" src={map.thumbnail} alt={map.name} /> : <div className="text-[28px] tracking-[2px] text-muted">{map.instances.length} 实例</div>}
      </div>
      <div className="flex flex-col gap-1 p-3">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate font-medium">{map.name}</span>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <button className="inline-flex cursor-pointer items-center gap-1.5 border border-border bg-panel-2 px-2.5 py-1.5 text-[13px] text-text transition-colors hover:border-accent" onClick={onEdit}>编辑</button>
          <button className="inline-flex cursor-pointer items-center gap-1.5 border border-border bg-panel-2 px-2.5 py-1.5 text-[13px] text-text transition-colors hover:border-accent" onClick={onDuplicate}>复制</button>
          <button className="inline-flex cursor-pointer items-center gap-1.5 border border-border bg-panel-2 px-2.5 py-1.5 text-[13px] text-text transition-colors hover:border-accent" onClick={onRename}>重命名</button>
          <button className="inline-flex cursor-pointer items-center gap-1.5 border border-danger bg-transparent px-2.5 py-1.5 text-[13px] text-danger transition-colors hover:border-danger" onClick={onDelete}>删除</button>
        </div>
      </div>
    </MagicCard>
  );
}

export function MapLibraryView() {
  const { maps, loading } = useMaps();

  async function createFromTemplate(key: string) {
    const m = createMapFromTemplate(key);
    const input: MapInput = {
      name: m.name,
      description: m.description,
      size: m.size,
      terrain: m.terrain,
      water: m.water,
      instances: m.instances,
    };
    const created = await mapMutations.create(input);
    location.hash = `#/map/${created.id}`;
  }

  async function handleDuplicate(id: string) {
    await mapMutations.duplicate(id);
  }
  function handleRename(map: MapComponent) {
    const name = window.prompt('重命名地图', map.name);
    if (name && name.trim()) void mapMutations.rename(map.id, name.trim());
  }
  async function handleDelete(map: MapComponent) {
    if (window.confirm(`确认删除「${map.name}」？`)) await mapMutations.remove(map.id);
  }

  return (
    <PageShell active="map">
      <div className="flex items-center justify-between p-6">
        <h2 className="text-2xl font-semibold">地图库</h2>
        <PlainButton onClick={() => (location.hash = '#/map')}>＋ 新建地图</PlainButton>
      </div>

      <div className="flex flex-wrap gap-2 px-6">
        {MAP_TEMPLATES.map((t) => (
          <button key={t.key} className="inline-flex cursor-pointer items-center gap-1.5 border border-border bg-panel-2 px-2.5 py-1.5 text-[13px] text-text transition-colors hover:border-accent" onClick={() => void createFromTemplate(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <Spinner label="加载地图中…" />
      ) : maps.length === 0 ? (
        <EmptyState title="还没有地图" hint="选择上方模板，或点击「新建地图」。" />
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4 p-6">
          {maps.map((map, i) => (
            <BlurFade key={map.id} delay={Math.min(i * 0.03, 0.3)}>
              <MapCard
                map={map}
                onEdit={() => (location.hash = `#/map/${map.id}`)}
                onDuplicate={() => void handleDuplicate(map.id)}
                onRename={() => handleRename(map)}
                onDelete={() => void handleDelete(map)}
              />
            </BlurFade>
          ))}
        </div>
      )}
    </PageShell>
  );
}
