import { PageShell, Spinner, EmptyState } from '../components';
import { useRecords, recordMutations } from '../../lib/hooks';
import { MagicCard, BlurFade, PlainButton, BorderBeam } from '../magicui';
import type { RecordSession } from '../../schema';

function RecordCard({ rec, onOpen, onRename, onDelete }: {
  rec: RecordSession;
  onOpen: () => void;
  onRename: () => void;
  onDelete: () => void;
}) {
  const updated = new Date(rec.updatedAt).toLocaleString();
  const hasCamera = Boolean(rec.cameraTrack && rec.cameraTrack.length > 0);
  return (
    <MagicCard className="relative flex flex-col overflow-hidden rounded-[10px] border border-border bg-panel p-0" gradientFrom="#f472b6" gradientTo="#a78bfa">
      <BorderBeam colorFrom="#f472b6" colorTo="#a78bfa" />
      <div className="flex h-full w-full flex-col">
        <div className="relative flex h-[140px] items-center justify-center overflow-hidden bg-[#0b0d12]">
        {rec.thumbnail ? (
          <img className="h-full w-full object-cover" src={rec.thumbnail} alt={rec.name} />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center text-[44px]"
            style={{ background: 'radial-gradient(120px circle at center, rgba(244,114,182,0.18), transparent 70%)' }}
          >
            🎬
          </div>
        )}
        <div className="absolute bottom-2 left-2 flex flex-wrap gap-1.5">
          <span className="rounded-full border border-[rgba(76,175,80,0.3)] bg-[rgba(76,175,80,0.15)] px-2 py-0.5 text-[12px] text-[#8fe6a0]">{rec.tracks.length} 轨道</span>
          {hasCamera && (
            <span className="rounded-full border border-[rgba(167,139,250,0.3)] bg-[rgba(167,139,250,0.15)] px-2 py-0.5 text-[12px] text-[#c4b5fd]">📷 镜头</span>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-1 p-3">
        <span className="truncate font-medium">{rec.name}</span>
        <span className="text-xs text-muted">更新于 {updated}</span>
        <div className="mt-3 flex flex-wrap gap-2">
          <button className="inline-flex cursor-pointer items-center gap-1.5 border border-border bg-panel-2 px-2.5 py-1.5 text-[13px] text-text transition-colors hover:border-accent" onClick={onOpen}>打开</button>
          <button className="inline-flex cursor-pointer items-center gap-1.5 border border-border bg-panel-2 px-2.5 py-1.5 text-[13px] text-text transition-colors hover:border-accent" onClick={onRename}>重命名</button>
          <button className="inline-flex cursor-pointer items-center gap-1.5 border border-danger bg-transparent px-2.5 py-1.5 text-[13px] text-danger transition-colors hover:border-danger" onClick={onDelete}>删除</button>
        </div>
      </div>
      </div>
    </MagicCard>
  );
}

export function RecordListView() {
  const { records, loading } = useRecords();

  function handleRename(rec: RecordSession) {
    const name = window.prompt('重命名录制', rec.name);
    if (name && name.trim()) void recordMutations.update(rec.id, { ...rec, name: name.trim() });
  }
  async function handleDelete(rec: RecordSession) {
    if (window.confirm(`确认删除「${rec.name}」？`)) await recordMutations.remove(rec.id);
  }

  return (
    <PageShell active="play">
      <div className="flex flex-col gap-1 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">扮演视频</h2>
          <PlainButton
            onClick={async () => {
              const rec = await recordMutations.create({ name: '未命名录制', sceneId: null, tracks: [], cameraTrack: null });
              location.hash = `#/record/${rec.id}`;
            }}
          >
            ＋ 新建录制
          </PlainButton>
        </div>
        <p className="text-sm text-muted">在场景里录制角色动作与镜头，保存后即可回放或导出视频。</p>
      </div>

      {loading ? (
        <Spinner label="加载录制中…" />
      ) : records.length === 0 ? (
        <EmptyState title="还没有录制" hint="在编辑器或场景里开始录制，会在此列出。" />
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4 p-6 pt-2">
          {records.map((rec, i) => (
            <BlurFade key={rec.id} delay={Math.min(i * 0.03, 0.3)}>
              <RecordCard
                rec={rec}
                onOpen={() => (location.hash = `#/record/${rec.id}`)}
                onRename={() => handleRename(rec)}
                onDelete={() => void handleDelete(rec)}
              />
            </BlurFade>
          ))}
        </div>
      )}
    </PageShell>
  );
}
