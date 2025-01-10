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
          properties: {}, // Section properties (empty in this case)
          children: [
            // Add the interviewee name as a bold paragraph
            new Paragraph({
              children: [
                new TextRun({
                  text: `Interviewee: ${interview.intervieweeName}`,
                  bold: true, // Make text bold
                }),
              ],
            }),
            // Add the topic as a bold paragraph
            new Paragraph({
              children: [
                new TextRun({
                  text: `Topic: ${interview.topic}`,
                  bold: true, // Make text bold
                }),
              ],
            }),
            // Add the date as a bold paragraph
            new Paragraph({
              children: [
                new TextRun({
                  text: `Date: ${interview.date}`,
                  bold: true, // Make text bold
                }),
              ],
            }),
            // Add a heading for questions and answers
            new Paragraph({
              children: [new TextRun("\nQuestions and Answers:")],
            }),
            // Map through the questions and answers to generate paragraphs
            ...interview.questionsAndAnswers.map((qa, index) => {
              return new Paragraph({
                children: [
                  // Add the question as bold text
                  new TextRun({
                    text: `${index + 1}. Question: ${qa.question}`,
                    bold: true,
                  }),
                  // Add the answer as regular text
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

    // Generate the Word document as a blob and trigger the download
    Packer.toBlob(doc).then((blob) => {
      const url = window.URL.createObjectURL(blob); // Create a URL for the blob
      const link = document.createElement("a"); // Create a temporary anchor element
      link.href = url; // Set the blob URL as the href
      link.download = `${interview.intervieweeName}_Interview.docx`; // Set the download filename
      link.click(); // Programmatically trigger a click to download the file
    });
  };

  return (
    // Wrapper for the download icon
    <div className="flex items-center justify-center">
      {/* Download icon with hover effects and click functionality */}
      <FaDownload
        size={20} // Icon size
        className="text-indigo-600 cursor-pointer hover:text-indigo-800 transition-colors sm:mx-2 mx-1" // Styling for hover and spacing
        onClick={handleDownloadWord} // Attach the click handler
        title="Download Interview as Word" // Tooltip for accessibility
      />
    </div>
  );
};

export default HistoryDownload;
