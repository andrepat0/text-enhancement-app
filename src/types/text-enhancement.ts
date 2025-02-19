export interface RevisionHistoryItem {
    timestamp: string;
    text: string;
    changes: {
      type: string;
      description: string;
    }[];
  }

  export interface Change {
    type: string;
    description: string;
  }

  export interface EndpointParams {
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
  
  export interface GrammarCorrection {
    correction: string;
    explanation: string;
    original?: string;
  }
  
  export interface Settings {
    tone: string;
    preserveStyle: boolean;
    maxLength: number;
    targetAudience: string;
    domainContext: string;
    focusAreas: string[];
    explainChanges: boolean;
    correctionStyle: string;
    locale: string;
    formalityLevel: string;
    style: string;
    maintainContext: boolean;
    replyFormat: string;
    keyPoints: string[];
    fontSize: number;
    highContrast: boolean;
    theme: string;
    autoSaveInterval: number;
    keyboardShortcuts: boolean;
    autoSaveEnabled: boolean;
  }
  
  export const DEFAULT_SETTINGS: Settings = {
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
    keyPoints: [],
    fontSize: 16,
    highContrast: false,
    theme: "system",
    autoSaveInterval: 30,
    keyboardShortcuts: true,
    autoSaveEnabled: true,
  };
  
  export const FOCUS_AREA_OPTIONS = [
    { id: "grammar", label: "Grammar" },
    { id: "spelling", label: "Spelling" },
    { id: "punctuation", label: "Punctuation" },
    { id: "style", label: "Style" },
    { id: "clarity", label: "Clarity" },
  ];