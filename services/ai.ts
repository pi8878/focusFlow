import { FOCUS_QUOTES } from "@/constants";
import { Shield, PredictedShield } from "@/types";

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

export const getPredictedShields = async (
  existingShields: Shield[]
): Promise<PredictedShield[]> => {
  // Mock predictions based on existing shields for when no API key/credits
  const mockPredictions: PredictedShield[] = [
    {
      id: "p1",
      appName: "Instagram",
      days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      startTime: "21:00",
      endTime: "23:59",
      reason:
        "Prevents the identified 3-hour usage streak after 9 PM to protect sleep quality.",
    },
    {
      id: "p2",
      appName: "TikTok",
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      startTime: "10:00",
      endTime: "12:00",
      reason:
        "Eliminates distractions during the 10am-12pm work window where usage is most frequent.",
    },
    {
      id: "p3",
      appName: "YouTube",
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      startTime: "13:00",
      endTime: "14:00",
      reason:
        "Blocks the post-lunch scroll habit that typically extends beyond 45 minutes.",
    },
  ];

  if (!CLAUDE_API_KEY) {
    return mockPredictions;
  }

  try {
    const shieldSummary =
      existingShields.length > 0
        ? existingShields
            .map(
              (s) =>
                `${s.appName} blocked ${s.days.join(", ")} from ${s.startTime} to ${s.endTime}`
            )
            .join("; ")
        : "No shields set yet";

    const response = await fetch(CLAUDE_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": CLAUDE_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 800,
        messages: [
          {
            role: "user",
            content: `You are an AI digital wellness coach. Based on a user's current app blocking schedule: ${shieldSummary}, suggest 3 additional shield schedules to improve their focus and digital wellness.
            
            Respond ONLY with a JSON array in this exact format:
            [
              {
                "id": "p1",
                "appName": "Instagram",
                "days": ["Mon", "Tue", "Wed"],
                "startTime": "21:00",
                "endTime": "23:59",
                "reason": "Short explanation of why this helps"
              }
            ]
            
            AppName must be one of: Instagram, TikTok, X (Twitter), YouTube, Facebook, Reddit.
            Days must be from: Mon, Tue, Wed, Thu, Fri, Sat, Sun.
            Times must be in 24hr format HH:MM.
            Only respond with the JSON array, nothing else.`,
          },
        ],
      }),
    });

    if (!response.ok) return mockPredictions;

    const data = await response.json();
    const content = data.content?.[0]?.text;
    if (!content) return mockPredictions;

    const parsed = JSON.parse(content);
    if (!Array.isArray(parsed)) return mockPredictions;

    return parsed;
  } catch {
    return mockPredictions;
  }
};