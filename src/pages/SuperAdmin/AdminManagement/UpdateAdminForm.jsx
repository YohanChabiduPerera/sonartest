import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Typography,
  Grid,
  Box,
  MenuItem,
} from "@mui/material";
import { UpdateAdmin, GetSingleAdmin } from "../../../apis/AdminManagementAPI";
import { useNavigate, useParams } from "react-router-dom";
import CheckCircleOutlineTwoToneIcon from "@mui/icons-material/CheckCircleOutlineTwoTone";
import DoDisturbAltTwoToneIcon from "@mui/icons-material/DoDisturbAltTwoTone";
import { useDispatch } from "react-redux";
import { setLoading } from "../../../store/loaderSlice";
import { getCompanyIdFromToken } from "../../../utils/auth";

const UpdateAdminForm = () => {
  const [adminData, setAdminData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    status: ""
  });
  const [error, setError] = useState(null);
  const [updateStatus, setUpdateStatus] = useState(""); 
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { admin_id } = useParams(); 
  const statuses = ["Active", "Inactive"];

  useEffect(() => {
    const fetchAdminDetails = async () => {
      try {
        dispatch(setLoading(true));
        const response = await GetSingleAdmin(admin_id);
        const { first_name, last_name, username, email, status } = response.data;
        setAdminData({ first_name, last_name, username, email, status });
      } catch (error) {
        setError("Failed to load admin details.");
      } finally {
        dispatch(setLoading(false));
      }
    };
  
    fetchAdminDetails();
  }, [admin_id, dispatch]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setAdminData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setUpdateStatus("");
    dispatch(setLoading(true));
    // console.log("RES DATA: ", adminData);

    try {
      const response = await UpdateAdmin(admin_id, adminData);
      // console.log("Admin updated successfully:", response.data);
      setUpdateStatus("success");

      setTimeout(() => {
        dispatch(setLoading(false));
        navigate(`/admin`);
      }, 2000);
    } catch (error) {
      setUpdateStatus("error");
      setError("An error occurred while updating the admin.");

      setTimeout(() => {
        dispatch(setLoading(false));
      }, 2000);
    }
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
            Update Admin
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{ color: "text.secondary", mb: 2 }}
          >
            Edit the Admin Profile Information Below
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
                name="first_name"
                label="First Name"
                type="text"
                fullWidth
                variant="outlined"
                value={adminData.first_name}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                name="last_name"
                label="Last Name"
                type="text"
                fullWidth
                variant="outlined"
                value={adminData.last_name}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                name="email"
                label="Email"
                type="text"
                fullWidth
                variant="outlined"
                value={adminData.email}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                name="username"
                label="Username"
                type="text"
                fullWidth
                variant="outlined"
                value={adminData.username}
                onChange={handleInputChange}
                InputProps={{ readOnly: true }}
                sx={{
                  marginBottom: "16px",
                  "& .MuiInputBase-root": {
                    backgroundColor: "#ACACAC29",
                  },
                  "& .MuiInputBase-input": {
                    color: "#5D7285",
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                name="status"
                label="Status"
                select
                fullWidth
                variant="outlined"
                value={adminData.status}
                onChange={handleInputChange}
              >
                {statuses.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
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
            Update Admin
          </Button>
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
              <Typography>Successfully Updated</Typography>
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
              <Typography>There is an Error in Updating this Profile</Typography>
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

export default UpdateAdminForm;
