// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Match from "./pages/Match";
import AuthSuccess from "./pages/AuthSuccess";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />{" "}
        <Route path="/player/:id" element={<Profile />} />{" "}
        <Route path="/match/:id" element={<Match />} />{" "}
        <Route path="auth/success" element={<AuthSuccess />} />{" "}
      </Routes>{" "}
    </Router>
  );
}
