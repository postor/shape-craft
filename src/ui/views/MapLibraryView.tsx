import { PageShell, Spinner, EmptyState } from '../components';
import { useMaps, mapMutations } from '../../lib/hooks';
import { MAP_TEMPLATES, createMapFromTemplate, type MapInput } from '../../schema/map';
import { MagicCard, BlurFade, ShimmerButton, BorderBeam } from '../magicui';
import type { MapComponent } from '../../schema';

function MapCard({ map, onEdit, onDuplicate, onRename, onDelete }: {
  map: MapComponent;
  onEdit: () => void;
  onDuplicate: () => void;
  onRename: () => void;
  onDelete: () => void;
}) {
  return (
    <MagicCard className="map-card relative flex-col p-0" gradientFrom="#22d3ee" gradientTo="#a78bfa">
      <BorderBeam colorFrom="#22d3ee" colorTo="#a78bfa" />
      <div className="map-thumb">
        {map.thumbnail ? <img src={map.thumbnail} alt={map.name} /> : <div className="map-thumb-empty">{map.instances.length} 实例</div>}
      </div>
      <div className="map-meta p-3">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate font-medium">{map.name}</span>
        </div>
        <div className="map-actions mt-3 flex flex-wrap gap-2">
          <button className="btn small" onClick={onEdit}>编辑</button>
          <button className="btn small" onClick={onDuplicate}>复制</button>
          <button className="btn small" onClick={onRename}>重命名</button>
          <button className="btn small danger" onClick={onDelete}>删除</button>
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
      <div className="library-header flex items-center justify-between p-6">
        <h2 className="text-2xl font-semibold">地图库</h2>
        <ShimmerButton onClick={() => (location.hash = '#/map')}>＋ 新建地图</ShimmerButton>
      </div>

      <div className="map-quickbar flex flex-wrap gap-2 px-6">
        {MAP_TEMPLATES.map((t) => (
          <button key={t.key} className="btn small" onClick={() => void createFromTemplate(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <Spinner label="加载地图中…" />
      ) : maps.length === 0 ? (
        <EmptyState title="还没有地图" hint="选择上方模板，或点击「新建地图」。" />
      ) : (
        <div className="asset-grid p-6">
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
