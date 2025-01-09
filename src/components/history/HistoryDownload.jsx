import React from "react";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { FaDownload } from "react-icons/fa";

const HistoryDownload = ({ interview }) => {
  const handleDownloadWord = () => {
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: `Interviewee: ${interview.intervieweeName}`,
                  bold: true,
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Topic: ${interview.topic}`,
                  bold: true,
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Date: ${interview.date}`,
                  bold: true,
                }),
              ],
            }),
            new Paragraph({
              children: [new TextRun("\nQuestions and Answers:")],
            }),
            ...interview.questionsAndAnswers.map((qa, index) => {
              return new Paragraph({
                children: [
                  new TextRun({
                    text: `${index + 1}. Question: ${qa.question}`,
                    bold: true,
                  }),
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

    Packer.toBlob(doc).then((blob) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${interview.intervieweeName}_Interview.docx`;
      link.click();
    });
  };

  return (
    <FaDownload
      size={20}
      className="text-indigo-600 cursor-pointer hover:text-indigo-800 transition-colors"
      onClick={handleDownloadWord}
      title="Download Interview as Word"
    />
  );
};

export default HistoryDownload;
