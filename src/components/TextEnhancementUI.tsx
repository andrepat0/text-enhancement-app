import { useState } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { RotateCw, Eye, History, Settings2, Wand2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

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
    // explain_changes: boolean;
    // correction_style: string;
    // locale: string;
    // formality_level: string;
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
  const [userId, setUserId] = useState(
    () => localStorage.getItem("userId") || ""
  );
  const [apiKey, setApiKey] = useState(
    () => localStorage.getItem("apiKey") || ""
  );
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [revisionHistory, setRevisionHistory] = useState<RevisionHistoryItem[]>(
    []
  );
  const [showPreview, setShowPreview] = useState(false);
  const [activeEndpoint, setActiveEndpoint] =
    useState<keyof EndpointParams>("craft-tone");
  const [email, setEmail] = useState("");
  const [settings, setSettings] = useState({
    // Tone Crafting settings
    tone: "professional",
    preserveStyle: true,
    maxLength: 1000,
    targetAudience: "general",
    domainContext: "",

    // Grammar settings
    focusAreas: ["punctuation"],
    explainChanges: true,
    correctionStyle: "detailed",
    locale: "en-US",
    formalityLevel: "standard",

    // Reply Generation settings
    style: "professional",
    maintainContext: true,
    replyFormat: "standard",
    keyPoints: [] as string[],

    // UI settings
    fontSize: 16,
    highContrast: false,
  });

  const focusAreaOptions = [
    { id: "grammar", label: "Grammar" },
    { id: "spelling", label: "Spelling" },
    { id: "punctuation", label: "Punctuation" },
    { id: "style", label: "Style" },
    { id: "clarity", label: "Clarity" },
  ];

  const handleApiCall = async () => {
    if (!inputText) {
      setError("Please enter some text");
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
        // explain_changes: settings.explainChanges,
        // correction_style: settings.correctionStyle,
        // locale: settings.locale,
        // formality_level: settings.formalityLevel
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
        `http://localhost:8000/api/${activeEndpoint}`,
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
            ...prev,
            {
              timestamp: new Date().toISOString(),
              text: data.result,
              changes: data.fixes,
            },
          ]);
        }
      } else {
        if (response.status === 401) {
          // Unlog the user if unauthorized
          localStorage.removeItem("userId");
          window.location.reload();
        }
        setError(data.error || "Failed to process text");
      }
    } catch (err) {
      const error = err as Error;
      setError(`API call failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!userId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <Wand2 className="w-8 h-8 text-purple-600" />
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
                Text Enhancement Suite
              </h1>
            </div>
          </div>
        </div>
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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <Wand2 className="w-8 h-8 text-purple-600" />
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
              Text Enhancement Suite
            </h1>
          </div>

          <div className="flex gap-3">
            <Select
              value={activeEndpoint}
              onValueChange={(value: keyof EndpointParams) =>
                setActiveEndpoint(value)
              }
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

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
            >
              <Eye className="w-4 h-4 mr-2" />
              {showPreview ? "Hide Preview" : "Show Preview"}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                (
                  document.getElementById("settingsDialog") as HTMLDialogElement
                )?.showModal()
              }
            >
              <Settings2 className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-0 shadow-lg bg-white dark:bg-gray-800">
            <CardHeader className="border-b border-gray-100 dark:border-gray-700">
              <CardTitle className="text-xl font-semibold">
                Input Text
              </CardTitle>
              <div className="flex flex-wrap gap-3">
                {activeEndpoint === "craft-tone" && (
                  <>
                    <Select
                      value={settings.tone}
                      onValueChange={(value) =>
                        setSettings((prev) => ({ ...prev, tone: value }))
                      }
                    >
                      <SelectTrigger className="w-36">
                        <SelectValue placeholder="Select tone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="formal">Formal</SelectItem>
                        <SelectItem value="casual">Casual</SelectItem>
                        <SelectItem value="friendly">Friendly</SelectItem>
                        <SelectItem value="professional">
                          Professional
                        </SelectItem>
                        <SelectItem value="empathetic">Empathetic</SelectItem>
                        <SelectItem value="assertive">Assertive</SelectItem>
                        <SelectItem value="diplomatic">Diplomatic</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select
                      value={settings.targetAudience}
                      onValueChange={(value) =>
                        setSettings((prev) => ({
                          ...prev,
                          targetAudience: value,
                        }))
                      }
                    >
                      <SelectTrigger className="w-36">
                        <SelectValue placeholder="Target audience" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="technical">Technical</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                        <SelectItem value="academic">Academic</SelectItem>
                      </SelectContent>
                    </Select>
                  </>
                )}

                {activeEndpoint === "improve-grammar" && (
                  <div className="flex flex-wrap gap-2">
                    {focusAreaOptions.map((option) => (
                      <div
                        key={option.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={option.id}
                          checked={settings.focusAreas.includes(option.id)}
                          onCheckedChange={(checked) => {
                            setSettings((prev) => ({
                              ...prev,
                              focusAreas: checked
                                ? [...prev.focusAreas, option.id]
                                : prev.focusAreas.filter(
                                    (id) => id !== option.id
                                  ),
                            }));
                          }}
                        />
                        <label htmlFor={option.id} className="text-sm">
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                )}

                {activeEndpoint === "generate-reply" && (
                  <>
                    <Select
                      value={settings.style}
                      onValueChange={(value) =>
                        setSettings((prev) => ({ ...prev, style: value }))
                      }
                    >
                      <SelectTrigger className="w-36">
                        <SelectValue placeholder="Select style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="professional">
                          Professional
                        </SelectItem>
                        <SelectItem value="casual">Casual</SelectItem>
                        <SelectItem value="formal">Formal</SelectItem>
                        <SelectItem value="friendly">Friendly</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select
                      value={settings.replyFormat}
                      onValueChange={(value) =>
                        setSettings((prev) => ({ ...prev, replyFormat: value }))
                      }
                    >
                      <SelectTrigger className="w-36">
                        <SelectValue placeholder="Reply format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="detailed">Detailed</SelectItem>
                        <SelectItem value="concise">Concise</SelectItem>
                      </SelectContent>
                    </Select>
                  </>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="w-full p-4 border rounded-lg h-64 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-900 dark:border-gray-700 resize-none"
                placeholder="Enter your text here..."
                style={{ fontSize: `${settings.fontSize}px` }}
              />
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white dark:bg-gray-800">
            <CardHeader className="border-b border-gray-100 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl font-semibold">
                  {showPreview ? "Live Preview" : "Enhanced Output"}
                </CardTitle>
                {!showPreview && activeEndpoint === "improve-grammar" && (
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
                )}
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

        <div className="mt-6">
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
        </div>

        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

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
                onClick={() =>
                  (
                    document.getElementById(
                      "historyDialog"
                    ) as HTMLDialogElement
                  )?.close()
                }
              >
                ✕
              </Button>
            </div>
            <ScrollArea className="h-[400px] pr-4">
              {revisionHistory.map((revision, index) => (
                <div key={revision.timestamp} className="mb-6">
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
                </div>
              ))}
            </ScrollArea>
          </div>
        </dialog>
      </div>
    </div>
  );
};

export default TextEnhancementUI;
