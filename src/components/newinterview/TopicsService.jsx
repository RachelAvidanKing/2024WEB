import React, { useState, useEffect } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import AIQuestionGenerator from "./AIQuestionGenerator";
import CustomQuestionInput from "./CustomQuestionInput";
import DownloadService from "./DownloadService";
import InterviewController from "./InterviewController";

// Component to generate interview questions
const TopicsService = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [intervieweeDetails, setIntervieweeDetails] = useState({
    name: "",
    date: "",
  });
  const [topicInput, setTopicInput] = useState("");
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [customQuestions, setCustomQuestions] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleIntervieweeChange = (e) => {
    setIntervieweeDetails({
      ...intervieweeDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleQuestionSelect = (question) => {
    setSelectedQuestions((prevSelected) => {
      if (prevSelected.includes(question)) {
        setCustomQuestions((prevCustom) =>
          prevCustom.filter((q) => q !== question)
        );
        return prevSelected.filter((q) => q !== question);
      } else {
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

  const handleAnswerChange = (question, answer) => {
    setAnswers({
      ...answers,
      [question]: answer,
    });
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // פורמט YYYY-MM-DD
  };

  const handleSubmit = async () => {
    const interviewData = InterviewController.prepareInterviewData({
      intervieweeDetails,
      topicInput,
      selectedQuestions,
      customQuestions,
      answers,
      currentUser,
    });

    const validation = InterviewController.validateInterviewData(interviewData);
    if (!validation.isValid) {
      alert(validation.message);
      return;
    }

    const result = await InterviewController.saveInterview(interviewData);
    alert(result.message);
  };

  return (
    <div className="dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-full p-6 sm:p-10">
        <h2 className="text-3xl sm:text-4xl font-bold text-purple-800 dark:text-purple-400 mb-8">
          Generate Interview Questions
        </h2>

        <h2 className="text-3xl sm:text-4xl font-bold text-purple-800 dark:text-purple-400 mb-8">
          Please tick the questions you would like to include in the interview ☑️
        </h2>

        <div className="space-y-6 sm:space-y-8 mb-8">
          <div className="w-full max-w-lg">
            <input
              type="text"
              placeholder="Interviewee Name"
              name="name"
              className="w-full p-4 sm:p-5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none text-xl sm:text-2xl"
              value={intervieweeDetails.name}
              onChange={handleIntervieweeChange}
            />
          </div>
          <div className="w-full max-w-lg">
            <input
              type="date"
              name="date"
              className="w-full p-4 sm:p-5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none text-xl sm:text-2xl"
              max={getTodayDate()} // מגביל לתאריכים עד היום בלבד
              value={intervieweeDetails.date}
              onChange={handleIntervieweeChange}
            />
          </div>
        </div>

        <div className="w-60% p-6 sm:p-8 bg-purple-100 dark:bg-gray-800 border dark:border-gray-700 text-purple-600 dark:text-purple-300 rounded-lg shadow-lg mb-8">
          <h3 className="text-2xl sm:text-3xl font-semibold text-purple-600 dark:text-purple-300 mb-4">
            AI Question Generator
          </h3>
          <p className="text-lg sm:text-xl text-purple-600 dark:text-purple-300 mb-6">
            Enter a topic below to generate relevant questions for the interview.
          </p>
          <input
            type="text"
            placeholder="Enter a topic for interview questions"
            className="w-full p-4 sm:p-5 border border-purple-600 dark:border-purple-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:border-purple-600 outline-none shadow-sm text-lg sm:text-xl mb-6"
            value={topicInput}
            onChange={(e) => setTopicInput(e.target.value)}
          />
          {isLoading && (
            <p className="text-lg text-indigo-600 dark:text-indigo-400 mt-4">
              Generating questions, please wait...
            </p>
          )}
          {!isLoading && (
            <AIQuestionGenerator
              topicInput={topicInput}
              setGeneratedQuestions={setGeneratedQuestions}
              setIsLoading={setIsLoading}
              intervieweeDetails={intervieweeDetails}
            />
          )}
        </div>

        {generatedQuestions.length > 0 && (
          <div className="mb-12 p-6 bg-white dark:bg-gray-800 rounded-lg">
            <h3 className="text-2xl sm:text-3xl font-semibold text-purple-800 dark:text-purple-400 mb-6">
              Generated Questions
            </h3>
            <div className="space-y-6">
              {generatedQuestions.map((question, index) => (
                <div key={index} className="flex flex-col space-y-4">
                  <div className="flex items-center space-x-4">
                    <input
                      type="checkbox"
                      checked={selectedQuestions.includes(question)}
                      onChange={() => handleQuestionSelect(question)}
                      className="w-6 h-6 text-purple-600 dark:text-purple-400 bg-white dark:bg-gray-700 rounded focus:ring-purple-500"
                    />
                    <span className="text-lg sm:text-xl text-gray-900 dark:text-white">
                      {question.replace(/^\d+\.\s*/, "")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mb-12 p-6 bg-white dark:bg-gray-800 rounded-lg">
          <CustomQuestionInput
            addCustomQuestion={(newQuestion) => {
              setCustomQuestions((prevQuestions) => [...prevQuestions, newQuestion]);
              setSelectedQuestions((prevSelected) => [...prevSelected, newQuestion]);
            }}
          />

          {customQuestions.length > 0 && (
            <div className="mt-6 space-y-6">
              {customQuestions.map((question, index) => (
                <div key={index} className="flex flex-col space-y-4">
                  <div className="flex items-center space-x-4">
                    <input
                      type="checkbox"
                      checked={selectedQuestions.includes(question)}
                      onChange={() => handleQuestionSelect(question)}
                      className="w-6 h-6 text-purple-600 dark:text-purple-400 bg-white dark:bg-gray-700 rounded focus:ring-purple-500"
                    />
                    <span className="text-lg sm:text-xl text-gray-900 dark:text-white">
                      {question.replace(/^\d+\.\s*/, "")}
                    </span>
                  </div>
                  {selectedQuestions.includes(question) && (
                    <input
                      type="text"
                      placeholder="Enter your answer"
                      className="w-50% p-4 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none text-lg sm:text-xl"
                      value={answers[question] || ""}
                      onChange={(e) => handleAnswerChange(question, e.target.value)}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {(selectedQuestions.length > 0 || customQuestions.length > 0) && (
          <div className="flex justify-start space-x-4 mt-8">
            <button
              onClick={handleSubmit}
              className="px-6 py-3 bg-indigo-600 dark:bg-indigo-700 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-800 transition-colors text-xl sm:text-2xl"
            >
              Save Interview
            </button>
            <DownloadService
              interviewData={{
                intervieweeName: intervieweeDetails.name,
                date: intervieweeDetails.date,
                topic: topicInput,
              }}
              customQuestions={customQuestions}
              selectedQuestions={selectedQuestions}
              answers={answers}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TopicsService;
