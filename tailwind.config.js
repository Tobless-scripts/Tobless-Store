import lineClamp from "@tailwindcss/line-clamp";

export default {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            animation: {
                "spin-slow": "spin 3s linear infinite",
            },
        },
    },
    plugins: [lineClamp],
};
