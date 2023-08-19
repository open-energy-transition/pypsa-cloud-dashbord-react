import * as React from "react";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import JobTableButton from "./JobTableButton";
import CloseIcon from "@mui/icons-material/Close";
import { Close } from "@mui/icons-material";
import CheckIcon from "@mui/icons-material/Check";
import { FormControl, Select, MenuItem, InputLabel } from "@mui/material";
import PypsaVersion from "./PypsaVersion";
import { UPLOAD_CONFIGS } from "../../configuration/CONFIG";
import { LoadingButton } from "@mui/lab";
import { Buffer } from "buffer";

const headCells = [
  {
    id: "name",
    label: "Job Name",
    align: "left",
  },
  {
    id: "pypsa_version",
    label: "PYPSA version",
    align: "center",
  },
  {
    id: "config",
    label: "config",
    align: "center",
  },
  {
    id: "bundle_config",
    label: "bundle",
    align: "center",
  },
  {
    id: "powerplantmatching_config",
    label: "powerplantmatching",
    align: "center",
  },
  {
    id: "status",
    label: "status",
    align: "left",
  },
];

function EnhancedTableHead(props) {
  return (
    <TableHead sx={{ borderBottom: "1px solid gray" }}>
      <TableRow>
        <TableCell sx={{ width: "2% " }}></TableCell>
        {headCells.map((headCell) => (
          <EnhancedTableCell key={headCell.id} align={headCell.align}>
            {headCell.label}
          </EnhancedTableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

function EnhancedTableCell(props) {
  return (
    <TableCell sx={{ color: "white", width: "15%" }} {...props}>
      {props.children}
    </TableCell>
  );
}

function EnhancedTableToolbar(props) {
  const { numSelected, deleteHandler } = props;

  return (
    <Toolbar>
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Jobs
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete" onClick={deleteHandler}>
          <IconButton>
            <DeleteIcon style={{ color: "white" }} />
          </IconButton>
        </Tooltip>
      ) : (
        <></>
      )}
    </Toolbar>
  );
}

export default function JobsTableCheckbox({
  jobsData,
  selected,
  setSelected,
  getAllJobs,
}) {
  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  function handleDelete() {
    const file_dump_req = axios.create({
      withCredentials: true,
      credentials: "include",
    });

    file_dump_req
      .post(
        "/fileDump/name/delete",
        { job_names: selected },
        {
          Accept: "application/json",
          "content-type": "application/json",
        }
      )
      .then((res) => {
        getAllJobs();
      });
  }

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const onlyfileNames = UPLOAD_CONFIGS.map((item) => item.split(".")[0]);

  const [dowloadingConfig, setDownloadingConfig] = React.useState([
    false,
    false,
    false,
  ]);

  function dowload_config(index, row) {
    setDownloadingConfig((prev) =>
      prev.map((item, i) => (i === index ? true : item))
    );
    const get_config_req = axios.create({
      withCredentials: true,
      credentials: "include",
    });

    get_config_req
      .get(`/download/getConfig`, {
        params: { file_name: onlyfileNames[index], job_id: row._id },
      })
      .then((res) => {
        console.log("config data ", res.data);

        const nodeJSBuffer = res.data;

        const buffer = Buffer.from(nodeJSBuffer);
        const blob = new Blob([buffer]);

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        a.href = url;
        a.download = `${onlyfileNames[index]}.yaml`;
        a.click();
        window.URL.revokeObjectURL(url);
        setDownloadingConfig((prev) =>
          prev.map((item, i) => (i === index ? false : item))
        );
      });
  }

  return (
    <Box sx={{ width: "90%" }}>
      <Paper sx={{ width: "100%", backgroundColor: "#132f4c", color: "white" }}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          deleteHandler={handleDelete}
        />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={"medium"}
          >
            <EnhancedTableHead />
            <TableBody>
              {jobsData.map((row, index) => {
                const isItemSelected = isSelected(row.name);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.name}
                    selected={isItemSelected}
                    sx={{
                      cursor: "pointer",
                      borderBottom: "1px solid darkgray",
                    }}
                  >
                    <TableCell
                      sx={{
                        width: "2%",
                      }}
                      padding="checkbox"
                    >
                      <Checkbox
                        color="primary"
                        onClick={(event) => handleClick(event, row.name)}
                        checked={isItemSelected}
                        inputProps={{
                          "aria-labelledby": labelId,
                        }}
                      />
                    </TableCell>
                    <EnhancedTableCell component="th" id={labelId} scope="row">
                      {row.name}
                    </EnhancedTableCell>
                    <EnhancedTableCell>
                      <PypsaVersion row={row} />
                    </EnhancedTableCell>
                    <EnhancedTableCell align="center">
                      {row.config ? (
                        <>
                          <div>
                            <CheckIcon sx={{ fontSize: 30 }} />
                          </div>
                          <LoadingButton
                            loading={dowloadingConfig[0]}
                            onClick={() => dowload_config(0, row)}
                            variant="contained"
                          >
                            download
                          </LoadingButton>
                        </>
                      ) : (
                        <CloseIcon sx={{ fontSize: 30 }} />
                      )}
                    </EnhancedTableCell>
                    <EnhancedTableCell align="center">
                      {row.bundle_config ? (
                        <>
                          <div>
                            <CheckIcon sx={{ fontSize: 30 }} />
                          </div>
                          <LoadingButton
                            loading={dowloadingConfig[1]}
                            onClick={() => dowload_config(1, row)}
                            variant="contained"
                          >
                            download
                          </LoadingButton>
                        </>
                      ) : (
                        <CloseIcon sx={{ fontSize: 30 }} />
                      )}
                    </EnhancedTableCell>
                    <EnhancedTableCell align="center">
                      {row.powerplantmatching_config ? (
                        <>
                          <div>
                            <CheckIcon sx={{ fontSize: 30 }} />
                          </div>
                          <LoadingButton
                            loading={dowloadingConfig[2]}
                            onClick={() => dowload_config(2, row)}
                            variant="contained"
                          >
                            download
                          </LoadingButton>
                        </>
                      ) : (
                        <CloseIcon sx={{ fontSize: 30 }} />
                      )}
                    </EnhancedTableCell>
                    <EnhancedTableCell align="left">
                      {<JobTableButton jobData={row} getAllJobs={getAllJobs} />}
                    </EnhancedTableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
