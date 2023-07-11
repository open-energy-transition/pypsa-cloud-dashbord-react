import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Upload from "./Upload";
import { UPLOAD_CONFIGS, UPLOAD_CONTENT } from "../../configuration/CONFIG";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import styles from "./Tabs.module.css";
import { Button } from "@mui/material";
import axios from "axios";
import { LoadingButton } from "@mui/lab";
import { Buffer } from "buffer";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs({ jobData, setJobData }) {
  const [value, setValue] = React.useState(0);
  const [_unused, _setUnused] = React.useState(0);
  const [downloading, setDownloading] = React.useState(false);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const onlyfileNames = UPLOAD_CONFIGS.map((item) => item.split(".")[0]);

  function dowload_config(fileName) {
    setDownloading(true);
    const get_config_req = axios.create({
      withCredentials: true,
      credentials: "include",
    });

    get_config_req
      .get(`/download/getConfig`, {
        params: { file_name: fileName, job_id: jobData._id },
      })
      .then((res) => {
        console.log("config data ", res.data[0]);

        const nodeJSBuffer = res.data[0];

        const buffer = Buffer.from(nodeJSBuffer);
        const blob = new Blob([buffer]);

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        a.href = url;
        a.download = `${fileName}.yaml`;
        a.click();
        window.URL.revokeObjectURL(url);
        setDownloading(false);
      });
  }

  return (
    <Box>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          variant="fullWidth"
          indicatorColor="primary"
        >
          <Tab label={UPLOAD_CONFIGS[0]} {...a11yProps(0)} key={0} />
          <Tab label={UPLOAD_CONFIGS[1]} {...a11yProps(1)} key={1} />
          <Tab label={UPLOAD_CONFIGS[2]} {...a11yProps(2)} key={2} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        {jobData[onlyfileNames[0]] ? (
          <div className={styles.tab_layout}>
            <TaskAltIcon className={styles.icon_layout} />
            <Typography variant="h4">UPLOADED</Typography>
            <LoadingButton
              variant="contained"
              loading={downloading}
              onClick={() => {
                dowload_config(onlyfileNames[0]);
              }}
            >
              download config
            </LoadingButton>
          </div>
        ) : (
          <Upload
            fileName={UPLOAD_CONFIGS[0]}
            content={UPLOAD_CONTENT[0]}
            jobData={jobData}
            setJobData={setJobData}
            key={0}
          />
        )}
      </TabPanel>
      <TabPanel value={value} index={1}>
        {jobData[onlyfileNames[1]] ? (
          <div className={styles.tab_layout}>
            <TaskAltIcon className={styles.icon_layout} />
            <Typography variant="h4">UPLOADED</Typography>
            <LoadingButton
              variant="contained"
              loading={downloading}
              onClick={() => {
                dowload_config(onlyfileNames[1]);
              }}
            >
              download config
            </LoadingButton>
          </div>
        ) : (
          <Upload
            fileName={UPLOAD_CONFIGS[1]}
            content={UPLOAD_CONTENT[1]}
            jobData={jobData}
            setJobData={setJobData}
            key={1}
          />
        )}
      </TabPanel>
      <TabPanel value={value} index={2}>
        {jobData[onlyfileNames[2]] ? (
          <div className={styles.tab_layout}>
            <TaskAltIcon className={styles.icon_layout} />
            <Typography variant="h4">UPLOADED</Typography>
            <LoadingButton
              variant="contained"
              loading={downloading}
              onClick={() => {
                dowload_config(onlyfileNames[2]);
              }}
            >
              download config
            </LoadingButton>
          </div>
        ) : (
          <Upload
            fileName={UPLOAD_CONFIGS[2]}
            content={UPLOAD_CONTENT[2]}
            jobData={jobData}
            setJobData={setJobData}
            key={2}
          />
        )}
      </TabPanel>
    </Box>
  );
}
