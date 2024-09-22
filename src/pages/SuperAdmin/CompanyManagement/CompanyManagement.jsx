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
import "./CompanyManagement.css";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { DeleteCompany, GetAllCompanys } from "../../../apis/CompanyManagementAPI";
import { format } from "date-fns";
import DeleteConfirmationDialog from "../../../components/DeleteConfirmationDialog";
import { useDispatch } from "react-redux";
import { setLoading } from "../../../store/loaderSlice";

const CompanyManagement = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [selectAll, setSelectAll] = useState(false);
  const [selected, setSelected] = useState([]);
  const [rows, setRows] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setLoading(true));
    const fetchData = async () => {
      try {
        const response = await GetAllCompanys();
        // console.log("Response: ", response.data);
        setRows(response.data);
        dispatch(setLoading(false));
      } catch (error) {
        console.error("Error fetching companys:", error);
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

  const handleUpdate = () => {
    if (selectedRow) {
      navigate(`/company/update/${selectedRow.company_id}`);
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

      try {
        const response = await DeleteCompany(selectedRow.company_id);
        // console.log("Company Deleted successfully:");
      } catch (error) {
        // console.log("An error occurred while deleting the company.", error);
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
      const newSelected = rows.map((n) => n.company_id);
      setSelected(newSelected);
      setSelectAll(true);
    } else {
      setSelected([]);
      setSelectAll(false);
    }
  };

  const handleClick = (event, company_id) => {
    const selectedIndex = selected.indexOf(company_id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, company_id);
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

  const isSelected = (company_id) => selected.indexOf(company_id) !== -1;

  const handleAddClick = () => {
    navigate("/company");
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Active":
      case "active":
        return { backgroundColor: "#EBF9F1", color: "#1F9254" };
      case "Inactive":
      case "inactive":
        return { backgroundColor: "#FBE7E8", color: "#A30D11" };
      case "Pending":
      case "pending":
        return { backgroundColor: "#FEF2E5", color: "#CD6200" };
      default:
        return {};
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
        Company Management
      </Typography>
      <Typography variant="subtitle1" sx={{ color: "text.secondary", mb: 2 }}>
        Manage your companys
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
          Add new company
        </Button>
        {/* <TextField variant="outlined" placeholder="Search..." size="small" /> */}
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
                Company ID
              </TableCell>
              <TableCell
                sx={{ fontWeight: "bold", border: "none", color: "#B5B7C0" }}
              >
                Company Name
              </TableCell>
              <TableCell
                sx={{ fontWeight: "bold", border: "none", color: "#B5B7C0" }}
              >
                Enrolled Date
              </TableCell>

              {/* <TableCell
                sx={{ fontWeight: "bold", border: "none", color: "#B5B7C0" }}
              >
                Phone Number
              </TableCell>
              <TableCell
                sx={{ fontWeight: "bold", border: "none", color: "#B5B7C0" }}
              >
                Admin
              </TableCell> */}
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
                const isItemSelected = isSelected(row.company_id);
                return (
                  <>
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.company_id)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.company_id}
                      selected={isItemSelected}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{ "aria-labelledby": row.company_id }}
                        />
                      </TableCell>
                      <TableCell
                        component="th"
                        scope="row"
                        sx={{ fontWeight: "bold" }}
                      >
                        <Link
                          to={`/company/view/${row.company_id}`}
                          className="no-visited"
                        >
                          {row.company_id}
                        </Link>
                        {/* <Link to={`/view-company/${row.id}`} className="no-visited">{row.name}</Link> */}
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        {row.company_name}
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        {formatDate(row.dateCreated)}
                      </TableCell>
                      {/* <TableCell sx={{ fontWeight: "bold" }}>
                        {row.phone_no}
                      </TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        {row.admin}
                      </TableCell> */}
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
        <MenuItem onClick={handleOpenDeleteConfirmation}>
          <DeleteIcon style={{ marginRight: "8px" }} />
          Delete
        </MenuItem>
      </Menu>
      <DeleteConfirmationDialog
        open={openDeleteConfirmation}
        handleClose={handleCloseDeleteConfirmation}
        handleDelete={handleDelete}
      />
    </Box>
  );
};

export default CompanyManagement;
