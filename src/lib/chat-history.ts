// Per-scope chat input history, persisted to localStorage.
// Each editing scenario passes its own `scope` (e.g. `asset:<id>`,
// `character:<id>`) so histories never mix between scenarios.

const PREFIX = 'shape-craft:chat-history:';
const MAX_ITEMS = 100;

export interface ChatHistory {
  /** Record a sent message and advance the cursor to the end. */
  push(text: string): void;
  /** Step backward through history; returns the entry or null if at the start. */
  prev(): string | null;
  /** Step forward through history; returns the entry or '' past the end. */
  next(): string;
  /** Reset the navigation cursor to the end (e.g. after a fresh edit). */
  reset(): void;
}

export function createChatHistory(scope: string): ChatHistory {
  const key = PREFIX + scope;
  let items: string[] = [];
  let idx = 0;

  try {
    const raw = localStorage.getItem(key);
    const arr = raw ? JSON.parse(raw) : [];
    if (Array.isArray(arr)) items = arr.filter((x) => typeof x === 'string');
  } catch {
    /* ignore corrupt / unavailable storage */
  }
  idx = items.length;

  const persist = () => {
    try {
      localStorage.setItem(key, JSON.stringify(items));
    } catch {
      /* ignore quota / private-mode errors */
    }
  };

  return {
    push(text: string) {
      items.push(text);
      if (items.length > MAX_ITEMS) items = items.slice(-MAX_ITEMS);
      persist();
      idx = items.length;
    },
    prev() {
      if (idx <= 0) return null;
      idx--;
      return items[idx];
    },
    next() {
      if (idx < items.length - 1) {
        idx++;
        return items[idx];
      }
      idx = items.length;
      return '';
    },
    reset() {
      idx = items.length;
    },
  };
}
