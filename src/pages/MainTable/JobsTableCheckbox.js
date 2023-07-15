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
const headCells = [
  {
    id: "name",
    label: "Job Name",
  },
  {
    id: "pypsa_version",
    label: "PYPSA version",
  },
  {
    id: "config",
    label: "config",
  },
  {
    id: "bundle_config",
    label: "bundle",
  },
  {
    id: "powerplantmatching_config",
    label: "powerplantmatching",
  },
  {
    id: "status",
    label: "status",
  },
];

function EnhancedTableHead(props) {
  return (
    <TableHead sx={{ borderBottom: "1px solid gray" }}>
      <TableRow>
        <TableCell sx={{ width: "2% " }}></TableCell>
        {headCells.map((headCell) => (
          <EnhancedTableCell key={headCell.id} align={"left"}>
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
                    <EnhancedTableCell align="left">
                      {row.config ? (
                        <CheckIcon sx={{ fontSize: 30 }} />
                      ) : (
                        <CloseIcon sx={{ fontSize: 30 }} />
                      )}
                    </EnhancedTableCell>
                    <EnhancedTableCell align="left">
                      {row.bundle_config ? (
                        <CheckIcon sx={{ fontSize: 30 }} />
                      ) : (
                        <CloseIcon sx={{ fontSize: 30 }} />
                      )}
                    </EnhancedTableCell>
                    <EnhancedTableCell align="left">
                      {row.powerplantmatching_config ? (
                        <CheckIcon sx={{ fontSize: 30 }} />
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
