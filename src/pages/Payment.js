import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import React, { useEffect } from "react";

const Payment = ({ jobData, open, setOpen }) => {
  const [cost, setCost] = React.useState(null);

  const orderObjRef = React.useRef();
  const razorKeyRef = React.useRef();

  function handleClose() {
    setOpen(false);
  }

  function fetchCost() {
    const getCostReq = axios.create({
      withCredentials: true,
      credentials: "include",
    });

    getCostReq
      .get(`/payment/getCost`, {
        Accept: "application/json",
        params: { job_id: jobData._id },
      })
      .then((res) => {
        if (res.status == 200) {
          setCost(res.data.order_obj.amount);
          orderObjRef.current = res.data.order_obj;
          razorKeyRef.current = res.data.razor_key;
          console.log(res.data);
        }
      });
  }

  function checkoutHanlder() {
    const BASE_BACKEND_URL = process.env.REACT_APP_BASE_BACKEND_URL;

    const options = {
      key: razorKeyRef.current,
      amount: orderObjRef.current.amount,
      currency: "INR",
      name: "PYPSA-EARTH",
      description: "pypsa cloud solver",
      image: "https://avatars.githubusercontent.com/u/84225086?s=48&v=4",
      order_id: orderObjRef.current.id,
      callback_url: `${BASE_BACKEND_URL}/payment/verify`,
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#121212",
      },
    };
    const razor = new window.Razorpay(options);
    razor.open();
  }

  useEffect(() => {
    console.log(jobData);
    fetchCost();
  }, []);

  return (
    <>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
        <DialogTitle>
          Payment
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">this run will cost</Typography>
          {cost ? (
            <>
              <Typography variant="h5">{cost}</Typography>
              <Button variant="contained" onClick={checkoutHanlder}>
                checkout
              </Button>
            </>
          ) : (
            <Typography variant="h5">loading...</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Payment;
