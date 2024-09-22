import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Typography,
  Grid,
  MenuItem,
  Box,
  Autocomplete,
} from "@mui/material";
import { CreateAdmin } from "../../../apis/AdminManagementAPI";
import { useNavigate } from "react-router-dom";
import CheckCircleOutlineTwoToneIcon from "@mui/icons-material/CheckCircleOutlineTwoTone";
import DoDisturbAltTwoToneIcon from "@mui/icons-material/DoDisturbAltTwoTone";
import { useDispatch } from "react-redux";
import { setLoading } from "../../../store/loaderSlice";
import { getCompanyIdFromToken } from "../../../utils/auth";
import { GetAllCompanys } from "../../../apis/CompanyManagementAPI";
const AddAdminForm = () => {
  const navigate = useNavigate();
  const [updateStatus, setUpdateStatus] = useState("");
  const [companies, setCompanies] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const dispatch = useDispatch();
  const [formDisabled, setFormDisabled] = useState(false);
  const [downloadData, setDownloadData] = useState(null);
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await GetAllCompanys();
        if (response.data) {
          setCompanies(response.data);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchCompanies();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = {
      company_id: selectedCompanyId,
      first_name: event.target.firstName.value,
      last_name: event.target.lastName.value,
      username: event.target.username.value,
      email: event.target.email.value,
    };

    setUpdateStatus(""); 
    dispatch(setLoading(true));

    try {
      const response = await CreateAdmin(data);

      if (response && response.data) {
        // console.log("Admin added successfully:", response.data);
        setUpdateStatus("success");
        setFormDisabled(true);

        setDownloadData({
          username: response.data.username,
          password: response.data.password,
        });
        dispatch(setLoading(false));
      } else {
        setUpdateStatus("error");
        setTimeout(() => {
          dispatch(setLoading(false));
        }, 2000);
      }
    } catch (error) {
      console.error("Error adding admin:", error);
      console.error("ERR: " + error.response.data.message);
      if (error.response.data.message == "User Already Exists") {
        setUpdateStatus("userExists");
      } else {
        setUpdateStatus("error");
      }
      setTimeout(() => {
        dispatch(setLoading(false));
      }, 2000);
    } finally {
      // setTimeout(() => {
      //   dispatch(setLoading(false));
      // }, 2000);
    }
  };

  const handleDownload = () => {
    if (!downloadData) return;

    const username = `"${downloadData.username}"`;
    const password = `"${downloadData.password}"`;

    const csvContent = `data:text/csv;charset=utf-8,Username,Password\n${username},${password}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${username}_admin_credentials.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    navigate(`/admin`);
  };

  return (
    <>
      <Grid container justifyContent="space-between" alignItems="center" mb={2}>
        <Grid item>
          <Typography
            variant="h4"
            component="h1"
            sx={{ fontWeight: "bold", textAlign: "left", mb: 1 }}
          >
            Add New Admin
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{ color: "text.secondary", mb: 2 }}
          >
            Create a New Profile From Here
          </Typography>
        </Grid>
      </Grid>
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }} />

      <Grid container justifyContent="center" alignItems="center">
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoFocus
                margin="dense"
                id="firstName"
                label="First Name"
                type="text"
                fullWidth
                variant="outlined"
                disabled={formDisabled}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                id="lastName"
                label="Last Name"
                type="text"
                fullWidth
                variant="outlined"
                disabled={formDisabled}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                id="email"
                label="Email"
                type="text"
                fullWidth
                variant="outlined"
                disabled={formDisabled}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                id="username"
                label="Username"
                type="username"
                fullWidth
                variant="outlined"
                disabled={formDisabled}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                id="claimantId"
                options={companies.map((company) => company.company_id)}
                value={selectedCompanyId}
                onChange={(event, newValue) => {
                  setSelectedCompanyId(newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    name="companyId"
                    label="Company ID"
                    variant="outlined"
                    fullWidth
                    disabled={formDisabled}
                  />
                )}
                sx={{ mb: 3 }}
              />
            </Grid>
          </Grid>
          {!formDisabled && (
            <Button
              fullWidth
              type="submit"
              sx={{
                mt: 2,
                backgroundColor: "black",
                color: "white",
                borderRadius: 2,
                boxShadow: 1,
                "&:hover": {
                  backgroundColor: "grey.800",
                },
              }}
            >
              Add Admin
            </Button>
          )}
          {formDisabled && (
            <Button
              fullWidth
              onClick={handleDownload}
              sx={{
                mt: 2,
                backgroundColor: "blue",
                color: "white",
                borderRadius: 2,
                boxShadow: 1,
                "&:hover": {
                  backgroundColor: "darkblue",
                },
              }}
            >
              Download Credentials
            </Button>
          )}
          {updateStatus === "success" && (
            <Box
              sx={{
                mt: 2,
                p: 2,
                border: "1px dashed green",
                borderRadius: 1,
                display: "flex",
                alignItems: "center",
                color: "green",
              }}
            >
              <CheckCircleOutlineTwoToneIcon sx={{ mr: 1 }} />
              <Typography>Successfully Added</Typography>
            </Box>
          )}

          {updateStatus === "error" && (
            <Box
              sx={{
                mt: 2,
                p: 2,
                bgcolor: "#EB5757",
                borderRadius: 1,
                display: "flex",
                alignItems: "center",
                color: "white",
              }}
            >
              <DoDisturbAltTwoToneIcon sx={{ mr: 1 }} />
              <Typography>There is an Error in Adding this Profile</Typography>
            </Box>
          )}

          {updateStatus === "userExists" && (
            <Box
              sx={{
                mt: 2,
                p: 2,
                bgcolor: "#EB5757",
                borderRadius: 1,
                display: "flex",
                alignItems: "center",
                color: "white",
              }}
            >
              <DoDisturbAltTwoToneIcon sx={{ mr: 1 }} />
              <Typography>User Already Exists</Typography>
            </Box>
          )}
        </form>
      </Grid>
    </>
  );
};

export default AddAdminForm;
