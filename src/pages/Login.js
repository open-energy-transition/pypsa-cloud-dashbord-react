import React from "react";
import { Button, Grid, Typography } from "@mui/material";

const Login = () => {
  const BASE_BACKEND_URL = process.env.REACT_APP_BASE_BACKEND_URL;

  const authHandler = () => {
    window.location.replace(`${BASE_BACKEND_URL}/auth/google`);
  };

  return (
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
      height={"100vh"}
      gap={"3rem"}
    >
      <Typography variant="h1">PYPSA EARTH !!!!</Typography>
      <Typography variant="h3">Login</Typography>
      <Button onClick={authHandler} variant="contained" size="large">
        Sign Up/ Sign In
      </Button>
    </Grid>
  );
};

export default Login;
