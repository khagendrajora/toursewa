// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { AuthContextProvider } from "./context/AuthContext.tsx";
import * as React from "react";
import "./App.css";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthContextProvider>
      <App />
    </AuthContextProvider>
  </React.StrictMode>
);
