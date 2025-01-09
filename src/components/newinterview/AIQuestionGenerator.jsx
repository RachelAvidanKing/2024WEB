import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const AIQuestionGenerator = ({ topicInput, setGeneratedQuestions, setIsLoading, intervieweeDetails }) => {
  const [error, setError] = useState("");

  const apiKey = "AIzaSyCwWfGIlhfpmA3TAv7yi6p2zdHrJeTp2Lk";
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-exp",
  });

  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };

  const validateInputs = () => {
    let errorMessage = "";

    if (!intervieweeDetails.name.trim()) {
      errorMessage += "Please enter the interviewee's name.\n";
    }
    if (!intervieweeDetails.date) {
      errorMessage += "Please select an interview date.\n";
    }
    if (!topicInput.trim()) {
      errorMessage += "Please enter a topic to generate questions.\n";
    }

    if (errorMessage) {
      setError(errorMessage.trim());
      return false;
    }

    return true;
  };

  const generateQuestions = async () => {
    setError(""); // Clear any previous errors

    if (!validateInputs()) {
      return;
    }

    setIsLoading(true);
    try {
      const chatSession = model.startChat({
        generationConfig,
        history: [],
      });

      const result = await chatSession.sendMessage(
        `Generate 10 newspaper interview questions based on the topic: ${topicInput}, don't write any word other than the questions`
      );

      const responseText = result.response.text();
      const questions = responseText.split("\n").map((item) => item.trim()).filter((item) => item);
      setGeneratedQuestions(questions);
    } catch (error) {
      setError("Error generating questions. Please try again.");
      console.error("Error generating questions:", error);
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
      {error && (
        <div className="mt-4 text-red-500 font-medium whitespace-pre-line">
          {error}
        </div>
      )}
    </div>
  );
};

export default AIQuestionGenerator;
