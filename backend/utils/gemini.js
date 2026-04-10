const TIMEOUT_MS = parseInt(process.env.NVIDIA_TIMEOUT_MS, 10) || parseInt(process.env.GEMINI_TIMEOUT_MS, 10) || 30_000;

function buildPrompt(userPrompt) {
  return `You are a mock REST API data generator.
Generate a realistic JSON array based on the user's request.
Rules:
- Respond with ONLY a valid JSON array. No markdown, no code fences, no explanations.
- Minimum 3 items, maximum 20 items unless the user specifies otherwise.
- Use realistic, varied data (no "foo/bar/test" placeholders).
- Every object in the array must share the same schema.
- If images or image URLs are requested, you MUST use picsum.photos. The format is: 'https://picsum.photos/seed/{unique_word}/400/400'. Replace {unique_word} with a unique lowercase word related to the item. Each item MUST have a different seed so images are different. Never use Unsplash, Pexels, Pollinations, LoremFlickr, or placeholder services.

User request: "${userPrompt}"`;
}

async function generateMockData(userPrompt) {
  const apiKey = process.env.NVIDIA_API_KEY;
  if (!apiKey) throw new Error('NVIDIA_API_KEY is not configured.');

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let response;
  try {
    const currentModel = 'meta/llama-3.1-70b-instruct';
    response = await fetch(`https://integrate.api.nvidia.com/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: currentModel,
        messages: [{ role: 'user', content: buildPrompt(userPrompt) }],
        temperature: 0.7,
        max_tokens: 2048
      }),
    });
  } catch (err) {
    if (err.name === 'AbortError') {
      const timeoutErr = new Error(`NVIDIA API timed out after ${TIMEOUT_MS / 1000}s. Please try again.`);
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
    console.error(`[NVIDIA API Error] Status: ${response.status}, Message: ${apiMsg}`);
    const err = new Error(`AI API error (${response.status}): ${apiMsg}`);
    err.statusCode = response.status === 429 ? 429 : 502;
    throw err;
  }

  const data = await response.json();
  const rawText = data?.choices?.[0]?.message?.content;

  if (!rawText) {
    const err = new Error('AI returned an empty response.');
    err.statusCode = 502;
    throw err;
  }

  const cleaned = rawText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    const err = new Error('AI response could not be parsed as JSON. Try rephrasing your prompt.');
    err.statusCode = 422;
    throw err;
  }

  if (!Array.isArray(parsed)) {
    const err = new Error('AI did not return a JSON array. Try rephrasing your prompt.');
    err.statusCode = 422;
    throw err;
  }

  return parsed;
}

module.exports = { generateMockData };
