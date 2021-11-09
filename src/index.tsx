import React from "react";
import ReactDOM from "react-dom";
import App from "./frontend/App";
import { HashRouter } from "react-router-dom";
import "../styles/index.scss";
import "./backend/index";

ReactDOM.render(
  <HashRouter>
    <App />
  </HashRouter>,
  document.getElementById("root")
);
