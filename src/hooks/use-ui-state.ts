import { useState } from "react";

export const useUIState = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [activeEndpoint, setActiveEndpoint] = useState("craft-tone");

  return {
    isLoading,
    error,
    showPreview,
    activeEndpoint,
    setIsLoading,
    setError,
    setShowPreview,
    setActiveEndpoint,
  };
};