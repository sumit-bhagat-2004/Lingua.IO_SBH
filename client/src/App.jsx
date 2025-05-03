import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import { Routes, Route } from "react-router-dom";
import OnboardingGate from "./components/OnboardingGate";
import Dashboard from "./pages/Dashboard";
import OnboardingPage from "./pages/OnboardingPage";
import Recorder from "./components/Recorder";
import PronunciationChecker from "./components/Pronounciationchecker";

const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/dashboard"
          element={
            <OnboardingGate>
              <Dashboard />
            </OnboardingGate>
          }
        />
        <Route path="/onboarding" element={<OnboardingPage />} />
      </Routes>
    </div>
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
