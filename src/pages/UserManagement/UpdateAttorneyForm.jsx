import React, { useState, useEffect } from "react";
import { TextField, Button, Typography, Grid, Alert, Box, MenuItem } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { GetAttorney, UpdateAttorney } from "../../apis/UserManagementAPI";
import { useDispatch } from "react-redux";
import { setLoading } from "../../store/loaderSlice";
import CheckCircleOutlineTwoToneIcon from "@mui/icons-material/CheckCircleOutlineTwoTone";
import DoDisturbAltTwoToneIcon from "@mui/icons-material/DoDisturbAltTwoTone";

const UpdateAttorneyForm = () => {
  const { attorney_id } = useParams();
  const navigate = useNavigate();
  const [updateStatus, setUpdateStatus] = useState(""); 

  const [attorneyData, setAttorneyData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    lawFirm: "",
    username: "",
  });

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const statuses = ["Active", "Inactive"];
  const [status, setStatus] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setLoading(true));
    const fetchAttorneyData = async () => {
      try {
        const response = await GetAttorney(attorney_id);
        const attorney = response.data.data;
        setAttorneyData(attorney);
        dispatch(setLoading(false));
      } catch (error) {
        console.error("Error fetching attorney data:", error);
        dispatch(setLoading(false));
      }
    };

    if (attorney_id) {
      fetchAttorneyData();
    }
  }, [attorney_id]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (password && confirmPassword && password !== confirmPassword) {
        setError("Passwords do not match.");
      } else {
        setError("");
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [password, confirmPassword]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setAttorneyData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlePasswordChange = (event) => {
    const { id, value } = event.target;
    if (id === "password") {
      setPassword(value);
    } else if (id === "confirmPassword") {
      setConfirmPassword(value);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
  
    setError(null);
    setUpdateStatus("");
    dispatch(setLoading(true));
  
    try {
      const dataToUpdate = {
        ...attorneyData,
        password: password ? password : undefined,
      };
      const response = await UpdateAttorney(attorney_id, dataToUpdate);
      // console.log("Attorney updated successfully:", response.data);
      setUpdateStatus("success");
  
      setTimeout(() => {
        dispatch(setLoading(false));
        navigate(`/user-view/attorney/${attorney_id}`);
      }, 2000);
  
    } catch (error) {
      setUpdateStatus("error");
      setError("An error occurred while updating the attorney.");
  
      setTimeout(() => {
        dispatch(setLoading(false));
      }, 2000);
  
    } finally {
    }
  };
  
  const handleStatusChange = (event) => {
    setStatus(event.target.value);
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
            Update Attorney
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{ color: "text.secondary", mb: 2 }}
          >
            Update the Attorney's Profile From Here
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
                value={attorneyData.first_name}
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
                value={attorneyData.last_name}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                name="lawFirm"
                label="Law Firm"
                type="text"
                fullWidth
                variant="outlined"
                value={attorneyData.lawFirm}
                onChange={handleChange}
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
                value={attorneyData.username}
                onChange={handleChange}
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
                name="email"
                label="Email"
                type="email"
                fullWidth
                variant="outlined"
                value={attorneyData.email}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
            <TextField
              margin="dense"
              id="status"
              label="Status"
              select
              fullWidth
              variant="outlined"
              value={attorneyData.status}
              onChange={handleStatusChange}
            >
              {statuses.map((lang) => (
                <MenuItem key={lang} value={lang}>
                  {lang}
                </MenuItem>
              ))}
            </TextField>
            </Grid>

            {/* <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                id="password"
                label="New Password"
                type="password"
                fullWidth
                variant="outlined"
                value={password}
                onChange={handlePasswordChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                id="confirmPassword"
                label="Confirm New Password"
                type="password"
                fullWidth
                variant="outlined"
                value={confirmPassword}
                onChange={handlePasswordChange}
              />
            </Grid> */}
            {error && (
              <Grid item xs={12}>
                <Alert severity="error">{error}</Alert>
              </Grid>
            )}
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
            Update Attorney
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
        </form>
      </Grid>
    </>
  );
};

export default UpdateAttorneyForm;