import React, { useEffect, useRef } from "react";
import axios from "axios";
import useFileUpload from "react-use-file-upload";
import styles from "./Upload.module.css";
import { Button, Typography } from "@mui/material";

const Upload = ({ fileName, content, jobData, updateJobData }) => {
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

  const inputRef = useRef();
  const only_file_name = fileName.split(".")[0];

  const handleSubmit = async (e) => {
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
            // trigger rerender
            updateJobData();
          }
        });
    } catch (error) {
      console.error("Failed to submit files.");
    }
  };

  return (
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
        className={styles.drag_drop}
      >
        <Typography variant="h8" component="span" display="block" color="white">
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
        <Button onClick={() => inputRef.current.click()} variant="outlined">
          Select File To Upload
        </Button>
      </div>

      <div className={styles.submit_btn}>
        <Button component="span" onClick={handleSubmit} variant="outlined">
          upload file
        </Button>
      </div>
    </div>
  );
};

export default Upload;
