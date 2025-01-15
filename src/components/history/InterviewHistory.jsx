import React, { useState, useEffect } from "react";
import { auth } from "../firebase";
import mammoth from "mammoth";
import Table from "./Table";
import HistoryDownload from "./HistoryDownload";
import { fetchInterviewsByUserId, saveInterview } from "./InterviewHistoryController";
import image1 from "./example.png";

const InterviewHistory = () => {
  // State to store fetched interviews
  const [interviews, setInterviews] = useState([]);
  // State to track the currently logged-in user
  const [currentUser, setCurrentUser] = useState(null);
  // State to track whether dark mode is enabled
  const [darkMode, setDarkMode] = useState(false);
  // State to determine if the user is on a mobile screen size
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  // State to store the selected file for uploading
  const [file, setFile] = useState(null);

  // Update isMobile state on window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Load dark mode preference from local storage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedDarkMode);
  }, []);

  // Fetch user details and their interviews when authentication state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user);
        fetchInterviewsByUserId(user.uid).then(setInterviews);
      } else {
        setCurrentUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // Handle file selection and ensure the file is a valid Word document
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

  // Parse the Word document, extract data, and save the interview
  const handleFileUpload = async () => {
    if (!file || !currentUser) {
      alert("No file selected or user not logged in.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const arrayBuffer = event.target.result;

      try {
        // Extract text from Word document
        const { value } = await mammoth.extractRawText({ arrayBuffer });
        // Split text into lines, trimming and filtering empty lines
        const lines = value
          .split("\n")
          .map((line) => line.trim())
          .filter((line) => line);

        // Ensure the document contains at least three lines: name, topic, and date
        if (lines.length < 3) {
          alert("Invalid Word document format. Ensure it contains name, topic, and date.");
          return;
        }

        const [intervieweeName, topic, date] = lines;

        // Validate date format (YYYY-MM-DD)
        if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
          alert("Invalid date format. Use YYYY-MM-DD.");
          return;
        }

        // Extract questions and answers from subsequent lines
        const questionsAndAnswers = [];
        let currentQuestion = null;
        let currentAnswer = [];

        for (const line of lines.slice(3)) {
          if (line.endsWith("?")) {
            if (currentQuestion) {
              questionsAndAnswers.push({
                question: currentQuestion,
                answer: currentAnswer.join(" ").trim(),
              });
            }
            currentQuestion = line;
            currentAnswer = [];
          } else {
            currentAnswer.push(line);
          }
        }

        // Save the last question and answer pair
        if (currentQuestion) {
          questionsAndAnswers.push({
            question: currentQuestion,
            answer: currentAnswer.join(" ").trim(),
          });
        }

        // Ensure at least one question-answer pair exists
        if (questionsAndAnswers.length === 0) {
          alert("No valid questions and answers found.");
          return;
        }

        // Create interview object and save to the database
        const interview = {
          intervieweeName,
          topic,
          date,
          questionsAndAnswers,
          userId: currentUser.uid,
        };

        await saveInterview(interview);
        // Refresh the interview list
        fetchInterviewsByUserId(currentUser.uid).then(setInterviews);
        alert("Interview added successfully!");
      } catch (error) {
        console.error("Error processing file:", error);
        alert("Failed to process the uploaded file.");
      }
    };

    reader.readAsArrayBuffer(file);
  };

  // Component to display interview details on mobile screens
  const MobileCard = ({ interview }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4">
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

  // Define headers for desktop table
  const headers = ["Interviewee", "Topic", "Date", "Download History"];
  // Map interviews into rows for the table
  const rows = interviews
    .sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort interviews by date (descending)
    .map((interview) => [
      <div key={`${interview.id}-name`} className="text-gray-800 dark:text-white">
        {interview.intervieweeName}
      </div>,
      <div key={`${interview.id}-topic`} className="text-gray-800 dark:text-white">
        {interview.topic}
      </div>,
      <div key={`${interview.id}-date`} className="text-gray-800 dark:text-white">
        {interview.date}
      </div>,
      <div
        key={`${interview.id}-download`}
        className="text-gray-800 dark:text-white w-12 text-center"
      >
        <HistoryDownload interview={interview} />
      </div>,
    ]);

  return (
    <div className="dark:bg-gray-900 backdrop-blur-sm rounded-lg p-4 md:p-6 w-full max-w-7xl mx-auto">
      <h2 className="text-xl md:text-3xl font-bold text-purple-800 dark:text-purple-400 mb-4 md:mb-6 text-center">
        Interview History
      </h2>
      <div className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-lg p-4 mb-6 shadow-md">
        <h3 className="text-lg font-bold mb-2">How to Use</h3>
        <ol className="list-decimal pl-5 space-y-2">
          <li>
            Prepare a Word document (.docx) with the following format:
            <ul className="list-disc pl-5">
              <li>The first line should contain the interviewee's name.</li>
              <li>The second line should contain the interview topic.</li>
              <li>The third line should contain the date in the format <strong>YYYY-MM-DD</strong>.</li>
              <li>Each question should be followed by its corresponding answer.</li>
              <li>Ensure that a question ends with a question mark.</li>
            </ul>
          </li>
          <li>
            Below is an example of how your Word document should look:
            <div className="flex justify-start mt-2">
              <img
                src={image1}
                alt="Example Word Document"
                className="max-w-full h-auto rounded shadow-md"
              />
            </div>
          </li>
          <li>Click on the "Choose File" button to select your Word document.</li>
          <li>After selecting the file, click on the "Upload Interview" button to save it.</li>
          <li>Once uploaded, you can view the saved interviews in the table below.</li>
        </ol>
      </div>
      <div className="text-center mb-4">
        <input
          type="file"
          accept=".docx"
          onChange={handleFileChange}
          className="block w-full sm:w-auto text-sm text-gray-700 bg-white dark:bg-gray-800 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:text-white dark:border-gray-600 dark:placeholder-gray-400"
        />
        <button
          onClick={handleFileUpload}
          className="bg-purple-600 text-white p-2 rounded shadow transition-all w-full sm:w-auto mt-3 sm:mt-0"
        >
          Upload Interview
        </button>
      </div>
      {interviews.length === 0 ? (
        <div className="text-center text-gray-600 dark:text-gray-400 py-8">
          No interviews found
        </div>
      ) : (
        <div id="table-section" className="table-section w-full">
          {isMobile ? (
            <div className="space-y-4">
              {interviews.map((interview) => (
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
