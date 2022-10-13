module.exports = {
    content: ["./src/**/*.elm"],
    prefix: "ew-",
    theme: {
        extend: {
            colors: {
                transparent: "transparent",
                current: "currentColor"
            }
        }
    },
    plugins: [require("elm-theme-tailwindcss")],
};
