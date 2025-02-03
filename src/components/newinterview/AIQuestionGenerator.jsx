import React, { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "../firebase"; // Firebase configuration
import { ref, get } from "firebase/database";

const AIQuestionGenerator = ({ topicInput, setGeneratedQuestions, setIsLoading, intervieweeDetails }) => {
  const [error, setError] = useState(""); // State for error messages
  const [apiKey, setApiKey] = useState(""); // Store API key
  const [isApiKeyLoaded, setIsApiKeyLoaded] = useState(false); // Track API key loading status

  // Fetch API Key from Firebase on component mount
  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        // Reference the API key field in Firebase
        const apiKeyRef = ref(db, "api_key"); 
        const snapshot = await get(apiKeyRef);

        if (snapshot.exists()) {
          setApiKey(snapshot.val()); // Store API key in state
          console.log("API key loaded:", snapshot.val());
          setIsApiKeyLoaded(true);
        } else {
          setError("API key not found in Firebase.");
        }
      } catch (error) {
        console.error("Error fetching API key:", error);
        setError("Failed to fetch API key.");
      }
    };

    fetchApiKey();
  }, []);

  // Don't proceed until API key is loaded
  if (!isApiKeyLoaded) {
    return <div>Loading API Key...</div>;
  }

  // Initialize Google Generative AI with the fetched API key
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };

  // Function to generate interview questions
  const generateQuestions = async () => {
    setError("");

    if (!topicInput.trim()) {
      setError("Please enter a topic to generate questions.");
      return;
    }

    setIsLoading(true);
    try {
      const chatSession = model.startChat({ generationConfig, history: [] });
      const result = await chatSession.sendMessage(
        `Generate 10 newspaper interview questions based on the topic: ${topicInput}, don't write any word other than the questions`
      );

      const responseText = result.response.text();
      const questions = responseText.split("\n").map((q) => q.trim()).filter((q) => q);
      
      setGeneratedQuestions(questions);
    } catch (error) {
      setError("Error generating questions. Please try again.");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={generateQuestions}
        className="w-70% mt-6 px-6 py-3 bg-purple-600 text-white rounded-md duration-200 text-xl"
      >
        Generate Questions
      </button>

      {error && <div className="mt-4 text-red-500 font-medium">{error}</div>}
    </div>
  );
};

export default AIQuestionGenerator;
