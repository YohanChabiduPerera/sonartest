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
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { DeleteDocument, GetDocuments, SearchDocument } from "../../apis/DocumentManagement";
import { format, parseJSON } from "date-fns";
import { GetAllUsers } from "../../apis/UserManagementAPI";
import axios from "axios";
import DeleteConfirmationDialog from "../../components/DeleteConfirmationDialog";
import { useDispatch } from "react-redux";
import { setLoading } from "../../store/loaderSlice";

const DocumentManagement = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [selectAll, setSelectAll] = useState(false);
  const [selected, setSelected] = useState([]);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  const [rows, setRows] = useState([]);
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = async () => {
    dispatch(setLoading(true));
    try {
      const data = await GetDocuments();
      setRows(data.data);
      dispatch(setLoading(false));
      // console.log("fetchData" + data.data);
    } catch (error) {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    setIsSuperAdmin(userRole === "super_admin");
  }, []);

  const navigate = useNavigate();

  const handleAddClick = () => {
    navigate("/document/add");
  };

  const handleMenuOpen = (event, row) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false);

  const handleOpenDeleteConfirmation = () => {
    setOpenDeleteConfirmation(true);
  };

  const handleCloseDeleteConfirmation = () => {
    setOpenDeleteConfirmation(false);
  };

  const handleUpdate = () => {
    if (selectedRow) {
      navigate(`/document/update/${selectedRow.doc_id}`);
      handleMenuClose();
    }
  };

  const handleDelete = async (event) => {
    dispatch(setLoading(true));
    if (selectedRow) {
      // console.log("Delete", selectedRow);
      event.preventDefault();

      try {
        const response = await DeleteDocument(selectedRow.doc_id);
        // console.log("Document Deleted successfully:");
        dispatch(setLoading(false));
        window.location.reload();
      } catch (error) {
        // console.log("An error occurred while deleting the document.", error);
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
      const newSelected = rows.map((n) => n.id);
      setSelected(newSelected);
      setSelectAll(true);
    } else {
      setSelected([]);
      setSelectAll(false);
    }
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
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

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const formatDate = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      console.error("Invalid date:", dateString);
      return "Invalid Date";
    }

    return date.toISOString().split("T")[0];
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async (search = "") => {
    dispatch(setLoading(true));
    try {
      let response;
      if (search) {
        response = await SearchDocument(search);
        // console.log("Search Response: ", response.data);

      } else {
        response = await GetDocuments();
        // console.log("Normal Response: ", response.data);
      }
      // console.log("Response: ", response.data);
      setRows(search ? response.data.data : response.data);
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
      fetchDocuments(value);
    } else if (value.length === 0) {
      fetchDocuments();
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h4"
        component="h1"
        sx={{ fontWeight: "bold", textAlign: "left", mb: 1 }}
      >
        Document Management
      </Typography>
      <Typography variant="subtitle1" sx={{ color: "text.secondary", mb: 2 }}>
        Manage your documents
      </Typography>
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 8 }} />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 4,
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
            ml: 2,
          }}
          onClick={handleAddClick}
        >
          Add new document
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
                Document ID
              </TableCell>
              <TableCell
                sx={{ fontWeight: "bold", border: "none", color: "#B5B7C0" }}
              >
                Document Name
              </TableCell>
              <TableCell
                sx={{ fontWeight: "bold", border: "none", color: "#B5B7C0" }}
              >
                Case ID
              </TableCell>
              <TableCell
                sx={{ fontWeight: "bold", border: "none", color: "#B5B7C0" }}
              >
                Claimant ID
              </TableCell>
              <TableCell
                sx={{ fontWeight: "bold", border: "none", color: "#B5B7C0" }}
              >
                Type
              </TableCell>
              <TableCell
                sx={{ fontWeight: "bold", border: "none", color: "#B5B7C0" }}
              >
                Date
              </TableCell>
              <TableCell sx={{ width: 50, border: "none" }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                const isItemSelected = isSelected(row.doc_id);
                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, row.doc_id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.doc_id}
                    selected={isItemSelected}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{ "aria-labelledby": row.doc_id }}
                      />
                    </TableCell>
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{ fontWeight: "bold" }}
                    >
                      <Link
                        to={`/document/view/${row.doc_id}`}
                        className="no-visited"
                      >
                        {row.doc_id}
                      </Link>
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      {row.name}
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      {row.case_id}
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      {row.claimant_id}
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      {row.type}
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      {formatDate(row.dateCreated)}
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={(e) => handleMenuOpen(e, row)}>
                        <MoreHorizIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
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

export default DocumentManagement;
