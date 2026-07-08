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

const LS_KEY = 'shapecraft.settings.v1';

export const DEFAULT_SETTINGS: OpenAISettings = {
  enabled: false,
  apiKey: '',
  model: 'gpt-4o-mini',
  baseUrl: 'https://api.openai.com/v1',
  supportsVision: false,
};

export function loadSettings(): OpenAISettings {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return { ...DEFAULT_SETTINGS };
    return { ...DEFAULT_SETTINGS, ...(JSON.parse(raw) as Partial<OpenAISettings>) };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function saveSettings(s: OpenAISettings): void {
  localStorage.setItem(LS_KEY, JSON.stringify(s));
}
