import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

// Importation de react-toastify
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <>
        <App />
        <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar />
      </>
    </BrowserRouter>
  </StrictMode>
);
