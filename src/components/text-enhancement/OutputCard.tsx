import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, History } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { GrammarOutput } from "./GrammarOutput";
import { GrammarCorrection, Settings } from "@/types/text-enhancement";

interface OutputCardProps {
  showPreview: boolean;
  outputText: string;
  activeEndpoint: string;
  grammarCorrections: GrammarCorrection[];
  settings: Settings;
  onCopy: () => void;
}

export const OutputCard = ({
  showPreview,
  outputText,
  activeEndpoint,
  grammarCorrections,
  settings,
  onCopy,
}: OutputCardProps) => {
  return (
    <Card className="border-0 shadow-lg bg-white dark:bg-gray-800">
      <CardHeader className="border-b border-gray-100 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <div className="flex gap-2 items-start">
            <CardTitle className="text-xl font-semibold">
              {showPreview ? "Live Preview" : "Enhanced Output"}
            </CardTitle>
            {activeEndpoint !== "improve-grammar" && (
              <div className="flex gap-2 items-start">
                <div className="px-2 py-1 text-sm rounded-md bg-gray-100 dark:bg-gray-700">
                  {settings.tone.charAt(0).toUpperCase() + settings.tone.slice(1)}
                </div>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onCopy}
                  disabled={!outputText}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Copy to clipboard</TooltipContent>
            </Tooltip>
            {!showPreview && activeEndpoint === "improve-grammar" && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      (
                        document.getElementById(
                          "historyDialog"
                        ) as HTMLDialogElement
                      )?.showModal()
                    }
                  >
                    <History className="w-4 h-4 mr-2" />
                    View Changes
                  </Button>
                </TooltipTrigger>
                <TooltipContent>View revision history</TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {activeEndpoint === "improve-grammar" &&
        grammarCorrections.length > 0 ? (
          <GrammarOutput output={outputText} corrections={grammarCorrections} />
        ) : (
          <textarea
            value={outputText}
            readOnly
            className="w-full p-4 border rounded-lg h-64 bg-gray-50 dark:bg-gray-900 dark:border-gray-700 resize-none"
            style={{ fontSize: `${settings.fontSize}px` }}
          />
        )}
      </CardContent>
    </Card>
  );
};
