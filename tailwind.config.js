// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      keyframes: {
        fadeOut: {
          "0%, 40%": { opacity: "1" },
          "60%,100%": { opacity: "0" },
        },
        fadeIn: {
          "0%, 40%": { opacity: "0" },
          "60%,100%": { opacity: "1" },
        },
      },
      animation: {
        fadeOut: "fadeOut 0.8s ease-in-out infinite",
        fadeIn: "fadeIn 0.8s ease-in-out infinite",
      },
    },
  },
};


