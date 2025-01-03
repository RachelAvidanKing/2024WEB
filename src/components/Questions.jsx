import React, { useState, useEffect } from 'react';
import { database } from "./firebase"; // Use Firebase Realtime Database
import { ref, get } from "firebase/database";
import { useTheme } from './ThemeContext'; // Import useTheme to get the current theme
import QuestionsList from './QuestionsList'; // Import the separated QuestionsList component

//In order to fill the interview
const Questions = () => {
    // State to hold the list of subjects fetched from Firebase
    const [subjects, setSubjects] = useState([]);

    // State to hold the currently selected subject
    const [selectedSubject, setSelectedSubject] = useState('');

    // State to hold the list of questions for the selected subject
    const [questions, setQuestions] = useState([]);

    // Get the current theme (dark or light) from the ThemeContext
    const { theme } = useTheme();

    // Fetch the list of subjects from Firebase when the component is mounted
    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const subjectsRef = ref(database, "subjects"); // Reference to the "subjects" node in Firebase
                const snapshot = await get(subjectsRef); // Retrieve data from Firebase

                if (snapshot.exists()) {
                    const data = snapshot.val();
                    // Map the data into an array of subject objects
                    const subjectsData = Object.keys(data).map(key => ({
                        id: key,
                        name: data[key].name,
                        questions: data[key].questions || [] // Default to an empty array if no questions exist
                    }));
                    console.log("Fetched Subjects:", subjectsData); // Log the fetched data for debugging
                    setSubjects(subjectsData); // Update the state with the fetched subjects
                } else {
                    console.log("No topic was selected."); // Log a message if no subjects are found
                }
            } catch (error) {
                console.error("Error fetching subjects:", error); // Log any errors encountered during fetching
            }
        };

        fetchSubjects(); // Invoke the fetchSubjects function
    }, []); // Empty dependency array ensures this effect runs only once, on component mount

    // Handle changes in the subject dropdown
    const handleSubjectChange = (e) => {
        const subjectName = e.target.value; // Get the selected subject name
        setSelectedSubject(subjectName); // Update the selected subject in the state

        // Find the selected subject in the subjects array
        const selected = subjects.find(subject => subject.name === subjectName);

        if (selected) {
            setQuestions(selected.questions); // Update the questions state with the questions for the selected subject
        } else {
            setQuestions([]); // Clear the questions if no subject is selected
        }
    };

    return (
        <div
            id="background"
            className={`min-h-screen flex flex-col items-center justify-center ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-yellow-200'
            }`} // Apply theme-based background styling
        >
            <div id="background" className="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full">
                {/* Title Section */}
                <h1
                    className={`text-3xl font-extrabold ${
                        theme === 'dark' ? 'text-purple-500' : 'text-gray-800'
                    } text-center mb-6`}
                >
                    Interview Topics
                </h1>

                {/* Subject Dropdown */}
                <div className="mb-4">
                    <h6 className="text-2xl font-extrabold">Select a Subject</h6>
                    <select
                        id="subjectDropdown"
                        value={selectedSubject} // Bind the value to the selectedSubject state
                        onChange={handleSubjectChange} // Trigger handleSubjectChange on change
                        className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 ${
                            theme === 'dark'
                                ? 'bg-gray-600 text-white border-gray-500'
                                : 'bg-white text-black border-gray-300'
                        }`} // Apply theme-based styling
                    >
                        {/* Default option */}
                        <option value="" disabled>
                            Select a subject...
                        </option>
                        {/* Map through subjects and render options */}
                        {subjects.map((subject) => (
                            <option key={subject.id} value={subject.name}>
                                {subject.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Render QuestionsList component with the questions and theme as props */}
                <QuestionsList questions={questions} theme={theme} />
            </div>
        </div>
    );
};

export default Questions;
