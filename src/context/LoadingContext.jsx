// src/context/LoadingContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import "./cookingLoader.css";

const LoadingContext = createContext();

export function LoadingProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [progress, setProgressState] = useState(0);
  const [title, setTitle] = useState("Cooking in progress...");

  // open/close the Swal when `open` changes
  useEffect(() => {
    if (open) {
      Swal.fire({
        background: '#ffa851ff',
        title: '',
         html: `
          <div class="cooking-loader">
            <div class="pot">
              <div class="lid"></div>
              <div class="steam steam1"></div>
              <div class="steam steam2"></div>
              <div class="steam steam3"></div>
            </div>
            <div class="loader-text">${title}</div>

            <div class="progress-container">
              <div id="swal-progress-bar" class="progress-bar" style="width:${progress}%"></div>
            </div>
          </div>
        `,
        showConfirmButton: false,
        allowOutsideClick: false,
        didOpen: () => {
          // ensure the bar width is set when opened
          const bar = document.getElementById("swal-progress-bar");
          if (bar) bar.style.width = `${progress}%`;
        },
      });
    } else {
      Swal.close();
    }
  }, [open, title]); // re-run when open or title changes

  // update progress bar DOM when progress changes
  useEffect(() => {
    const bar = document.getElementById("swal-progress-bar");
    if (bar) bar.style.width = `${progress}%`;
  }, [progress]);

  // public API
  const startLoading = (txt = "Cooking in progress...") => {
    setTitle(txt);
    setProgressState(0);
    setOpen(true);
  };
  const setProgress = (n) => {
    const clamped = Math.min(100, Math.max(0, Math.round(n)));
    setProgressState(clamped);
  };
  const stopLoading = () => {
    setProgressState(100);
    // small delay to allow user to see 100% then close
    setTimeout(() => setOpen(false), 250);
  };

  return (
    <LoadingContext.Provider value={{ startLoading, setProgress, stopLoading }}>
      {children}
    </LoadingContext.Provider>
  );
}

export const useLoading = () => {
  return useContext(LoadingContext);
};
