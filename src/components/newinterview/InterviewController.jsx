import { db, ref, push } from "../firebase";

//Controller for saving and validating interview data
class InterviewController {
    // Save interview data to Firebase
    static async saveInterview(interviewData) {
        try {
            const interviewsRef = ref(db, "interviews");
            await push(interviewsRef, interviewData);
            return { success: true, message: "Interview saved!" };
        } catch (error) {
            console.error("Error saving interview:", error);
            return { success: false, message: "Failed to save interview" };
        }
    }

    // Validate interview data before saving
    static validateInterviewData(interviewData) {
        const { intervieweeName, date, topic, questionsAndAnswers } = interviewData;
        let alertMessage = "";

        if (!intervieweeName.trim()) {
            alertMessage += "Interviewee name is required.\n";
        }
        if (!date.trim()) {
            alertMessage += "Interview date is required.\n";
        }
        if (!topic.trim()) {
            alertMessage += "Interview topic is required.\n";
        }
        if (!questionsAndAnswers || questionsAndAnswers.length === 0) {
            alertMessage += "No valid questions with answers to save.\n";
        }

        return {
            isValid: alertMessage === "",
            message: alertMessage
        };
    }

    // Prepare interview data for saving
    static prepareInterviewData({
        intervieweeDetails,
        topicInput,
        selectedQuestions,
        customQuestions,
        answers,
        currentUser
    }) {
        // Combine selected and custom questions, removing duplicates
        const allQuestions = [...new Set([...selectedQuestions, ...customQuestions])];

        // Prepare questions with answers, filtering out unanswered ones
        const questionsAndAnswers = allQuestions
            .map((question) => ({
                question: question.replace(/^\d+\.\s*/, ""), // Remove numbering if present
                answer: answers[question] || "",
            }))
            .filter((qa) => qa.answer.trim());

        return {
            intervieweeName: intervieweeDetails.name,
            date: intervieweeDetails.date,
            topic: topicInput,
            questionsAndAnswers,
            userId: currentUser ? currentUser.uid : null,
            username: currentUser ? currentUser.displayName : "Anonymous",
        };
    }
}

export default InterviewController;