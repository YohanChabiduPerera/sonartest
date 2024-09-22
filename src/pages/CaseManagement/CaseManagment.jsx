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
  Button,
  TextField,
  TablePagination,
  FormControlLabel,
} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import AddIcon from "@mui/icons-material/Add";
import { Link, useNavigate } from "react-router-dom";
import "./CaseManagement.css";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { DeleteCase, GetAllCases, SearchCase } from "../../apis/CaseManagementAPI";
import { format } from "date-fns";
import DeleteConfirmationDialog from "../../components/DeleteConfirmationDialog";
import { useDispatch } from "react-redux";
import { setLoading } from "../../store/loaderSlice";

const CaseManagement = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [selectAll, setSelectAll] = useState(false);
  const [selected, setSelected] = useState([]);
  const [rows, setRows] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

    const fetchData = async () => {
      dispatch(setLoading(true));
      try {
        const response = await GetAllCases();
        // console.log("Response: ", response);
        setRows(response);
        dispatch(setLoading(false));
      } catch (error) {
        console.error("Error fetching cases:", error);
        dispatch(setLoading(false));
      }
    };

  useEffect(() => {
    fetchData();
  }, [])

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    setIsSuperAdmin(userRole === "super_admin");
  }, []);


  const handleMenuOpen = (event, row) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const handleUpdate = () => {
    if (selectedRow) {
      navigate(`/case/update/${selectedRow.case_id}`);
      handleMenuClose();
    }
  };

  const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false);

  const handleOpenDeleteConfirmation = () => {
    setOpenDeleteConfirmation(true);
  };

  const handleCloseDeleteConfirmation = () => {
    setOpenDeleteConfirmation(false);
  };

  const handleDelete = async (event) => {
    if (selectedRow) {
      // console.log("Delete", selectedRow);
      event.preventDefault();
      dispatch(setLoading(true));
      try {
        const response = await DeleteCase(selectedRow.case_id);
        // console.log("Case Deleted successfully:");
        dispatch(setLoading(false));
      } catch (error) {
        // console.log("An error occurred while deleting the case.", error);
        fetchCases();
        window.location.reload();
        dispatch(setLoading(false));
      } finally {
      }

      handleCloseDeleteConfirmation();
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

  const handleAddClick = () => {
    navigate("/case/add");
  };

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

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async (search = "") => {
    dispatch(setLoading(true));
    try {
      let response;
      if (search) {
        response = await SearchCase(search);
      } else {
        response = await GetAllCases();
      }
      // console.log("Response: ", response);
      setRows(search ? response.data.data : response);
      dispatch(setLoading(false));
    } catch (error) {
      console.error("Error fetching cases:", error);
      dispatch(setLoading(false));
    }
  };

  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    if (value.length >= 3) {
      fetchCases(value);
    } else if (value.length === 0) {
      fetchCases();
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      console.error("Invalid date:", dateString);
      return "Invalid Date";
    }

    return date.toISOString().split("T")[0];
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h4"
        component="h1"
        sx={{ fontWeight: "bold", textAlign: "left", mb: 1 }}
      >
        Case Management
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
        <Button
          variant="contained"
          startIcon={
            <IconButton
              sx={{
                color: "white",
                backgroundColor: "white",
                borderRadius: "50%",
                p: 0.5,
                mr: 1,
              }}
              disabled
            >
              <AddIcon sx={{ color: "white" }} />
            </IconButton>
          }
          sx={{
            backgroundColor: "#39C7AD",
            color: "white",
            "&:hover": {
              backgroundColor: "#2ea78a",
            },
            borderRadius: 8,
          }}
          onClick={handleAddClick}
        >
          Add new case
        </Button>
        <TextField
          variant="outlined"
          placeholder="Search..."
          size="small"
          value={searchTerm}
          onChange={handleSearch}
        />{" "}
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
                Claimant Name
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
                          to={`/case/view/${row.case_id}`}
                          className="no-visited"
                        >
                          {row.case_id}
                        </Link>
                        {/* <Link to={`/view-case/${row.id}`} className="no-visited">{row.name}</Link> */}
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        {row.caseName}
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        {row.claimant_name}
                      </TableCell>

                      <TableCell sx={{ fontWeight: "bold" }}>
                        {formatDate(row.dateCreated)}
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
        <MenuItem onClick={handleUpdate}>
          <EditIcon style={{ marginRight: "8px" }} />
          Update
        </MenuItem>
        {isSuperAdmin && (

        <MenuItem onClick={handleOpenDeleteConfirmation}>
          <DeleteIcon style={{ marginRight: "8px" }} />
          Delete
        </MenuItem>
        )}
      </Menu>
      <DeleteConfirmationDialog
        open={openDeleteConfirmation}
        handleClose={handleCloseDeleteConfirmation}
        handleDelete={handleDelete}
      />
    </Box>
  );
};

export default CaseManagement;
