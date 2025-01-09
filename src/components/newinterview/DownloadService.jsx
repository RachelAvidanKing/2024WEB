import { Document, Packer, Paragraph, TextRun } from "docx";
import { FaDownload } from "react-icons/fa";

const DownloadService = ({ interviewData, customQuestions, selectedQuestions, answers }) => {
  const downloadWordDocument = () => {
    let errorMessage = "";

    // Validate interviewee details
    if (!interviewData.intervieweeName?.trim()) {
      errorMessage += "Interviewee name is required.\n";
    }
    if (!interviewData.date?.trim()) {
      errorMessage += "Interview date is required.\n";
    }
    if (!interviewData.topic?.trim()) {
      errorMessage += "Interview topic is required.\n";
    }

    // Combine selected and custom questions and filter valid questions
    const allQuestions = [...new Set([...selectedQuestions, ...customQuestions])];
    const validQuestions = allQuestions.filter((question) => answers[question]?.trim());

    if (validQuestions.length === 0) {
      errorMessage += "No questions with answers are available to download.\n";
    }

    // If there are validation errors, show an alert and exit
    if (errorMessage) {
      alert(errorMessage.trim());
      return;
    }

    // Create Word document
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              children: [
                new TextRun("Interviewee Name: " + interviewData.intervieweeName),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun("Interview Date: " + interviewData.date),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun("Topic: " + interviewData.topic),
              ],
            }),
            new Paragraph({
              children: [new TextRun("\nAnswers:")],
            }),
            ...validQuestions.map((question) => {
              // Remove numeric prefixes from questions
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

    // Generate and download the Word document
    Packer.toBlob(doc).then((blob) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "interview_data.docx";
      link.click();
    });
  };

  return (
    <button
      onClick={downloadWordDocument}
      className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-xl sm:text-2xl"
    >
      <span>Download Here</span>
      <FaDownload size={20} /> {/* Download Icon */}
    </button>
  );
};

export default DownloadService;
