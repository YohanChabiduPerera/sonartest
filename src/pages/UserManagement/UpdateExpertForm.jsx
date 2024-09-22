import React, { useState, useEffect } from "react";
import { TextField, Button, Typography, Grid, MenuItem, Box } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import {
  GetExpert,
  UpdateExpert,
} from "../../apis/UserManagementAPI";
import { useDispatch } from "react-redux";
import { setLoading } from "../../store/loaderSlice";
import CheckCircleOutlineTwoToneIcon from "@mui/icons-material/CheckCircleOutlineTwoTone";
import DoDisturbAltTwoToneIcon from "@mui/icons-material/DoDisturbAltTwoTone";

const UpdateExpertForm = () => {
  const { expert_id } = useParams();
  const navigate = useNavigate();

  const types = ["IP", "CP", "OT"];

  const [expertData, setExpertData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    contact_no: "",
    address: "",
    type: "",
    username: "",
  });

  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const [updateStatus, setUpdateStatus] = useState("");

  useEffect(() => {
    dispatch(setLoading(true));
    const fetchExpertData = async () => {
      try {
        const response = await GetExpert(expert_id);
        const expert = response.data.data;
        setExpertData(expert);
        dispatch(setLoading(false));
      } catch (error) {
        console.error("Error fetching expert data:", error);
        dispatch(setLoading(false));
      }
    };

    if (expert_id) {
      fetchExpertData();
    }
  }, [expert_id]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setExpertData((prevData) => ({
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
      const response = await UpdateExpert(expert_id, expertData);
      // console.log("Expert updated successfully:", response.data);
      setUpdateStatus("success");
  
      setTimeout(() => {
        dispatch(setLoading(false));
        navigate(`/user-view/expert/${expert_id}`);
      }, 2000);
  
    } catch (error) {
      setUpdateStatus("error");
      setError("An error occurred while updating the expert.");
  
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
            Update Expert
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{ color: "text.secondary", mb: 2 }}
          >
            Update the Expert's Profile From Here
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
                value={expertData.first_name}
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
                value={expertData.last_name}
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
                value={expertData.email}
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
                value={expertData.username}
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
                name="contact_no"
                label="Contact Number"
                type="text"
                fullWidth
                variant="outlined"
                value={expertData.contact_no}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                name="address"
                label="Address"
                type="text"
                fullWidth
                variant="outlined"
                value={expertData.address}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                name="type"
                label="Type"
                select
                fullWidth
                variant="outlined"
                value={expertData.type}
                onChange={handleChange}
              >
                {types.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
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
            Update Expert
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

export default UpdateExpertForm;
