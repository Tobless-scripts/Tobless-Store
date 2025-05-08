import { createSlice } from "@reduxjs/toolkit";

// Get initial theme from localStorage or system preference
const getInitialTheme = () => {
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
    ).matches;
    return saved || (prefersDark ? "dark" : "light");
};

const initialState = {
    theme: getInitialTheme(),
};

const themeSlice = createSlice({
    name: "theme",
    initialState,
    reducers: {
        // Manually set theme to 'dark' or 'light'
        setTheme(state, action) {
            state.theme = action.payload;
            localStorage.setItem("theme", action.payload);
            document.documentElement.classList.toggle(
                "dark",
                action.payload === "dark"
            );
        },

        // Toggle between dark and light theme
        toggleTheme(state) {
            const newTheme = state.theme === "dark" ? "light" : "dark";
            state.theme = newTheme;
            localStorage.setItem("theme", newTheme);
            document.documentElement.classList.toggle(
                "dark",
                newTheme === "dark"
            );
        },
    },
});

export const { setTheme, toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
