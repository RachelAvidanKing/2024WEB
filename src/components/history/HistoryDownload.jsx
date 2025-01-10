import React from "react";
import { Document, Packer, Paragraph, TextRun } from "docx"; 
import { FaDownload } from "react-icons/fa"; 

// Component to generate and download interview details as a Word document
const HistoryDownload = ({ interview }) => {
  // Function to handle Word document generation and download
  const handleDownloadWord = () => {
    // Create a new Word document
    const doc = new Document({
      sections: [
        {
          properties: {}, // Optional section properties
          children: [
            // Adding interviewee name as a bold paragraph
            new Paragraph({
              children: [
                new TextRun({
                  text: `Interviewee: ${interview.intervieweeName}`,
                  bold: true,
                }),
              ],
            }),
            // Adding topic as a bold paragraph
            new Paragraph({
              children: [
                new TextRun({
                  text: `Topic: ${interview.topic}`,
                  bold: true,
                }),
              ],
            }),
            // Adding date as a bold paragraph
            new Paragraph({
              children: [
                new TextRun({
                  text: `Date: ${interview.date}`,
                  bold: true,
                }),
              ],
            }),
            // Adding a heading for questions and answers
            new Paragraph({
              children: [new TextRun("\nQuestions and Answers:")],
            }),
            // Dynamically map through the questions and answers to create paragraphs
            ...interview.questionsAndAnswers.map((qa, index) => {
              return new Paragraph({
                children: [
                  // Bold text for the question
                  new TextRun({
                    text: `${index + 1}. Question: ${qa.question}`,
                    bold: true,
                  }),
                  // Regular text for the answer
                  new TextRun({
                    text: `\n   Answer: ${qa.answer}`,
                  }),
                ],
              });
            }),
          ],
        },
      ],
    });

    // Generate the Word document blob and trigger the download
    Packer.toBlob(doc).then((blob) => {
      const url = window.URL.createObjectURL(blob); // Create a URL for the blob
      const link = document.createElement("a"); // Create a hidden anchor element
      link.href = url; // Set the href to the blob URL
      link.download = `${interview.intervieweeName}_Interview.docx`; // Set the download filename
      link.click(); // Programmatically trigger a click to download the file
    });
  };

  return (
    // Render the download icon with event handling and styling
    <FaDownload
      size={20} // Set the icon size
      className="text-indigo-600 cursor-pointer hover:text-indigo-800 transition-colors" // Styling for hover effects and cursor pointer
      onClick={handleDownloadWord} // Attach the download handler
      title="Download Interview as Word" // Tooltip for accessibility
    />
  );
};

export default HistoryDownload; 
