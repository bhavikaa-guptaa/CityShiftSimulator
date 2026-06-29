const CLAUDE_API_KEY = import.meta.env.VITE_CLAUDE_API_KEY;

const MOCK_DATA = {
  tagline: `A new chapter waiting to be written.`,
  salary_local: "€4,200",
  rent: "€1,850",
  leftover: "€1,200",
  cost_vs_home: "more expensive",
  commute: "A brisk 20-minute cycle along the canals.",
  daily_routine: [
    "08:15 AM - First espresso at a local roastery, watching the city wake up.",
    "09:30 AM - Collaborative work session in a sun-drenched canal-side studio.",
    "01:00 PM - Quick lunch with colleagues at a nearby park.",
    "06:30 PM - Meeting friends for craft beers in a historic brown café.",
    "10:00 PM - A peaceful cycle home under a canopy of stars."
  ],
  friend_types: [
    "The ambitious expat who knows all the hidden speakeasies.",
    "The local artist who has lived in the same apartment for 30 years.",
    "The fellow digital nomad chasing the perfect workspace."
  ],
  what_they_miss: [
    "Your favorite quiet bakery",
    "The specific smell of rain on your old street",
    "Spontaneous family dinners"
  ],
  hidden_perk: "A small, nameless garden only accessible through a hidden courtyard.",
  hardest_thing: "Mastering the local slang to bridge the cultural gap.",
  letter: "You'll realize how much smaller the world is when you're finally where you belong. The first winter was tough, but the spring here is unlike anything you've ever felt. You are finally home.",
  verdict: "yes",
  verdict_reason: "This move aligns perfectly with your desire for professional growth and a vibrant lifestyle."
};

// Ensures daily_routine is always a non-empty array of strings,
// which prevents SimsMode from crashing when it reads routine[0] etc.
function sanitizeResult(data) {
  const fallbackRoutine = MOCK_DATA.daily_routine;

  if (!data || typeof data !== 'object') return { ...MOCK_DATA };

  const routine = Array.isArray(data.daily_routine) && data.daily_routine.length >= 3
    ? data.daily_routine.map(item => typeof item === 'string' ? item : String(item))
    : fallbackRoutine;

  return {
    ...MOCK_DATA,   // fallback defaults for any missing field
    ...data,        // overwrite with real data
    daily_routine: routine,
    verdict: ['yes', 'maybe', 'no'].includes(data.verdict) ? data.verdict : 'maybe',
    cost_vs_home: ['cheaper', 'more expensive'].includes(data.cost_vs_home) ? data.cost_vs_home : 'more expensive',
  };
}

export async function simulateLife(userData) {
  const { currentCity, destinationCity, income, profession, lifestyle } = userData;

  const prompt = `
    You are a world-class travel writer and life coach with a cinematic, emotional, and vivid writing style.
    Simulate a user's life if they moved from ${currentCity} to ${destinationCity}.
    
    User Context:
    - Profession: ${profession}
    - Monthly Income (USD): $${income}
    - Lifestyle: ${lifestyle}
    
    Return ONLY a valid JSON object with NO markdown, no backticks, no explanation — just raw JSON.
    Use exactly these fields:
    - tagline: one punchy emotional sentence about this move for this specific person.
    - salary_local: estimated salary in local currency of ${destinationCity}.
    - rent: estimated 1BR rent in local currency of ${destinationCity}.
    - leftover: money left after rent and basics in local currency.
    - cost_vs_home: exactly the string "cheaper" or "more expensive".
    - commute: typical commute style and duration in ${destinationCity}.
    - daily_routine: array of exactly 5 strings, each formatted as "HH:MM AM/PM - activity description".
    - friend_types: array of exactly 3 strings (vivid descriptions of people they'd befriend).
    - what_they_miss: array of exactly 3 strings (specific things they'd miss from home).
    - hidden_perk: one unexpected amazing thing about living there.
    - hardest_thing: the single hardest adjustment they'd face.
    - letter: a 3-sentence emotional letter from their future self 1 year after moving.
    - verdict: exactly the string "yes", "maybe", or "no".
    - verdict_reason: one honest sentence on whether this move makes sense for them.

    Tone: Emotional, personal, cinematic, human. Not a calculator, but a mirror.
  `;

  // No API key — use mock data immediately
  if (!CLAUDE_API_KEY) {
    console.warn('VITE_CLAUDE_API_KEY is missing. Using mock data for demonstration.');
    return new Promise((resolve) =>
      setTimeout(() => resolve(sanitizeResult({
        ...MOCK_DATA,
        tagline: `A dance of ${profession} and ${destinationCity}'s morning light.`,
        verdict_reason: `This move aligns perfectly with your desire for professional growth and a vibrant lifestyle in ${destinationCity}.`
      })), 2000)
    );
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'  // ✅ correct header name
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',  // ✅ updated model
        max_tokens: 1500,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!response.ok) {
      const errBody = await response.text();
      console.error('Claude API error:', response.status, errBody);
      throw new Error(`API error ${response.status}`);
    }

    const data = await response.json();
    const content = data.content[0].text.trim();

    // Strip markdown code fences if model wraps response in them
    const cleaned = content
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```\s*$/i, '')
      .trim();

    const jsonStart = cleaned.indexOf('{');
    const jsonEnd = cleaned.lastIndexOf('}');

    if (jsonStart === -1 || jsonEnd === -1) {
      throw new Error('No valid JSON found in Claude response');
    }

    const parsed = JSON.parse(cleaned.substring(jsonStart, jsonEnd + 1));
    return sanitizeResult(parsed);

  } catch (error) {
    console.error('Simulation Error:', error);
    throw error;
  }
}
