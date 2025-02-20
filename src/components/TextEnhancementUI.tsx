// Components
import { Header } from "@/components/text-enhancement/Header";
import { InputCard } from "@/components/text-enhancement/InputCard";
import { OutputCard } from "@/components/text-enhancement/OutputCard";
import { EnhanceButton } from "@/components/text-enhancement/EnhanceButton";
import { RegistrationForm } from "@/components/text-enhancement/RegistrationForm";
import { HistoryDialog } from "@/components/text-enhancement/HistoryDialog";

// Hooks
import { useTextState } from "@/hooks/use-text-state";
import { useUIState } from "@/hooks/use-ui-state";
import { useHistoryState } from "@/hooks/use-history-state";
import { useAutoSave } from "@/hooks/use-auto-save";
import { useAuth } from "@/hooks/use-auth";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";

// API
import { handleApiCall } from "@/api/text-enhancement";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { AnimatePresence, motion } from "framer-motion";
import { Alert, AlertDescription } from "./ui/alert";
import { toast } from "@/hooks/use-toast";
import {
  DEFAULT_SETTINGS,
  EndpointParams,
  GrammarCorrection,
  Settings,
} from "@/types/text-enhancement";
import { useState, useEffect } from "react";
import { SettingsDialog } from "./text-enhancement/SettingsDialog";

const TextEnhancementUI = () => {
  // Authentication state
  const {
    userId,
    apiKey,
    email,
    setEmail,
    handleRegistration,
    error: authError,
  } = useAuth();

  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);

  const [grammarCorrections, setGrammarCorrections] = useState<
    GrammarCorrection[]
  >([]);

  // Text state
  const {
    inputText,
    outputText,
    wordCount,
    charCount,
    handleInputChange,
    setOutputText,
    setInputText,
  } = useTextState();

  // UI state
  const {
    isLoading,
    error,
    showPreview,
    activeEndpoint,
    setIsLoading,
    setError,
    setShowPreview,
    setActiveEndpoint,
  } = useUIState();

  // History and undo/redo state
  const { revisionHistory, undoStack, handleUndo, setRevisionHistory } =
    useHistoryState(inputText, setInputText);

  // Auto-save state
  const { handleSave } = useAutoSave(inputText);

  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);

  // Load saved draft on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem("draftText");
    if (savedDraft) {
      setInputText(savedDraft);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    enabled: settings.keyboardShortcuts,
    onSave: handleSave,
    onUndo: handleUndo,
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
    toast({
      title: "Copied to clipboard",
      description: "The enhanced text has been copied",
    });
  };

  const handleEnhance = () => {
    handleApiCall({
      inputText,
      activeEndpoint: activeEndpoint as keyof EndpointParams,
      settings,
      userId,
      apiKey,
      setIsLoading,
      setError,
      setOutputText,
      setRevisionHistory,
      setGrammarCorrections,
    });
  };

  if (!userId) {
    return (
      <RegistrationForm
        email={email}
        setEmail={setEmail}
        onRegister={handleRegistration}
        error={authError}
      />
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
          <Header
            activeEndpoint={activeEndpoint}
            showPreview={showPreview}
            onEndpointChange={setActiveEndpoint}
            onPreviewToggle={() => setShowPreview(!showPreview)}
            onSettingsOpen={() => setSettingsDialogOpen(true)}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <InputCard
              text={inputText}
              wordCount={wordCount}
              charCount={charCount}
              undoStack={undoStack}
              settings={settings}
              onTextChange={handleInputChange}
              onUndo={handleUndo}
              onSave={handleSave}
            />

            <OutputCard
              showPreview={showPreview}
              outputText={outputText}
              activeEndpoint={activeEndpoint}
              grammarCorrections={grammarCorrections}
              settings={settings}
              onCopy={handleCopy}
            />
          </div>

          <EnhanceButton
            isLoading={isLoading}
            activeEndpoint={activeEndpoint}
            onClick={handleEnhance}
          />

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

          <HistoryDialog revisionHistory={revisionHistory} />

          <SettingsDialog
            settings={settings}
            onSettingsChange={(newSettings) => setSettings(newSettings)}
            open={settingsDialogOpen}
            onOpenChange={setSettingsDialogOpen}
          />
        </div>
      </motion.div>
    </TooltipProvider>
  );
};

export default TextEnhancementUI;
