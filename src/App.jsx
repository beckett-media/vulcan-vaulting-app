import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import IntakePage from "./pages/IntakePage/IntakePage";
import OuttakePage from "./pages/OuttakePage/OuttakePage";

function App() {
  return (
    <Routes>
      <Route path="/deposit" element={<IntakePage />} />
      <Route path="/withdraw" element={<OuttakePage />} />
    </Routes>
  );
}

export default App;
