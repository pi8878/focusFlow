import { useState, useEffect } from "react";
import { StreakData } from "@/types";
import { getStreakData, recordDailyActivity, getLast7Days } from "@/store/streak";

export function useStreak(hasActiveShields: boolean) {
  const [streakData, setStreakData] = useState<StreakData>({
    currentStreak: 0,
    longestStreak: 0,
    lastActiveDate: null,
    history: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      // Record today's activity and get updated streak
      const updated = await recordDailyActivity(hasActiveShields);
      setStreakData(updated);
      setLoading(false);
    };

    init();
  }, [hasActiveShields]);

  const weekGrid = getLast7Days(streakData.history);

  return {
    streakData,
    weekGrid,
    loading,
  };
}