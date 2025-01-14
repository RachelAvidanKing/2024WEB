import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

class LoginController {
    // Attempt to log in user with email and password
    static async loginWithEmailAndPassword(email, password) {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            return {
                success: true,
                user: userCredential.user,
                message: "Login successful"
            };
        } catch (error) {
            return {
                success: false,
                error: error,
                message: "Login is not successful. Please check your credentials."
            };
        }
    }

    // Validate login form data
    static validateLoginData(email, password) {
        if (!email || !password) {
            return {
                isValid: false,
                message: "Please fill in all fields."
            };
        }
        return {
            isValid: true,
            message: ""
        };
    }
}

export default LoginController;