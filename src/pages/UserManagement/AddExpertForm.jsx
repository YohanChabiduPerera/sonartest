import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Typography,
  Grid,
  MenuItem,
  Box,
} from "@mui/material";
import { AddExpert } from "../../apis/UserManagementAPI";
import { useNavigate } from "react-router-dom";
import CheckCircleOutlineTwoToneIcon from "@mui/icons-material/CheckCircleOutlineTwoTone";
import DoDisturbAltTwoToneIcon from "@mui/icons-material/DoDisturbAltTwoTone";
import { useDispatch } from "react-redux";
import { setLoading } from "../../store/loaderSlice";
import { getCompanyIdFromToken } from "../../utils/auth";
const AddExpertForm = () => {
  const types = ["IP", "CP", "OT"];

  const [type, setType] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [updateStatus, setUpdateStatus] = useState("");
  const handleTypeChange = (event) => {
    setType(event.target.value);
  };
  const dispatch = useDispatch();
  const [formDisabled, setFormDisabled] = useState(false);
  const [downloadData, setDownloadData] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = {
      company_id: getCompanyIdFromToken(),
      first_name: event.target.firstName.value,
      last_name: event.target.lastName.value,
      email: event.target.email.value,
      contact_no: event.target.contact.value,
      address: event.target.address.value,
      username: event.target.username.value,
      type,
    };

    setError(null);
    setUpdateStatus("");
    dispatch(setLoading(true));

    try {
      const response = await AddExpert(data);
      // console.log("Expert added successfully:", response.data);
      setUpdateStatus("success");
      setFormDisabled(true);
      setDownloadData({
        username: response.data.data.username,
        password: response.data.data.password,
      });
      dispatch(setLoading(false));
    } catch (error) {
      setUpdateStatus("error");
      setError("An error occurred while adding the expert.");
      setTimeout(() => {
        dispatch(setLoading(false));
      }, 2000);
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
    link.setAttribute("download", `${username}_expert_credentials.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    navigate(`/users`);
  };

  return (
    <>
      <Grid container justifyContent="space-between" alignItems="center" mb={0}>
        <Grid item>
          <Typography
            variant="h4"
            component="h1"
            sx={{ fontWeight: "bold", textAlign: "left", mb: 1 }}
          >
            Add New Expert
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
                required
                disabled={formDisabled}
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
                required
                disabled={formDisabled}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                id="email"
                label="Email"
                type="email"
                fullWidth
                variant="outlined"
                required
                disabled={formDisabled}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                id="username"
                label="Username"
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
                id="contact"
                label="Contact Number"
                type="text"
                fullWidth
                variant="outlined"
                required
                disabled={formDisabled}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                id="address"
                label="Address"
                type="text"
                fullWidth
                variant="outlined"
                required
                disabled={formDisabled}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                id="type"
                label="Type"
                select
                fullWidth
                variant="outlined"
                required
                value={type}
                onChange={handleTypeChange}
                disabled={formDisabled}
              >
                {types.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>
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
              Add Expert
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

          {error && (
            <Typography color="error" mt={2}>
              {error}
            </Typography>
          )}
        </form>
      </Grid>
    </>
  );
};

export default AddExpertForm;
