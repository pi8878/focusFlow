import { AppName } from "@/types";
import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";

interface UnlockSession {
  shieldId: string;
  appName: AppName;
  totalSeconds: number;
  secondsLeft: number;
  reason: string;
}

interface EmergencyUnlockContextType {
  session: UnlockSession | null;
  isExpanded: boolean;
  startSession: (
    shieldId: string,
    appName: AppName,
    durationMinutes: number,
    reason: string
  ) => void;
  endSession: () => void;
  expand: () => void;
  minimize: () => void;
}

const EmergencyUnlockContext =
  createContext<EmergencyUnlockContextType | null>(null);

export function EmergencyUnlockProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<UnlockSession | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const startSession = (
    shieldId: string,
    appName: AppName,
    durationMinutes: number,
    reason: string
  ) => {
    clearTimer();
    const totalSeconds = durationMinutes * 60;

    setSession({
      shieldId,
      appName,
      totalSeconds,
      secondsLeft: totalSeconds,
      reason,
    });
    setIsExpanded(true);

    timerRef.current = setInterval(() => {
      setSession((prev) => {
        if (!prev) return null;
        const next = prev.secondsLeft - 1;
        if (next <= 0) {
          clearTimer();
          setTimeout(() => setSession(null), 0);
          return null;
        }
        return { ...prev, secondsLeft: next };
      });
    }, 1000);
  };

  const endSession = () => {
    clearTimer();
    setSession(null);
    setIsExpanded(false);
  };

  const expand = () => setIsExpanded(true);
  const minimize = () => setIsExpanded(false);

  useEffect(() => {
    return () => clearTimer();
  }, []);

  return (
    <EmergencyUnlockContext.Provider
      value={{ session, isExpanded, startSession, endSession, expand, minimize }}
    >
      {children}
    </EmergencyUnlockContext.Provider>
  );
}

export function useEmergencyUnlock() {
  const context = useContext(EmergencyUnlockContext);
  if (!context) {
    throw new Error(
      "useEmergencyUnlock must be used within EmergencyUnlockProvider"
    );
  }
  return context;
}