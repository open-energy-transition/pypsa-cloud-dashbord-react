import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import styles from "./Dashboard.module.css";
import { Button, Typography } from "@mui/material";
import JobsTableCheckbox from "./MainTable/JobsTableCheckbox";
import CreateJob from "./Job/CreateJob";

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

  return (
    <>
      <div className="backgound_main">
        <div className={styles.top_bar}>
          <Typography variant="h2" className={styles.conatiner_margin}>
            Dashboard
          </Typography>
          <div
            className={`${styles.info_btn_container} ${styles.conatiner_margin}`}
          >
            {user ? (
              <div className={styles.info_container}>
                <Typography variant="h6">{user.name}</Typography>
                <Typography variant="h6">{user.email}</Typography>
              </div>
            ) : (
              <></>
            )}
            <Button variant="outlined" onClick={signOutHandler}>
              Logout
            </Button>
          </div>
        </div>
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
            <Typography variant="h5" gutterBottom>
              No Jobs To Display
            </Typography>
            <Typography variant="h5">create one!</Typography>
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;
