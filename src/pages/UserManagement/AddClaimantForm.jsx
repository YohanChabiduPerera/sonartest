import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Typography,
  Grid,
  MenuItem,
  Box,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { AddClaimant } from "../../apis/UserManagementAPI";
import { useNavigate } from "react-router-dom";
import CheckCircleOutlineTwoToneIcon from "@mui/icons-material/CheckCircleOutlineTwoTone";
import DoDisturbAltTwoToneIcon from "@mui/icons-material/DoDisturbAltTwoTone";
import { useDispatch } from "react-redux";
import { setLoading } from "../../store/loaderSlice";
import { getCompanyIdFromToken } from "../../utils/auth";
const AddClaimantForm = () => {
  const genders = ["Male", "Female"];
  const maritalStatuses = ["Single", "Married", "Divorced", "Widowed"];
  const languages = ["English", "Spanish", "French", "German"];

  const [gender, setGender] = useState("");
  const [maritalStatus, setMaritalStatus] = useState("");
  const [language, setLanguage] = useState("");
  const [dob, setDob] = useState("");
  const [accidentDate, setAccidentDate] = useState("");
  const [ageAtAccident, setAgeAtAccident] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [updateStatus, setUpdateStatus] = useState("");
  const dispatch = useDispatch();
  const [isMinor, setIsMinor] = useState(false);
  const [guardian1Type, setGuardian1Type] = useState("");
  const [guardian1Name, setGuardian1Name] = useState("");
  const [guardian1Contact, setGuardian1Contact] = useState("");
  const [guardian2Type, setGuardian2Type] = useState("");
  const [guardian2Name, setGuardian2Name] = useState("");
  const [guardian2Contact, setGuardian2Contact] = useState("");
  const [includeSecondGuardian, setIncludeSecondGuardian] = useState(false);

  const guardianTypes = ["Mother", "Father", "Guardian"];

  useEffect(() => {
    if (dob) {
      const age = calculateAge(dob);
      setIsMinor(age < 18);
      if (age < 18) {
        setMaritalStatus("");
        // Clear NIC and occupation fields if you have state for them
      } else {
        // Reset guardian fields when not a minor
        setGuardian1Type("");
        setGuardian1Name("");
        setGuardian1Contact("");
        setGuardian2Type("");
        setGuardian2Name("");
        setGuardian2Contact("");
        setIncludeSecondGuardian(false);
      }
    }
  }, [dob]);

  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDifference = today.getMonth() - birth.getMonth();
    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }
    return age;
  };

  const handleGuardian1TypeChange = (event) => {
    setGuardian1Type(event.target.value);
  };

  const handleGuardian2TypeChange = (event) => {
    setGuardian2Type(event.target.value);
  };

  const handleIncludeSecondGuardianChange = (event) => {
    setIncludeSecondGuardian(event.target.checked);
    if (!event.target.checked) {
      setGuardian2Type("");
      setGuardian2Name("");
      setGuardian2Contact("");
    }
  };

  useEffect(() => {
    if (dob && accidentDate) {
      const calculatedAge = calculateAgeAtAccident(dob, accidentDate);
      setAgeAtAccident(calculatedAge);
    }
  }, [dob, accidentDate]);

  const calculateAgeAtAccident = (dob, accidentDate) => {
    const dobDate = new Date(dob);
    const accidentDateObj = new Date(accidentDate);
    let age = accidentDateObj.getFullYear() - dobDate.getFullYear();
    const monthDifference = accidentDateObj.getMonth() - dobDate.getMonth();
    if (
      monthDifference < 0 ||
      (monthDifference === 0 && accidentDateObj.getDate() < dobDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const handleGenderChange = (event) => {
    setGender(event.target.value);
  };

  const handleMaritalStatusChange = (event) => {
    setMaritalStatus(event.target.value);
  };

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const handleDobChange = (event) => {
    setDob(event.target.value);
  };

  const handleAccidentDateChange = (event) => {
    setAccidentDate(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = {
      first_name: event.target.firstName.value,
      last_name: event.target.lastName.value,
      dob,
      contact_no: event.target.contact.value,
      email: event.target.email.value,
      gender,
      nationality: event.target.nationality.value,
      NIC: event.target.nic.value,
      marital_status: isMinor ? null : maritalStatus,
      occupation: isMinor ? null : event.target.occupation.value,
      language,
      address: event.target.address.value,
      accident_date: accidentDate,
      age_at_accident: ageAtAccident.toString(),
      accident_type: event.target.accident_type.value,
      consultation_date: event.target.consultation_date.value,
      guardian_data: isMinor
        ? [
            {
              guardian_type: guardian1Type,
              guardian_name: guardian1Name,
              guardian_contact: guardian1Contact,
            },
            ...(includeSecondGuardian
              ? [
                  {
                    guardian_type: guardian2Type,
                    guardian_name: guardian2Name,
                    guardian_contact: guardian2Contact,
                  },
                ]
              : []),
          ]
        : [],
      company_id: getCompanyIdFromToken(),
    };

    setError(null);
    setUpdateStatus("");
    dispatch(setLoading(true));

    try {
      const response = await AddClaimant(data);
      // console.log("Claimant added successfully:", response.data);
      setUpdateStatus("success");

      setTimeout(() => {
        dispatch(setLoading(false));
        navigate(`/users`);
      }, 2000);
    } catch (error) {
      setUpdateStatus("error");
      setError("An error occurred while adding the claimant.");

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
            Add New Claimant
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
                id="dob"
                label="Date of Birth"
                type="date"
                fullWidth
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
                value={dob}
                onChange={handleDobChange}
                required
              />
            </Grid>
            {isMinor && (
              <Grid item xs={12}>
                <Typography variant="h6">
                  Parent/Guardian Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      margin="dense"
                      id="guardian1Type"
                      label="Guardian Type"
                      select
                      fullWidth
                      variant="outlined"
                      value={guardian1Type}
                      onChange={handleGuardian1TypeChange}
                      required
                    >
                      {guardianTypes.map((type) => (
                        <MenuItem key={type} value={type}>
                          {type}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      margin="dense"
                      id="guardian1Name"
                      label="Guardian Name"
                      type="text"
                      fullWidth
                      variant="outlined"
                      value={guardian1Name}
                      onChange={(e) => setGuardian1Name(e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      margin="dense"
                      id="guardian1Contact"
                      label="Guardian Contact Number"
                      type="text"
                      fullWidth
                      variant="outlined"
                      value={guardian1Contact}
                      onChange={(e) => setGuardian1Contact(e.target.value)}
                      required
                    />
                  </Grid>
                </Grid>

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={includeSecondGuardian}
                      onChange={handleIncludeSecondGuardianChange}
                      name="includeSecondGuardian"
                    />
                  }
                  label="Include Second Guardian (Optional)"
                />

                {includeSecondGuardian && (
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        margin="dense"
                        id="guardian2Type"
                        label="Guardian Type"
                        select
                        fullWidth
                        variant="outlined"
                        value={guardian2Type}
                        onChange={handleGuardian2TypeChange}
                        required
                      >
                        {guardianTypes.map((type) => (
                          <MenuItem key={type} value={type}>
                            {type}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        margin="dense"
                        id="guardian2Name"
                        label="Guardian Name"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={guardian2Name}
                        onChange={(e) => setGuardian2Name(e.target.value)}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        margin="dense"
                        id="guardian2Contact"
                        label="Guardian Contact Number"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={guardian2Contact}
                        onChange={(e) => setGuardian2Contact(e.target.value)}
                        required
                      />
                    </Grid>
                  </Grid>
                )}
              </Grid>
            )}
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
                id="gender"
                label="Gender"
                select
                fullWidth
                variant="outlined"
                value={gender}
                onChange={handleGenderChange}
                required
              >
                {genders.map((gender) => (
                  <MenuItem key={gender} value={gender}>
                    {gender}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                id="nationality"
                label="Nationality"
                type="text"
                fullWidth
                variant="outlined"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                id="nic"
                label="NIC"
                type="text"
                fullWidth
                variant="outlined"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                id="marital_status"
                label="Marital Status"
                select
                fullWidth
                variant="outlined"
                value={maritalStatus}
                onChange={handleMaritalStatusChange}
                required={!isMinor}
                disabled={isMinor}
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
                id="occupation"
                label="Occupation"
                type="text"
                fullWidth
                variant="outlined"
                required={!isMinor}
                disabled={isMinor}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                id="language"
                label="Language"
                select
                fullWidth
                variant="outlined"
                value={language}
                required
                onChange={handleLanguageChange}
              >
                {languages.map((lang) => (
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
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                id="accident_date"
                label="Accident Date"
                type="date"
                fullWidth
                variant="outlined"
                required
                InputLabelProps={{
                  shrink: true,
                }}
                value={accidentDate}
                onChange={handleAccidentDateChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                id="age_at_accident"
                label="Age at Accident"
                type="number"
                fullWidth
                variant="outlined"
                required
                value={ageAtAccident}
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                id="accident_type"
                label="Accident Type"
                type="text"
                fullWidth
                variant="outlined"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                id="consultation_date"
                label="Consultation Date"
                type="date"
                fullWidth
                variant="outlined"
                required
                InputLabelProps={{
                  shrink: true,
                }}
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
            Add Claimant
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

export default AddClaimantForm;
