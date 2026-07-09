import { PageShell, Spinner, EmptyState } from '../components';
import { useAssets, assetMutations } from '../../lib/hooks';
import { categoryLabel } from '../../views/_shared';
import { MagicCard, BlurFade, ShimmerButton, BorderBeam } from '../magicui';
import type { AssetComponent } from '../../schema';

function AssetCard({ asset, onEdit, onDuplicate, onRename, onDelete }: {
  asset: AssetComponent;
  onEdit: () => void;
  onDuplicate: () => void;
  onRename: () => void;
  onDelete: () => void;
}) {
  return (
    <MagicCard className="asset-card relative flex-col p-0" gradientFrom="#34d399" gradientTo="#22d3ee">
      <BorderBeam colorFrom="#34d399" colorTo="#22d3ee" />
      <div className="asset-thumb">
        {asset.thumbnail ? (
          <img src={asset.thumbnail} alt={asset.name} />
        ) : (
          <div className="asset-thumb-empty">3D</div>
        )}
      </div>
      <div className="asset-meta p-3">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate font-medium">{asset.name}</span>
          <span className="badge">{categoryLabel(asset.category)}</span>
        </div>
        <div className="asset-actions mt-3 flex flex-wrap gap-2">
          <button className="btn small" onClick={onEdit}>编辑</button>
          <button className="btn small" onClick={onDuplicate}>复制</button>
          <button className="btn small" onClick={onRename}>重命名</button>
          <button className="btn small danger" onClick={onDelete}>删除</button>
        </div>
      </div>
    </MagicCard>
  );
}

export function LibraryView() {
  const { assets, loading } = useAssets();

  async function handleDuplicate(id: string) {
    await assetMutations.duplicate(id);
  }
  function handleRename(asset: AssetComponent) {
    const name = window.prompt('重命名元件', asset.name);
    if (name && name.trim()) void assetMutations.rename(asset.id, name.trim());
  }
  async function handleDelete(asset: AssetComponent) {
    if (window.confirm(`确认删除「${asset.name}」？`)) {
      await assetMutations.remove(asset.id);
    }
  }

  return (
    <PageShell active="library">
      <div className="library-header flex items-center justify-between p-6">
        <h2 className="text-2xl font-semibold">元件库</h2>
        <ShimmerButton onClick={() => (location.hash = '#/editor')}>＋ 新建元件</ShimmerButton>
      </div>

      {loading ? (
        <Spinner label="加载元件中…" />
      ) : assets.length === 0 ? (
        <EmptyState title="还没有元件" hint="点击右上角「新建元件」开始，或用编辑器里的聊天自动生成。" />
      ) : (
        <div className="asset-grid p-6">
          {assets.map((asset, i) => (
            <BlurFade key={asset.id} delay={Math.min(i * 0.03, 0.3)}>
              <AssetCard
                asset={asset}
                onEdit={() => (location.hash = `#/editor/${asset.id}`)}
                onDuplicate={() => void handleDuplicate(asset.id)}
                onRename={() => handleRename(asset)}
                onDelete={() => void handleDelete(asset)}
              />
            </BlurFade>
          ))}
        </div>
      )}
    </PageShell>
  );
}
