import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import "./index.css";
import "@fontsource/poppins";
import { Provider } from "react-redux";
import store from "../src/store/store";
import { AuthProvider } from "./contexts/AuthContext"; // Import AuthProvider
import { ThemeProvider } from "./utils/ThemeProvider";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <Router>
        <Provider store={store}>
          <AuthProvider>
            {" "}
            {/* Wrap your App with AuthProvider */}
            <App />
          </AuthProvider>
        </Provider>
      </Router>
    </ThemeProvider>
  </React.StrictMode>
);
