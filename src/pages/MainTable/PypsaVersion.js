import React from "react";
import { FormControl, Select, MenuItem, InputLabel } from "@mui/material";
import axios from "axios";

const PypsaVersion = ({ row }) => {
  const [version, setVersion] = React.useState(row.pypsa_version);
  const handleVersioChange = (event, row) => {
    const version_change_req = axios.create({
      withCredentials: true,
      credentials: "include",
    });

    version_change_req
      .post(
        "/fileDump/version",
        { job_id: row._id, pypsa_ver: event.target.value },
        {
          Accept: "application/json",
          "content-type": "application/json",
        }
      )
      .then((res) => {
        console.log("eaffff", res);
      });
    setVersion(event.target.value);
  };

  return (
    <FormControl fullWidth>
      <InputLabel id="demo-simple-select-label">version</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={version}
        label="version"
        defaultValue={row.pypsa_version}
        onChange={(e) => {
          handleVersioChange(e, row);
        }}
        MenuProps={{
          PaperProps: {
            sx: {
              bgcolor: "#011e3c",
              "& .MuiMenuItem-root": {
                padding: 2,
              },
            },
          },
        }}
        sx={{
          color: "white",
        }}
      >
        <MenuItem value={"main"}>main</MenuItem>
        <MenuItem value={"v0.2.2"}>v0.2.2</MenuItem>
        <MenuItem value={"v0.2.1"}>v0.2.1</MenuItem>
        <MenuItem value={"v0.0.1"}>v0.0.1</MenuItem>
      </Select>
    </FormControl>
  );
};

export default PypsaVersion;
