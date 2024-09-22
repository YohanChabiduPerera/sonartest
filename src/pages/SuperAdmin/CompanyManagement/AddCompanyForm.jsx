import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Typography,
  Grid,
  Box,
  Autocomplete,
  MenuItem,
} from "@mui/material";
import { CreateCompany } from "../../../apis/CompanyManagementAPI";
import { useNavigate } from "react-router-dom";
import CheckCircleOutlineTwoToneIcon from "@mui/icons-material/CheckCircleOutlineTwoTone";
import DoDisturbAltTwoToneIcon from "@mui/icons-material/DoDisturbAltTwoTone";
import { useDispatch } from "react-redux";
import { setLoading } from "../../../store/loaderSlice";
import { getCompanyIdFromToken } from "../../../utils/auth";
import { GetAllAdmins } from "../../../apis/AdminManagementAPI";

const AddCompanyForm = () => {
  const [dateCreated, setDateCreated] = useState(null);
  const [error, setError] = useState(null);
  const [updateStatus, setUpdateStatus] = useState("");
  const statuses = ["Active", "Inactive", "Pending"];
  const [status, setStatus] = useState("");
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoBase64, setLogoBase64] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [admins, setAdmins] = useState([]);
  const [selectedAdminId, setSelectedAdminId] = useState(null);

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await GetAllAdmins();
        if (response.data) {
          // console.log(response.data);
          setAdmins(response.data);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchAdmins();
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setLogoPreview(URL.createObjectURL(file));

      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoBase64(reader.result.split(",")[1]); 
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("company_name", event.target.companyName.value);
    formData.append("address", event.target.address.value);
    // formData.append("dateCreated", dateCreated);
    // formData.append("admin_id", selectedAdminId);
    formData.append("status", status)
    formData.append("img_type", "png");
    if (logoBase64) {
      formData.append("img_blob", logoBase64); 
    }

    setError(null);
    setUpdateStatus("");
    dispatch(setLoading(true));
    // console.log("T: " + JSON.stringify(formData));

    for (let [key, value] of formData.entries()) {
      // console.log(key + ": " + value);
    }

    try {
      const response = await CreateCompany(formData); 
      // console.log("Company added successfully:", response.data);
      setUpdateStatus("success");

      setTimeout(() => {
        dispatch(setLoading(false));
        navigate(`/company`);
      }, 2000);
    } catch (error) {
      setUpdateStatus("error");
      setError("An error occurred while adding the company.");

      setTimeout(() => {
        dispatch(setLoading(false));
      }, 2000);
    }
  };

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
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
            Add New Company
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
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoFocus
                margin="dense"
                id="companyName"
                label="Company Name"
                type="text"
                fullWidth
                variant="outlined"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Enrolled Date"
                type="date"
                margin="dense"
                InputLabelProps={{ shrink: true }}
                value={dateCreated}
                onChange={(e) => setDateCreated(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              {/* <Autocomplete
                id="adminId"
                options={admins.map((admin) => admin.admin_id)}
                value={selectedAdminId}
                onChange={(event, newValue) => {
                  setSelectedAdminId(newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    name="adminId"
                    label="Admin ID"
                    variant="outlined"
                    fullWidth
                    sx={{ marginTop: 1 }}
                  />
                )}
                sx={{ mb: 2 }}
              /> */}
              <TextField
                margin="dense"
                id="status"
                label="Status"
                select
                fullWidth
                variant="outlined"
                value={status}
                required
                onChange={handleStatusChange}
              >
                {statuses.map((lang) => (
                  <MenuItem key={lang} value={lang}>
                    {lang}
                  </MenuItem>
                ))}
              </TextField>
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
              />
            </Grid>
            <Grid item xs={12}>
              <input
                accept="image/*"
                id="company-logo-upload"
                type="file"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              <label htmlFor="company-logo-upload">
                <Button variant="contained" component="span" sx={{ mt: 2 }}>
                  Upload Company Logo
                </Button>
              </label>
              {logoPreview && (
                <Box mt={2}>
                  <img
                    src={logoPreview}
                    alt="Company Logo Preview"
                    style={{ width: 100, height: 100, objectFit: "cover" }}
                  />
                </Box>
              )}
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
            Add Company
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

export default AddCompanyForm;
