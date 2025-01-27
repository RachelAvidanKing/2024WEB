import React, { useState, useEffect } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import AIQuestionGenerator from "./AIQuestionGenerator";
import CustomQuestionInput from "./CustomQuestionInput";
import DownloadService from "./DownloadService";
import InterviewController from "./InterviewController";

// Component to generate interview questions
const TopicsService = () => {
  // State for tracking the currently logged-in user
  const [currentUser, setCurrentUser] = useState(null);

  // State for storing interviewee details (name and date)
  const [intervieweeDetails, setIntervieweeDetails] = useState({
    name: "",
    date: "",
  });

  // State for managing input, generated questions, and user selections
  const [topicInput, setTopicInput] = useState(""); // Input for topic
  const [generatedQuestions, setGeneratedQuestions] = useState([]); // AI-generated questions
  const [selectedQuestions, setSelectedQuestions] = useState([]); // Selected questions
  const [answers, setAnswers] = useState({}); // Answers for questions
  const [isLoading, setIsLoading] = useState(false); // Loading state for AI question generation
  const [customQuestions, setCustomQuestions] = useState([]); // User-defined custom questions

  // Handle user authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user); // Set the logged-in user
      } else {
        setCurrentUser(null); // Clear user state when logged out
      }
    });
    return () => unsubscribe(); // Cleanup subscription
  }, []);

  // Update interviewee details as user types
  const handleIntervieweeChange = (e) => {
    setIntervieweeDetails({
      ...intervieweeDetails,
      [e.target.name]: e.target.value, // Update name or date dynamically
    });
  };

  // Toggle selection of a question and handle custom question logic
  const handleQuestionSelect = (question) => {
    setSelectedQuestions((prevSelected) => {
      if (prevSelected.includes(question)) {
        // If already selected, deselect it and remove it from custom questions
        setCustomQuestions((prevCustom) =>
          prevCustom.filter((q) => q !== question)
        );
        return prevSelected.filter((q) => q !== question);
      } else {
        // Add the question to selected and custom question list (if not already present)
        setCustomQuestions((prevCustom) => {
          if (!prevCustom.includes(question)) {
            return [...prevCustom, question];
          }
          return prevCustom;
        });
        return [...prevSelected, question];
      }
    });
  };

  // Update the answers state for a specific question
  const handleAnswerChange = (question, answer) => {
    setAnswers({
      ...answers,
      [question]: answer, // Store answer mapped to the question
    });
  };

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // Format to match date input
  };

  // Handle form submission and save the interview data
  const handleSubmit = async () => {
    const interviewData = InterviewController.prepareInterviewData({
      intervieweeDetails,
      topicInput,
      selectedQuestions,
      customQuestions,
      answers,
      currentUser,
    });

    // Validate the interview data
    const validation = InterviewController.validateInterviewData(interviewData);
    if (!validation.isValid) {
      alert(validation.message); // Show validation error
      return;
    }

    // Save the interview data and alert the result
    const result = await InterviewController.saveInterview(interviewData);
    alert(result.message);
  };

  return (
    // Added "flex-col" and "px-4" for better spacing on phones
    <div className="flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 dark:bg-gray-900">
      {/* Main container for the interview question generator */}
      {/* Added "space-y-8" to give vertical spacing between sections on phones */}
      <div className="w-full max-w-6xl bg-white dark:bg-gray-800 p-6 sm:p-16 rounded-lg shadow-2xl space-y-8">
        {/* Header */}
        <h2 className="text-3xl sm:text-4xl font-bold text-purple-800 dark:text-purple-400">
          Generate Interview Questions
        </h2>
        <h2 className="text-2xl sm:text-3xl font-bold text-purple-800 dark:text-purple-400">
          Please tick the questions you would like to include in the interview ☑️
        </h2>

        {/* Inputs for interviewee name and date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="w-full max-w-lg">
            <input
              type="text" // Input for interviewee name
              placeholder="Interviewee Name"
              name="name"
              className="w-full p-4 sm:p-5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none text-xl sm:text-2xl"
              value={intervieweeDetails.name} // Bind to name state
              onChange={handleIntervieweeChange} // Update state on input
            />
          </div>
          <div className="w-full max-w-lg">
            <input
              type="date" // Input for interview date
              name="date"
              className="w-full p-4 sm:p-5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none text-xl sm:text-2xl"
              max={getTodayDate()} // Restrict date to today or earlier
              value={intervieweeDetails.date} // Bind to date state
              onChange={handleIntervieweeChange} // Update state on input
            />
          </div>
        </div>

        {/* AI Question Generator Section */}
        <div className="w-full sm:w-4/5 lg:w-3/4 mx-auto p-6 sm:p-8 bg-purple-100 dark:bg-gray-800 border dark:border-gray-700 text-purple-600 dark:text-purple-300 rounded-lg shadow-lg">
          <h3 className="text-2xl sm:text-3xl font-semibold text-purple-600 dark:text-purple-300 mb-4">
            AI Question Generator
          </h3>
          <p className="text-lg sm:text-xl text-purple-600 dark:text-purple-300 mb-6">
            Enter a topic below to generate relevant questions for the interview.
          </p>
          <input
            type="text" // Input for topic
            placeholder="Enter a topic for interview questions"
            className="w-full p-4 sm:p-5 border border-purple-600 dark:border-purple-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:border-purple-600 outline-none shadow-sm text-lg sm:text-xl mb-6"
            value={topicInput} // Bind to topic input state
            onChange={(e) => setTopicInput(e.target.value)} // Update state on input
          />
          {isLoading && (
            <p className="text-lg text-indigo-600 dark:text-indigo-400 mt-4">
              Generating questions, please wait...
            </p>
          )}
          {!isLoading && (
            <AIQuestionGenerator
              topicInput={topicInput} // Pass topic input
              setGeneratedQuestions={setGeneratedQuestions} // Set generated questions
              setIsLoading={setIsLoading} // Update loading state
              intervieweeDetails={intervieweeDetails} // Pass interviewee details
            />
          )}
        </div>

        {/* Display generated questions */}
        {generatedQuestions.length > 0 && (
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg">
            <h3 className="text-2xl sm:text-3xl font-semibold text-purple-800 dark:text-purple-400 mb-6">
              Generated Questions
            </h3>
            <div className="space-y-6">
              {generatedQuestions.map((question, index) => (
                <div key={index} className="flex flex-col space-y-4">
                  <div className="flex items-center space-x-4">
                    <input
                      type="checkbox" // Checkbox for selecting questions
                      checked={selectedQuestions.includes(question)} // Check if selected
                      onChange={() => handleQuestionSelect(question)} // Toggle selection
                      className="w-6 h-6 text-purple-600 dark:text-purple-400 bg-white dark:bg-gray-700 rounded focus:ring-purple-500"
                    />
                    <span className="text-lg sm:text-xl text-gray-900 dark:text-white">
                      {question.replace(/^\d+\.\s*/, "")} {/* Display question text */}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Custom Questions Input */}
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg">
          <CustomQuestionInput
            addCustomQuestion={(newQuestion) => {
              setCustomQuestions((prevQuestions) => [...prevQuestions, newQuestion]); // Add custom question
              setSelectedQuestions((prevSelected) => [...prevSelected, newQuestion]); // Select custom question
            }}
          />

          {/* Display custom questions */}
          {customQuestions.length > 0 && (
            <div className="mt-6 space-y-6">
              {customQuestions.map((question, index) => (
                <div key={index} className="flex flex-col space-y-4">
                  <div className="flex items-center space-x-4">
                    <input
                      type="checkbox" // Checkbox for custom questions
                      checked={selectedQuestions.includes(question)} // Check if selected
                      onChange={() => handleQuestionSelect(question)} // Toggle selection
                      className="w-6 h-6 text-purple-600 dark:text-purple-400 bg-white dark:bg-gray-700 rounded focus:ring-purple-500"
                    />
                    <span className="text-lg sm:text-xl text-gray-900 dark:text-white">
                      {question.replace(/^\d+\.\s*/, "")} {/* Display question */}
                    </span>
                  </div>
                  {/* Input for answer if the question is selected */}
                  {selectedQuestions.includes(question) && (
                    <input
                      type="text"
                      placeholder="Enter your answer"
                      className="w-full max-w-md p-4 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none text-lg sm:text-xl"
                      value={answers[question] || ""} // Bind answer state
                      onChange={(e) => handleAnswerChange(question, e.target.value)} // Update answer
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action buttons (Save and Download) */}
        {(selectedQuestions.length > 0 || customQuestions.length > 0) && (
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={handleSubmit} // Save interview data
              className="px-6 py-3 bg-indigo-600 dark:bg-indigo-700 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-800 transition-colors text-xl sm:text-2xl"
            >
              Save Interview
            </button>
            <DownloadService
              interviewData={{
                intervieweeName: intervieweeDetails.name, // Pass interviewee name
                date: intervieweeDetails.date, // Pass date
                topic: topicInput, // Pass topic
              }}
              customQuestions={customQuestions} // Pass custom questions
              selectedQuestions={selectedQuestions} // Pass selected questions
              answers={answers} // Pass answers
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TopicsService;
