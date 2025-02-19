import { useState } from "react";
import { toast } from "@/hooks/use-toast";

export const useAuth = () => {
  const [userId, setUserId] = useState(() => localStorage.getItem("userId") || "");
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("apiKey") || "");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleRegistration = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        const data = await response.json();
        setUserId(data.user_id);
        setApiKey(data.api_key);
        localStorage.setItem("userId", data.user_id);
        localStorage.setItem("apiKey", data.api_key);
        toast({
          title: "Registration successful",
          description: "You can now use the Text Enhancement Suite.",
        });
      } else {
        const data = await response.json();
        setError(data.error || "Registration failed");
        toast({
          title: "Error",
          description: data.error || "Registration failed",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error(err);
      setError("Failed to register");
      toast({
        title: "Error",
        description: "Failed to register",
        variant: "destructive",
      });
    }
  };

  return {
    userId,
    apiKey,
    email,
    setEmail,
    handleRegistration,
    error,
  };
};