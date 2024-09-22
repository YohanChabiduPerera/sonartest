import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Typography,
  Grid,
  MenuItem,
  Box,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { GetClaimant, UpdateClaimant } from "../../apis/UserManagementAPI";
import { useDispatch } from "react-redux";
import { setLoading } from "../../store/loaderSlice";
import CheckCircleOutlineTwoToneIcon from "@mui/icons-material/CheckCircleOutlineTwoTone";
import DoDisturbAltTwoToneIcon from "@mui/icons-material/DoDisturbAltTwoTone";

const UpdateClaimantForm = () => {
  const { claimant_id } = useParams();
  const navigate = useNavigate();

  const maritalStatuses = ["Single", "Married", "Divorced", "Widowed"];
  const statuses = ["Active", "Inactive"];

  const [claimantData, setClaimantData] = useState({
    first_name: "",
    last_name: "",
    contact_no: "",
    email: "",
    NIC: "",
    address: "",
    marital_status: "",
    occupation: "",
    status: "",

    dob: "",
    gender: "",
    nationality: "",
    language: "",
    accident_date: "",
    consultation_date: "",
    age_at_accident: "",
    guardian_data: [],
  });

  const [error, setError] = useState(null);
  const [updateStatus, setUpdateStatus] = useState("");
  const dispatch = useDispatch();
  const [isMinor, setIsMinor] = useState(false);

  useEffect(() => {
    dispatch(setLoading(true));
    const fetchClaimantData = async () => {
      try {
        const response = await GetClaimant(claimant_id);
        const claimant = response.data.data;
        setClaimantData(claimant);
        console.log("age_at_accident", claimantData.age_at_accident)
        setIsMinor(claimantData.age_at_accident < 18 ? true : false);
        console.log("isMinor", isMinor)
        console.log("claimantData.guardian_data.length", claimantData.guardian_data.length)
        console.log("claimantData.guardian_data", claimantData.guardian_data)
        dispatch(setLoading(false));
      } catch (error) {
        console.error("Error fetching claimant data:", error);
        dispatch(setLoading(false));
      }
    };

    if (claimant_id) {
      fetchClaimantData();
    }
  }, [claimant_id, dispatch]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setClaimantData((prevData) => ({
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
      const dataToSubmit = {
        first_name: claimantData.first_name,
        last_name: claimantData.last_name,
        contact_no: claimantData.contact_no,
        email: claimantData.email,
        NIC: claimantData.NIC,
        address: claimantData.address,
        status: claimantData.status
      };

      const response = await UpdateClaimant(claimant_id, dataToSubmit);
      setUpdateStatus("success");

      setTimeout(() => {
        dispatch(setLoading(false));
        navigate(`/user-view/claimant/${claimant_id}`);
      }, 2000);
    } catch (error) {
      setUpdateStatus("error");
      setError("An error occurred while updating the claimant.");

      setTimeout(() => {
        dispatch(setLoading(false));
      }, 2000);
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
            Update Claimant
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{ color: "text.secondary", mb: 2 }}
          >
            Update the Claimant's Profile From Here
          </Typography>
        </Grid>
      </Grid>
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }} />
      <Grid container justifyContent="center" alignItems="center">
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                name="first_name"
                label="First Name"
                type="text"
                fullWidth
                variant="outlined"
                value={claimantData.first_name}
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
                value={claimantData.last_name}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                name="dob"
                label="Date of Birth"
                type="date"
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                value={claimantData.dob}
                disabled
                // sx={{
                //   "& .MuiInputBase-input.Mui-disabled": {
                //     WebkitTextFillColor: "#000000",
                //   },
                //   "& .MuiInputLabel-root.Mui-disabled": {
                //     color: "rgba(0, 0, 0, 0.6)",
                //   },
                // }}
              />
            </Grid>
            {/* Guardian Data Fields */}
            {claimantData.guardian_data &&
              claimantData.guardian_data.length > 0 && (
                <>
                  <Grid item xs={12}>
                    <Typography variant="h6">
                      Parent/Guardian Information
                    </Typography>
                  </Grid>
                  {claimantData.guardian_data.map((guardian, index) => (
                    <React.Fragment key={index}>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          margin="dense"
                          label={`Guardian Type`}
                          fullWidth
                          variant="outlined"
                          value={guardian.guardian_type || ""}
                          disabled
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          margin="dense"
                          label={`Guardian Name`}
                          fullWidth
                          variant="outlined"
                          value={guardian.guardian_name || ""}
                          disabled
                        />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          margin="dense"
                          label={`Guardian Contact Number`}
                          fullWidth
                          variant="outlined"
                          value={guardian.guardian_contact || ""}
                          disabled
                        />
                      </Grid>
                    </React.Fragment>
                  ))}
                </>
              )}
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                name="email"
                label="Email"
                type="email"
                fullWidth
                variant="outlined"
                value={claimantData.email}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                name="gender"
                label="Gender"
                fullWidth
                variant="outlined"
                value={claimantData.gender}
                disabled
                // sx={{
                //   "& .MuiInputBase-input.Mui-disabled": {
                //     WebkitTextFillColor: "#000000",
                //   },
                //   "& .MuiInputLabel-root.Mui-disabled": {
                //     color: "rgba(0, 0, 0, 0.6)",
                //   },
                // }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                name="nationality"
                label="Nationality"
                type="text"
                fullWidth
                variant="outlined"
                value={claimantData.nationality}
                disabled
                // sx={{
                //   "& .MuiInputBase-input.Mui-disabled": {
                //     WebkitTextFillColor: "#000000",
                //   },
                //   "& .MuiInputLabel-root.Mui-disabled": {
                //     color: "rgba(0, 0, 0, 0.6)",
                //   },
                // }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                name="NIC"
                label="NIC"
                type="text"
                fullWidth
                variant="outlined"
                value={claimantData.NIC}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                name="marital_status"
                label="Marital Status"
                select
                fullWidth
                variant="outlined"
                value={claimantData.marital_status}
                onChange={handleChange}
                disabled
                // sx={{
                //   "& .MuiInputBase-input.Mui-disabled": {
                //     WebkitTextFillColor: "#000000",
                //   },
                //   "& .MuiInputLabel-root.Mui-disabled": {
                //     color: "rgba(0, 0, 0, 0.6)",
                //   },
                // }}
              >
                {maritalStatuses.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                name="occupation"
                label="Occupation"
                type="text"
                fullWidth
                variant="outlined"
                value={claimantData.occupation}
                onChange={handleChange}
                disabled
                // sx={{
                //   "& .MuiInputBase-input.Mui-disabled": {
                //     WebkitTextFillColor: "#000000",
                //   },
                //   "& .MuiInputLabel-root.Mui-disabled": {
                //     color: "rgba(0, 0, 0, 0.6)",
                //   },
                // }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                name="language"
                label="Language"
                fullWidth
                variant="outlined"
                value={claimantData.language}
                disabled
                // sx={{
                //   "& .MuiInputBase-input.Mui-disabled": {
                //     WebkitTextFillColor: "#000000",
                //   },
                //   "& .MuiInputLabel-root.Mui-disabled": {
                //     color: "rgba(0, 0, 0, 0.6)",
                //   },
                // }}
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
                value={claimantData.address}
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
                value={claimantData.contact_no}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                name="accident_date"
                label="Accident Date"
                type="date"
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                value={claimantData.accident_date}
                disabled
                // sx={{
                //   "& .MuiInputBase-input.Mui-disabled": {
                //     WebkitTextFillColor: "#000000",
                //   },
                //   "& .MuiInputLabel-root.Mui-disabled": {
                //     color: "rgba(0, 0, 0, 0.6)",
                //   },
                // }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                name="age_at_accident"
                label="Age at Accident"
                type="number"
                fullWidth
                variant="outlined"
                value={claimantData.age_at_accident}
                InputLabelProps={{ shrink: true }}
                disabled
                // sx={{
                //   "& .MuiInputBase-input.Mui-disabled": {
                //     WebkitTextFillColor: "#000000",
                //   },
                //   "& .MuiInputLabel-root.Mui-disabled": {
                //     color: "rgba(0, 0, 0, 0.6)",
                //   },
                // }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                name="consultation_date"
                label="Consultation Date"
                type="date"
                fullWidth
                variant="outlined"
                value={claimantData.consultation_date}
                InputLabelProps={{ shrink: true }}
                disabled
                // sx={{
                //   "& .MuiInputBase-input.Mui-disabled": {
                //     WebkitTextFillColor: "#000000",
                //   },
                //   "& .MuiInputLabel-root.Mui-disabled": {
                //     color: "rgba(0, 0, 0, 0.6)",
                //   },
                // }}
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
                value={claimantData.status}
                onChange={handleChange}
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
            Update Claimant
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
              <Typography>
                There is an Error in Updating this Profile
              </Typography>
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

export default UpdateClaimantForm;
