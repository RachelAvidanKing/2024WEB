import React, { useState } from "react";
import WelcomePage from "./WelcomePage";
import Tabs from "./Tabs";
import Menu from "./Menu"; // Import the Menu component
import InterviewHistory from "../history/InterviewHistory";
import TopicsService from "../newinterview/TopicsService";
//Main component for the interview system
const InterviewSystem = () => {
  // State to manage the currently active tab
  const [activeTab, setActiveTab] = useState("welcome");

  // Function to update the active tab state
  const handleSetActiveTab = (tabId) => {
    setActiveTab(tabId);
  };

  // States to hold interviewee details, topics, questions, answers, and saved interviews
  const [intervieweeDetails, setIntervieweeDetails] = useState({
    name: "",
    background: "",
    date: "",
  });
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [interviews, setInterviews] = useState([]);
  const [selectedInterview, setSelectedInterview] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br bg-purple-200 dark:bg-gray-900">
      {/* Render the Menu component and pass activeTab and setActiveTab */}
      <Menu activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main content container */}
      <div className="dark:bg-gray-900 container mx-auto p-4">
        {/* Render the Tabs component */}
        <Tabs activeTab={activeTab} setActiveTab={handleSetActiveTab} />

        {/* Render WelcomePage if the active tab is "welcome" */}
        {activeTab === "welcome" && (
          <>
            <WelcomePage setActiveTab={handleSetActiveTab} />
          </>
        )}

        {/* Render the TopicsService component and handle loading/error states */}
        {activeTab === "interview" && (
          <TopicsService>
            {({ topics, isLoading, error }) => {
              if (isLoading) {
                // Show a loading spinner
                return (
                  <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
                  </div>
                );
              }

              if (error) {
                // Display an error message
                return (
                  <div className="text-center p-8 bg-white/50 backdrop-blur-sm rounded-lg">
                    <p className="text-red-600 font-medium">{error}</p>
                  </div>
                );
              }

              if (!topics) return null; // If there are no topics, return null

              // Render the NewInterview component
              return (
                <NewInterview
                  topics={topics}
                  intervieweeDetails={intervieweeDetails}
                  setIntervieweeDetails={setIntervieweeDetails}
                  selectedTopic={selectedTopic}
                  setSelectedTopic={setSelectedTopic}
                  selectedQuestions={selectedQuestions}
                  handleQuestionSelect={(question) => {
                    // Toggle question selection
                    if (selectedQuestions.includes(question)) {
                      setSelectedQuestions(
                        selectedQuestions.filter((q) => q !== question)
                      );
                    } else {
                      setSelectedQuestions([...selectedQuestions, question]);
                    }
                  }}
                  answers={answers}
                  handleAnswerChange={(question, answer) =>
                    // Update answers
                    setAnswers({ ...answers, [question]: answer })
                  }
                  handleCustomQuestionAdd={() => {
                    // Add a custom question
                    const newQuestion = prompt("Enter your custom question:");
                    if (newQuestion) {
                      setSelectedQuestions([...selectedQuestions, newQuestion]);
                    }
                  }}
                  handleSaveInterview={() => {
                    // Save a new interview
                    const newInterview = {
                      id: Date.now(),
                      interviewee: intervieweeDetails,
                      topic: selectedTopic,
                      questions: selectedQuestions,
                      answers,
                      date: new Date().toISOString(),
                    };
                    setInterviews([...interviews, newInterview]);
                    handleSetActiveTab("history");
                  }}
                />
              );
            }}
          </TopicsService>
        )}

        {/* Render InterviewHistory if the active tab is "history" */}
        {activeTab === "history" && (
          <InterviewHistory
            interviews={interviews}
            selectedInterview={selectedInterview}
            setSelectedInterview={setSelectedInterview}
          />
        )}
      </div>
    </div>
  );
};

export default InterviewSystem;
