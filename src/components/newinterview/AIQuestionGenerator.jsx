import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Component to generate AI-powered interview questions
const AIQuestionGenerator = ({ topicInput, setGeneratedQuestions, setIsLoading, intervieweeDetails }) => {
  const [error, setError] = useState(""); // State to store error messages

  // API key for Google Generative AI
  const apiKey = "AIzaSyD4ZMUsbomZEjkAv255Eys1JNDUYaRmBwY";
  
  // Initialize the Google Generative AI client
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-exp", // Specify the generative model to use
  });

  // Configuration for question generation
  const generationConfig = {
    temperature: 1, // Controls randomness (higher values = more creative outputs)
    topP: 0.95, // Nucleus sampling parameter
    topK: 40, // Limits the number of most probable tokens considered
    maxOutputTokens: 8192, // Maximum tokens for the output
    responseMimeType: "text/plain", // Expected response format
  };

  // Validate user inputs before making the API call
  const validateInputs = () => {
    let errorMessage = "";

    // Check if the interviewee's name is provided
    if (!intervieweeDetails.name.trim()) {
      errorMessage += "Please enter the interviewee's name.\n";
    }

    // Check if the interview date is selected
    if (!intervieweeDetails.date) {
      errorMessage += "Please select an interview date.\n";
    }

    // Check if the topic input is non-empty
    if (!topicInput.trim()) {
      errorMessage += "Please enter a topic to generate questions.\n";
    }

    // Set error message if any validation fails
    if (errorMessage) {
      setError(errorMessage.trim());
      return false;
    }

    return true; // All inputs are valid
  };

  // Function to generate interview questions
  const generateQuestions = async () => {
    setError(""); // Clear previous errors

    // Validate inputs before proceeding
    if (!validateInputs()) {
      return;
    }

    setIsLoading(true); // Set loading state while generating questions
    try {
      // Start a new chat session with the generative model
      const chatSession = model.startChat({
        generationConfig,
        history: [], // No prior conversation history
      });

      // Send the message to generate questions
      const result = await chatSession.sendMessage(
        `Generate 10 newspaper interview questions based on the topic: ${topicInput}, don't write any word other than the questions`
      );

      // Extract and process the response text into individual questions
      const responseText = result.response.text();
      const questions = responseText.split("\n").map((item) => item.trim()).filter((item) => item);
      console.log("Generated Questions:", questions);
      // Update the state with the generated questions
      setGeneratedQuestions(questions);
    } catch (error) {
      // Handle errors during the API call
      setError("Error generating questions. Please try again.");
      console.error("Error generating questions:", error);
    } finally {
      setIsLoading(false); // Reset the loading state
    }
  };

  return (
    <div>
      {/* Button to trigger question generation */}
      <button
        onClick={generateQuestions}
        className="w-70% mt-6 px-6 py-3 bg-purple-600 text-white rounded-md duration-200 text-xl"
      >
        Generate Questions
      </button>

      {/* Display error messages, if any */}
      {error && (
        <div className="mt-4 text-red-500 font-medium whitespace-pre-line">
          {error}
        </div>
      )}
    </div>
  );
};

export default AIQuestionGenerator;