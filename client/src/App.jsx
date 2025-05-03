import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import Recorder from "./components/Recorder";
import PronunciationChecker from "./components/Pronounciationchecker";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/grammar" element={<Recorder />} />
        <Route path="/pronounciation" element={<PronunciationChecker />} />
      </Routes>
    </Router>
  );
};

export default App;
