import React, { useEffect, useRef } from "react";
import axios from "axios";
import useFileUpload from "react-use-file-upload";
import styles from "./Upload.module.css";
import { Button, Typography } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import LoadingButton from "@mui/lab/LoadingButton";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Upload = ({ fileName, content, jobData, setJobData }) => {
  const {
    files,
    fileNames,
    fileTypes,
    totalSize,
    totalSizeInBytes,
    handleDragDropEvent,
    clearAllFiles,
    createFormData,
    setFiles,
    removeFile,
  } = useFileUpload();

  const [enableUpload, setEnableUpload] = React.useState(false);

  const [fileType, setFileType] = React.useState(false);

  const [uploading, setUploading] = React.useState(false);

  const handleClickType = () => {
    setFileType(true);
  };

  const handleCloseType = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setFileType(false);
  };

  const inputRef = useRef();
  const only_file_name = fileName.split(".")[0];

  const handleSubmit = async (e) => {
    setUploading(true);
    e.preventDefault();

    const formData = createFormData();

    try {
      const file_dump_req = axios.create({
        withCredentials: true,
        credentials: "include",
      });

      file_dump_req
        .post(`/fileDump/upload/config`, formData, {
          Accept: "application/json",
          "content-type": "multipart/form-data",
          params: { file_name: only_file_name, job_id: jobData._id },
        })
        .then((res) => {
          if (res.status == 200) {
            setJobData((prev) => {
              const temp = { ...prev };
              temp[only_file_name] = true;
              return temp;
            });
          }
          console.log("copied config", res.data);
        });
    } catch (error) {
      console.error("Failed to submit files.");
    }
  };

  const handleDefaultSubmit = async (e) => {
    setUploading(true);
    e.preventDefault();

    try {
      const file_dump_req = axios.create({
        withCredentials: true,
        credentials: "include",
      });

      file_dump_req
        .post(
          `/fileDump/upload/config/default`,
          {},
          {
            Accept: "application/json",
            "content-type": "multipart/form-data",
            params: { file_name: only_file_name, job_id: jobData._id },
          }
        )
        .then((res) => {
          if (res.status == 200) {
            setJobData((prev) => {
              const temp = { ...prev };
              temp[only_file_name] = true;
              return temp;
            });
          }
          console.log("copied config", res.data);
        });
    } catch (error) {
      console.error("Failed to submit files.");
    }
  };

  useEffect(() => {
    console.log("files", files);
    if (files.length !== 0) {
      const ftype = files[0].name.split(".").at(-1);
      console.log("sadas", ftype);
      if (ftype === "yaml") {
        setEnableUpload(true);
      } else {
        setEnableUpload(false);
        handleClickType();
        clearAllFiles();
      }
    } else {
      setEnableUpload(false);
    }
  }, [files]);

  useEffect(() => {
    console.log("ena", enableUpload);
  }, [enableUpload]);

  return (
    <>
      <div className={styles.upload_layout}>
        <Typography variant="h5" component="span" display="block" color="white">
          {`Upload ${fileName} File`}
        </Typography>

        <Typography
          variant="body1"
          component="span"
          display="block"
          align="center"
        >{`${content}`}</Typography>

        <div
          onDragEnter={handleDragDropEvent}
          onDragOver={handleDragDropEvent}
          onDrop={(e) => {
            handleDragDropEvent(e);
            setFiles(e, "w");
          }}
          className={
            files.length !== 0 ? styles.drag_drop_filled : styles.drag_drop
          }
        >
          {files.length !== 0 ? (
            <>
              <Typography
                variant="h8"
                component="span"
                display="block"
                color="white"
              >
                {files[0].name} has been uploaded
              </Typography>
              <Button
                variant="outlined"
                component="span"
                display="block"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  // setEnableUpload(false)
                  clearAllFiles();
                }}
              >
                delete file
              </Button>
            </>
          ) : (
            <>
              <Typography
                variant="h8"
                component="span"
                display="block"
                color="white"
              >
                Drag and drop files here
              </Typography>

              {/* Hide the crappy looking default HTML input */}
              <input
                ref={inputRef}
                type="file"
                multiple
                style={{ display: "none" }}
                onChange={(e) => {
                  setFiles(e, "w");
                  inputRef.current.value = null;
                }}
              />
              <Button
                onClick={() => inputRef.current.click()}
                variant="outlined"
              >
                Select File To Upload
              </Button>
            </>
          )}
        </div>

        <div className={styles.btn_bar}>
          <LoadingButton
            variant="contained"
            component="span"
            color="primary"
            onClick={handleSubmit}
            disabled={!enableUpload}
            loading={uploading}
          >
            upload custom file
          </LoadingButton>
          {only_file_name !== "config" ? (
            <LoadingButton
              variant="contained"
              component="span"
              color="primary"
              onClick={handleDefaultSubmit}
              loading={uploading}
              disabled={enableUpload}
            >
              upload default file
            </LoadingButton>
          ) : (
            <></>
          )}
        </div>
      </div>
      <Snackbar
        open={fileType}
        autoHideDuration={5000}
        onClose={handleCloseType}
      >
        <Alert
          onClose={handleCloseType}
          severity="warning"
          sx={{ width: "100%" }}
        >
          wrong file type uploaded
        </Alert>
      </Snackbar>
    </>
  );
};

export default Upload;
