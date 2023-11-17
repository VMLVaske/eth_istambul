import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import SafeProvider from "@safe-global/safe-apps-react-sdk";
import { ThemeProvider, Theme } from "@mui/material/styles";
import { SafeThemeProvider } from "@safe-global/safe-react-components";

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <SafeProvider>
      <SafeThemeProvider mode="dark">
        {(safeTheme: Theme) => (
          <ThemeProvider theme={safeTheme}>
            <App />
          </ThemeProvider>
        )}
      </SafeThemeProvider>
    </SafeProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
