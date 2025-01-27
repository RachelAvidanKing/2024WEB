import React, { useState, useEffect } from "react";
import { auth } from "../firebase";
import mammoth from "mammoth";
import Table from "./Table";
import HistoryDownload from "./HistoryDownload";
import { fetchInterviewsByUserId, saveInterview, deleteInterviewById} from "./InterviewHistoryController";
//Component for interview history
const InterviewHistory = () => {
  // State variables for managing interviews, current user, dark mode, viewport size, and file upload
  const [interviews, setInterviews] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [file, setFile] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredInterviews, setFilteredInterviews] = useState([]);


  // Effect for handling screen resize and updating mobile view state
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Effect for retrieving dark mode preference from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedDarkMode);
  }, []);

  // Effect for checking authentication state and fetching interviews for the logged-in user
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user); // Set the current user
        fetchInterviewsByUserId(user.uid).then(setInterviews); // Fetch interviews for the user
      } else {
        setCurrentUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const lowerQuery = searchQuery.toLowerCase();
    const filtered = interviews.filter(
      (interview) =>
        interview.intervieweeName.toLowerCase().includes(lowerQuery) ||
        interview.topic.toLowerCase().includes(lowerQuery) ||
        interview.date.includes(lowerQuery)
    );
    setFilteredInterviews(filtered); // Dynamically update filteredInterviews
  }, [searchQuery, interviews]);
  

  // Handle file selection and validate it
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (
      selectedFile &&
      selectedFile.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      setFile(selectedFile);
    } else {
      alert("Please upload a valid Word document.");
    }
  };

  // Process and upload the selected Word document
  const handleFileUpload = async () => {
    if (!file || !currentUser) {
      alert("No file selected or user not logged in.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const arrayBuffer = event.target.result;

      try {
        // Extract raw text from the Word document
        const { value } = await mammoth.extractRawText({ arrayBuffer });
        const lines = value
          .split("\n")
          .map((line) => line.trim())
          .filter((line) => line);

        // Validate document format
        if (lines.length < 3) {
          alert("Invalid Word document format. Ensure it contains name, topic, and date.");
          return;
        }

        const [intervieweeName, topic, date] = lines;

        // Validate date format
        if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
          alert("Invalid date format. Use YYYY-MM-DD.");
          return;
        }

        // Extract questions and answers
        const questionsAndAnswers = [];
        let currentQuestion = null;
        let currentAnswer = [];

        for (const line of lines.slice(3)) {
          if (line.endsWith("?")) {
            // Save the previous question and its answers
            if (currentQuestion) {
              questionsAndAnswers.push({
                question: currentQuestion,
                answer: currentAnswer.join(" ").trim(),
              });
            }
            currentQuestion = line; // Set new question
            currentAnswer = []; // Reset answers
          } else {
            currentAnswer.push(line); // Add to current answer
          }
        }

        // Add the last question-answer pair if any
        if (currentQuestion) {
          questionsAndAnswers.push({
            question: currentQuestion,
            answer: currentAnswer.join(" ").trim(),
          });
        }

        if (questionsAndAnswers.length === 0) {
          alert("No valid questions and answers found.");
          return;
        }

        // Create an interview object and save it
        const interview = {
          intervieweeName,
          topic,
          date,
          questionsAndAnswers,
          userId: currentUser.uid,
        };

        await saveInterview(interview); // Save interview to the database
        fetchInterviewsByUserId(currentUser.uid).then(setInterviews); // Refresh interviews list
        alert("Interview added successfully!");
      } catch (error) {
        console.error("Error processing file:", error);
        alert("Failed to process the uploaded file.");
      }
    };

    reader.readAsArrayBuffer(file); // Read the file
  };

  // Copy example text to clipboard
  const copyToClipboard = () => {
    const text = `
John Doe
Software Development Trends
2025-01-17
Where do you see the future of mathematics heading?
Toward AI, quantum computing, and interdisciplinary applications.
What are your thoughts on teaching methodologies in math?
Focus on real-world problems and tech-driven tools.
What is the role of technology in advancing mathematics?
Enabling complex computations and data insights.
    `;
    navigator.clipboard.writeText(text).then(
      () => alert("Text copied to clipboard!"),
      (err) => alert("Failed to copy text.")
    );
  };

  // Mobile card component for interviews
  const MobileCard = ({ interview }) => (
    
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4">
      <div className="grid grid-cols-1 gap-2">
        {/* Display interviewee name */}
        <div>
          <span className="font-semibold text-gray-600 dark:text-gray-300">Interviewee:</span>
          <span className="ml-2 text-black dark:text-white">{interview.intervieweeName}</span>
        </div>
        {/* Display topic */}
        <div>
          <span className="font-semibold text-gray-600 dark:text-gray-300">Topic:</span>
          <span className="ml-2 text-black dark:text-white">{interview.topic}</span>
        </div>
        {/* Display date */}
        <div>
          <span className="font-semibold text-gray-600 dark:text-gray-300">Date:</span>
          <span className="ml-2 text-black dark:text-white">{interview.date}</span>
        </div>
        {/* Download button */}
        <div key={`${interview.id}-download`} className="text-gray-800 dark:text-white flex items-center justify-start">
  <span className="mr-2">Click here to download:</span>
  <HistoryDownload interview={interview} />
</div>
<div className="flex justify-center items-center">
  <button
    onClick={() => deleteInterviewById(interview.id, setInterviews)}
    className="bg-red-500 text-white py-2 px-4 rounded mt-3 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-50"
  >
    delete
  </button>
  </div>
      </div>
    </div>
  );
  
  // Headers and rows for the table component
  const headers = ["Interviewee", "Topic", "Date", "Download History", "Delete"];
  const rows = filteredInterviews
    .sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort interviews by date
    .map((interview) => [
      
      <div key={`${interview.id}-name`} className="text-gray-800 dark:text-white w-24">
        {interview.intervieweeName}
      </div>,
      <div key={`${interview.id}-topic`} className="text-gray-800 dark:text-white w-24">
        {interview.topic}
      </div>,
      <div key={`${interview.id}-date`} className="text-gray-800 dark:text-white">
        {interview.date}
      </div>,
      
      <div
  key={`${interview.id}-download`}
  className="text-gray-800 dark:text-white w-8 text-center"
>
  <HistoryDownload interview={interview} />
</div>,
         <div
         key={`${interview.id}-actions`}
         className="text-gray-800 dark:text-white w-12 text-center"
       >
         <button
           onClick={() => deleteInterviewById(interview.id, setInterviews)}
           className="bg-red-500 text-white px-3 py-1 rounded shadow"
         >
           -
         </button>
       </div>,
      
    ]);

  return (
    <div className="dark:bg-gray-900 backdrop-blur-sm rounded-lg p-4 md:p-6 w-full max-w-7xl mx-auto">
      <h2 className="text-xl md:text-3xl font-bold text-purple-800 dark:text-purple-400 mb-4 md:mb-6 text-center">
        Interview History
      </h2>
      {/* Instructions section */}
      <div className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-lg p-4 mb-6 shadow-md">
        <h3 className="text-lg font-bold mb-4">How to Use</h3>
        {/* Instructions content */}
        <ul className="list-none pl-5 space-y-4">
          {/* Prepare a document */}
          <li>
            Prepare a Word document (.docx) with the following format:
            <ul className="list-none">
              <li>The first line should contain the interviewee's name.</li>
              <li>The second line should contain the interview topic.</li>
              <li>The third line should contain the date in the format <strong>YYYY-MM-DD</strong>.</li>
              <li>Each question should be followed by its corresponding answer.</li>
              <li>Ensure that a question ends with a question mark.</li>
            </ul>
          </li>
          {/* Example document */}
          <li>
            Below is an example of the required text format:
            <div className="mt-4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-4 shadow-sm">
              <ul className="list-none space-y-2 font-mono text-sm text-gray-700 dark:text-gray-300">
                <li className="font-bold text-gray-900 dark:text-gray-100">John Doe</li>
                <li>Software Development Trends</li>
                <li>2025-01-17</li>
                <li>
                  <ul className="list-disc pl-6">
                    <li>
                      <span className="font-semibold text-gray-900 dark:text-gray-100">
                        Where do you see the future of mathematics heading?
                      </span>
                      <br />
                      Toward AI, quantum computing, and interdisciplinary applications.
                    </li>
                    <li>
                      <span className="font-semibold text-gray-900 dark:text-gray-100">
                        What are your thoughts on teaching methodologies in math?
                      </span>
                      <br />
                      Focus on real-world problems and tech-driven tools.
                    </li>
                    <li>
                      <span className="font-semibold text-gray-900 dark:text-gray-100">
                        What is the role of technology in advancing mathematics?
                      </span>
                      <br />
                      Enabling complex computations and data insights.
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
            <button
              onClick={copyToClipboard}
              className="bg-purple-600 text-white py-2 px-4 rounded mt-3 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-50"
            >
              Copy to Clipboard
            </button>
          </li>
          {/* File upload instructions */}
          <li>Click on the "Choose File" button to select your Word document.</li>
          <li>Click "Upload Interview" to save the file and view it in the table below.</li>
        </ul>
      </div>
      {/* File upload section */}
      <div className="text-center mb-4">
        <input
          type="file"
          accept=".docx"
          onChange={handleFileChange}
          className="block w-full sm:w-auto text-sm text-gray-700 bg-white dark:bg-gray-800 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:text-white dark:border-gray-600 dark:placeholder-gray-400"
        />
        <button
  onClick={handleFileUpload}
  className="bg-purple-600 text-white py-2 px-4 rounded mt-3 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-50"
>
  Upload Interview
</button>
      </div>
      <div className="flex items-center justify-center text-gray-800 dark:text-gray-800 rounded-lg p-3 mb-3">
  <input
    type="text"
    placeholder="Search by Topic, Date, or Interviewee (type here)"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    className="py-2 w-full max-w-xl mx-auto dark:bg-gray-300 text-black"
  />
</div>
      {/* Interviews table */}
      {interviews.length === 0 || filteredInterviews.length === 0? (
        <div className="text-center text-black dark:text-white py-8">
          No interviews found
        </div>
        
      ) : (
        <div id="table-section" className="table-section w-full">
                    {isMobile ? (
            <div className="space-y-4">
              {filteredInterviews.map((interview) => (
                <MobileCard key={interview.id} interview={interview} />
              ))}
            </div>
          ) : (
            <div className="table-container overflow-x-auto rounded-lg bg-white dark:bg-gray-900">
              <Table headers={headers} rows={rows} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InterviewHistory;
