import React from "react";
import ReactDOM from "react-dom/client";

import "./styles/theme.css";
import "./styles/base.css";
import "./styles/layout.css";
import "./styles/public.css";
import "./styles/dashboard.css";
import "./styles/forms.css";
import "./styles/components.css";

import App from "./app/App";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
