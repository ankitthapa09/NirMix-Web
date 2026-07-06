"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { useAuth } from "./auth-context";
import { fetchSavedProperties, saveProperty, unsaveProperty } from "./property-api";
import type { Property } from "@/types/property";

interface SavedContextType {
  saved: Property[];
  loading: boolean;
  isSaved: (id: string) => boolean;
  toggleSave: (property: Property) => Promise<void>;
}

const SavedContext = createContext<SavedContextType | undefined>(undefined);

export function SavedProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const [saved, setSaved] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);

  // Load (or clear) the saved list as auth state settles.
  useEffect(() => {
    if (isLoading) return;
    let active = true;
    (async () => {
      if (!isAuthenticated) {
        setSaved([]);
        return;
      }
      setLoading(true);
      try {
        const list = await fetchSavedProperties();
        if (active) setSaved(list);
      } catch {
        /* silent — keep whatever we have */
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [isAuthenticated, isLoading]);

  const savedIds = useMemo(() => new Set(saved.map((p) => p.id)), [saved]);
  const isSaved = useCallback((id: string) => savedIds.has(id), [savedIds]);

  const toggleSave = useCallback(async (property: Property) => {
    if (!isAuthenticated) {
      toast.error("Please log in to save properties.");
      return;
    }
    const id = property.id;
    const currentlySaved = savedIds.has(id);

    // Optimistic update — flip immediately, reconcile on failure.
    setSaved((prev) => (currentlySaved ? prev.filter((p) => p.id !== id) : [property, ...prev]));
    try {
      if (currentlySaved) {
        await unsaveProperty(id);
      } else {
        await saveProperty(id);
        toast.success("Saved to your list.");
      }
    } catch {
      setSaved((prev) => (currentlySaved ? [property, ...prev] : prev.filter((p) => p.id !== id)));
      toast.error("Couldn’t update saved. Please try again.");
    }
  }, [isAuthenticated, savedIds]);

  return (
    <SavedContext.Provider value={{ saved, loading, isSaved, toggleSave }}>
      {children}
    </SavedContext.Provider>
  );
}

export function useSaved(): SavedContextType {
  const ctx = useContext(SavedContext);
  if (!ctx) throw new Error("useSaved must be used within a SavedProvider");
  return ctx;
}
