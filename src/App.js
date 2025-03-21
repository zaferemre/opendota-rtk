// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Match from "./pages/Match";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/player/:id" element={<Profile />} />
        <Route path="/match/:id" element={<Match />} />
      </Routes>
    </Router>
  );
}