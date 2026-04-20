import { useState, useEffect, useCallback } from "react";
import { Shield } from "@/types";
import {
  getShields,
  addShield,
  toggleShield,
  deleteShield,
} from "@/store/shields";

export function useShields() {
  const [shields, setShields] = useState<Shield[]>([]);
  const [loading, setLoading] = useState(true);

  // Load shields from AsyncStorage on first mount
  const loadShields = useCallback(async () => {
    setLoading(true);
    const stored = await getShields();
    setShields(stored);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadShields();
  }, [loadShields]);

  const handleAdd = async (shield: Shield) => {
    const updated = await addShield(shield);
    setShields(updated);
  };

  const handleToggle = async (id: string, value: boolean) => {
    const updated = await toggleShield(id, value);
    setShields(updated);
  };

  const handleDelete = async (id: string) => {
    const updated = await deleteShield(id);
    setShields(updated);
  };

  const activeCount = shields.filter((s) => s.isActive).length;

  return {
    shields,
    loading,
    activeCount,
    addShield: handleAdd,
    toggleShield: handleToggle,
    deleteShield: handleDelete,
    reload: loadShields,
  };
}