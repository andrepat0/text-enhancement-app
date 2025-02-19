import { EndpointParams, GrammarCorrection, RevisionHistoryItem, Settings } from "@/types/text-enhancement";
import { toast } from "@/hooks/use-toast";

export const handleApiCall = async ({
  inputText,
  activeEndpoint,
  settings,
  userId,
  apiKey,
  setIsLoading,
  setError,
  setOutputText,
  setRevisionHistory,
  setGrammarCorrections,
}: {
  inputText: string;
  activeEndpoint: keyof EndpointParams;
  settings: Settings;
  userId: string;
  apiKey: string;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string) => void;
  setOutputText: (text: string) => void;
  setRevisionHistory: (history: RevisionHistoryItem[] | ((prev: RevisionHistoryItem[]) => RevisionHistoryItem[])) => void;
  setGrammarCorrections: (corrections: GrammarCorrection[]) => void;
}) => {
  if (!inputText) {
    toast({
      title: "Error",
      description: "Please enter some text",
      variant: "destructive",
    });
    return;
  }

  setIsLoading(true);
  setError("");

  const endpointParams = {
    "craft-tone": {
      tone: settings.tone,
      preserve_style: settings.preserveStyle,
      max_length: settings.maxLength,
      target_audience: settings.targetAudience,
      domain_context: settings.domainContext,
    },
    "improve-grammar": {
      focus_areas: settings.focusAreas,
    },
    "generate-reply": {
      style: settings.style,
      tone: settings.tone,
      maintain_context: settings.maintainContext,
      reply_format: settings.replyFormat,
      key_points: settings.keyPoints,
    },
  };

  try {
    const response = await fetch(`http://localhost:8000/api/${activeEndpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-User-Id": userId,
        "X-Api-Key": apiKey,
      },
      body: JSON.stringify({
        text: inputText,
        ...endpointParams[activeEndpoint],
      }),
    });

    const data = await response.json();
    if (response.ok) {
      setOutputText(data.result);
      if (data.fixes) {
        setRevisionHistory((prev: RevisionHistoryItem[]) => [
          {
            timestamp: new Date().toISOString(),
            text: data.result,
            changes: data.fixes,
          },
          ...prev,
        ] as RevisionHistoryItem[]);
      }
      if (activeEndpoint === "improve-grammar" && data.corrections) {
        setGrammarCorrections(data.corrections);
      }
      toast({
        title: "Success",
        description: "Text enhanced successfully",
      });
    } else {
      if (response.status === 401) {
        localStorage.removeItem("userId");
        window.location.reload();
      }
      throw new Error(data.error || "Failed to process text");
    }
  } catch (err) {
    const error = err as Error;
    setError(`API call failed: ${error.message}`);
    toast({
      title: "Error",
      description: error.message,
      variant: "destructive",
    });
  } finally {
    setIsLoading(false);
  }
};