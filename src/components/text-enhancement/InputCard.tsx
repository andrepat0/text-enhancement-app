import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Undo, Save } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Settings } from "@/types/text-enhancement";

interface InputCardProps {
  text: string;
  wordCount: number;
  charCount: number;
  undoStack: string[];
  settings: Settings;
  onTextChange: (text: string) => void;
  onUndo: () => void;
  onSave: () => void;
}

export const InputCard = ({
  text,
  wordCount,
  charCount,
  undoStack,
  settings,
  onTextChange,
  onUndo,
  onSave,
}: InputCardProps) => {
  return (
    <Card className="border-0 shadow-lg bg-white dark:bg-gray-800">
      <CardHeader className="border-b border-gray-100 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold">Input Text</CardTitle>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>{wordCount} words</span>
            <span>|</span>
            <span>{charCount} characters</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="relative">
          <textarea
            value={text}
            onChange={(e) => onTextChange(e.target.value)}
            className="w-full p-4 border rounded-lg h-64 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-900 dark:border-gray-700 resize-none"
            placeholder="Enter your text here..."
            style={{ fontSize: `${settings.fontSize}px` }}
          />
          <div className="absolute bottom-4 right-4 flex gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={onUndo} disabled={undoStack.length === 0}>
                  <Undo className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Undo (Ctrl+Z)</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={onSave}>
                  <Save className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Save (Ctrl+S)</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};