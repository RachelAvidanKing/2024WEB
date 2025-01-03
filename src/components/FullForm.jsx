import React, { useState, useEffect } from 'react';
import { auth, database } from "./firebase"; // Firebase authentication and database imports
import { ref, get, push, set } from "firebase/database";

//In order to fill form of questions and answers
const FullForm = () => {
    // State to manage the list of questions and answers
    const [questions, setQuestions] = useState([
        { question: '', answer: '', isCustom: false },
    ]);

    // State to manage form details like interviewee name and date
    const [formDetails, setFormDetails] = useState({
        intervieweeName: '',
        interviewDate: '',
    });

    // State to hold topics fetched from Firebase
    const [topics, setTopics] = useState([]);

    // State to manage the currently selected topic
    const [selectedTopic, setSelectedTopic] = useState('');

    // State to hold suggested questions for the selected topic
    const [suggestedQuestions, setSuggestedQuestions] = useState([]);

    // State to display a success message after saving the form
    const [successMessage, setSuccessMessage] = useState('');

    // Fetch topics and questions from Firebase when the component mounts
    useEffect(() => {
        const fetchTopics = async () => {
            try {
                const topicsRef = ref(database, "subjects");
                const snapshot = await get(topicsRef);
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    // Format topics into a list with id, name, and questions
                    const topicsList = Object.keys(data).map(key => ({
                        id: key,
                        name: data[key].name,
                        questions: data[key].questions || []
                    }));
                    setTopics(topicsList);
                }
            } catch (error) {
                console.error("Error fetching topics:", error);
            }
        };
        fetchTopics();
    }, []);

    // Handle topic selection and fetch relevant questions
    const handleTopicChange = (e) => {
        const topicName = e.target.value;
        setSelectedTopic(topicName);
        const selected = topics.find(topic => topic.name === topicName);
        if (selected) {
            setSuggestedQuestions(selected.questions);
        } else {
            setSuggestedQuestions([]);
        }
    };

    // Add more question and answer input fields
    const addInputBoxes = () => {
        // Prevent adding more fields if existing ones are incomplete
        const incomplete = questions.some(qa => !qa.question || !qa.answer);
        if (incomplete) {
            alert("Please fill all existing questions and answers before adding more.");
            return;
        }
        setQuestions([...questions, { question: '', answer: '', isCustom: false }]);
    };

    // Handle changes to question and answer input fields
    const handleInputChange = (index, field, value) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index][field] = value;
        setQuestions(updatedQuestions);
    };

    // Toggle between custom question input and predefined dropdown
    const toggleCustomQuestion = (index) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index].isCustom = !updatedQuestions[index].isCustom;
        updatedQuestions[index].question = ''; // Clear question when toggling
        setQuestions(updatedQuestions);
    };

    // Validate question selection from the dropdown
    const validateQuestion = (index) => {
        const question = questions[index];
        if (!question.isCustom && question.question === "Select predefined question") {
            alert("Please select a valid predefined question.");
        }
    };

    // Handle changes to form details (interviewee name and date)
    const handleFormDetailChange = (field, value) => {
        setFormDetails({ ...formDetails, [field]: value });
    };

    // Save interview details to Firebase
    const saveInterviewDetails = async () => {
        let errorMessage = ""; // Variable to accumulate error messages

        // Validate required form fields
        if (!formDetails.intervieweeName.trim()) {
            errorMessage += "• Interviewee name is required.\n";
        }
        if (!formDetails.interviewDate.trim()) {
            errorMessage += "• Interview date is required.\n";
        }
        if (!selectedTopic.trim()) {
            errorMessage += "• Please select a topic.\n";
        }
        const incompleteQuestions = questions.some(
            qa =>
                (!qa.isCustom && qa.question === "Select predefined question") ||
                !qa.question.trim() ||
                !qa.answer.trim()
        );
        if (incompleteQuestions) {
            errorMessage +=
                "• All questions must be selected from predefined questions or custom, and answers must be filled.\n";
        }

        // Show errors if any and stop saving
        if (errorMessage) {
            alert("Saving was not successful due to the following errors:\n" + errorMessage);
            return;
        }

        const user = auth.currentUser; // Get the currently logged-in user
        if (!user) {
            alert("You need to log in to save the details.");
            return;
        }

        try {
            // Fetch username from Firebase
            const userRef = ref(database, `users/${user.uid}`);
            const userSnapshot = await get(userRef);
            if (!userSnapshot.exists()) {
                alert("User data not found.");
                return;
            }
            const username = userSnapshot.val().username || "Anonymous";

            // Prepare interview data for saving
            const interviewDetails = {
                username,
                intervieweeName: formDetails.intervieweeName,
                interviewDate: formDetails.interviewDate,
                topic: selectedTopic,
                questions: questions.map(({ isCustom, ...qa }) => qa), // Exclude `isCustom` before saving
            };

            // Save interview details to Firebase
            const interviewsRef = ref(database, `interviews`);
            const newInterviewRef = push(interviewsRef);
            await set(newInterviewRef, interviewDetails);

            // Show success message temporarily
            setSuccessMessage("Interview details saved successfully!");
            setTimeout(() => setSuccessMessage(""), 3000);

            // Reset form after saving
            setFormDetails({ intervieweeName: '', interviewDate: '' });
            setQuestions([{ question: '', answer: '', isCustom: false }]);
            setSelectedTopic('');
        } catch (error) {
            console.error("Error saving interview details:", error);
            alert("An error occurred while saving the details. Please try again.");
        }
    };

    return (
        <div id="background" className="bg-yellow-200 min-h-screen flex flex-col items-center justify-center">
            <div id="background" className="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full">
            <h1 className="text-4xl font-bold">Add Questions & Answers</h1>

                {/* Form for interviewee information */}
                <form className="mb-6">
                    <div className="mb-4">
                        <label htmlFor="intervieweeName" className="block text-lg font-semibold text-gray-600 dark:text-purple-600 mb-2">
                            Interviewee Name
                        </label>
                        <input
                            type="text"
                            id="intervieweeName"
                            placeholder="Enter the interviewee name"
                            className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 
                                bg-gray-100 text-black border-gray-300 
                                dark:bg-gray-600 dark:text-purple-600 dark:border-gray-500`}
                            value={formDetails.intervieweeName}
                            onChange={(e) => handleFormDetailChange('intervieweeName', e.target.value)}
                            required
                        />
                    </div>
                    {/* Date selection */}
                    <div className="mb-4">
                        <label htmlFor="interviewDate" className="block text-lg font-semibold text-gray-600 dark:text-purple-600 mb-2">
                            Date
                        </label>
                        <input
                            type="date"
                            id="interviewDate"
                            className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 
                                bg-gray-100 border-gray-300 
                                dark:bg-gray-600 dark:border-gray-500`}
                            value={formDetails.interviewDate}
                            onChange={(e) => handleFormDetailChange('interviewDate', e.target.value)}
                            required
                        />
                    </div>
                    {/* Topic selection dropdown */}
                    <div className="mb-4">
                        <label htmlFor="topicDropdown" className="block text-lg font-semibold text-gray-600 dark:text-purple-600 mb-2">
                            Select a Topic
                        </label>
                        <select
                            id="topicDropdown"
                            value={selectedTopic}
                            onChange={handleTopicChange}
                            className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 
                                bg-gray-100 border-gray-300 
                                dark:bg-gray-600 dark:border-gray-500`}
                        >
                            <option value="" disabled>
                                Select a topic...
                            </option>
                            {topics.map((topic) => (
                                <option key={topic.id} value={topic.name}>
                                    {topic.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </form>

                {/* Input container for questions and answers */}
                {selectedTopic && (
                    <div id="inputContainer" className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 
                        bg-gray-100 border-gray-300 
                        dark:bg-gray-600 dark:border-gray-500`}>
                        {questions.map((qa, index) => (
                            <div key={index} className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 
                                bg-gray-100 border-gray-300 
                                dark:bg-gray-600 dark:border-gray-500`}>
                                <label className="block text-gray-800 font-bold mb-2">Question {index + 1}</label>
                                {qa.isCustom ? (
                                    <input
                                        type="text"
                                        placeholder="Type your own question"
                                        className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 
                                            bg-gray-100 border-gray-300 
                                            dark:bg-gray-600 dark:border-gray-500`}
                                        value={qa.question}
                                        onChange={(e) => handleInputChange(index, 'question', e.target.value)}
                                    />
                                ) : (
                                    <select
                                        value={qa.question}
                                        onChange={(e) => {
                                            handleInputChange(index, 'question', e.target.value);
                                            validateQuestion(index);
                                        }}
                                        className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 
                                            bg-gray-100 border-gray-300 
                                            dark:bg-gray-600 dark:border-gray-500`}
                                    >
                                        <option value="">Select predefined question</option>
                                        {suggestedQuestions.map((question, i) => (
                                            <option key={i} value={question}>
                                                {question}
                                            </option>
                                        ))}
                                    </select>
                                )}
                                <button
                                    type="button"
                                    onClick={() => toggleCustomQuestion(index)}
                                    className="text-blue-500 text-sm underline mb-4"
                                >
                                    {qa.isCustom ? 'Choose from predefined questions' : 'Write by yourself'}
                                </button>
                                <label className="block text-gray-800 font-bold mb-2">Answer {index + 1}</label>
                                <input
                                    type="text"
                                    placeholder={`Enter Answer ${index + 1}`}
                                    className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 
                                        bg-gray-100 border-gray-300 
                                        dark:bg-gray-600 dark:border-gray-500`}
                                    value={qa.answer}
                                    onChange={(e) => handleInputChange(index, 'answer', e.target.value)}
                                />
                            </div>
                        ))}
                    </div>
                )}

                {/* Add More Questions and Answers Button */}
                {selectedTopic && (
                    <button
                        type="button"
                        onClick={addInputBoxes}
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
                    >
                        + Add More
                    </button>
                )}

                {/* Save Button */}
                <button
                    type="button"
                    onClick={saveInterviewDetails}
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
                >
                    Save Form
                </button>

                {/* Success Message Section */}
                {successMessage && (
                    <p className="text-green-600 font-bold text-center mt-4">
                        {successMessage}
                    </p>
                )}
            </div>
        </div>
    );
};

export default FullForm;
