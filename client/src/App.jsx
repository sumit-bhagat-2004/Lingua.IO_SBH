import React from "react";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import { Routes, Route } from "react-router-dom";
import OnboardingGate from "./components/OnboardingGate";
import Dashboard from "./pages/Dashboard";
import OnboardingPage from "./pages/OnboardingPage";

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
  );
};

export default App;
