import * as React from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import styles from "./UploadDialog.module.css";
import BasicTabs from "./Tabs";
import { TextField } from "@mui/material";
import axios from "axios";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

function BootstrapDialogTitle(props) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

export default function CustomizedDialogs({
  open,
  setOpen,
  refreshHome,
  initialJobData,
}) {
  const [typedName, setTypedName] = React.useState("");
  const [jobData, setJobData] = React.useState(initialJobData);

  const handleClose = () => {
    setOpen(false);
    setTypedName("");
    refreshHome();
  };

  const handleJobCreate = () => {
    try {
      const file_dump_req = axios.create({
        withCredentials: true,
        credentials: "include",
      });

      file_dump_req
        .post(
          "/fileDump/name",
          { jobName: typedName },
          {
            Accept: "application/json",
            "content-type": "application/json",
          }
        )
        .then((res) => {
          setJobData(res.data);
        });
    } catch (error) {
      console.error("Failed to create job.");
    }
  };

  return (
    <BootstrapDialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={open}
      PaperProps={
        {
          // sx: styles_dialog.dialogPaper,
        }
      }
      fullWidth
      maxWidth="lg"
    >
      <BootstrapDialogTitle
        id="customized-dialog-title"
        onClose={handleClose}
        className={styles.bg_color}
      >
        # {jobData ? jobData.name : "New Job"}
      </BootstrapDialogTitle>
      {jobData ? (
        <DialogContent className={styles.dialog_content_name}>
          <BasicTabs jobData={jobData} setJobData={setJobData} />
        </DialogContent>
      ) : (
        <DialogContent className={styles.dialog_content_name}>
          <Typography variant="body1">
            Ad occaecat in nisi ut dolor dolore laboris pariatur cupidatat.
          </Typography>
          <TextField
            sx={{ input: { color: "white" } }}
            inputProps={{ style: { color: "white", fontSize: "2rem" } }}
            InputLabelProps={{
              style: { color: "gray" },
            }}
            id="name"
            label="JOB NAME"
            variant="filled"
            color="primary"
            value={typedName}
            onChange={(e) => {
              setTypedName(e.target.value);
            }}
            className={styles.text_field}
          />
          <Button variant="contained" onClick={handleJobCreate}>
            submit
          </Button>
        </DialogContent>
      )}
      <DialogActions className={styles.bg_color}>
        <Button
          autoFocus
          onClick={handleClose}
          variant="outlined"
          style={{ color: "white" }}
        >
          Save changes
        </Button>
      </DialogActions>
    </BootstrapDialog>
  );
}
