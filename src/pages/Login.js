import React from "react";
import { useNavigate, redirect } from "react-router-dom";
import styles from "./Login.module.css";
import { Button, Typography } from "@mui/material";

const Login = () => {
  const navigate = useNavigate();

  const authHandler = () => {
    console.log("rsgseg");
    // navigate();
    window.location.replace("http://localhost:3001/auth/google");
  };

  return (
    <>
      <div className={`${styles.main_layout} backgound_main`}>
        <Typography variant="h1" color="white">
          Login
        </Typography>
        <Button onClick={authHandler} variant="contained" size="large">
          Sign Up/ Sign In
        </Button>
      </div>
    </>
  );
};

export default Login;
