import { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RotateCw, Eye, History, Settings2, Wand2, Save, Copy, Undo } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import config from "@/config";

interface RevisionHistoryItem {
  timestamp: string;
  text: string;
  changes: {
    type: string;
    description: string;
  }[];
}

interface EndpointParams {
  "craft-tone": {
    tone: string;
    preserve_style: boolean;
    max_length: number;
    target_audience: string;
    domain_context: string;
  };
  "improve-grammar": {
    focus_areas: string[];
  };
  "generate-reply": {
    style: string;
    tone: string;
    maintain_context: boolean;
    reply_format: string;
    key_points: string[];
  };
}

const TextEnhancementUI = () => {
  const [userId, setUserId] = useState(() => localStorage.getItem("userId") || "");
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("apiKey") || "");
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [revisionHistory, setRevisionHistory] = useState<RevisionHistoryItem[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [activeEndpoint, setActiveEndpoint] = useState<keyof EndpointParams>("craft-tone");
  const [email, setEmail] = useState("");
  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);

  const [settings, setSettings] = useState({
    tone: "professional",
    preserveStyle: true,
    maxLength: 1000,
    targetAudience: "general",
    domainContext: "",
    focusAreas: ["punctuation"],
    explainChanges: true,
    correctionStyle: "detailed",
    locale: "en-US",
    formalityLevel: "standard",
    style: "professional",
    maintainContext: true,
    replyFormat: "standard",
    keyPoints: [] as string[],
    fontSize: 16,
    highContrast: false,
    theme: "system",
    autoSaveInterval: 30,
    keyboardShortcuts: true,
  });

  // Auto-save functionality
  useEffect(() => {
    if (autoSaveEnabled && inputText) {
      const timer = setTimeout(() => {
        localStorage.setItem("draftText", inputText);
        setLastSaved(new Date());
        toast({
          title: "Draft saved",
          description: "Your work has been automatically saved",
        });
      }, settings.autoSaveInterval * 1000);

      return () => clearTimeout(timer);
    }
  }, [inputText, autoSaveEnabled, settings.autoSaveInterval]);

  // Word and character count
  useEffect(() => {
    setWordCount(inputText.trim().split(/\s+/).length);
    setCharCount(inputText.length);
  }, [inputText]);

  // Keyboard shortcuts
  useEffect(() => {
    if (settings.keyboardShortcuts) {
      const handleKeyPress = (e: KeyboardEvent) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
          e.preventDefault();
          handleSave();
        }
        if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
          e.preventDefault();
          handleUndo();
        }
      };

      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }
  }, [settings.keyboardShortcuts]);

  const handleInputChange = (text: string) => {
    setUndoStack([...undoStack, inputText]);
    setInputText(text);
    setRedoStack([]);
  };

  const handleUndo = () => {
    if (undoStack.length > 0) {
      const previousText = undoStack[undoStack.length - 1];
      setRedoStack([...redoStack, inputText]);
      setInputText(previousText);
      setUndoStack(undoStack.slice(0, -1));
    }
  };

  const handleSave = () => {
    localStorage.setItem("draftText", inputText);
    setLastSaved(new Date());
    toast({
      title: "Saved successfully",
      description: "Your work has been saved",
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
    toast({
      title: "Copied to clipboard",
      description: "The enhanced text has been copied",
    });
  };

  const focusAreaOptions = [
    { id: "grammar", label: "Grammar" },
    { id: "spelling", label: "Spelling" },
    { id: "punctuation", label: "Punctuation" },
    { id: "style", label: "Style" },
    { id: "clarity", label: "Clarity" },
  ];

  const handleApiCall = async () => {
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

    const endpointParams: EndpointParams = {
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
      const response = await fetch(
        `${config.getApiUrl(activeEndpoint)}`,
        {
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
        }
      );

      const data = await response.json();
      if (response.ok) {
        setOutputText(data.result);
        if (data.fixes) {
          setRevisionHistory((prev) => [
            {
              timestamp: new Date().toISOString(),
              text: data.result,
              changes: data.fixes,
            },
            ...prev,
          ]);
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

  if (!userId) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8"
      >
        <div className="flex flex-col justify-center items-center gap-4">
          <div className="flex flex-col gap-4 w-80">
            <input
              type="email"
              placeholder="Enter your email"
              className="p-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-700"
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button
              variant="outline"
              onClick={async () => {
                try {
                  const response = await fetch(
                    "http://localhost:8000/api/auth/register",
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        email: email,
                      }),
                    }
                  );

                  if (response.ok) {
                    const data = await response.json();
                    setUserId(data.user_id);
                    setApiKey(data.api_key);
                    console.log(data.user_id);
                    console.log(data.api_key);
                    localStorage.setItem("userId", data.user_id);
                    localStorage.setItem("apiKey", data.api_key);
                    window.location.reload();
                  } else {
                    const data = await response.json();
                    setError(data.error || "Registration failed");
                  }
                } catch {
                  setError("Failed to register");
                }
              }}
            >
              Start
            </Button>
          </div>
          <p className="text-sm text-gray-500">
            This is a demo version. Please register with your email to use the
            full version.
          </p>
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
      </motion.div>
    );
  }

  return (
    <TooltipProvider>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8"
      >
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-3"
            >
              <Wand2 className="w-8 h-8 text-purple-600" />
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
                Text Enhancement Suite
              </h1>
            </motion.div>

            <div className="flex gap-3">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Select
                    value={activeEndpoint}
                    onValueChange={(value: keyof EndpointParams) => setActiveEndpoint(value)}
                  >
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
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPreview(!showPreview)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    {showPreview ? "Hide Preview" : "Show Preview"}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Toggle preview mode</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => (document.getElementById("settingsDialog") as HTMLDialogElement)?.showModal()}
                  >
                    <Settings2 className="w-4 h-4 mr-2" />
                    Settings
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Open settings</TooltipContent>
              </Tooltip>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                <div className="flex flex-wrap gap-3">
                  {/* ... (existing mode-specific controls remain the same) ... */}
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="relative">
                  <textarea
                    value={inputText}
                    onChange={(e) => handleInputChange(e.target.value)}
                    className="w-full p-4 border rounded-lg h-64 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-900 dark:border-gray-700 resize-none"
                    placeholder="Enter your text here..."
                    style={{ fontSize: `${settings.fontSize}px` }}
                  />
                  <div className="absolute bottom-4 right-4 flex gap-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleUndo}
                          disabled={undoStack.length === 0}
                        >
                          <Undo className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Undo (Ctrl+Z)</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleSave}
                        >
                          <Save className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Save (Ctrl+S)</TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-white dark:bg-gray-800">
              <CardHeader className="border-b border-gray-100 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl font-semibold">
                    {showPreview ? "Live Preview" : "Enhanced Output"}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleCopy}
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
                            onClick={() => (document.getElementById("historyDialog") as HTMLDialogElement)?.showModal()}
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
                <textarea
                  value={outputText}
                  readOnly
                  className="w-full p-4 border rounded-lg h-64 bg-gray-50 dark:bg-gray-900 dark:border-gray-700 resize-none"
                  style={{ fontSize: `${settings.fontSize}px` }}
                />
              </CardContent>
            </Card>
          </div>

          <motion.div 
            className="mt-6"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              onClick={handleApiCall}
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
          </motion.div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Alert variant="destructive" className="mt-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          <dialog
            id="historyDialog"
            className="modal p-0 rounded-lg shadow-lg bg-white dark:bg-gray-800"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Revision History</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => (document.getElementById("historyDialog") as HTMLDialogElement)?.close()}
                >
                  ✕
                </Button>
              </div>
              <ScrollArea className="h-[400px] pr-4">
                {revisionHistory.map((revision, index) => (
                  <motion.div
                    key={revision.timestamp}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="mb-6"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-500">
                        {new Date(revision.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {revision.changes.map((change, changeIndex) => (
                        <div key={changeIndex} className="text-sm">
                          <span className="font-medium">{change.type}:</span>{" "}
                          {change.description}
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-900 rounded">
                      <p className="text-sm">{revision.text}</p>
                    </div>
                    {index < revisionHistory.length - 1 && (
                      <Separator className="my-4" />
                    )}
                  </motion.div>
                ))}
              </ScrollArea>
            </div>
          </dialog>
        </div>
      </motion.div>
    </TooltipProvider>
  );
};

export default TextEnhancementUI;
