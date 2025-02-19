import { useEffect } from "react";

export const useKeyboardShortcuts = ({
  enabled,
  onSave,
  onUndo,
}: {
  enabled: boolean;
  onSave: () => void;
  onUndo: () => void;
}) => {
  useEffect(() => {
    if (enabled) {
      const handleKeyPress = (e: KeyboardEvent) => {
        if ((e.ctrlKey || e.metaKey) && e.key === "s") {
          e.preventDefault();
          onSave();
        }
        if ((e.ctrlKey || e.metaKey) && e.key === "z") {
          e.preventDefault();
          onUndo();
        }
      };

      window.addEventListener("keydown", handleKeyPress);
      return () => window.removeEventListener("keydown", handleKeyPress);
    }
  }, [enabled, onSave, onUndo]);
};