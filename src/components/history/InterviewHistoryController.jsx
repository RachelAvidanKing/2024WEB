import { db } from "../firebase";
import { ref, query, orderByChild, equalTo, get, push } from "firebase/database";

/**
 * Fetch interviews for a specific user by user ID.
 * @param {string} userId - The ID of the user whose interviews should be fetched.
 * @returns {Promise<Array>} - A promise that resolves to an array of interview objects.
 */
export const fetchInterviewsByUserId = async (userId) => {
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
      return interviewsData;
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error fetching interviews:", error);
    throw error;
  }
};

/**
 * Save an interview to the database.
 * @param {Object} interview - The interview object to be saved.
 * @returns {Promise<Object>} - Success or failure message.
 */
export const saveInterview = async (interview) => {
  try {
    const interviewsRef = ref(db, "interviews");
    await push(interviewsRef, interview);
    return { success: true, message: "Interview saved!" };
  } catch (error) {
    console.error("Error saving interview:", error);
    return { success: false, message: "Failed to save interview" };
  }
};
