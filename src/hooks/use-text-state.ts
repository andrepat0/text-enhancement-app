import { useState } from "react";

export const useTextState = () => {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const wordCount = inputText.trim().split(/\s+/).length;
  const charCount = inputText.length;

  const handleInputChange = (text: string) => {
    setInputText(text);
  };

  return {
    inputText,
    outputText,
    wordCount,
    charCount,
    handleInputChange,
    setOutputText,
  };
};