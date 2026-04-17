export type DayOfWeek = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

export type AppName =
  | "Instagram"
  | "TikTok"
  | "X (Twitter)"
  | "YouTube"
  | "Facebook"
  | "Reddit";

export interface Shield {
  id: string;
  appName: AppName;
  startTime: string;   // "09:00"
  endTime: string;     // "17:00"
  days: DayOfWeek[];
  isActive: boolean;
  createdAt: string;
}

export interface AppOption {
  name: AppName;
  color: string;       // background color for the icon
  iconColor: string;   // icon foreground color
}

export interface Suggestion {
  id: string;
  text: string;
}

export interface WeeklyProgress {
  day: DayOfWeek;
  minutesSaved: number;
}