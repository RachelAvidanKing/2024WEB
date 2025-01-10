import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { ref, query, orderByChild, equalTo, get } from "firebase/database";
import Table from "./Table";
import HistoryDownload from "./HistoryDownload";

const InterviewHistory = () => {
  // State management for interviews, user, and responsive design
  const [interviews, setInterviews] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  // Track if viewport is mobile size (below 768px)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Handle responsive layout changes on window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    // Cleanup listener on component unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Load dark mode preference from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedDarkMode);
  }, []);

  // Handle authentication state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user);
        fetchInterviews(user.uid);
      } else {
        setCurrentUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch interviews data for the current user
  const fetchInterviews = async (userId) => {
    const interviewsRef = ref(db, "interviews");
    const q = query(interviewsRef, orderByChild("userId"), equalTo(userId));
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
        setInterviews(interviewsData);
      } else {
        setInterviews([]);
      }
    } catch (error) {
      console.error("Error fetching interviews:", error);
    }
  };

  // Mobile-optimized card component for individual interviews
  const MobileCard = ({ interview }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-4">
      <div className="grid grid-cols-1 gap-2">
        <div>
          <span className="font-semibold text-gray-600 dark:text-gray-300">Interviewee:</span>
          <span className="ml-2 text-black dark:text-white">{interview.intervieweeName}</span>
        </div>
        <div>
          <span className="font-semibold text-gray-600 dark:text-gray-300">Topic:</span>
          <span className="ml-2 text-black dark:text-white">{interview.topic}</span>
        </div>
        <div>
          <span className="font-semibold text-gray-600 dark:text-gray-300">Date:</span>
          <span className="ml-2 text-black dark:text-white">{interview.date}</span>
        </div>
        <div className="mt-2">
          <HistoryDownload interview={interview} />
        </div>
      </div>
    </div>
  );

  // Table configuration for desktop view
  const headers = ["Interviewee", "Topic", "Date", "Download History"];
  const rows = interviews.map((interview) => [
    // Each cell is wrapped in a div for consistent styling
    <div key={`${interview.id}-name`} className="text-black dark:text-white">
      {interview.intervieweeName}
    </div>,
    <div key={`${interview.id}-topic`} className="text-black dark:text-white">
      {interview.topic}
    </div>,
    <div key={`${interview.id}-date`} className="text-black dark:text-white">
      {interview.date}
    </div>,
    <div key={`${interview.id}-download`} className="whitespace-nowrap">
      <HistoryDownload interview={interview} />
    </div>,
  ]);

  return (
    // Container with responsive padding and max width
    <div className="dark:bg-gray-900 backdrop-blur-sm rounded-lg p-4 md:p-6 shadow-lg w-full max-w-7xl mx-auto">
      {/* Responsive heading */}
      <h2 className="text-xl md:text-3xl font-bold text-purple-800 dark:text-purple-400 mb-4 md:mb-6 text-center">
        Interview History
      </h2>
      
      {/* Show empty state message if no interviews */}
      {interviews.length === 0 ? (
        <div className="text-center text-gray-600 dark:text-gray-400 py-8">
          No interviews found
        </div>
      ) : (
        // Main content container
        <div className="w-full">
          {/* Conditionally render mobile cards or desktop table */}
          {isMobile ? (
            // Mobile view: Stack cards vertically
            <div className="space-y-4">
              {interviews.map((interview) => (
                <MobileCard key={interview.id} interview={interview} />
              ))}
            </div>
          ) : (
            // Desktop view: Show table with horizontal scroll if needed
            <div className="overflow-x-auto">
              <Table headers={headers} rows={rows} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InterviewHistory;