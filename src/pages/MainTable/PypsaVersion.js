import React from "react";
import { FormControl, Select, MenuItem, InputLabel } from "@mui/material";
import axios from "axios";

const PypsaVersion = ({ row }) => {
  const [version, setVersion] = React.useState(row.pypsa_version);
  const [sending, setSending] = React.useState(false);

  const handleVersioChange = (event, row) => {
    setSending(true);
    const version_change_req = axios.create({
      withCredentials: true,
      credentials: "include",
    });

    version_change_req
      .post("/fileDump/version", {
        job_id: row._id,
        pypsa_ver: event.target.value,
      })
      .then((res) => {
        console.log("recived version", res.data.pypsa_version);
        setVersion(res.data.pypsa_version);
        setSending(false);
      });
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
        disabled={sending}
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
        <MenuItem value={"v0.2.0"}>v0.2.0</MenuItem>
      </Select>
    </FormControl>
  );
};

export default PypsaVersion;
