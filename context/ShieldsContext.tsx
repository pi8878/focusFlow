import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { Shield } from "@/types";
import {
  getShields,
  addShield as storeAdd,
  toggleShield as storeToggle,
  deleteShield as storeDelete,
} from "@/store/shields";

interface ShieldsContextType {
  shields: Shield[];
  loading: boolean;
  activeCount: number;
  addShield: (shield: Shield) => Promise<void>;
  toggleShield: (id: string, value: boolean) => Promise<void>;
  deleteShield: (id: string) => Promise<void>;
  reload: () => Promise<void>;
}

const ShieldsContext = createContext<ShieldsContextType | null>(null);

export function ShieldsProvider({ children }: { children: ReactNode }) {
  const [shields, setShields] = useState<Shield[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    const stored = await getShields();
    setShields(stored);
    setLoading(false);
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const addShield = async (shield: Shield) => {
    const updated = await storeAdd(shield);
    setShields(updated);
  };

  const toggleShield = async (id: string, value: boolean) => {
    const updated = await storeToggle(id, value);
    setShields(updated);
  };

  const deleteShield = async (id: string) => {
    const updated = await storeDelete(id);
    setShields(updated);
  };

  const activeCount = shields.filter((s) => s.isActive).length;

  return (
    <ShieldsContext.Provider
      value={{
        shields,
        loading,
        activeCount,
        addShield,
        toggleShield,
        deleteShield,
        reload,
      }}
    >
      {children}
    </ShieldsContext.Provider>
  );
}

export function useShields() {
  const context = useContext(ShieldsContext);
  if (!context) {
    throw new Error("useShields must be used within a ShieldsProvider");
  }
  return context;
}