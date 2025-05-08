import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    message: "",
    type: "", // 'success', 'error', etc.
    visible: false,
    duration: 5000, // Default: 5 seconds
};

const notificationSlice = createSlice({
    name: "notification",
    initialState,
    reducers: {
        showNotification(state, action) {
            state.message = action.payload.message;
            state.type = action.payload.type;
            state.visible = true;
            // Override default duration if provided
            state.duration = action.payload.duration ?? 5000;
        },
        hideNotification(state) {
            state.message = "";
            state.type = "";
            state.visible = false;
        },
    },
});

export const { showNotification, hideNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
