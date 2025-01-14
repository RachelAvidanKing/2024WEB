import React, { useState } from "react";

const CustomQuestionInput = ({ addCustomQuestion }) => {
  const [customQuestion, setCustomQuestion] = useState("");

  const handleAddCustomQuestion = () => {
    if (customQuestion.trim()) {
      addCustomQuestion(customQuestion.trim()); // Add question and auto-select
      setCustomQuestion(""); // Clear the input field
    }
  };

  return (
    <div className="mb-8">
      <h3 className="text-2xl font-semibold text-purple-800 mb-6">Add Custom Questions</h3>
      <div className="flex items-center space-x-4">
        <input
          type="text"
          placeholder="Enter your custom question"
          className="flex-1 p-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500"
          value={customQuestion}
          onChange={(e) => setCustomQuestion(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddCustomQuestion()} // Add on Enter
        />
        <button
          onClick={handleAddCustomQuestion}
          className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          Add Question
        </button>
      </div>
    </div>
  );
};

export default CustomQuestionInput;
