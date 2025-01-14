import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

/**
 * Validates the username format.
 * @param {string} username - The username to validate.
 * @returns {boolean} - True if the username is valid, false otherwise.
 */
export const isValidUsername = (username) => {
  const usernameRegex = /^[a-zA-Z0-9]{3,15}$/; // Alphanumeric, 3-15 characters
  return usernameRegex.test(username);
};

/**
 * Signs up a new user using Firebase Authentication.
 * @param {string} username - The username of the user.
 * @param {string} email - The email of the user.
 * @param {string} password - The password of the user.
 * @returns {Promise<object>} - Resolves with the user object if successful.
 * @throws {Error} - Throws an error if sign-up fails.
 */
export const signUpUser = async (username, email, password) => {
  if (!username || !email || !password) {
    throw new Error("Please fill in all fields.");
  }

  if (!isValidUsername(username)) {
    throw new Error(
      "Invalid username. Username must be 3-15 characters long and contain only letters and numbers."
    );
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    return user; // Return the user object
  } catch (error) {
    throw new Error(error.message);
  }
};
