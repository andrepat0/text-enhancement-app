import { useState } from "react";
import { RevisionHistoryItem } from "@/types/text-enhancement";
export const useHistoryState = (inputText: string, setInputText: (text: string) => void) => {
  const [revisionHistory, setRevisionHistory] = useState<RevisionHistoryItem[]>([]);
  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);

  const handleUndo = () => {
    if (undoStack.length > 0) {
      const previousText = undoStack[undoStack.length - 1];
      setRedoStack([...redoStack, inputText]);
      setUndoStack(undoStack.slice(0, -1));
      setInputText(previousText);
    }
  };

  return {
    revisionHistory,
    undoStack,
    redoStack,
    handleUndo,
    setRevisionHistory,
  };
};