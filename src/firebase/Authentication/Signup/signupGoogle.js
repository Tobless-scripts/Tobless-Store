import {
    auth,
    googleProvider,
    signInWithPopup,
    fetchSignInMethodsForEmail,
    doc,
    setDoc,
    db,
} from "../../index";

/**
 * Sign up with Google – only creates your user record if it's a NEW user.
 */
export const signUpWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;

        // Prevent linking conflicts
        const methods = await fetchSignInMethodsForEmail(auth, user.email);
        if (methods.length > 0 && !methods.includes("google.com")) {
            await auth.signOut();
            return {
                error: `Account already exists with ${formatProviderNames(
                    methods
                )}. Please sign in instead.`,
                exists: true,
                providers: methods,
            };
        }

        // If brand‑new user, create the Firestore doc
        if (result._tokenResponse?.isNewUser) {
            const now = new Date().toISOString();
            const userRef = doc(db, "users", user.uid);
            await setDoc(userRef, {
                uid: user.uid,
                name: user.displayName,
                email: user.email,
                provider: "google",
                createdAt: now,
                lastLogin: now,
            });
            console.log("Created new user:", user.uid);
        }

        return { user };
    } catch (error) {
        console.log("Google signup error:", error);
        let errorMessage = error.message;
        if (error.code === "auth/popup-closed-by-user") {
            errorMessage = "Google sign‑in was canceled.";
        } else if (
            error.code === "auth/account-exists-with-different-credential"
        ) {
            errorMessage =
                "An account already exists with this email. Try signing in another way.";
        }
        return { error: errorMessage };
    }
};

const formatProviderNames = (methods) =>
    methods
        .map((m) => {
            switch (m) {
                case "password":
                    return "Email/Password";
                case "google.com":
                    return "Google";
                default:
                    return m;
            }
        })
        .join(", ");
