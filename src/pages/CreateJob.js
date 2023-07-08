import { Button } from "@mui/material";
import React from "react";
import CustomizedDialogs from "./Job/UploadDialog";

const CreateJob = ({ refreshHome }) => {
  const [uploadDialogOpen, setUploadDialogOpen] = React.useState(false);

  return (
    <>
      <Button
        onClick={() => {
          setUploadDialogOpen(true);
        }}
        variant="contained"
      >
        Create Job
      </Button>
      <CustomizedDialogs
        open={uploadDialogOpen}
        setOpen={setUploadDialogOpen}
        refreshHome={refreshHome}
        initialJobData={null}
      />
    </>
  );
};

export default CreateJob;
