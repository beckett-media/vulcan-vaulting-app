import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import DepositPage from "./pages/DepositPage/DepositPage";
import WithdrawPage from "./pages/WithdrawPage/WithdrawPage";

function App() {
  return (
    <Routes>
      <Route path="/deposit" element={<DepositPage />} />
      <Route path="/withdraw" element={<WithdrawPage />} />
    </Routes>
  );
}

export default App;
