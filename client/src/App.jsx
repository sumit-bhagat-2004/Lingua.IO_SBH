import React from "react";
import Recorder from "./components/Recorder";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";

const App = () => {
  return (
    <div>
      <Navbar/>
    <HomePage/>
      {/* <Recorder /> */}
    </div>
  );
};

export default App;
