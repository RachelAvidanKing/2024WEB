import { ref, onValue } from "firebase/database";

// Fetch user details from the database
export const fetchUserDetails = (database, uid, setUserDetails) => {
  // Create a reference to the user's data in the database
  const userRef = ref(database, `users/${uid}`);
  
  // Listen for changes to the user data
  onValue(userRef, (snapshot) => {
    // If user data exists, update state with the retrieved data
    if (snapshot.exists()) {
      setUserDetails(snapshot.val());
    } else {
      // If no user data is found, reset state and log an error
      setUserDetails({
        username: "Guest",
        email: "",
        newspaper: "",
      });
      console.error("No user details found in the database for this user.");
    }
  });
};

// Fetch the most recent interview for a given user
export const fetchLastInterview = (database, uid, setLastInterview) => {
  // Create a reference to the interviews data in the database
  const interviewsRef = ref(database, "interviews");
  
  // Listen for changes to the interviews data
  onValue(interviewsRef, (snapshot) => {
    // If interviews data exists, filter for interviews belonging to the user
    if (snapshot.exists()) {
      const interviews = Object.values(snapshot.val()).filter(
        (interview) => interview.userId === uid
      );

      // If interviews are found, sort by date and set the most recent one
      if (interviews.length > 0) {
        const sortedInterviews = interviews.sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateB - dateA;
        });
        setLastInterview(sortedInterviews[0]);
      } else {
        // If no interviews are found for the user, reset state and log a message
        setLastInterview(null);
        console.log("No interviews found for this user.");
      }
    } else {
      // If no interviews exist in the database, reset state and log an error
      setLastInterview(null);
      console.error("No interviews found in the database.");
    }
  });
};
