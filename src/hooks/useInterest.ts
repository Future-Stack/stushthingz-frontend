import { useState, useEffect } from "react";

const STORAGE_KEY = "expressed_interest_ids";

export const useInterest = () => {
  const [interestedIds, setInterestedIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        setInterestedIds(stored ? JSON.parse(stored) : []);
      } catch {
        setInterestedIds([]);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("interest-updated", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("interest-updated", handleStorageChange);
    };
  }, []);

  const addInterest = (id: string) => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const current = stored ? JSON.parse(stored) : [];
      if (!current.includes(id)) {
        const next = [...current, id];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        setInterestedIds(next);
        window.dispatchEvent(new Event("interest-updated"));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const removeInterest = (id: string) => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const current = stored ? JSON.parse(stored) : [];
      const next = current.filter((x: string) => x !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setInterestedIds(next);
      window.dispatchEvent(new Event("interest-updated"));
    } catch (e) {
      console.error(e);
    }
  };

  const isInterested = (id: string) => interestedIds.includes(id);

  const toggleInterest = (id: string) => {
    if (isInterested(id)) {
      removeInterest(id);
    } else {
      addInterest(id);
    }
  };

  return {
    interestedIds,
    addInterest,
    removeInterest,
    isInterested,
    toggleInterest,
  };
};
