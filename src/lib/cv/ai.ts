import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import { AI_MAX_CHARS } from "./constants";

type ImproveInput = {
  section: string;
  context?: Record<string, string>;
  text: string;
  language: "id" | "en";
};

type ImproveOk = {
  ok: true;
  original: string;
  improved: string;
  alternatives: string[];
};

type ImproveErr = { ok: false; error: string };

const buckets = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 60 * 60 * 1000;
const LIMIT = 20;

function rateLimit(key: string) {
  const now = Date.now();
  const current = buckets.get(key);
  if (!current || now > current.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (current.count >= LIMIT) return false;
  current.count += 1;
  return true;
}

function extractJson(raw: string) {
  const trimmed = raw.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  const payload = fenced?.[1] ?? trimmed;
  const start = payload.indexOf("{");
  const end = payload.lastIndexOf("}");
  if (start === -1 || end === -1) return null;
  try {
    return JSON.parse(payload.slice(start, end + 1)) as {
      improved?: string;
      alternatives?: unknown;
    };
  } catch {
    return null;
  }
}

export const improveText = createServerFn({ method: "POST" })
  .validator((input: ImproveInput) => {
    if (!input || typeof input.text !== "string") {
      throw new Error("Invalid payload");
    }
    const text = input.text.trim();
    if (!text) throw new Error("Empty text");
    if (text.length > AI_MAX_CHARS) throw new Error("Text too long");
    return {
      section: String(input.section ?? "profile").slice(0, 40),
      context: input.context,
      text,
      language: input.language === "en" ? "en" : "id",
    } satisfies ImproveInput;
  })
  .handler(async ({ data }): Promise<ImproveOk | ImproveErr> => {
    const forwarded = getRequestHeader("x-forwarded-for") ?? "anon";
    const ip = forwarded.split(",")[0]?.trim() || "anon";
    if (!rateLimit(ip)) {
      return { ok: false, error: "rate_limited" };
    }

    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) return { ok: false, error: "unavailable" };

    const langName = data.language === "en" ? "English" : "Indonesian";
    const contextLines = data.context
      ? Object.entries(data.context)
          .filter(([, v]) => v)
          .map(([k, v]) => `${k}: ${v}`)
          .join("\n")
      : "";

    const system = `You are a professional resume writing assistant.
Improve the CV text so it is more professional, clear, effective, and natural.
Keep every fact from the user input.
Do not invent experience, numbers, companies, job titles, certificates, or skills.
Do not change numbers or important facts.
You may expand sentences only with information already implied by the input.
Write the improved text in ${langName}.
Return ONLY valid JSON with this shape:
{"improved":"...","alternatives":["...","..."]}`;

    const user = `Section: ${data.section}
${contextLines ? `Context:\n${contextLines}\n` : ""}Text to improve:
${data.text}`;

    try {
      const res = await fetch("https://api.x.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "grok-4.5",
          temperature: 0.3,
          max_tokens: 700,
          messages: [
            { role: "system", content: system },
            { role: "user", content: user },
          ],
        }),
      });
      if (!res.ok) return { ok: false, error: "unavailable" };
      const body = (await res.json()) as {
        choices?: { message?: { content?: string } }[];
      };
      const content = body.choices?.[0]?.message?.content ?? "";
      const parsed = extractJson(content);
      const improved = parsed?.improved?.trim();
      if (!parsed || !improved) return { ok: false, error: "unavailable" };
      const alternatives = Array.isArray(parsed.alternatives)
        ? parsed.alternatives.filter((x): x is string => typeof x === "string" && x.trim().length > 0).slice(0, 3)
        : [];
      return { ok: true, original: data.text, improved, alternatives };
    } catch {
      return { ok: false, error: "unavailable" };
    }
  });
