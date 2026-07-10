import { PageShell, Spinner, EmptyState } from '../components';
import { useRecords, recordMutations } from '../../lib/hooks';
import { MagicCard, BlurFade, PlainButton, BorderBeam } from '../magicui';
import type { RecordSession } from '../../schema';

function RecordCard({ rec, onOpen, onDelete }: {
  rec: RecordSession;
  onOpen: () => void;
  onDelete: () => void;
}) {
  const updated = new Date(rec.updatedAt).toLocaleString();
  return (
    <MagicCard className="relative flex flex-col overflow-hidden rounded-[10px] border border-border bg-panel p-4" gradientFrom="#f472b6" gradientTo="#a78bfa">
      <BorderBeam colorFrom="#f472b6" colorTo="#a78bfa" />
      <div className="flex items-center justify-between">
        <span className="font-medium">{rec.name}</span>
        <span className="whitespace-nowrap rounded-full border border-[rgba(76,175,80,0.3)] bg-[rgba(76,175,80,0.15)] px-2 py-0.5 text-[12px] text-[#8fe6a0]">{rec.tracks.length} 轨道</span>
      </div>
      <p className="mt-1 text-xs text-muted">更新于 {updated}</p>
      <div className="mt-3 flex gap-2">
        <button className="inline-flex cursor-pointer items-center gap-1.5 border border-border bg-panel-2 px-2.5 py-1.5 text-[13px] text-text transition-colors hover:border-accent" onClick={onOpen}>打开</button>
        <button className="inline-flex cursor-pointer items-center gap-1.5 border border-danger bg-transparent px-2.5 py-1.5 text-[13px] text-danger transition-colors hover:border-danger" onClick={onDelete}>删除</button>
      </div>
    </MagicCard>
  );
}

export function RecordListView() {
  const { records, loading } = useRecords();

  async function handleDelete(rec: RecordSession) {
    if (window.confirm(`确认删除「${rec.name}」？`)) await recordMutations.remove(rec.id);
  }

  return (
    <PageShell active="play">
      <div className="flex items-center justify-between p-6">
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

      {loading ? (
        <Spinner label="加载录制中…" />
      ) : records.length === 0 ? (
        <EmptyState title="还没有录制" hint="在编辑器或场景里开始录制，会在此列出。" />
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4 p-6">
          {records.map((rec, i) => (
            <BlurFade key={rec.id} delay={Math.min(i * 0.03, 0.3)}>
              <RecordCard
                rec={rec}
                onOpen={() => (location.hash = `#/record/${rec.id}`)}
                onDelete={() => void handleDelete(rec)}
              />
            </BlurFade>
          ))}
        </div>
      )}
    </PageShell>
  );
}
