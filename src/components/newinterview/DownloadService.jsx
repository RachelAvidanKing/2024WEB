import { Document, Packer, Paragraph, TextRun } from "docx"; 
import { FaDownload } from "react-icons/fa"; 

// Component to generate and download a Word document containing interview data
const DownloadService = ({ interviewData, customQuestions, selectedQuestions, answers }) => {
  // Function to create and download the Word document
  const downloadWordDocument = () => {
    let errorMessage = "";

    // Validate interviewee details
    if (!interviewData.intervieweeName?.trim()) {
      errorMessage += "Interviewee name is required.\n"; // Check if interviewee's name is provided
    }
    if (!interviewData.date?.trim()) {
      errorMessage += "Interview date is required.\n"; // Check if interview date is provided
    }
    if (!interviewData.topic?.trim()) {
      errorMessage += "Interview topic is required.\n"; // Check if interview topic is provided
    }

    // Combine selected and custom questions, ensuring no duplicates
    const allQuestions = [...new Set([...selectedQuestions, ...customQuestions])];
    
    // Filter out valid questions (questions with non-empty answers)
    const validQuestions = allQuestions.filter((question) => answers[question]?.trim());

    // Validate if there are any valid questions to download
    if (validQuestions.length === 0) {
      errorMessage += "No questions with answers are available to download.\n";
    }

    // If there are validation errors, show an alert and exit
    if (errorMessage) {
      alert(errorMessage.trim());
      return;
    }

    // Create a Word document using the docx library
    const doc = new Document({
      sections: [
        {
          properties: {}, // Section properties (empty for now)
          children: [
            // Adding interviewee's name
            new Paragraph({
              children: [
                new TextRun("Interviewee Name: " + interviewData.intervieweeName),
              ],
            }),
            // Adding interview date
            new Paragraph({
              children: [
                new TextRun("Interview Date: " + interviewData.date),
              ],
            }),
            // Adding interview topic
            new Paragraph({
              children: [
                new TextRun("Topic: " + interviewData.topic),
              ],
            }),
            // Adding a header for the answers section
            new Paragraph({
              children: [new TextRun("\nAnswers:")],
            }),
            // Adding each valid question and its corresponding answer
            ...validQuestions.map((question) => {
              // Remove numeric prefixes (e.g., "1. ", "2. ") from questions
              const cleanedQuestion = question.replace(/^\d+\.\s*/, "");
              const answer = answers[question];
              return new Paragraph({
                children: [new TextRun(`${cleanedQuestion} - Answer: ${answer}`)],
              });
            }),
          ],
        },
      ],
    });

    // Generate the Word document and trigger a download
    Packer.toBlob(doc).then((blob) => {
      const url = window.URL.createObjectURL(blob); // Create a URL for the generated blob
      const link = document.createElement("a"); // Create a temporary anchor element
      link.href = url; // Set the blob URL as the link's href
      link.download = "interview_data.docx"; // Set the file name for the download
      link.click(); // Simulate a click to trigger the download
    });
  };

  return (
    <button
      onClick={downloadWordDocument} // Trigger Word document generation on click
      className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-xl sm:text-2xl"
    >
      <span>Download Here</span>
      <FaDownload size={20} /> {/* Download icon */}
    </button>
  );
};

export default DownloadService; 
