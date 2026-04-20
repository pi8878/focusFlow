import { FOCUS_QUOTES } from "@/constants";

const CLAUDE_API_KEY = process.env.EXPO_PUBLIC_CLAUDE_API_KEY;
const CLAUDE_API_URL = "https://api.anthropic.com/v1/messages";

// Gets a random quote from our local constants as fallback
const getFallbackQuote = () => {
  const random = Math.floor(Math.random() * FOCUS_QUOTES.length);
  return FOCUS_QUOTES[random];
};

// Fetches a focus quote from Claude API
export const getFocusQuote = async (): Promise<{
  text: string;
  author: string;
}> => {
  // If no API key or no credits, use fallback immediately
  if (!CLAUDE_API_KEY) {
    return getFallbackQuote();
  }

  try {
    const response = await fetch(CLAUDE_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": CLAUDE_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 150,
        messages: [
          {
            role: "user",
            content: `Give me a single short motivational quote about focus, productivity, or digital wellness. 
            Format your response as JSON only with two fields: "text" (the quote without quotation marks) and "author" (the person who said it).
            Example: {"text": "Focus is the art of knowing what to ignore", "author": "James Clear"}
            Only respond with the JSON object, nothing else.`,
          },
        ],
      }),
    });

    if (!response.ok) {
      return getFallbackQuote();
    }

    const data = await response.json();
    const content = data.content?.[0]?.text;

    if (!content) return getFallbackQuote();

    const parsed = JSON.parse(content);

    if (!parsed.text || !parsed.author) return getFallbackQuote();

    return parsed;
  } catch {
    // Any error — network, parse, API — falls back to local quotes
    return getFallbackQuote();
  }
};

// Fetches AI focus suggestions based on the user's shields
export const getFocusSuggestions = async (
  shieldApps: string[]
): Promise<string[]> => {
  if (!CLAUDE_API_KEY) {
    return [];
  }

  try {
    const response = await fetch(CLAUDE_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": CLAUDE_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 400,
        messages: [
          {
            role: "user",
            content: `The user is blocking these apps to improve focus: ${shieldApps.join(", ")}.
            Give me exactly 3 short, practical suggestions to help them improve their digital habits.
            Format your response as a JSON array of strings only.
            Example: ["Suggestion one here", "Suggestion two here", "Suggestion three here"]
            Only respond with the JSON array, nothing else.`,
          },
        ],
      }),
    });

    if (!response.ok) return [];

    const data = await response.json();
    const content = data.content?.[0]?.text;

    if (!content) return [];

    const parsed = JSON.parse(content);

    if (!Array.isArray(parsed)) return [];

    return parsed;
  } catch {
    return [];
  }
};