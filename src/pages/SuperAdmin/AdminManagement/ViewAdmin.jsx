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
} from "@mui/material";
import UpdateIcon from "@mui/icons-material/Update";
import DeleteIcon from "@mui/icons-material/Delete";
// import UpdateAdminForm from "./UpdateDocument";
import DeleteConfirmationDialog from "../../../components/DeleteConfirmationDialog";
import { useNavigate, useParams } from "react-router-dom";
import {
  DeleteAdmin,
  GetSingleAdmin,
} from "../../../apis/AdminManagementAPI";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useDispatch } from "react-redux";
import { setLoading } from "../../../store/loaderSlice";
const ViewAdmin = () => {
  let { admin_id } = useParams();
  const [admin, setAdmin] = useState({});
  const [info, setInfo] = useState([]);
  const navigate = useNavigate();
  const [tooltipText, setTooltipText] = useState("Copy to clipboard");
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setLoading(true));

    const fetchData = async () => {
      try {
        // console.log("Fetching data for admin_id: ", admin_id);
        const response = await GetSingleAdmin(admin_id);
        const fetchedAdmin = response.data;
        // console.log("Fetched admin: ", fetchedAdmin);

        setAdmin(fetchedAdmin);
        dispatch(setLoading(false));
      } catch (error) {
        console.error("Error fetching data: ", error);
        dispatch(setLoading(false));
      }
    };

    fetchData();
  }, [admin_id]);

  useEffect(() => {
    if (admin) {
      const updatedInfo = [
        {
          adminId: admin.admin_id,
          firstName: admin.first_name,
          lastName: admin.last_name,
          email: admin.email,
          username: admin.username,
          date: admin.dateCreated,
          status: admin.status,
          // type: admin.type,
          company_id: admin.company_id,
        },
      ];

      // console.log("Updated Info before setting state: ", updatedInfo);
      setInfo(updatedInfo);
    } else {
      // console.log("No admin data received");
    }
  }, [admin]);

  const {
    adminId = "",
    firstName = "",
    lastName = "",
    email = "",
    company_id = "",
    username = "",
    date = "",
    status = "",
    // type = "",
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
    navigate(`/admin/update/${admin_id}`);
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
      const response = await DeleteAdmin(admin_id);
      // console.log("Admin  Deleted successfully:");
      dispatch(setLoading(false));
      navigate("/admin")
    } catch (error) {
      // console.log("An error occurred while deleting the admin.", error);
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
    <Box display="flex" p={2} gap={4}>
      <Box
        width="25%"
        display="flex"
        flexDirection="column"
        alignItems="flex-start"
        p={2}
      >
        <Avatar
          alt="Profile Picture"
          src="/path/to/profile-picture.jpg"
          sx={{ width: 100, height: 100, mb: 2 }}
        />
        <Typography variant="h6">{firstName + " " + lastName}</Typography>
        <Box display="flex" alignItems="center">
          <Typography variant="subtitle1" sx={{ mr: 1 }}>
            {adminId}
          </Typography>
          <Tooltip title={tooltipText}>
            <IconButton
              size="small"
              onClick={() => handleCopyToClipboard(adminId)}
            >
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>{" "}
        <Typography variant="body2" style={profileStyles.status}>
          {status}
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
          onClick={() => handleOpenForm()}
        >
          Update Profile
        </Button>
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
      </Box>

      <Box width="75%" p={2}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6">Personal Information</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography>First Name</Typography>
                    <TextField
                      value={firstName}
                      InputProps={{
                        readOnly: true,
                      }}
                      variant="outlined"
                      fullWidth
                      sx={profileStyles.textField}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>Last Name</Typography>
                    <TextField
                      value={lastName}
                      InputProps={{
                        readOnly: true,
                      }}
                      variant="outlined"
                      fullWidth
                      sx={profileStyles.textField}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>Email</Typography>
                    <TextField
                      value={email}
                      InputProps={{
                        readOnly: true,
                      }}
                      variant="outlined"
                      fullWidth
                      sx={profileStyles.textField}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>Username</Typography>
                    <TextField
                      value={username}
                      InputProps={{
                        readOnly: true,
                      }}
                      variant="outlined"
                      fullWidth
                      sx={profileStyles.textField}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>Company ID</Typography>
                    <TextField
                      value={company_id}
                      InputProps={{
                        readOnly: true,
                      }}
                      variant="outlined"
                      fullWidth
                      sx={profileStyles.textField}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>Enrolled Date</Typography>
                    <TextField
                      value={formatDate(date)}
                      InputProps={{
                        readOnly: true,
                      }}
                      variant="outlined"
                      fullWidth
                      sx={profileStyles.textField}
                    />
                  </Grid>
                  {/* <Grid item xs={6}>
                    <Typography>Type</Typography>
                    <TextField
                      value={type}
                      InputProps={{
                        readOnly: true,
                      }}
                      variant="outlined"
                      fullWidth
                      sx={profileStyles.textField}
                    />
                  </Grid> */}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6">Assigned Cases</Typography>
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
                <Typography variant="h6">Assessed Plaiments</Typography>
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

export default ViewAdmin;
