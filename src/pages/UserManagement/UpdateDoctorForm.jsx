import React, { useState, useEffect } from "react";
import { TextField, Button, Typography, Grid, MenuItem, Box } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { GetDoctor, UpdateDoctor } from "../../apis/UserManagementAPI";
import { useDispatch } from "react-redux";
import { setLoading } from "../../store/loaderSlice";
import CheckCircleOutlineTwoToneIcon from "@mui/icons-material/CheckCircleOutlineTwoTone";
import DoDisturbAltTwoToneIcon from "@mui/icons-material/DoDisturbAltTwoTone";

const UpdateDoctorForm = () => {
  const { doctor_id } = useParams();
  const navigate = useNavigate();
  const [updateStatus, setUpdateStatus] = useState("");

  const specializations = [
    "Cardiology",
    "Dermatologist",
    "Endocrinologist",
    "Gastroenterologist",
    "Hematologist",
    "Nephrologist",
    "Neurologist",
    "Oncologist",
    "Ophthalmologist",
    "Orthopedic Surgeon",
    "Otolaryngologist",
    "Pediatrician",
    "Psychiatrist",
    "Pulmonologist",
    "Radiologist",
    "Rheumatologist",
    "Urologist",
    "General Practitioner",
  ];

  const statuses = ["Active", "Inactive"];

  const [doctorData, setDoctorData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    specialization: "",
    address: "",
    contact_no: "",
    status: "",
    dateCreated: ""
  });

  const [error, setError] = useState(null);
  const dispatch = useDispatch();

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
    const fetchDoctorData = async () => {
      try {
        dispatch(setLoading(true));
        const response = await GetDoctor(doctor_id);
        const doctor = response.data.data;
        setDoctorData({
          ...doctor,
          dateCreated: formatDate(doctor.dateCreated),
        });
        dispatch(setLoading(false));
      } catch (error) {
        console.error("Error fetching doctor data:", error);
        dispatch(setLoading(false));
      }
    };

    if (doctor_id) {
      fetchDoctorData();
    }
  }, [doctor_id]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setDoctorData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setUpdateStatus("");
    dispatch(setLoading(true));
  
    try {
      const response = await UpdateDoctor(doctor_id, doctorData);
      // console.log("Doctor updated successfully:", response.data);
      setUpdateStatus("success");
  
      setTimeout(() => {
        dispatch(setLoading(false));
        navigate(`/user-view/doctor/${doctor_id}`);
      }, 2000);
  
    } catch (error) {
      setUpdateStatus("error");
      setError("An error occurred while updating the doctor.");
  
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
            Update Doctor
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{ color: "text.secondary", mb: 2 }}
          >
            Update the Doctor's Profile From Here
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
                name="doctor_id"
                label="Doctor ID"
                type="text"
                fullWidth
                variant="outlined"
                value={doctorData.doctor_id}
                disabled
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                name="company_id"
                label="Company ID"
                type="text"
                fullWidth
                variant="outlined"
                value={doctorData.company_id}
                disabled
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                autoFocus
                margin="dense"
                name="first_name"
                label="First Name"
                type="text"
                fullWidth
                variant="outlined"
                value={doctorData.first_name}
                onChange={handleChange}
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
                value={doctorData.last_name}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                name="email"
                label="Email"
                type="email"
                fullWidth
                variant="outlined"
                value={doctorData.email}
                onChange={handleChange}
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
                value={doctorData.status}
                onChange={handleChange}
              >
                {statuses.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                name="specialization"
                label="Specialization"
                select
                fullWidth
                variant="outlined"
                value={doctorData.specialization}
                onChange={handleChange}
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
                name="address"
                label="Address"
                type="text"
                fullWidth
                variant="outlined"
                value={doctorData.address}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                name="contact_no"
                label="Contact Number"
                type="text"
                fullWidth
                variant="outlined"
                value={doctorData.contact_no}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                name="date_created"
                label="Date Created"
                type="text"
                fullWidth
                variant="outlined"
                value={doctorData.dateCreated}
                disabled
                InputLabelProps={{ shrink: true }}
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
            Update Doctor
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

export default UpdateDoctorForm;
