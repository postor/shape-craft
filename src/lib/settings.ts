/**
 * App settings, persisted in localStorage.
 *
 * Holds the OpenAI-compatible provider configuration so the chat agent can
 * optionally call a real LLM (key / model / baseUrl) instead of the built-in
 * rule-based generator.
 */
export interface OpenAISettings {
  enabled: boolean;
  apiKey: string;
  model: string;
  /** OpenAI-compatible base URL, e.g. https://api.openai.com/v1 */
  baseUrl: string;
  /** Whether the endpoint accepts image input (vision) for auto visual verification. */
  supportsVision: boolean;
}

export const SETTINGS_KEY = 'shapecraft.settings.v1';
const MODE_KEY = 'shapecraft.mode.v1';

/**
 * Whether the app runs in local-only mode (no backend server).
 * Defaults to `true` so the app works out of the box with no server; the
 * backend HTTP API is only used when this is explicitly turned off.
 */
export function isLocalMode(): boolean {
  try {
    const raw = localStorage.getItem(MODE_KEY);
    if (!raw) return true;
    const parsed = JSON.parse(raw) as { local?: boolean };
    return parsed.local !== false;
  } catch {
    return true;
  }
}

/** Persist the local-mode flag. */
export function setLocalMode(local: boolean): void {
  localStorage.setItem(MODE_KEY, JSON.stringify({ local }));
}

export const DEFAULT_SETTINGS: OpenAISettings = {
  enabled: false,
  apiKey: '',
  model: 'gpt-4o-mini',
  baseUrl: 'https://api.openai.com/v1',
  supportsVision: false,
};

export function loadSettings(): OpenAISettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return { ...DEFAULT_SETTINGS };
    return { ...DEFAULT_SETTINGS, ...(JSON.parse(raw) as Partial<OpenAISettings>) };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function saveSettings(s: OpenAISettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
}
