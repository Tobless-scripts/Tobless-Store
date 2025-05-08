// src/auth/loginGoogle.js
import {
    auth,
    googleProvider,
    signInWithPopup,
    doc,
    getDoc,
    updateDoc,
    db,
} from "../../index";

/**
 * Login with Google — only updates lastLogin if user doc exists
 */
export const loginWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
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

        console.log("Google login successful:", user.uid);
        return { user };
    } catch (error) {
        console.error("Google login error:", error.message);
        let errorMessage = error.message;
        if (error.code === "auth/popup-closed-by-user") {
            errorMessage = "Google sign-in was canceled.";
        }
        return { error: errorMessage };
    }
};
