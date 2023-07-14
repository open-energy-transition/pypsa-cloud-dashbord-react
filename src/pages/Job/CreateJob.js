import { Button } from "@mui/material";
import React from "react";
import CustomizedDialogs from "./UploadDialog";

const CreateJob = ({ refreshHome }) => {
  const [uploadDialogOpen, setUploadDialogOpen] = React.useState(false);

  return (
    <>
      <Button
        onClick={() => {
          setUploadDialogOpen(true);
        }}
        variant="contained"
        sx={{
          marginLeft: "30px",
          marginTop: "1rem",
          marginBottom: "1rem",
        }}
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
