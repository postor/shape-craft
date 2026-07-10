import { useRef, useState } from 'react';
import { runMapAgent, type MapAgentContext, type MapAgentResult } from '../../../lib/map-agent';

const BTN_SM_PRIMARY =
  'inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-accent bg-accent px-3 py-2 text-[13px] font-semibold text-[#06140a] transition-colors hover:border-accent disabled:cursor-not-allowed disabled:opacity-50';

export interface ChatMsg {
  id: number;
  role: 'user' | 'bot';
  text: string;
  thinking?: boolean;
  raw?: string;
}

let msgId = 0;

export function MapChat({
  messages,
  setMessages,
  onResult,
  context,
}: {
  messages: ChatMsg[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMsg[]>>;
  onResult: (result: MapAgentResult) => void;
  context: MapAgentContext;
}) {
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);

  const scroll = () => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  };

  const send = async () => {
    const text = input.trim();
    if (!text || busy) return;
    setInput('');
    setBusy(true);
    setMessages((m) => [...m, { id: ++msgId, role: 'user', text }]);
    const botId = ++msgId;
    setMessages((m) => [...m, { id: botId, role: 'bot', text: '', thinking: true }]);
    scroll();

    const patch = (patch: Partial<ChatMsg>) =>
      setMessages((m) => m.map((msg) => (msg.id === botId ? { ...msg, ...patch } : msg)));

    const result = await runMapAgent(text, context, (t) => {
      patch({ thinking: false, text: t });
      scroll();
    });
    setBusy(false);
    patch({ thinking: false, text: result.message, raw: result.raw });
    scroll();
    onResult(result);
  };

  return (
    <div className="flex h-[300px] min-h-0 flex-col">
      <div className="border-b border-border px-3.5 py-2 text-[13px] uppercase tracking-[0.5px] text-muted">
        聊天建造
      </div>
      <div ref={logRef} className="min-h-0 flex-1 space-y-2 overflow-auto p-3">
        {messages.length === 0 && (
          <p className="text-[12px] text-muted">
            你好！我可以放置 树 / 花 / 草 / 房子，也能调整地形与水域（如“整体抬升地形”“开启水域”“提升水位”），并自动保存。
          </p>
        )}
        {messages.map((m) => (
          <div key={m.id} className={'flex ' + (m.role === 'user' ? 'justify-end' : 'justify-start')}>
            <div
              className={
                'max-w-[88%] rounded-lg px-2.5 py-1.5 text-[12px] ' +
                (m.role === 'user'
                  ? 'bg-accent text-[#06140a]'
                  : m.thinking
                    ? 'bg-panel-2 text-muted'
                    : 'border border-border bg-panel-2 text-text')
              }
            >
              {m.thinking ? (
                <span className="inline-flex gap-1">
                  <span className="h-1.5 w-1.5 animate-chat-dot rounded-full bg-muted [animation-delay:0ms]" />
                  <span className="h-1.5 w-1.5 animate-chat-dot rounded-full bg-muted [animation-delay:150ms]" />
                  <span className="h-1.5 w-1.5 animate-chat-dot rounded-full bg-muted [animation-delay:300ms]" />
                </span>
              ) : (
                m.text
              )}
              {m.raw && (
                <details className="mt-1.5">
                  <summary className="cursor-pointer text-[11px] text-muted">查看 AI 完整返回</summary>
                  <pre className="mt-1 max-h-[160px] overflow-auto whitespace-pre-wrap text-[10px] text-muted">{m.raw}</pre>
                </details>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2 border-t border-border p-2.5">
        <input
          className="min-w-0 flex-1 rounded-lg border border-border bg-bg px-2 py-1.5 text-[13px] text-text"
          type="text"
          placeholder="例如：放一棵树 / 整体抬升地形 / 开启水域 / 提升水位"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') void send();
          }}
        />
        <button className={BTN_SM_PRIMARY} onClick={() => void send()} disabled={busy}>
          发送
        </button>
      </div>
    </div>
  );
}
