import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import styles from "./Dashboard.module.css";
import { Button, Typography } from "@mui/material";
import JobsTableCheckbox from "./JobsTableCheckbox";
import CreateJob from "./CreateJob";
import { Buffer } from "buffer";

const Dashboard = () => {
  const [cookies, setCookie, removeCookie] = useCookies();
  const navigate = useNavigate();

  const [user, setUser] = useState();
  const [jobsData, setJobsData] = useState(null);

  const [selectedRows, setSelectedRows] = useState([]);

  const signOutHandler = () => {
    removeCookie("jwt");
    navigate("/");
  };

  useEffect(() => {
    const user_data_req = axios.create({
      withCredentials: true,
      credentials: "include",
    });
    console.log("i ran");
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
    console.log("selectedRows: ", selectedRows);
  }, [selectedRows]);

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
      console.log(res.data);
      setSelectedRows([]);
    });
  }

  function getAllResults() {
    const user_data_req = axios.create({
      withCredentials: true,
      credentials: "include",
    });

    user_data_req.get("/download/getResults").then((res) => {
      console.log("res.data: ", res.data[0]);

      const nodeJSBuffer = res.data[0];

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
        <Button variant="contained" onClick={getAllResults}>
          wfw
        </Button>
        <CreateJob refreshHome={getAllJobs} />
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
