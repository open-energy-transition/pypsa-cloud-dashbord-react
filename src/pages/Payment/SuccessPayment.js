import { Button, Grid, Typography } from "@mui/material";
import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const SuccessPayment = () => {
  const [searchParam] = useSearchParams();
  const navigator = useNavigate();
  console.log(searchParam.values());

  return (
    <>
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        gap={"1rem"}
        paddingTop={"5rem"}
      >
        <Typography variant="h3">Payment was successfull</Typography>
        <Typography>{searchParam.get("reference")}</Typography>
        <Button
          variant="contained"
          onClick={() => {
            navigator("/dashboard");
          }}
        >
          Dashboard
        </Button>
      </Grid>
    </>
  );
};

export default SuccessPayment;
