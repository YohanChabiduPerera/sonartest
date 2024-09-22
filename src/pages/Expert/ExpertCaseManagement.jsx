import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  TablePagination,
  FormControlLabel,
} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Link, useNavigate } from "react-router-dom";
import "./ExpertCaseManagement.css";
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
  GetCaseByExpert,
} from "../../apis/CaseManagementAPI";
import { format } from "date-fns";
import { useDispatch } from "react-redux";
import { setLoading } from "../../store/loaderSlice";
import { getUserIdFromToken } from "../../utils/auth";

const AdminCaseManagement = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [selectAll, setSelectAll] = useState(false);
  const [selected, setSelected] = useState([]);
  const [rows, setRows] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const expert_id = getUserIdFromToken();

  useEffect(() => {
    dispatch(setLoading(true));
    const fetchData = async () => {
      try {
        const response = await GetCaseByExpert(expert_id);
        // console.log("Response: ", response.data.data);
        setRows(response.data.data);
        dispatch(setLoading(false));
      } catch (error) {
        console.error("Error fetching cases:", error);
        dispatch(setLoading(false));
      }
    };

    fetchData();
  }, []);

  const handleMenuOpen = (event, row) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const handleView = () => {
    if (selectedRow) {
      navigate(`/expert/case/view/${selectedRow.case_id}`);
      handleMenuClose();
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.case_id);
      setSelected(newSelected);
      setSelectAll(true);
    } else {
      setSelected([]);
      setSelectAll(false);
    }
  };

  const handleClick = (event, case_id) => {
    const selectedIndex = selected.indexOf(case_id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, case_id);
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
    setSelectAll(newSelected.length === rows.length);
  };

  const isSelected = (case_id) => selected.indexOf(case_id) !== -1;

  const getStatusStyle = (status) => {
    switch (status) {
      case "Active":
      case "active":
        return { backgroundColor: "#EBF9F1", color: "#1F9254" };
      case "Completed":
      case "completed":
        return { backgroundColor: "#FBE7E8", color: "#A30D11" };
      default:
        return {};
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h4"
        component="h1"
        sx={{ fontWeight: "bold", textAlign: "left", mb: 1 }}
      >
        My Cases
      </Typography>
      <Typography variant="subtitle1" sx={{ color: "text.secondary", mb: 2 }}>
        Manage your cases
      </Typography>
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 8 }} />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 3,
          ml: 2,
        }}
      >
        <Box />
        <TextField variant="outlined" placeholder="Search..." size="small" />
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          ml: 2,
        }}
      >
        <FormControlLabel
          control={
            <Checkbox checked={selectAll} onChange={handleSelectAllClick} />
          }
          label="Select All"
        />
        <TablePagination
          component="div"
          count={rows.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
      <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  indeterminate={
                    selected.length > 0 && selected.length < rows.length
                  }
                  checked={selectAll}
                  onChange={handleSelectAllClick}
                />
              </TableCell>
              <TableCell
                sx={{ fontWeight: "bold", border: "none", color: "#B5B7C0" }}
              >
                Case ID
              </TableCell>
              <TableCell
                sx={{ fontWeight: "bold", border: "none", color: "#B5B7C0" }}
              >
                Name
              </TableCell>
              <TableCell
                sx={{ fontWeight: "bold", border: "none", color: "#B5B7C0" }}
              >
                Claimant ID
              </TableCell>

              <TableCell
                sx={{ fontWeight: "bold", border: "none", color: "#B5B7C0" }}
              >
                Start Date
              </TableCell>
              <TableCell
                sx={{ fontWeight: "bold", border: "none", color: "#B5B7C0" }}
              >
                End Date
              </TableCell>
              <TableCell
                sx={{ fontWeight: "bold", border: "none", color: "#B5B7C0" }}
              >
                Status
              </TableCell>
              <TableCell sx={{ width: 50, border: "none" }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                const isItemSelected = isSelected(row.case_id);
                return (
                  <>
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.case_id)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.case_id}
                      selected={isItemSelected}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{ "aria-labelledby": row.case_id }}
                        />
                      </TableCell>
                      <TableCell
                        component="th"
                        scope="row"
                        sx={{ fontWeight: "bold" }}
                      >
                        <Link
                          to={`/expert/case/view/${row.case_id}`}
                          className="no-visited"
                        >
                          {row.case_id}
                        </Link>
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        {row.caseName}
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        {row.claimant_id}
                      </TableCell>

                      <TableCell sx={{ fontWeight: "bold" }}>
                        {format(new Date(row.dateCreated), "dd/MM/yyyy")}
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        {row.estimated_end_date}
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        <Box
                          sx={{
                            ...getStatusStyle(row.status),
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                            display: "inline-block",
                          }}
                        >
                          {row.status}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <IconButton onClick={(e) => handleMenuOpen(e, row)}>
                          <MoreHorizIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  </>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleView}>
          <VisibilityIcon style={{ marginRight: "8px" }} />
          View
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default AdminCaseManagement;
