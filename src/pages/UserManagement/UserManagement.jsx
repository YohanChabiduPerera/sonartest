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
  Tabs,
  Tab,
  Card,
  CardContent,
  Divider,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import PersonAddAltRoundedIcon from "@mui/icons-material/PersonAddAltRounded";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import Person2OutlinedIcon from "@mui/icons-material/Person2Outlined";
import Person3OutlinedIcon from "@mui/icons-material/Person3Outlined";
import Person4OutlinedIcon from "@mui/icons-material/Person4Outlined";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  DeleteAttorney,
  DeleteDoctor,
  DeleteClaimant,
  DeleteExpert,
  GetAllUsers,
} from "../../apis/UserManagementAPI";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import DeleteConfirmationDialog from "../../components/DeleteConfirmationDialog";
import { useDispatch } from "react-redux";
import { setLoading } from "../../store/loaderSlice";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

const UserManagement = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectAll, setSelectAll] = useState(false);
  const [selected, setSelected] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchType, setSearchType] = useState("name");
  const [searchInput, setSearchInput] = useState("");
  const [tooltipText, setTooltipText] = useState("Copy to clipboard");
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  const columns = {
    Claimants: [
      "Claimant ID",
      "Claimant Name",
      "NIC",
      "Email",
      "Date Created",
      "Status",
    ],
    Doctors: [
      "Doctor ID",
      "Doctor Name",
      "Specialization",
      "Email",
      "Date Created",
      "Status",
    ],
    Attorneys: [
      "Attorney ID",
      "Attorney Name",
      "Law Firm",
      "Email",
      "Date Created",
      "Status",
    ],
    Experts: [
      "Expert ID",
      "Expert Name",
      "Type",
      "Email",
      "Date Created",
      "Status",
    ],
  };

  const tabLabels = ["Claimants", "Attorneys", "Doctors", "Experts"];
  const buttonLabels = [
    "Add new claimant",
    "Add new attorney",
    "Add new doctor",
    "Add new expert",
  ];

  const [rows, setRows] = useState({
    data: { doctors: [], attorneys: [], claimants: [], experts: [] },
  });

  const fetchData = async () => {
    setIsLoading(true);
    dispatch(setLoading(true));
    try {
      const response = await GetAllUsers();
      if (response.data.code === 0) {
        setRows({ data: response.data.data });
        // console.log("Data refreshed: ", response.data.data);
      } else {
        console.error("Error fetching data:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    setIsSuperAdmin(userRole === "super_admin");
  }, []);

  const handleMenuOpen = (event, row) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
    // console.log("Selected Row:", row);
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
    // console.log("Selected Row in handleUpdate:", selectedRow);
    if (!selectedRow) {
      console.error("No row selected for update");
      return;
    }

    const role = tabLabels[tabValue].toLowerCase().slice(0, -1);
    let path;
    let id;

    switch (role) {
      case "claimant":
        id = selectedRow.claimant_id;
        path = `/user-update/claimant/${id}`;
        break;
      case "attorney":
        id = selectedRow.attorney_id;
        path = `/user-update/attorney/${id}`;
        break;
      case "expert":
        id = selectedRow.expert_id;
        path = `/user-update/expert/${id}`;
        break;
      case "doctor":
        id = selectedRow.doctor_id;
        path = `/user-update/doctor/${id}`;
        break;
      default:
        console.error("Unknown role");
        return;
    }

    if (id) {
      // console.log(`Navigating to ${path} for ${role} update`);
      navigate(path);
      handleMenuClose();
    } else {
      console.error(`ID not found for selected ${role}`);
    }
  };

  const handleDelete = async () => {
    // console.log("Selected Row in handleDelete:", selectedRow);
    if (!selectedRow) {
      console.error("No row selected for deletion");
      return;
    }

    let response;
    const userType = tabLabels[tabValue].toLowerCase().slice(0, -1);
    let id;

    switch (userType) {
      case "doctor":
        id = selectedRow.doctor_id;
        break;
      case "claimant":
        id = selectedRow.claimant_id;
        break;
      case "attorney":
        id = selectedRow.attorney_id;
        break;
      case "expert":
        id = selectedRow.expert_id;
        break;
      default:
        console.error("Invalid user type");
        return;
    }

    // console.log(`Attempting to delete ${userType} with ID:`, id);

    if (!id) {
      console.error(`ID not found for selected ${userType}`);
      return;
    }

    try {
      let response;
      switch (userType) {
        case "doctor":
          response = await DeleteDoctor(id);
          break;
        case "claimant":
          response = await DeleteClaimant(id);
          break;
        case "attorney":
          response = await DeleteAttorney(id);
          break;
        case "expert":
          response = await DeleteExpert(id);
          break;
      }
      // console.log("Delete response:", response);

      if (response.data && response.data.code === 0) {
        // console.log("Deletion successful, refreshing data...");
      } else {
        console.error("Deletion failed:", response.data.message);
      }
    } catch (error) {
      console.error("Error during deletion:", error);
    }
    await fetchData();
    handleCloseDeleteConfirmation();
    handleMenuClose();
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
      const newSelected = filteredRows().map((n) => n.id);
      setSelected(newSelected);
      setSelectAll(true);
    } else {
      setSelected([]);
      setSelectAll(false);
    }
  };

  const handleClick = (event, id) => {
    event.stopPropagation();
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
    setSelectAll(newSelected.length === filteredRows().length);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setPage(0);
  };

  const filteredRows = () => {
    if (!rows.data) return [];

    const role = tabLabels[tabValue];
    const roleKey = role.toLowerCase();
    const allRows = rows.data[roleKey] || [];

    return allRows.filter((row) => {
      const lowercasedSearchInput = searchInput.toLowerCase();

      if (searchType === "name") {
        return (
          row.first_name.toLowerCase().includes(lowercasedSearchInput) ||
          row.last_name.toLowerCase().includes(lowercasedSearchInput) ||
          (
            row.first_name.toLowerCase() +
            " " +
            row.last_name.toLowerCase()
          ).includes(lowercasedSearchInput)
        );
      } else if (searchType === "NIC") {
        if (roleKey === "claimants" && row.NIC) {
          return row.NIC.toLowerCase().includes(lowercasedSearchInput);
        }
        return true;
      }
      return true;
    });
  };

  const countByRole = (role) => {
    const roleKey = role.toLowerCase();
    return rows.data && rows.data[roleKey] ? rows.data[roleKey].length : 0;
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

  const handleCopyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setTooltipText("Copied");
    // console.log(`Copied to clipboard: ${text}`);
    setTimeout(() => {
      setTooltipText("Copy to clipboard");
    }, 2000);
  };

  const renderTableCell = (row, column) => {
    console.log("NIC", row.NIC)

    switch (column) {
      case "Claimant ID":
        let pat_id = row.claimant_id;
        return (
          <>
            <span
              onClick={() => handleIDClick(row)}
              style={{ cursor: "pointer", color: "#" }}
            >
              {pat_id || "N/A"}
            </span>
            <Tooltip title={tooltipText}>
              <IconButton
                size="small"
                onClick={() => handleCopyToClipboard(pat_id)}
              >
                <ContentCopyIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </>
        );
      case "Attorney ID":
        let att_id = row.attorney_id;
        return (
          <>
            <span
              onClick={() => handleIDClick(row)}
              style={{ cursor: "pointer", color: "#" }}
            >
              {att_id || "N/A"}
            </span>
            <Tooltip title={tooltipText}>
              <IconButton
                size="small"
                onClick={() => handleCopyToClipboard(att_id)}
              >
                <ContentCopyIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </>
        );
      case "Doctor ID":
        let doc_id =
          row.claimant_id || row.attorney_id || row.expert_id || row.doctor_id;
        return (
          <>
            <span
              onClick={() => handleIDClick(row)}
              style={{ cursor: "pointer", color: "#" }}
            >
              {doc_id || "N/A"}
            </span>
            <Tooltip title={tooltipText}>
              <IconButton
                size="small"
                onClick={() => handleCopyToClipboard(doc_id)}
              >
                <ContentCopyIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </>
        );
      case "Expert ID":
        let pro_id =
          row.claimant_id || row.attorney_id || row.expert_id || row.doctor_id;
        return (
          <>
            <span
              onClick={() => handleIDClick(row)}
              style={{ cursor: "pointer", color: "#" }}
            >
              {pro_id || "N/A"}
            </span>
            <Tooltip title={tooltipText}>
              <IconButton
                size="small"
                onClick={() => handleCopyToClipboard(pro_id)}
              >
                <ContentCopyIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </>
        );
      case "Claimant Name":
        return `${row.first_name} ${row.last_name}`;
      case "Attorney Name":
        return `${row.first_name} ${row.last_name}`;
      case "Doctor Name":
        return `${row.first_name} ${row.last_name}`;
      case "Expert Name":
        return `${row.first_name} ${row.last_name}`;
      case "Law Firm":
        return row.lawFirm || "N/A";
      case "NIC":
        return row.NIC ? row.NIC : "-"
      case "Specialization":
      case "Type":
        return row[column.toLowerCase()] || "N/A";
      case "Email":
        return row.email || "N/A";
      case "Date Created":
        return row.dateCreated ? formatDate(row.dateCreated) : "N/A";
      case "Status":
        return (
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
        );
      default:
        return "N/A";
    }
  };

  const [isLoading, setIsLoading] = useState(true);

  const handleOpenForm = (pro) => {
    const job = pro.toLowerCase().slice(0, -1);
    navigate(`/user-add/${job}`);
  };

  const handleIDClick = (row) => {
    const role = tabLabels[tabValue].toLowerCase().slice(0, -1);
    let path;
    switch (role) {
      case "claimant":
        path = `/user-view/claimant/${row.claimant_id}`;
        break;
      case "attorney":
        path = `/user-view/attorney/${row.attorney_id}`;
        break;
      case "expert":
        path = `/user-view/expert/${row.expert_id}`;
        break;
      case "doctor":
        path = `/user-view/doctor/${row.doctor_id}`;
        break;
      default:
        console.error("Unknown role");
        return;
    }
    navigate(path);
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Active":
      case "active":
        return { backgroundColor: "#EBF9F1", color: "#1F9254" };
      case "Inactive":
      case "inactive":
        return { backgroundColor: "#FBE7E8", color: "#A30D11" };
      default:
        return {};
    }
  };

  const handleSearchInputChange = (event) => {
    setSearchInput(event.target.value);
    setPage(0);
  };

  const handleSearchTypeChange = (event) => {
    setSearchType(event.target.value);
    setSearchInput("");
    setPage(0);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h4"
        component="h1"
        sx={{ fontWeight: "bold", textAlign: "left", mb: 1 }}
      >
        Users
      </Typography>
      <Typography variant="subtitle1" sx={{ color: "text.secondary", mb: 2 }}>
        Find and Manage All Platform Users Here
      </Typography>
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }} />
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ display: "flex", justifyContent: "space-around" }}>
          {tabLabels.map((label, index) => (
            <React.Fragment key={label}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "50%",
                    backgroundColor: "#EFFFF6",
                    mr: 2,
                  }}
                >
                  {index === 0 && (
                    <PersonOutlineOutlinedIcon
                      sx={{ fontSize: 40, color: "#39C7AD" }}
                    />
                  )}
                  {index === 1 && (
                    <Person2OutlinedIcon
                      sx={{ fontSize: 40, color: "#39C7AD" }}
                    />
                  )}
                  {index === 2 && (
                    <Person3OutlinedIcon
                      sx={{ fontSize: 40, color: "#39C7AD" }}
                    />
                  )}
                  {index === 3 && (
                    <Person4OutlinedIcon
                      sx={{ fontSize: 40, color: "#39C7AD" }}
                    />
                  )}
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                  <Typography variant="subtitle2">{label}</Typography>
                  <Typography variant="h4">{countByRole(label)}</Typography>
                </Box>
              </Box>
              {index < tabLabels.length - 1 && (
                <Divider orientation="vertical" flexItem />
              )}
            </React.Fragment>
          ))}
        </CardContent>
      </Card>

      <TablePagination
        component="div"
        count={filteredRows().length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ mr: 2 }}
        >
          {tabLabels.map((label, index) => (
            <Tab key={index} label={label} />
          ))}
        </Tabs>
        <Box display="flex" gap={2}>
          <TextField
            select
            label="Search by"
            value={searchType}
            onChange={handleSearchTypeChange}
            variant="outlined"
            size="small"
          >
            <MenuItem value="name">Name</MenuItem>
            <MenuItem
              value="NIC"
              disabled={tabLabels[tabValue].toLowerCase() !== "claimants"}
            >
              NIC
            </MenuItem>
          </TextField>
          <TextField
            label={`Search by ${searchType === "name" ? "Name" : "NIC"}`}
            variant="outlined"
            value={searchInput}
            onChange={handleSearchInputChange}
            size="small"
          />
        </Box>
      </Box>
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
              <PersonAddAltRoundedIcon sx={{ color: "white" }} />
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
          onClick={() => handleOpenForm(tabLabels[tabValue])}
        >
          {buttonLabels[tabValue]}
        </Button>
      </Box>
      <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={
                    selected.length > 0 &&
                    selected.length < filteredRows().length
                  }
                  checked={selectAll}
                  onChange={handleSelectAllClick}
                  color="primary"
                />
              </TableCell>
              {columns[tabLabels[tabValue]] &&
                columns[tabLabels[tabValue]].map((column) => (
                  <TableCell
                    key={column}
                    align="left"
                    sx={{
                      fontWeight: "bold",
                      border: "none",
                      color: "#B5B7C0",
                    }}
                  >
                    {column}
                  </TableCell>
                ))}
              {/* <TableCell align="right"></TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows()
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                const isItemSelected = isSelected(row.id);
                return (
                  <TableRow
                    hover
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id}
                    selected={isItemSelected}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isItemSelected}
                        inputProps={{ "aria-labelledby": row.id }}
                        onClick={(event) => handleClick(event, row.id)}
                      />
                    </TableCell>
                    {columns[tabLabels[tabValue]] &&
                      columns[tabLabels[tabValue]].map((column) => (
                        <TableCell
                          key={column}
                          sx={{ fontWeight: "bold" }}
                          onClick={(e) =>
                            column === "User Name" && e.stopPropagation()
                          }
                        >
                          {renderTableCell(row, column)}
                        </TableCell>
                      ))}
                    <TableCell>
                      <IconButton
                        onClick={(event) => handleMenuOpen(event, row)}
                      >
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
        <MenuItem onClick={() => handleUpdate(selectedRow)}>
          <EditIcon style={{ marginRight: "8px" }} />
          Edit
        </MenuItem>
        {isSuperAdmin && (
          <MenuItem onClick={() => handleOpenDeleteConfirmation(selectedRow)}>
            <DeleteIcon style={{ marginRight: "8px" }} />
            Delete
          </MenuItem>
        )}
      </Menu>
      <DeleteConfirmationDialog
        open={openDeleteConfirmation}
        handleClose={handleCloseDeleteConfirmation}
        handleDelete={() => handleDelete(selectedRow)}
      />
    </Box>
  );
};

export default UserManagement;
