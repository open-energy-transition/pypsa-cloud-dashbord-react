import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import styles from "./Dashboard.module.css";
import { Button, Typography } from "@mui/material";
import CustomizedDialogs from "./Job/UploadDialog";
import JobsTableCheckbox from "./JobsTableCheckbox";

const Dashboard = () => {
  const [cookies, setCookie, removeCookie] = useCookies();
  const navigate = useNavigate();

  const [user, setUser] = useState();
  const [jobsData, setJobsData] = useState(null);

  const [selectedRows, setSelectedRows] = useState([]);

  const [selectedJob, setSelectedJob] = React.useState(null);

  const [enableSolve, setEnableSolve] = useState(false);

  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  const signOutHandler = () => {
    removeCookie("jwt");
    navigate("/");
  };

  const solveHandler = () => {
    const user_data_req = axios.create({
      withCredentials: true,
      credentials: "include",
    });
    user_data_req.post("/fileDump/submitworkflow", {
      job_id: selectedJob._id,
    });
  };

  useEffect(() => {
    // const headers = { Authorization: `Bearer ${cookies.jwt}` };
    const user_data_req = axios.create({
      withCredentials: true,
      credentials: "include",
    });
    user_data_req
      .get("/getDetails")
      .then((res) => {
        setUser(res.data);
      })
      .then(() => {
        getAllJobs();
      });
  }, []);

  React.useEffect(() => {
    if (selectedRows.length === 1) {
      setSelectedJob(jobsData.filter((job) => job.name === selectedRows[0])[0]);
    } else {
      setSelectedJob(null);
    }
  }, [selectedRows]);

  React.useEffect(() => {
    if (selectedJob) {
      if (
        selectedJob.config &&
        selectedJob.bundle_config &&
        selectedJob.powerplantmatching_config
      ) {
        setEnableSolve(true);
      } else {
        setEnableSolve(false);
      }
    } else {
      setEnableSolve(false);
    }
  }, [selectedJob]);

  function getAllJobs() {
    const user_data_req = axios.create({
      withCredentials: true,
      credentials: "include",
    });
    user_data_req.get("/fileDump/userId").then((res) => {
      if (res.data.length === 0) {
        setJobsData(null);
      } else {
        setJobsData(res.data);
      }
      setSelectedRows([]);
    });
  }

  return (
    <>
      <div className="backgound_main">
        <div className={styles.top_bar}>
          <Typography
            variant="h3"
            color="white"
            className={styles.conatiner_margin}
          >
            Dashboard
          </Typography>
          <div
            className={`${styles.info_btn_container} ${styles.conatiner_margin}`}
          >
            {user ? (
              <div className={styles.info_container}>
                <Typography variant="h7" color="white">
                  {user.name}
                </Typography>
                <Typography variant="h7" color="white">
                  {user.email}
                </Typography>
              </div>
            ) : (
              <></>
            )}
            <Button variant="outlined" onClick={signOutHandler}>
              Logout
            </Button>
          </div>
        </div>
        <div className={styles.btn_bar}>
          <Button
            variant="contained"
            disabled={!enableSolve}
            onClick={solveHandler}
            sx={{
              "&.Mui-disabled": {
                background: "#eaeaea",
                color: "#c0c0c0",
              },
            }}
          >
            solve
          </Button>
          <Button
            onClick={() => {
              setUploadDialogOpen(true);
            }}
            variant="contained"
            className={styles.job_btn}
          >
            {selectedJob !== null ? "Update Job" : "Create Job"}
          </Button>
        </div>
        <CustomizedDialogs
          getAllJobs={getAllJobs}
          open={uploadDialogOpen}
          setOpen={setUploadDialogOpen}
          jobData={selectedJob}
          setJobData={setSelectedJob}
        />
        {jobsData ? (
          <div className={styles.jobs_table_layout}>
            <JobsTableCheckbox
              jobsData={jobsData}
              selected={selectedRows}
              setSelected={setSelectedRows}
              getAllJobs={getAllJobs}
            />
          </div>
        ) : (
          <div className={styles.jobs_table_layout}>
            <Typography variant="h5" color={"white"} gutterBottom>
              No Jobs To Display
            </Typography>
            <Typography variant="h5" color={"white"}>
              create one!
            </Typography>
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;
