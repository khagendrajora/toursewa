/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
    
      colors: {
       
        button: "#EA5434",
       
        
      },
      screens: {
        sm: "550px",
        mxl:"1360px"
      },
   
      keyframes: {
        scaleX: {
          "0%": { transform: "scaleX(0)" },
          "100%": { transform: "scaleX(1)" },
        },
      },
      animation: {
        scaleX: "scaleX 2s ease-in-out forwards 2",
      },
      height: {
        'phone-input':'2.5rem'
      }
    },
  },
  
  plugins: [],
};
