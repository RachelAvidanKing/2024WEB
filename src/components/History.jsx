import React, { useEffect, useState } from "react";
import { database } from "./firebase"; // Firebase configuration
import { ref, query, orderByChild, equalTo, get } from "firebase/database";
import { useLocation } from "react-router-dom";

//In order to show history of past interviews
const History = () => {
    // State to store rows of data for the table
    const [tableRows, setTableRows] = useState([]);

    // State to manage the visibility of the popup
    const [isPopupVisible, setIsPopupVisible] = useState(false);

    // State to hold the content of the popup
    const [popupContent, setPopupContent] = useState([]);

    // Access the current location to retrieve state (e.g., username passed during navigation)
    const location = useLocation();

    // Retrieve the username from the state, or use an empty string as fallback
    const username = location.state?.username || "";

    // Fetch interview data from Firebase whenever the username changes
    useEffect(() => {
        const fetchData = async () => {
            // If no username is provided, log a message and exit
            if (!username) {
                console.log("No username provided.");
                return;
            }

            try {
                // Reference to the "interviews" table in Firebase
                const interviewsRef = ref(database, "interviews");

                // Query to filter interviews by the username
                const userQuery = query(interviewsRef, orderByChild("username"), equalTo(username));

                // Fetch the data from Firebase
                const snapshot = await get(userQuery);

                if (snapshot.exists()) {
                    // If data exists, map it to table rows
                    const data = snapshot.val();
                    const rows = Object.entries(data).map(([key, item]) => ({
                        id: key, // Unique ID for each entry
                        intervieweeName: item.intervieweeName || "N/A", // Interviewee name
                        topic: item.topic || "N/A", // Topic of the interview
                        interviewDate: item.interviewDate || "N/A", // Date of the interview
                        questions: item.questions || {}, // Questions and answers for the popup
                    }));

                    setTableRows(rows);
                } else {
                    // Log a message if no data is found for the username
                    console.log(`No interviews found for username: ${username}`);
                }
            } catch (error) {
                // Log an error message if something goes wrong during data fetching
                console.error("Error fetching data from Firebase:", error);
            }
        };

        fetchData();
    }, [username]); // Dependency ensures this effect runs when the username changes

    // Function to display the popup with questions and answers
    const showPopup = (questions) => {
        // Map the questions object to an array of question-answer pairs
        const content = Object.entries(questions).map(([key, qa]) => ({
            question: qa.question || "No question provided", // Default message if no question
            answer: qa.answer || "No answer provided", // Default message if no answer
        }));

        // Set the popup content and make the popup visible
        setPopupContent(content);
        setIsPopupVisible(true);
    };

    // Function to close the popup
    const closePopup = () => {
        setIsPopupVisible(false);
    };

    return (
        <div id="background" className="bg-yellow-200 min-h-screen flex flex-col items-center justify-center">
            <div id="background" className="container mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
                <h1 id="background" className="text-xl font-bold mb-4 text-center text-gray-800 dark:text-purple-400">Interview History</h1>
                
                {/* Display table if there are rows, otherwise show a message */}
                {tableRows.length > 0 ? (
                    <table className="table-auto border-collapse border border-gray-400 w-full">
                        <thead>
                            <tr id="background" className="bg-gray-100">
                                <th className="border px-4 py-2">Interviewee Name</th>
                                <th className="border px-4 py-2">Topic</th>
                                <th className="border px-4 py-2">Interview Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableRows.map((row) => (
                                <tr
                                    key={row.id}
                                    className="hover:bg-gray-200 cursor-pointer"
                                    onClick={() => showPopup(row.questions)} // Show popup when a row is clicked
                                >
                                    <td className="border px-4 py-2">{row.intervieweeName}</td>
                                    <td className="border px-4 py-2">{row.topic}</td>
                                    <td className="border px-4 py-2">{row.interviewDate}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No interviews found for {username}.</p> // Message if no data is available
                )}
            </div>

            {/* Popup for displaying questions and answers */}
            {isPopupVisible && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    {/* Background overlay to dim the screen */}
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50"
                        onClick={closePopup} // Close popup when clicking outside
                    ></div>

                    {/* Popup container */}
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg w-3/4 max-w-2xl z-50 transition-all duration-300 border border-gray-300 dark:border-gray-700">
                    <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-purple-400">
                      Interview Summary
                    </h2>

                        {/* Scrollable content area */}
                        <div className="overflow-y-auto max-h-96 px-4">
                            <ul className="list-disc list-inside space-y-2 mb-6">
                                {popupContent.map((item, index) => (
                                    <li key={index}>
                                        <strong>Question:</strong> {item.question}
                                        <br />
                                        <strong>Answer:</strong> {item.answer}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Close button */}
                        <div className="flex justify-center items-center">
                            <button
                                className="w-1/3 bg-blue-500 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
                                onClick={closePopup} // Close the popup when clicked
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default History;
