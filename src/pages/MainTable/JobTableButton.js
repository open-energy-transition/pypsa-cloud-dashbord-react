import { Button, Typography } from "@mui/material";
import React from "react";
import CustomizedDialogs from "../Job/UploadDialog";
import Payment from "../Payment/Payment";
import axios from "axios";
import { LoadingButton } from "@mui/lab";
import { Buffer } from "buffer";

const JobTableButton = ({ jobData, getAllJobs }) => {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [payPopupOpen, setPayPopupOpen] = React.useState(false);
  const [downloading, setDownloading] = React.useState(false);

  function getAllResults() {
    const user_data_req = axios.create({
      withCredentials: true,
      credentials: "include",
    });
    setDownloading(true);
    user_data_req
      .get("/download/getResults", {
        params: {
          job_id: jobData._id,
        },
      })
      .then((res) => {
        const nodeJSBuffer = res.data.zip_buffer;
        console.log(nodeJSBuffer);
        const buffer = Buffer.from(nodeJSBuffer);
        const blob = new Blob([buffer]);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        a.href = url;
        a.download = "filename.zip";
        a.click();
        window.URL.revokeObjectURL(url);
        setDownloading(false);
      });
  }

  function getPypsaComplete() {
    const a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    a.href = `${process.env.REACT_APP_BASE_BACKEND_URL}/download/getPypsaData?job_id=${jobData._id}`;
    a.download = "filename.zip";
    a.click();
  }

  if (jobData.status === "incomplete") {
    return (
      <>
        <Button variant="contained" onClick={() => setDialogOpen(true)}>
          upload configs
        </Button>
        <CustomizedDialogs
          open={dialogOpen}
          setOpen={setDialogOpen}
          initialJobData={jobData}
          refreshHome={getAllJobs}
        />
      </>
    );
  } else if (jobData.status === "pending") {
    return (
      <>
        <Button variant="contained" onClick={() => setPayPopupOpen(true)}>
          pay
        </Button>
        <Payment
          jobData={jobData}
          open={payPopupOpen}
          setOpen={setPayPopupOpen}
        />
      </>
    );
  } else if (jobData.status === "Succeeded") {
    return (
      <>
        <LoadingButton
          loading={downloading}
          variant="contained"
          onClick={getAllResults}
        >
          download results
        </LoadingButton>
        <LoadingButton
          loading={downloading}
          variant="contained"
          onClick={getPypsaComplete}
          sx={{
            marginTop: "1rem",
          }}
        >
          download pypsa
        </LoadingButton>
      </>
    );
  } else {
    return <Typography>{jobData.status}</Typography>;
  }
};

export default JobTableButton;
