import React, { useEffect, useState } from "react";
import { auth, database } from "./firebase"; // Firebase authentication and database imports
import { ref, get } from "firebase/database"; // Firebase Realtime Database methods
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation

//In order to show the interviewer main page (selection of options)
const Options = () => {
    const [username, setUsername] = useState(""); // State to store the username
    const navigate = useNavigate(); // Initialize navigation

    useEffect(() => {
        // Retrieve the currently logged-in user
        const user = auth.currentUser;

        if (user) {
            const userRef = ref(database, `users/${user.uid}`); // Reference to the user's data in the database

            // Fetch the username from the database
            get(userRef)
                .then((snapshot) => {
                    if (snapshot.exists()) {
                        const userData = snapshot.val(); // Extract user data from the snapshot
                        setUsername(userData.username || "User"); // Set the username or default to "User"
                    } else {
                        console.log("No data available for this user."); // Log if no data exists for the user
                    }
                })
                .catch((error) => {
                    console.error("Error fetching username:", error); // Log any errors that occur during the fetch
                });
        } else {
            console.log("No user is logged in."); // Log if no user is currently logged in
        }
    }, []); // Run the effect only once when the component mounts

    return (
        <div id="background" className="bg-yellow-200 min-h-screen flex flex-col items-center justify-center">
            <div id="background" className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
                <h1 className="text-4xl font-extrabold text-black text-center mb-6">
                    Welcome Dear, {username}!
                </h1>
                <div className="space-y-4">
                    <button
                        type="button"
                        onClick={() => navigate('/questions')} // Navigate to Questions page
                        className="w-full bg-slate-400 text-white py-2 px-4 rounded-lg shadow hover:bg-slate-800 focus:outline-none focus:ring-2"
                    >
                        Questions❓
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/fullform')} // Navigate to FullForm page
                        className="w-full bg-slate-400 text-white py-2 px-4 rounded-lg shadow hover:bg-slate-800 focus:outline-none focus:ring-2"
                    >
                        Full Form📝
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate('/history', { state: { username } })} // Correct syntax for passing state
                      className="w-full bg-slate-400 text-white py-2 px-4 rounded-lg shadow hover:bg-slate-800 focus:outline-none focus:ring-2"
                    >
                        Interview History🕒
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Options;
