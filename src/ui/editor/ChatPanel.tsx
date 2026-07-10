import { useRef, useState } from 'react';
import { useEditor } from '../../lib/editor-hooks';
import { createChatHistory, type ChatHistory } from '../../lib/chat-history';

interface Msg {
  who: 'user' | 'bot';
  text: string;
}

/**
 * Chat-build panel (React + Tailwind). Keeps the conversation log in React
 * state and streams the assistant reply via `onProgress`. The actual asset
 * mutation is performed by the store's `agentTurn` action (which loops through
 * the optional visual-verify rounds and auto-saves), so the canvas + React stay
 * in sync automatically.
 */
export function ChatPanel() {
  const savedId = useEditor((s) => s.savedId);
  const chatBusy = useEditor((s) => s.chatBusy);
  const agentTurn = useEditor((s) => s.agentTurn);

  const [log, setLog] = useState<Msg[]>([
    {
      who: 'bot',
      text: '你好！我可以修改当前元件（如“把屋顶改成红色”“加一扇门”），也能插入引用其它元件，并自动保存。',
    },
  ]);
  const [input, setInput] = useState('');
  const historyRef = useRef<ChatHistory>(createChatHistory('asset:' + (savedId ?? 'new')));
  void savedId;

  const send = async () => {
    const text = input.trim();
    if (!text || chatBusy) return;
    historyRef.current.push(text);
    setLog((l) => [...l, { who: 'user', text }]);
    setInput('');
    setLog((l) => [...l, { who: 'bot', text: '' }]);
    const onProgress = (t: string) => {
      setLog((l) => {
        const copy = l.slice();
        copy[copy.length - 1] = { who: 'bot', text: t };
        return copy;
      });
    };
    await agentTurn(text, onProgress);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-2 p-3">
      <h4 className="mt-4 text-sm font-semibold text-muted">聊天建造</h4>
      <div className="flex-1 flex flex-col gap-2 overflow-auto rounded-lg border border-border bg-panel-2 p-2.5">
        {log.map((m, i) => (
          <div
            key={i}
            className={
              'max-w-[92%] rounded-lg px-2.5 py-2 text-[13px] leading-relaxed ' +
              (m.who === 'user'
                ? 'self-end bg-[rgba(76,175,80,0.18)]'
                : 'self-start border border-border bg-panel')
            }
          >
            {m.text}
          </div>
        ))}
        {chatBusy && (
          <div className="flex items-center gap-1.5 text-[12px] text-muted">
            <span className="h-1.5 w-1.5 animate-chat-dot rounded-full bg-muted" />
            <span className="h-1.5 w-1.5 animate-chat-dot rounded-full bg-muted [animation-delay:0.18s]" />
            <span className="h-1.5 w-1.5 animate-chat-dot rounded-full bg-muted [animation-delay:0.36s]" />
            <span>AI 正在思考…</span>
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 rounded-lg border border-border bg-bg px-2 py-1 text-sm text-text"
          type="text"
          placeholder="例如：帮我造一棵树 / 给这棵树添加叶子 / 把屋顶改成红色"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') void send();
            else if (e.key === 'ArrowUp') {
              e.preventDefault();
              const prev = historyRef.current.prev();
              if (prev !== null) setInput(prev);
            } else if (e.key === 'ArrowDown') {
              e.preventDefault();
              setInput(historyRef.current.next());
            }
          }}
        />
        <button
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-accent bg-accent px-3.5 py-2 text-sm font-semibold text-[#06140a] transition-colors hover:border-accent disabled:cursor-not-allowed disabled:opacity-50"
          onClick={() => void send()}
          disabled={chatBusy}
        >
          发送
        </button>
      </div>
    </div>
  );
}
