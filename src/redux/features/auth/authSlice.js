import { createSlice } from "@reduxjs/toolkit";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../firebase";

const initialState = {
    user: null,
    status: "idle", // 'idle' | 'loading' | 'authenticated' | 'error'
    error: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser(state, action) {
            state.user = action.payload;
            state.status = action.payload ? "authenticated" : "idle";
            state.error = null;
        },
        setAuthStatus(state, action) {
            state.status = action.payload.status;
            state.error = action.payload.error || null;
        },
    },
});

// Action creators
export const { setUser, setAuthStatus } = authSlice.actions;

// Thunk for Firebase auth state listener
export const initAuthListener = () => (dispatch) => {
    dispatch(setAuthStatus({ status: "loading" }));

    const unsubscribe = onAuthStateChanged(
        auth,
        (user) => {
            if (user) {
                dispatch(
                    setUser({
                        uid: user.uid,
                        email: user.email,
                        displayName: user.displayName,
                        emailVerified: user.emailVerified,
                    })
                );
            } else {
                dispatch(setUser(null));
            }
        },
        (error) => {
            dispatch(
                setAuthStatus({
                    status: "error",
                    error: error.message,
                })
            );
        }
    );

    return unsubscribe;
};

// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectUserId = (state) => state.auth.user?.uid;
export const selectAuthStatus = (state) => state.auth.status;
export const selectAuthError = (state) => state.auth.error;

export default authSlice.reducer;
