import React, { useState } from "react";

// Component for adding custom questions
const CustomQuestionInput = ({ setCustomQuestions }) => {
  const [customQuestion, setCustomQuestion] = useState(""); // State to hold the current custom question input

  // Function to add a custom question to the list
  const handleAddCustomQuestion = () => {
    // Check if the input is not empty or just whitespace
    if (customQuestion.trim()) {
      // Update the custom questions list by appending the new question
      setCustomQuestions((prevQuestions) => [...prevQuestions, customQuestion.trim()]);
      setCustomQuestion(""); // Clear the input field
    }
  };

  return (
    <div className="mb-8">
      {/* Header for the custom questions section */}
      <h3 className="text-2xl font-semibold text-purple-800 mb-6">Add Custom Questions</h3>
      
      {/* Input and button container */}
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        {/* Input field for custom question */}
        <input
          type="text"
          placeholder="Enter your custom question"
          className="flex-1 p-4 sm:p-5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white/70 text-lg sm:text-xl"
          value={customQuestion} // Bind input value to state
          onChange={(e) => setCustomQuestion(e.target.value)} // Update state on input change
          onKeyDown={(e) => {
            // Add question on pressing Enter
            if (e.key === "Enter") {
              handleAddCustomQuestion();
            }
          }}
        />
        
        {/* Button to add the custom question */}
        <button
          onClick={handleAddCustomQuestion} // Trigger adding the question
          className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-lg sm:text-xl"
        >
          Add Question
        </button>
      </div>
    </div>
  );
};

export default CustomQuestionInput; // Export the component as default
