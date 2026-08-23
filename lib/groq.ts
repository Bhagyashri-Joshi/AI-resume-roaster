/**
 * Thin LLM provider client. Keeps provider-specific request/response
 * shapes out of the rest of the app so the provider can be swapped
 * (e.g. for Claude) without touching lib/roast.ts callers.
 */

export class LlmProviderError extends Error {
  code: "LLM_TIMEOUT" | "LLM_RATE_LIMIT" | "LLM_ERROR";
  constructor(code: "LLM_TIMEOUT" | "LLM_RATE_LIMIT" | "LLM_ERROR", message: string) {
    super(message);
    this.code = code;
  }
}

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = process.env.GROQ_MODEL || "openai/gpt-oss-20b";
const REQUEST_TIMEOUT_MS = 20_000;

interface ChatMessage {
  role: "system" | "user";
  content: string;
}

export async function completeChat(messages: ChatMessage[]): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new LlmProviderError("LLM_ERROR", "LLM provider is not configured.");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        temperature: 0.8,
        max_tokens: 2500,
        messages,
      }),
      signal: controller.signal,
    });
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      throw new LlmProviderError("LLM_TIMEOUT", "The roast machine timed out. Please try again.");
    }
    throw new LlmProviderError("LLM_ERROR", "The roast machine is temporarily out of sarcasm. Please try again.");
  } finally {
    clearTimeout(timeout);
  }

  if (response.status === 429) {
    throw new LlmProviderError("LLM_RATE_LIMIT", "Too many roasts right now. Please try again in a moment.");
  }

  if (!response.ok) {
    throw new LlmProviderError("LLM_ERROR", "The roast machine is temporarily out of sarcasm. Please try again.");
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;

  if (typeof content !== "string" || content.trim().length === 0) {
    throw new LlmProviderError("LLM_ERROR", "The roast machine returned nothing usable. Please try again.");
  }

  return content;
}
