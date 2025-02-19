import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";

export const useAutoSave = (inputText: string) => {
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  useEffect(() => {
    if (autoSaveEnabled && inputText) {
      const timer = setTimeout(() => {
        localStorage.setItem("draftText", inputText);
        setLastSaved(new Date());
        toast({
          title: "Draft saved",
          description: "Your work has been automatically saved",
        });
      }, 30 * 1000); // Auto-save every 30 seconds

      return () => clearTimeout(timer);
    }
  }, [inputText, autoSaveEnabled]);

  const handleSave = () => {
    localStorage.setItem("draftText", inputText);
    setLastSaved(new Date());
    toast({
      title: "Saved successfully",
      description: "Your work has been saved",
    });
  };

  return {
    autoSaveEnabled,
    lastSaved,
    handleSave,
    setAutoSaveEnabled,
  };
};