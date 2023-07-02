import logo from "./logo.svg";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Logger from "./pages/Logger";
import Dashboard from "./pages/Dashboard";
import axios from "axios";

axios.defaults.baseURL = process.env.REACT_APP_BASE_BACKEND_URL;

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/verify" element={<Logger />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}

export default App;
