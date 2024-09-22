import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  Grid,
  TextField,
  Tooltip,
  IconButton,
  Table,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
import UpdateIcon from "@mui/icons-material/Update";
import DeleteIcon from "@mui/icons-material/Delete";
import UpdateAttorneyForm from "./UpdateAttorneyForm";
import DeleteConfirmationDialog from "../../components/DeleteConfirmationDialog";
import { useNavigate, useParams } from "react-router-dom";
import { DeleteAttorney, GetAttorney } from "../../apis/UserManagementAPI";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useDispatch } from "react-redux";
import { setLoading } from "../../store/loaderSlice";
import { GetCaseByAttorney } from "../../apis/CaseManagementAPI";
const ViewAttorney = () => {
  let { attorney_id } = useParams();
  const [attorneys, setAttorneys] = useState({});
  const [info, setInfo] = useState([]);
  const navigate = useNavigate();
  const [tooltipText, setTooltipText] = useState("Copy to clipboard");
  const dispatch = useDispatch();
  const [cases, setCases] = useState([]);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  useEffect(() => {
    dispatch(setLoading(true));
    const fetchData = async () => {
      try {
        // console.log("Fetching data for attorney_id: ", attorney_id);
        const response = await GetAttorney(attorney_id);
        const fetchedAttorney = response.data;
        // console.log("Fetched attorney: ", fetchedAttorney);

        setAttorneys(fetchedAttorney.data);
        dispatch(setLoading(false));
      } catch (error) {
        console.error("Error fetching data: ", error);
        dispatch(setLoading(false));
      }
    };

    fetchData();
  }, [attorney_id]);

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    setIsSuperAdmin(userRole === "super_admin");
  }, []);

  useEffect(() => {
    if (attorneys) {
      const updatedInfo = [
        {
          attorneyId: attorneys.attorney_id,
          firstName: attorneys.first_name,
          lastName: attorneys.last_name,
          username: attorneys.username,
          email: attorneys.email,
          phone: attorneys.contact_no,
          date: attorneys.dateCreated,
          status: attorneys.status,
          role: "Attorney",
          lawFirm: attorneys.lawFirm,
        },
      ];

      // console.log("Updated Info before setting state: ", updatedInfo);
      setInfo(updatedInfo);
    } else {
      // console.log("No attorney data received");
    }
  }, [attorneys]);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        // console.log("ATT: " , attorney_id)
        const response = await GetCaseByAttorney(attorney_id);
        // console.log("response: ", response.data.data)
        const relatedCases = response.data.data;
        // console.log("CASES: ", relatedCases)
        setCases(relatedCases);
      } catch (error) {
        console.error("Error fetching cases: ", error);
      }
    };

    fetchCases();
  }, []);

  const {
    attorneyId = "",
    firstName = "",
    lastName = "",
    username = "",
    email = "",
    phone = "",
    date = "",
    role = "",
    status = "",
    lawFirm = "",
  } = info[0] || {};

  const isActive = status === "Active";

  const profileStyles = {
    status: {
      backgroundColor: isActive ? "#EBF9F1" : "#FBE7E8",
      color: isActive ? "#1F9254" : "#A30D11",
      padding: "4px 8px",
      borderRadius: "4px",
      display: "inline-block",
      marginTop: "8px",
      fontWeight: "bold",
    },
    button: {
      textTransform: "none",
      fontWeight: "bold",
    },
    updateButton: {
      color: "#1F9254",
      border: "1px solid #1F9254",
      backgroundColor: "transparent",
    },
    deleteButton: {
      color: "#A30D11",
      border: "1px solid #A30D11",
      backgroundColor: "transparent",
    },
    textField: {
      marginBottom: "16px",
      "& .MuiInputBase-root": {
        backgroundColor: "#ACACAC29",
      },
      "& .MuiInputBase-input": {
        color: "#5D7285",
      },
    },
    grayOut: {
      color: "#9E9E9E",
    },
  };

  const handleOpenForm = () => {
    navigate(`/user-update/attorney/${attorney_id}`);
  };

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
      const response = await DeleteAttorney(attorney_id);
      // console.log("Attorney se Deleted successfully:");
      dispatch(setLoading(false));
      navigate("/users");
    } catch (error) {
      // console.log("An error occurred while deleting the attorney.", error);
      dispatch(setLoading(false));
    }
    handleCloseDeleteConfirmation();
  };

  const handleCopyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setTooltipText("Copied");
    // console.log(`Copied to clipboard: ${text}`);
    setTimeout(() => {
      setTooltipText("Copy to clipboard");
    }, 2000);
  };

  const getStatusStyle = (status) => {
    switch (status.toLowerCase()) {
      case "active":
        return { backgroundColor: "#EBF9F1", color: "#1F9254" };
      case "inactive":
        return { backgroundColor: "#FBE7E8", color: "#A30D11" };
      case "pending":
        return { backgroundColor: "#FEF2E5", color: "#CD6200" };
      case "completed":
        return { backgroundColor: "#E6F7FF", color: "#007BFF" };
      case "on hold":
        return { backgroundColor: "#FFFBEA", color: "#FFAA00" };
      default:
        return {};
    }
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <Box display="flex" p={2} gap={4}>
      <Box
        width="25%"
        display="flex"
        flexDirection="column"
        alignItems="flex-start"
        p={2}
      >
        <Avatar
          sx={{
            width: 100,
            height: 100,
            mb: 2,
            bgcolor: "#ACACAC",
            color: "#FFFFFF",
            fontSize: "2rem",
          }}
        >
          {getInitials(firstName, lastName)}
        </Avatar>
        <Typography variant="h6">{firstName + " " + lastName}</Typography>
        <Box display="flex" alignItems="center">
          <Typography variant="subtitle1" sx={{ mr: 1 }}>
            {attorneyId}
          </Typography>
          <Tooltip title={tooltipText}>
            <IconButton
              size="small"
              onClick={() => handleCopyToClipboard(attorneyId)}
            >
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>{" "}
        <Typography variant="body2" style={profileStyles.status}>
          {status}
        </Typography>
        <Typography
          variant="body2"
          sx={{ mt: 2, fontSize: 18, fontWeight: "bold" }}
        >
          {role}
        </Typography>
        <Button
          variant="outlined"
          startIcon={<UpdateIcon />}
          sx={{
            ...profileStyles.button,
            ...profileStyles.updateButton,
            mt: 2,
            alignSelf: "flex-start",
          }}
          onClick={() => handleOpenForm(role)}
        >
          Update Profile
        </Button>
        {isSuperAdmin && (
        <Button
          variant="outlined"
          startIcon={<DeleteIcon />}
          sx={{
            ...profileStyles.button,
            ...profileStyles.deleteButton,
            mt: 2,
            alignSelf: "flex-start",
          }}
          onClick={handleOpenDeleteConfirmation}
        >
          Delete Profile
        </Button>
        )}
      </Box>

      <Box width="75%" p={2}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{ marginBottom: 2, fontWeight: "bold" }}
                >
                  Personal Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography>First Name</Typography>
                    <TextField
                      value={firstName}
                      InputProps={{ readOnly: true }}
                      variant="outlined"
                      fullWidth
                      sx={profileStyles.textField}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>Last Name</Typography>
                    <TextField
                      value={lastName}
                      InputProps={{ readOnly: true }}
                      variant="outlined"
                      fullWidth
                      sx={profileStyles.textField}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>Email</Typography>
                    <TextField
                      value={email}
                      InputProps={{ readOnly: true }}
                      variant="outlined"
                      fullWidth
                      sx={profileStyles.textField}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>Phone Number</Typography>
                    <TextField
                      value={phone}
                      InputProps={{ readOnly: true }}
                      variant="outlined"
                      fullWidth
                      sx={profileStyles.textField}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>Username</Typography>
                    <TextField
                      value={username}
                      InputProps={{ readOnly: true }}
                      variant="outlined"
                      fullWidth
                      sx={profileStyles.textField}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>Law Firm</Typography>
                    <TextField
                      value={lawFirm}
                      InputProps={{ readOnly: true }}
                      variant="outlined"
                      fullWidth
                      sx={profileStyles.textField}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>Enrolled Date</Typography>
                    <TextField
                      value={date}
                      InputProps={{ readOnly: true }}
                      variant="outlined"
                      fullWidth
                      sx={profileStyles.textField}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>Status</Typography>
                    <TextField
                      value={status}
                      InputProps={{ readOnly: true }}
                      variant="outlined"
                      fullWidth
                      sx={profileStyles.textField}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <CardContent
                sx={{
                  maxHeight: "400px",
                  overflowY: "auto",
                  padding: "0",
                }}
              >
                <Typography variant="h6" sx={{ padding: "16px" }}>
                  Assigned Cases
                </Typography>
                {cases.length > 0 ? (
                  <Table
                    sx={{
                      borderCollapse: "separate",
                      borderSpacing: "0 16px",
                      width: "100%",
                      minWidth: "600px",
                    }}
                  >
                    <TableBody>
                      {cases.slice(0, 5).map((caseItem) => (
                        <TableRow
                          key={caseItem.case_id}
                          sx={{
                            backgroundColor: "#f0f0f0",
                            borderRadius: "4px",
                          }}
                        >
                          <TableCell
                            sx={{
                              fontSize: "16px",
                              padding: "8px",
                              border: "none",
                            }}
                          >
                            {caseItem.caseName}
                          </TableCell>
                          <TableCell
                            sx={{
                              fontSize: "16px",
                              padding: "8px",
                              border: "none",
                            }}
                          >
                            {caseItem.case_id}
                          </TableCell>
                          {/* <TableCell
                      sx={{
                        fontSize: '16px',
                        padding: '8px',
                        border: 'none', 
                      }}
                    >
                      {caseItem.status}
                    </TableCell> */}
                          <TableCell sx={{ fontWeight: "bold" }}>
                            <Box
                              sx={{
                                ...getStatusStyle(caseItem.status),
                                padding: "8px",
                                border: "none",
                                display: "inline-block",
                              }}
                            >
                              {caseItem.status}
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <Typography sx={{ padding: "16px" }}>
                    No assigned cases found.
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6">Status Details</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6">Assessed Claimants</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
      <DeleteConfirmationDialog
        open={openDeleteConfirmation}
        handleClose={handleCloseDeleteConfirmation}
        handleDelete={handleDelete}
      />
    </Box>
  );
};

export default ViewAttorney;
