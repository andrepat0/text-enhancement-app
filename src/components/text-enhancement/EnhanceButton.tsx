import { Button } from "@/components/ui/button";
import { RotateCw } from "lucide-react";

interface EnhanceButtonProps {
  isLoading: boolean;
  activeEndpoint: string;
  onClick: () => void;
}

export const EnhanceButton = ({ isLoading, activeEndpoint, onClick }: EnhanceButtonProps) => {
  return (
    <div className="mt-6">
      <Button
        onClick={onClick}
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-md"
      >
        {isLoading && <RotateCw className="w-4 h-4 mr-2 animate-spin" />}
        {activeEndpoint === "craft-tone"
          ? "Craft Tone"
          : activeEndpoint === "improve-grammar"
          ? "Improve Grammar"
          : "Generate Reply"}
      </Button>
    </div>
  );
};