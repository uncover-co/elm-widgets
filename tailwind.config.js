module.exports = {
    content: ["./src/**/*.elm"],
    prefix: "ew-",
    theme: {
        extend: {
            colors: {
                transparent: "transparent",
                current: "currentColor"
            },
            keyframes: {
                "fade-slide": {
                  from: {
                    opacity: 0,
                    transform: "translateY(10px) scale(0.9)",
                  },
                  to: {
                    opacity: 1,
                    transform: "translateY(0) scale(1)"
                  },
                }
            },
            animation: {
                "fade-slide": "fade-slide 0.4s ease-out",
            }
        }
    },
    plugins: [require("elm-theme-tailwindcss")],
    corePlugins: { preflight: false }
};
