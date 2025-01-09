import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase"; // Firebase modules
import { ref, query, orderByChild, equalTo, get } from "firebase/database"; // Database query functions
import Table from "./Table"; // Import the Table component
import HistoryDownload from "./HistoryDownload"; // Import the HistoryDownload component

const InterviewHistory = () => {
  const [interviews, setInterviews] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  // Check for dark mode preference from localStorage or system preference
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedDarkMode);
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user);
        fetchInterviews(user.uid); // Fetch interviews when the user is authenticated
      } else {
        setCurrentUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch interviews filtered by current user
  const fetchInterviews = async (userId) => {
    const interviewsRef = ref(db, "interviews"); // Reference to the interviews node in Realtime Database
    const q = query(interviewsRef, orderByChild("userId"), equalTo(userId)); // Query for interviews where userId matches the current user's ID

    try {
      const snapshot = await get(q);
      if (snapshot.exists()) {
        const interviewsData = [];
        snapshot.forEach((childSnapshot) => {
          const interviewData = childSnapshot.val();
          interviewsData.push({
            id: childSnapshot.key,
            ...interviewData,
          });
        });
        setInterviews(interviewsData); // Set the filtered interviews in state
      } else {
        setInterviews([]); // If no interviews exist for the user, set an empty array
      }
    } catch (error) {
      console.error("Error fetching interviews:", error);
    }
  };

  // Prepare headers and rows for the table
  const headers = ["Interviewee", "Topic", "Date", "Download"]; // Table headers
  const rows = interviews.map((interview) => [
    <div key={`${interview.id}-name`} className="text-black">
      {interview.intervieweeName}
    </div>,
    <div key={`${interview.id}-topic`} className="text-black">
      {interview.topic}
    </div>,
    <div key={`${interview.id}-date`} className="text-black">
      {interview.date}
    </div>,
    <div key={`${interview.id}-download`}>
      <HistoryDownload interview={interview} />
    </div>,
  ]);

  return (
    <div className="bg-white/50 dark:bg-gray-900 backdrop-blur-sm rounded-lg p-6 shadow-lg">
      <h2 className="text-2xl font-bold text-purple-800 mb-6">Interview History</h2>
      <Table headers={headers} rows={rows} />
    </div>
  );
};

export default InterviewHistory;
