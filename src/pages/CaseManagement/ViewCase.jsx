import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Paper,
  IconButton,
  Avatar,
  FormControlLabel,
  Checkbox,
  TablePagination,
  MenuItem,
  Menu,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import NoteAddOutlinedIcon from "@mui/icons-material/NoteAddOutlined";
import DeleteConfirmationDialog from "../../components/DeleteConfirmationDialog";
import { DeleteCase, GetSingleCase } from "../../apis/CaseManagementAPI";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  DeleteDocument,
  GetDocuments,
  GetDocumentsByCase,
  GetSingleDocument,
} from "../../apis/DocumentManagement";
import { useDispatch } from "react-redux";
import { setLoading } from "../../store/loaderSlice";

const ViewCase = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(3);
  const [selectAll, setSelectAll] = useState(false);
  const [selected, setSelected] = useState([]);
  let { case_id } = useParams();
  const [cases, setCases] = useState({});
  const [rows, setRows] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  useEffect(() => {
    dispatch(setLoading(true));
    const fetchData = async () => {
      try {
        // console.log("Fetching data for case_id: ", case_id);
        const response = await GetSingleCase(case_id);
        const fetchedCase = response.data;
        console.log("Fetched case: ", fetchedCase);

        setCases(fetchedCase.data);
        dispatch(setLoading(false));
      } catch (error) {
        console.error("Error fetching data: ", error);
        dispatch(setLoading(false));
      }
    };

    const fetchDocData = async () => {
      try {
        const data = await GetDocumentsByCase(case_id);
        setRows(data.data.data);
        // console.log("Docs: ", data);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
    fetchDocData();
  }, [case_id]);

  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
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

  const handleUpdateRow = () => {
    if (selectedRow) {
      navigate(`/document/update/${selectedRow.doc_id}`);
      handleMenuClose();
    }
  };

  const handleDeleteRow = async (event) => {
    dispatch(setLoading(true));
    if (selectedRow) {
      // console.log("Delete", selectedRow);
      event.preventDefault();

      try {
        const response = await DeleteDocument(selectedRow.doc_id);
        dispatch(setLoading(false));
        // console.log("Document Deleted successfully:");
      } catch (error) {
        dispatch(setLoading(false));
        // console.log("An error occurred while deleting the document.", error);
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

  const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false);

  const handleOpenDeleteConfirmation = () => {
    setOpenDeleteConfirmation(true);
  };

  const handleCloseDeleteConfirmation = () => {
    setOpenDeleteConfirmation(false);
  };

  const handleDelete = async (event) => {
    event.preventDefault();
    dispatch(setLoading(true));
    try {
      const response = await DeleteCase(case_id);
      handleCloseDeleteConfirmation();
      handleMenuClose();
      dispatch(setLoading(false));
      navigate("/case");
      // console.log("Document Deleted successfully:");
    } catch (error) {
      // console.log("An error occurred while deleting the document.", error);
      handleCloseDeleteConfirmation();
      handleMenuClose();
      dispatch(setLoading(false));
    } finally {
    }
  };

  const handleUpdate = (event) => {
    event.preventDefault();
    navigate(`/case/update/${case_id}`);
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

  const handleAddClick = () => {
    navigate(`/document/add/${case_id}`);
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

  const handleUserClick = (userType, userId) => {
    navigate(`/user-view/${userType}/${userId}`);
  };

  const renderPersonnel = (personnel, type) => (
    <Box
      sx={{
        flex: 1,
        p: 2,
        overflowY: "auto",
        borderRight: 1,
        borderColor: "divider",
      }}
    >
      <Typography variant="h6" sx={{ mb: 2, textAlign: "center" }}>
        Assigned {type}
      </Typography>
      {personnel &&
        personnel.map((person) => (
          <Box
            key={person.id}
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 1,
              cursor: "pointer",
            }}
            onClick={() => handleUserClick(type.toLowerCase(), person.id)}
          >
            <Avatar sx={{ mr: 1 }}>{person.name.substring(0, 2)}</Avatar>
            <Typography sx={{ "&:hover": { color: "#39C7AD" } }}>
              {person.name}
            </Typography>
          </Box>
        ))}
    </Box>
  );

  return (
    <>
      <Box sx={{ p: 3 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{ fontWeight: "bold", textAlign: "left", mb: 1 }}
        >
          Case Details
        </Typography>
        {/* <Typography variant="subtitle1" sx={{ color: "text.secondary", mb: 2 }}>
          {cases.caseName}
        </Typography> */}
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }} />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1,
            backgroundColor: "#39C7AD",
            padding: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" sx={{ color: "white", mr: 2 }}>
              More information required
            </Typography>
            <Box
              sx={{
                ...getStatusStyle(cases.status),
                px: 1,
                py: 0.5,
                borderRadius: 1,
                display: "inline-block",
              }}
            >
              {cases.status}
            </Box>
          </Box>
          <Box>
            <Typography
              variant="subtitle1"
              component="span"
              sx={{ mr: 2, color: "white" }}
            >
              Case ID: {cases.case_id}
            </Typography>
            <IconButton
              size="small"
              sx={{ color: "white" }}
              onClick={handleUpdate}
            >
              <EditIcon />
            </IconButton>
            {isSuperAdmin && (
              <IconButton
                size="small"
                sx={{ color: "white" }}
                onClick={handleOpenDeleteConfirmation}
              >
                <DeleteIcon />
              </IconButton>
            )}
          </Box>
        </Box>

        <Paper sx={{ display: "flex", height: 400, overflow: "hidden" }}>
          <Box
            sx={{
              flex: 1,
              p: 2,
              overflowY: "auto",
              borderRight: 1,
              borderColor: "divider",
            }}
          >
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ color: "grey" }}>
                Case Name
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                {cases.caseName}
              </Typography>
              <Box sx={{ borderBottom: 1, borderColor: "divider", mt: 0.1 }} />
            </Box>

            <Box
              sx={{ mb: 2, display: "flex", justifyContent: "space-between" }}
            >
              <Box sx={{ flex: 1, mr: 1 }}>
                <Typography variant="body2" sx={{ color: "grey" }}>
                  Claimant Name
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                  {cases.claimant_name}
                </Typography>
                <Box
                  sx={{ borderBottom: 1, borderColor: "divider", mt: 0.1 }}
                />
              </Box>
              <Box sx={{ flex: 1, ml: 1 }}>
                <Typography variant="body2" sx={{ color: "grey" }}>
                  Claimant ID
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: "bold",
                    cursor: "pointer",
                    "&:hover": { color: "#39C7AD" },
                  }}
                  onClick={() => handleUserClick("claimant", cases.claimant_id)}
                >
                  {cases.claimant_id}
                </Typography>
                <Box
                  sx={{ borderBottom: 1, borderColor: "divider", mt: 0.1 }}
                />
              </Box>
            </Box>

            <Box
              sx={{ mb: 2, display: "flex", justifyContent: "space-between" }}
            >
              <Box sx={{ flex: 1, mr: 1 }}>
                <Typography variant="body2" sx={{ color: "grey" }}>
                  Start Date
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                  {formatDate(cases.dateCreated)}
                </Typography>
                <Box
                  sx={{ borderBottom: 1, borderColor: "divider", mt: 0.1 }}
                />
              </Box>
              <Box sx={{ flex: 1, ml: 1 }}>
                <Typography variant="body2" sx={{ color: "grey" }}>
                  End Date
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                  {cases.estimated_end_date}
                </Typography>
                <Box
                  sx={{ borderBottom: 1, borderColor: "divider", mt: 0.1 }}
                />
              </Box>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ color: "grey" }}>
                Description
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                {cases.description}
              </Typography>
              <Box sx={{ borderBottom: 1, borderColor: "divider", mt: 0.1 }} />
            </Box>
          </Box>
            {renderPersonnel(cases.doctors, "Doctor")}
            {renderPersonnel(cases.attorneys, "Attorney")}
            {renderPersonnel(cases.experts, "Expert")}
        </Paper>
      </Box>
      <Box sx={{ p: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
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
                <NoteAddOutlinedIcon sx={{ color: "white" }} />
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
            Add new document
          </Button>
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
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{ fontWeight: "bold", border: "none", color: "#B5B7C0" }}
                ></TableCell>
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
          <MenuItem onClick={handleUpdateRow}>
            <EditIcon style={{ marginRight: "8px" }} />
            Update
          </MenuItem>
          {isSuperAdmin && (
          <MenuItem onClick={handleDeleteRow}>
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
    </>
  );
};

export default ViewCase;
