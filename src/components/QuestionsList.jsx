import React from 'react';

// Define the QuestionsList component, which displays a list of questions or a message when no questions are available
const QuestionsList = ({ questions, theme }) => {
    return (
        // Container for the questions list with dynamic text color based on the theme
        <div id="questionsContainer" className={`mt-6 ${theme === 'dark' ? 'text-purple-500' : 'text-gray-700'}`}>
            {/* Check if there are any questions to display */}
            {questions.length > 0 ? (
                // If questions are available, render them as a bulleted list
                <ul className="list-disc pl-5">
                    {questions.map((question, index) => (
                        // Render each question as a list item with a unique key (index)
                        <li key={index} className="mb-2">
                            {question} {/* Display the question text */}
                        </li>
                    ))}
                </ul>
            ) : (
                // If no questions are available, display a message
                <p className={`mt-6 ${theme === 'dark' ? 'text-purple-500' : 'text-gray-700'}`}>
                    No topic was selected.
                </p>
            )}
        </div>
    );
};

export default QuestionsList; // Export the component for use in other parts of the application
