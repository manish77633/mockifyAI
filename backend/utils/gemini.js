const TIMEOUT_MS = parseInt(process.env.GEMINI_TIMEOUT_MS, 10) || 30_000;

// Free tier RPM limits are strict — wait before retrying on 429
const RETRY_DELAY_MS = 5000;

const MODEL_CHAIN = [
  { api: 'v1beta', model: 'gemini-2.5-flash' },      // 5 RPM | 20 RPD free tier
  { api: 'v1beta', model: 'gemini-2.5-flash-lite' },  // fallback
  { api: 'v1beta', model: 'gemini-3-flash-preview' }, // fallback
];

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

function buildPrompt(userPrompt) {
  return `You are a mock REST API data generator.
Generate a realistic JSON array based on the user's request.
Rules:
- Respond with ONLY a valid JSON array. No markdown, no code fences, no explanations.
- Minimum 3 items, maximum 20 items unless the user specifies otherwise.
- Use realistic, varied data (no "foo/bar/test" placeholders).
- Every object in the array must share the same schema.
- If images or image URLs are requested, you MUST use picsum.photos. The format is: 'https://picsum.photos/seed/{unique_word}/400/400'. Replace {unique_word} with a unique lowercase word. Each item MUST have a different seed. Never use Unsplash, Pexels, Pollinations, or LoremFlickr.

User request: "${userPrompt}"`;
}

function buildBody(userPrompt) {
  return JSON.stringify({
    contents: [{ parts: [{ text: buildPrompt(userPrompt) }] }],
    generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
  });
}

function extractText(data) {
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) {
    const finishReason = data?.candidates?.[0]?.finishReason;
    if (finishReason && finishReason !== 'STOP') {
      throw Object.assign(
        new Error(`Gemini blocked the response. Reason: ${finishReason}`),
        { statusCode: 422 }
      );
    }
    throw Object.assign(new Error('Gemini returned an empty response.'), { statusCode: 502 });
  }

  const cleaned = rawText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw Object.assign(
      new Error('Gemini response could not be parsed as JSON. Try rephrasing your prompt.'),
      { statusCode: 422 }
    );
  }

  if (!Array.isArray(parsed)) {
    if (typeof parsed === 'object' && parsed !== null) return [parsed];
    throw Object.assign(
      new Error('Gemini did not return a JSON array. Try rephrasing your prompt.'),
      { statusCode: 422 }
    );
  }
  return parsed;
}

async function fetchWithTimeout(url, options, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    return res;
  } finally {
    clearTimeout(timer);
  }
}

async function generateMockData(userPrompt) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw Object.assign(
      new Error('GEMINI_API_KEY is not configured in .env'),
      { statusCode: 500 }
    );
  }

  const errors = [];
  let attempt = 0;

  for (const { api, model } of MODEL_CHAIN) {
    attempt++;
    const url = `https://generativelanguage.googleapis.com/${api}/models/${model}:generateContent?key=${apiKey}`;

    let res;
    try {
      res = await fetchWithTimeout(
        url,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: buildBody(userPrompt),
        },
        TIMEOUT_MS
      );
    } catch (fetchErr) {
      if (fetchErr.name === 'AbortError') {
        console.warn(`[Gemini] ${model} timed out, trying next...`);
        errors.push(`${model}: timeout`);
        continue;
      }
      errors.push(`${model}: network error - ${fetchErr.message}`);
      continue;
    }

    // Auth errors — stop immediately, no point trying other models
    if (res.status === 401 || res.status === 403) {
      const body = await res.json().catch(() => ({}));
      const msg = body?.error?.message || res.statusText;
      throw Object.assign(
        new Error(`Gemini API key unauthorized (${res.status}): ${msg}`),
        { statusCode: 401 }
      );
    }

    if (res.status === 400) {
      const body = await res.json().catch(() => ({}));
      const msg = body?.error?.message || res.statusText;
      throw Object.assign(new Error(`Gemini bad request: ${msg}`), { statusCode: 400 });
    }

    // 429 = rate limited — wait then try next model
    if (res.status === 429) {
      const body = await res.json().catch(() => ({}));
      const msg = body?.error?.message || res.statusText;
      console.warn(`[Gemini] ${model} rate limited (429): ${msg.slice(0, 80)}`);
      errors.push(`${model}: 429 rate limited`);
      if (attempt < MODEL_CHAIN.length) {
        console.log(`[Gemini] Waiting ${RETRY_DELAY_MS / 1000}s before next model...`);
        await sleep(RETRY_DELAY_MS);
      }
      continue;
    }

    // 404 = model not found — try next immediately
    if (res.status === 404) {
      const body = await res.json().catch(() => ({}));
      const msg = body?.error?.message || res.statusText;
      console.warn(`[Gemini] ${model} not found (404): ${msg.slice(0, 80)}`);
      errors.push(`${model}: 404 not found`);
      continue;
    }

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      const msg = body?.error?.message || res.statusText;
      errors.push(`${model}: ${res.status} - ${msg.slice(0, 60)}`);
      continue;
    }

    // Success!
    const data = await res.json();
    console.log(`[Gemini] ✅ Success with ${api}/${model}`);
    return extractText(data);
  }

  // All models failed
  console.error('[Gemini] All models failed:', errors.join(' | '));
  throw Object.assign(
    new Error(
      `All Gemini models failed. Errors: ${errors.join(', ')}. ` +
      `Free tier limit may be exceeded — wait a minute and try again, ` +
      `or upgrade at https://aistudio.google.com/`
    ),
    { statusCode: 429 }
  );
}

module.exports = { generateMockData };