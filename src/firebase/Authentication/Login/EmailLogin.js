// src/auth/loginEmail.js
import {
    auth,
    signInWithEmailAndPassword,
    doc,
    getDoc,
    updateDoc,
    db,
} from "../../index";

/**
 * Login with Email/Password — updates lastLogin if user exists
 */
export const loginWithEmail = async (email, password) => {
    try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        const user = result.user;
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            console.log(
                "No user record found in Firestore. Please sign up first."
            );
            return { error: "No user record found. Please sign up first." };
        }

        await updateDoc(userRef, {
            lastLogin: new Date().toISOString(),
        });

        console.log("Email login successful:", user.uid);
        return { user };
    } catch (error) {
        console.error("Email login error:", error.message);
        let errorMessage = error.message;
        if (error.code === "auth/user-not-found") {
            errorMessage = "No user found with this email.";
        } else if (error.code === "auth/wrong-password") {
            errorMessage = "Incorrect password.";
        }
        return { error: errorMessage };
    }
};
