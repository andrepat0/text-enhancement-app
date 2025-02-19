import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Settings2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface HeaderProps {
  activeEndpoint: string;
  showPreview: boolean;
  onEndpointChange: (value: string) => void;
  onPreviewToggle: () => void;
}

export const Header = ({ activeEndpoint, showPreview, onEndpointChange, onPreviewToggle }: HeaderProps) => {
  return (
    <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="flex items-center gap-3">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
          Text Enhancement Suite
        </h1>
      </div>

      <div className="flex gap-3">
        <Tooltip>
          <TooltipTrigger asChild>
            <Select value={activeEndpoint} onValueChange={onEndpointChange}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="craft-tone">Craft Tone</SelectItem>
                <SelectItem value="improve-grammar">Improve Grammar</SelectItem>
                <SelectItem value="generate-reply">Generate Reply</SelectItem>
              </SelectContent>
            </Select>
          </TooltipTrigger>
          <TooltipContent>Select enhancement mode</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm" onClick={onPreviewToggle}>
              <Eye className="w-4 h-4 mr-2" />
              {showPreview ? "Hide Preview" : "Show Preview"}
            </Button>
          </TooltipTrigger>
          <TooltipContent>Toggle preview mode</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm" onClick={() => (document.getElementById("settingsDialog") as HTMLDialogElement)?.showModal()}>
              <Settings2 className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </TooltipTrigger>
          <TooltipContent>Open settings</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};