module.exports = {
    content: ["./src/**/*.elm"],
    prefix: "ew-",
    theme: {
        borderRadius: {
            none: "0",
            sm: "2px",
            DEFAULT: "4px",
            md: "6px",
            lg: "8px",
            xl: "12px",
            full: "9999px"
        },
        extend: {
            colors: {
                inherit: "inherit",
                transparent: "transparent",
                current: "currentColor"
            },
            keyframes: {
                "ew-animation-fade-slide": {
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
                "fade-slide": "ew-animation-fade-slide 0.4s ease-out",
            }
        }
    },
    plugins: [require("elm-theme-tailwindcss")],
    corePlugins: { preflight: false }
};
