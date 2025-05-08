import {
    auth,
    createUserWithEmailAndPassword,
    fetchSignInMethodsForEmail,
    doc,
    setDoc,
    db,
} from "../../index";

/**
 * Sign up with email and password
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @param {Object} [additionalData={}] - Additional user data to store
 * @returns {Promise<{user?: User, error?: string, exists?: boolean, providers?: string[]}>}
 */
export const signUpWithEmailPassword = async (
    email,
    password,
    additionalData = {}
) => {
    try {
        // Validate email format
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            throw {
                code: "invalid-email",
                message: "Please enter a valid email address.",
            };
        }

        // Validate password
        if (!password || password.length < 6) {
            throw {
                code: "weak-password",
                message: "Password must be at least 6 characters.",
            };
        }

        // Check for existing accounts
        const methods = await fetchSignInMethodsForEmail(auth, email);

        if (methods.length > 0) {
            return {
                error: `Account already exists with ${formatProviderNames(
                    methods
                )}. Please sign in instead.`,
                exists: true,
                providers: methods,
            };
        }

        // Create user account
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );
        const user = userCredential.user;

        // Create user document in Firestore
        const userData = {
            uid: user.uid,
            email: user.email,
            emailVerified: user.emailVerified || false,
            provider: "email/password",
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            ...additionalData,
        };

        await setDoc(doc(db, "users", user.uid), userData);

        console.log("New user created:", user.uid);
        return { user };
    } catch (error) {
        console.log("User already existed—no Firestore write on signup.");

        let errorMessage;
        switch (error.code) {
            case "auth/email-already-in-use":
                errorMessage =
                    "User already existed—no Firestore write on signup.";
                break;
            case "auth/weak-password":
                errorMessage = "Password should be at least 6 characters.";
                break;
            case "auth/invalid-email":
                errorMessage = "Please enter a valid email address.";
                break;
            case "invalid-email":
            case "weak-password":
                // Use our custom error messages
                errorMessage = error.message;
                break;
            default:
                errorMessage = "Signup failed. Please try again.";
        }

        return { error: errorMessage };
    }
};

// Reuse the same provider formatting function from Google signup
const formatProviderNames = (methods) => {
    const providerMap = {
        password: "Email/Password",
        "google.com": "Google",
        "facebook.com": "Facebook",
        "twitter.com": "Twitter",
        "github.com": "GitHub",
        "apple.com": "Apple",
    };
    return methods.map((m) => providerMap[m] || m).join(", ");
};
