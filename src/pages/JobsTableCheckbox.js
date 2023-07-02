import * as React from "react";
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
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

const headCells = [
  {
    id: "name",
    label: "Job Name",
  },
  {
    id: "config",
    label: "config",
  },
  {
    id: "bundle_config",
    label: "bundle_config",
  },
  {
    id: "powerplantmatching_config",
    label: "powerplantmatching_config",
  },
];

function EnhancedTableHead(props) {
  return (
    <TableHead sx={{ borderBottom: "1px solid gray" }}>
      <TableRow>
        <EnhancedTableCell padding="checkbox"></EnhancedTableCell>
        {headCells.map((headCell) => (
          <EnhancedTableCell
            key={headCell.id}
            align={"left"}
            padding={"normal"}
          >
            {headCell.label}
          </EnhancedTableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

function EnhancedTableCell(props) {
  return (
    <TableCell sx={{ color: "white" }} {...props}>
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
                    hover
                    onClick={(event) => handleClick(event, row.name)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.name}
                    selected={isItemSelected}
                    sx={{
                      cursor: "pointer",
                      borderBottom: "1px solid darkgray",
                    }}
                  >
                    <EnhancedTableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{
                          "aria-labelledby": labelId,
                        }}
                      />
                    </EnhancedTableCell>
                    <EnhancedTableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                    >
                      {row.name}
                    </EnhancedTableCell>
                    <EnhancedTableCell align="right">
                      {row.config ? <p>yes</p> : <p>no</p>}
                    </EnhancedTableCell>
                    <EnhancedTableCell align="right">
                      {row.bundle_config ? <p>yes</p> : <p>no</p>}
                    </EnhancedTableCell>
                    <EnhancedTableCell align="right">
                      {row.powerplantmatching_config ? <p>yes</p> : <p>no</p>}
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
