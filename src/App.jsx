import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import IntakeForm from "./pages/IntakeForm/IntakeForm";
import OuttakeForm from "./pages/OuttakeForm/OuttakeForm";

function App() {
  return (
    <Routes>
      <Route path="/deposit" element={<IntakeForm />} />
      <Route path="/withdraw" element={<OuttakeForm />} />
    </Routes>
  );
}

export default App;
