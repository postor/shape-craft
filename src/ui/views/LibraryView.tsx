import { PageShell, Spinner, EmptyState } from '../components';
import { useAssets, assetMutations } from '../../lib/hooks';
import { categoryLabel } from '../../lib/labels';
import { MagicCard, BlurFade, PlainButton, BorderBeam } from '../magicui';
import type { AssetComponent } from '../../schema';

function AssetCard({ asset, onEdit, onDuplicate, onRename, onDelete }: {
  asset: AssetComponent;
  onEdit: () => void;
  onDuplicate: () => void;
  onRename: () => void;
  onDelete: () => void;
}) {
  return (
    <MagicCard className="relative h-full w-full overflow-hidden rounded-[10px] !border !border-border !bg-panel p-0" gradientFrom="#34d399" gradientTo="#22d3ee">
      <BorderBeam colorFrom="#34d399" colorTo="#22d3ee" />
      <div className="flex h-full w-full flex-col">
        <div className="flex h-[140px] items-center justify-center bg-[#0b0d12]">
          {asset.thumbnail ? (
            <img className="h-full w-full object-cover" src={asset.thumbnail} alt={asset.name} />
          ) : (
            <div className="px-3 text-center text-[13px] text-muted">暂无预览</div>
          )}
        </div>
        <div className="flex flex-col gap-2 p-3">
          <span className="truncate font-medium">{asset.name}</span>
          <span className="self-start rounded-full border border-[rgba(76,175,80,0.3)] bg-[rgba(76,175,80,0.15)] px-2 py-0.5 text-[12px] text-[#8fe6a0]">{categoryLabel(asset.category)}</span>
          <div className="mt-1 flex flex-wrap gap-2">
            <button className="inline-flex cursor-pointer items-center gap-1.5 border border-border bg-panel-2 px-2.5 py-1.5 text-[13px] text-text transition-colors hover:border-accent" onClick={onEdit}>编辑</button>
            <button className="inline-flex cursor-pointer items-center gap-1.5 border border-border bg-panel-2 px-2.5 py-1.5 text-[13px] text-text transition-colors hover:border-accent" onClick={onDuplicate}>复制</button>
            <button className="inline-flex cursor-pointer items-center gap-1.5 border border-border bg-panel-2 px-2.5 py-1.5 text-[13px] text-text transition-colors hover:border-accent" onClick={onRename}>重命名</button>
            <button className="inline-flex cursor-pointer items-center gap-1.5 border border-danger bg-transparent px-2.5 py-1.5 text-[13px] text-danger transition-colors hover:border-danger" onClick={onDelete}>删除</button>
          </div>
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
      <div className="flex items-center justify-between p-6">
        <h2 className="text-2xl font-semibold">元件库</h2>
        <PlainButton onClick={() => (location.hash = '#/editor')}>＋ 新建元件</PlainButton>
      </div>

      {loading ? (
        <Spinner label="加载元件中…" />
      ) : assets.length === 0 ? (
        <EmptyState title="还没有元件" hint="点击右上角「新建元件」开始，或用编辑器里的聊天自动生成。" />
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4 p-6">
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
