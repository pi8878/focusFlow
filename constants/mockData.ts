import { Shield, Suggestion, WeeklyProgress } from "@/types";

export const MOCK_SHIELDS: Shield[] = [
  {
    id: "1",
    appName: "Instagram",
    startTime: "09:00",
    endTime: "17:00",
    days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    appName: "TikTok",
    startTime: "09:00",
    endTime: "17:00",
    days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    appName: "YouTube",
    startTime: "22:00",
    endTime: "23:59",
    days: ["Mon", "Tue", "Wed", "Thu"],
    isActive: false,
    createdAt: new Date().toISOString(),
  },
];

export const MOCK_SUGGESTIONS: Suggestion[] = [
  {
    id: "1",
    text: "Set a daily app limit on Instagram starting at 9 PM to prevent late-night scrolling and improve next-day alertness.",
  },
  {
    id: "2",
    text: "Schedule lower-intensity or administrative tasks on Tuesdays to align your workload with your natural energy levels.",
  },
  {
    id: "3",
    text: "Establish a screen-free wind-down routine an hour before sleep to improve cognitive recovery and morning focus.",
  },
];

export const MOCK_WEEKLY_PROGRESS: WeeklyProgress[] = [
  { day: "Mon", minutesSaved: 45 },
  { day: "Tue", minutesSaved: 60 },
  { day: "Wed", minutesSaved: 30 },
  { day: "Thu", minutesSaved: 75 },
  { day: "Fri", minutesSaved: 50 },
  { day: "Sat", minutesSaved: 20 },
  { day: "Sun", minutesSaved: 10 },
];

export const MOCK_QUOTE = FOCUS_QUOTES[0];

import { FOCUS_QUOTES } from "./quotes";