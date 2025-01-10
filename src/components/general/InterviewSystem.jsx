import React, { useState } from "react";
import WelcomePage from "./WelcomePage";
import Tabs from "./Tabs";
import InterviewHistory from "../history/InterviewHistory";
import TopicsService from "../newinterview/TopicsService";
//Component to manage the interview system
const InterviewSystem = () => {
  const [activeTab, setActiveTab] = useState("welcome");
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

  // Function to handle selecting or deselecting a question
  const handleQuestionSelect = (question) => {
    if (selectedQuestions.includes(question)) {
      // Deselect the question
      setSelectedQuestions(selectedQuestions.filter((q) => q !== question));
      const newAnswers = { ...answers };
      delete newAnswers[question];
      setAnswers(newAnswers);
    } else {
      // Select the question
      setSelectedQuestions([...selectedQuestions, question]);
    }
  };

  // Function to handle changes in answers
  const handleAnswerChange = (question, answer) => {
    setAnswers({ ...answers, [question]: answer });
  };

  // Function to add a custom question
  const handleCustomQuestionAdd = () => {
    const newQuestion = prompt("Enter your custom question:");
    if (newQuestion) {
      setSelectedQuestions([...selectedQuestions, newQuestion]);
    }
  };

  // Function to save an interview
  const handleSaveInterview = () => {
    const newInterview = {
      id: Date.now(),
      interviewee: intervieweeDetails,
      topic: selectedTopic,
      questions: selectedQuestions,
      answers,
      date: new Date().toISOString(),
    };

    setInterviews([...interviews, newInterview]);

    // Reset form for a new interview
    setIntervieweeDetails({ name: "", background: "", date: "" });
    setSelectedTopic("");
    setSelectedQuestions([]);
    setAnswers({});
    setActiveTab("history");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br bg-purple-200 dark:bg-gray-900">
      <div className="dark:bg-gray-900 container mx-auto p-4">
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === "welcome" && <WelcomePage />}

        {activeTab === "interview" && (
          <TopicsService>
            {({ topics, isLoading, error }) => {
              if (isLoading) {
                return (
                  <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
                  </div>
                );
              }

              if (error) {
                return (
                  <div className="text-center p-8 bg-white/50 backdrop-blur-sm rounded-lg">
                    <p className="text-red-600 font-medium">{error}</p>
                  </div>
                );
              }

              if (!topics) return null;

              return (
                <NewInterview
                  topics={topics}
                  intervieweeDetails={intervieweeDetails}
                  setIntervieweeDetails={setIntervieweeDetails}
                  selectedTopic={selectedTopic}
                  setSelectedTopic={setSelectedTopic}
                  selectedQuestions={selectedQuestions}
                  handleQuestionSelect={handleQuestionSelect}
                  answers={answers}
                  handleAnswerChange={handleAnswerChange}
                  handleCustomQuestionAdd={handleCustomQuestionAdd}
                  handleSaveInterview={handleSaveInterview}
                />
              );
            }}
          </TopicsService>
        )}

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
