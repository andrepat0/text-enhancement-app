import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const TONE_OPTIONS = [
  {
    id: "formal",
    label: "Formal",
    description: "Sophisticated language for professional documents.",
  },
  {
    id: "casual",
    label: "Casual",
    description: "Relaxed, conversational language.",
  },
  {
    id: "friendly",
    label: "Friendly",
    description: "Warm and personal language.",
  },
  {
    id: "professional",
    label: "Professional",
    description: "Clear, direct business language.",
  },
  {
    id: "empathetic",
    label: "Empathetic",
    description: "Shows understanding and compassion.",
  },
  {
    id: "assertive",
    label: "Assertive",
    description: "Confident and direct language.",
  },
  {
    id: "diplomatic",
    label: "Diplomatic",
    description: "Tactful and considerate language.",
  },
];

export const ToneSelector = ({
  tone,
  onToneChange,
}: {
  tone: string;
  onToneChange: (tone: string) => void;
}) => {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium">Tone</h3>
      <Select value={tone} onValueChange={onToneChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a tone" />
        </SelectTrigger>
        <SelectContent>
          {TONE_OPTIONS.map((option) => (
            <SelectItem key={option.id} value={option.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>{option.label}</span>
                </TooltipTrigger>
                <TooltipContent>{option.description}</TooltipContent>
              </Tooltip>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};