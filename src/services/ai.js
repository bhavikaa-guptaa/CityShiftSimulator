const CLAUDE_API_KEY = import.meta.env.VITE_CLAUDE_API_KEY;

export async function simulateLife(userData) {
  const { currentCity, destinationCity, income, profession, lifestyle } = userData;

  const prompt = `
    You are a world-class travel writer and life coach with a cinematic, emotional, and vivid writing style.
    Simulate a user's life if they moved from ${currentCity} to ${destinationCity}.
    
    User Context:
    - Profession: ${profession}
    - Monthly Income (USD): $${income}
    - Lifestyle: ${lifestyle}
    
    Return a structured JSON object exactly with these fields:
    - tagline: one punchy emotional sentence about this move for this specific person.
    - salary_local: estimated salary in local currency of ${destinationCity}.
    - rent: estimated 1BR rent in local currency of ${destinationCity}.
    - leftover: money left after rent and basics in local currency.
    - cost_vs_home: "cheaper" or "more expensive" vs their home city.
    - commute: typical commute style and duration in ${destinationCity}.
    - daily_routine: array of 5 time-stamped vivid activities (e.g., "08:30 AM", "06:00 PM") tailored to their lifestyle and that city.
    - friend_types: 3 types of people they'd befriend there (vivid descriptions).
    - what_they_miss: 3 specific things they'd miss from home.
    - hidden_perk: one unexpected amazing thing about living there.
    - hardest_thing: the single hardest adjustment they'd face.
    - letter: a 3-sentence emotional letter from their future self 1 year after moving, personal and vivid.
    - verdict: "yes" | "maybe" | "no".
    - verdict_reason: one honest sentence on whether this move makes sense for them.

    Tone: Emotional, personal, cinematic, human. Not a calculator, but a mirror.
  `;

  if (!CLAUDE_API_KEY) {
    console.warn('VITE_CLAUDE_API_KEY is missing. Using mock data for demonstration.');
    return new Promise((resolve) => setTimeout(() => resolve({
      tagline: `A dance of ${profession} and ${destinationCity}'s morning light.`,
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
      what_they_miss: ["Your favorite quiet bakery", "The specific smell of rain on your old street", "Spontaneous family dinners"],
      hidden_perk: "A small, nameless garden only accessible through a hidden courtyard.",
      hardest_thing: "Mastering the local slang to bridge the cultural gap.",
      letter: "You'll realize how much smaller the world is when you're finally where you belong. The first winter was tough, but the spring here is unlike anything you've ever felt. You are finally home.",
      verdict: "yes",
      verdict_reason: "This move aligns perfectly with your desire for professional growth and a vibrant European lifestyle."
    }), 2000));
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01',
        'dangerously-allow-browser': 'true' // In a real app we'd use a proxy, but user asked for frontend-only env approach
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20240620", // Using standard sonnet for reliability
        max_tokens: 1500,
        messages: [{ role: "user", content: prompt }]
      })
    });

    if (!response.ok) {
      throw new Error('Failed to fetch from Claude');
    }

    const data = await response.json();
    const content = data.content[0].text;
    
    // Extract JSON from response (handling potential markdown wrapping)
    const jsonString = content.substring(content.indexOf('{'), content.lastIndexOf('}') + 1);
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Simulation Error:', error);
    throw error;
  }
}
