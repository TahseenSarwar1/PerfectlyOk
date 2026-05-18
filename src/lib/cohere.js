/* ─── Shared Cohere AI utility ─── */

const COHERE_API_URL = 'https://api.cohere.com/v2/chat'
const COHERE_MODEL = 'command-r-08-2024'
const API_KEY = import.meta.env.VITE_COHERE_API_KEY

export const SYSTEM_PROMPT =
  'You are MindMate, a compassionate AI companion for Indian university students. ' +
  'Warm, empathetic, judgment-free. Keep responses 2–4 sentences. ' +
  'Always validate feelings before offering perspective. Never diagnose. No toxic positivity. ' +
  'Crisis resources: iCall 9152987821, Vandrevala Foundation 1860-2662-345. ' +
  'You are supportive company, not a therapy replacement.'

/**
 * Check whether the Cohere API key is configured.
 */
export function isCohereConfigured() {
  return Boolean(API_KEY)
}

/**
 * Send a chat message to Cohere with full conversation history.
 * @param {Array<{role: string, content: string}>} messages – conversation history
 * @returns {Promise<string>} – the assistant's reply text
 */
export async function chatWithCohere(messages) {
  if (!API_KEY) {
    throw new Error('VITE_COHERE_API_KEY is not configured')
  }

  const res = await fetch(COHERE_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: COHERE_MODEL,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages,
      ],
    }),
  })

  if (!res.ok) {
    const errBody = await res.text().catch(() => '')
    throw new Error(`Cohere API error ${res.status}: ${errBody}`)
  }

  const data = await res.json()

  /* Cohere v2 response shape: data.message.content[0].text */
  const content = data?.message?.content
  if (Array.isArray(content) && content.length > 0) {
    return content[0].text
  }

  throw new Error('Unexpected Cohere response format')
}

/**
 * Generate a short empathetic response to a vent.
 * @param {string} ventText – the user's vent text
 * @param {string} category – e.g. "Anxiety", "Loneliness"
 * @returns {Promise<string>}
 */
export async function generateVentResponse(ventText, category) {
  const prompt =
    `A student just shared something about "${category}". ` +
    `Their words: "${ventText}". ` +
    `Respond with 2–3 sentences of personalized empathy. Acknowledge exactly what they said. Be warm, not generic.`

  return chatWithCohere([{ role: 'user', content: prompt }])
}
