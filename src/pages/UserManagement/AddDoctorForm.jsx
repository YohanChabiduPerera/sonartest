import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Grid,
  MenuItem,
  IconButton,
  Box,
} from "@mui/material";
import { AddDoctor } from "../../apis/UserManagementAPI";
import { useNavigate } from "react-router-dom";
import CheckCircleOutlineTwoToneIcon from "@mui/icons-material/CheckCircleOutlineTwoTone";
import DoDisturbAltTwoToneIcon from "@mui/icons-material/DoDisturbAltTwoTone";
import { useDispatch } from "react-redux";
import { setLoading } from "../../store/loaderSlice";
import { getCompanyIdFromToken } from "../../utils/auth";
const AddDoctorForm = () => {
  const specializations = [
    "Cardiologist",
    "Dermatologist",
    "Endocrinologist",
    "Gastroenterologist",
    "Hematologist",
    "Nephrologist",
    "Neurologist",
    "Oncologist",
    "Ophthalmologist",
    "Orthopaedic Surgeon",
    "Otolaryngologist",
    "Paediatrician",
    "Psychiatrist",
    "Pulmonologist",
    "Radiologist",
    "Rheumatologist",
    "Urologist",
    "General Practitioner",
  ];

  const [specialization, setSpecialization] = useState("");
  const [formData, setFormData] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [updateStatus, setUpdateStatus] = useState("");
  const dispatch = useDispatch();

  const handleSpecializationChange = (event) => {
    setSpecialization(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = {
      first_name: event.target.firstName.value,
      last_name: event.target.lastName.value,
      email: event.target.email.value,
      specialization,
      address: event.target.address.value,
      contact_no: event.target.contact.value,
      company_id: getCompanyIdFromToken(),
    };

    setError(null);
    setUpdateStatus("");
    dispatch(setLoading(true));

    try {
      const response = await AddDoctor(data);
      // console.log("Doctor added successfully:", response.data);
      setUpdateStatus("success");

      setTimeout(() => {
        dispatch(setLoading(false));
        navigate(`/users`);
      }, 2000);
    } catch (error) {
      setUpdateStatus("error");
      setError("An error occurred while adding the doctor.");

      setTimeout(() => {
        dispatch(setLoading(false));
      }, 2000);
    } finally {
    }
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
            Add New Doctor
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
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                id="specialization"
                label="Specialization"
                select
                fullWidth
                variant="outlined"
                value={specialization}
                onChange={handleSpecializationChange}
              >
                {specializations.map((specialization) => (
                  <MenuItem key={specialization} value={specialization}>
                    {specialization}
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
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                id="contact"
                label="Contact Number"
                type="text"
                fullWidth
                variant="outlined"
                required
              />
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
            Add Doctor
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

export default AddDoctorForm;
