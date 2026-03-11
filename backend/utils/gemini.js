const GEMINI_API_URL_PRIMARY =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';
const GEMINI_API_URL_FALLBACK =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

const TIMEOUT_MS = parseInt(process.env.GEMINI_TIMEOUT_MS, 10) || 30_000;

/**
 * Builds a strict prompt that instructs Gemini to return ONLY a JSON array.
 * @param {string} userPrompt
 * @returns {string}
 */
function buildPrompt(userPrompt) {
  return `You are a mock REST API data generator.
Generate a realistic JSON array based on the user's request.
Rules:
- Respond with ONLY a valid JSON array. No markdown, no code fences, no explanations.
- Minimum 3 items, maximum 20 items unless the user specifies otherwise.
- Use realistic, varied data (no "foo/bar/test" placeholders).
- Every object in the array must share the same schema.
- If images or image URLs are requested, you MUST use picsum.photos. The format is: 'https://picsum.photos/seed/{unique_word}/400/400'. Replace {unique_word} with a unique lowercase word related to the item (e.g. 'https://picsum.photos/seed/laptop1/400/400', 'https://picsum.photos/seed/redbag/400/400'). Each item MUST have a different seed so images are different. Never use Unsplash, Pexels, Pollinations, LoremFlickr, or placeholder services.

User request: "${userPrompt}"`;
}

/**
 * Calls the Gemini API and returns a parsed JavaScript array.
 * Throws a structured error on timeout, bad response, or invalid JSON.
 *
 * @param {string} userPrompt
 * @returns {Promise<Array>}
 */
async function generateMockData(userPrompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY is not configured.');

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let response;
  try {
    response = await fetch(`${GEMINI_API_URL_PRIMARY}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        contents: [{ parts: [{ text: buildPrompt(userPrompt) }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
        },
      }),
    });

    if (!response.ok && response.status === 503) {
      console.warn(`[Gemini API] Primary model 503, falling back to 1.5-flash`);
      response = await fetch(`${GEMINI_API_URL_FALLBACK}?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          contents: [{ parts: [{ text: buildPrompt(userPrompt) }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048,
          },
        }),
      });
    }

  } catch (err) {
    if (err.name === 'AbortError') {
      const timeoutErr = new Error(
        `Gemini API timed out after ${TIMEOUT_MS / 1000}s. Please try again.`
      );
      timeoutErr.statusCode = 504;
      throw timeoutErr;
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    const apiMsg = body?.error?.message || response.statusText;
    console.error(`[Gemini API Error] Status: ${response.status}, Message: ${apiMsg}`);
    const err = new Error(`Gemini API error (${response.status}): ${apiMsg}`);
    err.statusCode = 502;
    throw err;
  }

  const data = await response.json();
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!rawText) {
    const err = new Error('Gemini returned an empty response.');
    err.statusCode = 502;
    throw err;
  }

  // Strip accidental markdown code fences before parsing
  const cleaned = rawText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    const err = new Error('Gemini response could not be parsed as JSON. Try rephrasing your prompt.');
    err.statusCode = 422;
    throw err;
  }

  if (!Array.isArray(parsed)) {
    const err = new Error('Gemini did not return a JSON array. Try rephrasing your prompt.');
    err.statusCode = 422;
    throw err;
  }

  return parsed;
}

module.exports = { generateMockData };
