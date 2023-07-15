import logo from "./logo.svg";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Logger from "./pages/Logger";
import Dashboard from "./pages/Dashboard";
import axios from "axios";
import SuccessPayment from "./pages/Payment/SuccessPayment";
import { ThemeProvider, createTheme } from "@mui/material";

axios.defaults.baseURL = process.env.REACT_APP_BASE_BACKEND_URL;

function App() {
  const myTheme = createTheme({
    typography: {
      allVariants: {
        color: "white",
      },
    },
  });

  return (
    <ThemeProvider theme={myTheme}>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/verify" element={<Logger />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/paymentsuccess" element={<SuccessPayment />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
