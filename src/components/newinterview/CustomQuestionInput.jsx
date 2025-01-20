import React, { useState } from "react";

// Component to add custom questions to the interview
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
      <h3 className="text-xl sm:text-2xl font-semibold text-purple-800 mb-6 text-center sm:text-left">
        Add Custom Questions
      </h3>
      <div className="flex flex-col sm:flex-row items-center sm:space-x-4 space-y-4 sm:space-y-0">
        <input
          type="text"
          placeholder="Enter your custom question"
          className="w-full p-4 sm:p-5 border border-purple-600 dark:border-purple-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:border-purple-600 outline-none shadow-sm text-lg sm:text-xl mb-6"
          value={customQuestion}
          onChange={(e) => setCustomQuestion(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddCustomQuestion()} // Add on Enter
        />
<button
  onClick={handleAddCustomQuestion}
  className="w-full sm:w-auto min-w-[160px] px-10 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 transition-colors whitespace-nowrap"
>
  Add Question
</button>


      </div>
    </div>
  );
};

export default CustomQuestionInput;
