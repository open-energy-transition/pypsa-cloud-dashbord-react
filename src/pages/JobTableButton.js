import { Button } from "@mui/material";
import React from "react";
import CustomizedDialogs from "./Job/UploadDialog";
import Payment from "./Payment";

const JobTableButton = ({ jobData, getAllJobs }) => {
  // console.log("jobData: ", jobData);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [payPopupOpen, setPayPopupOpen] = React.useState(false);

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
  }

  return <></>;
};

export default JobTableButton;
