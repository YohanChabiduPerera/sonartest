import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Paper,
  Container,
  Button,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import { GetSingleCase } from "../../apis/CaseManagementAPI";
import { GetAllUsers } from "../../apis/UserManagementAPI";
import { useDispatch } from "react-redux";
import { setLoading } from "../../store/loaderSlice";
const UpdateCaseCont = ({ case_id, onSubmit }) => {
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedAttorney, setSelectedAttorney] = useState("");
  const [selectedExpert, setSelectedExpert] = useState("");
  const [selectedDoctors, setSelectedDoctors] = useState([]);
  const [selectedAttorneys, setSelectedAttorneys] = useState([]);
  const [selectedExperts, setSelectedExperts] = useState([]);

  const [doctors, setDoctors] = useState([]);
  const [attorneys, setAttorneys] = useState([]);
  const [experts, setExperts] = useState([]);

  const location = useLocation();
  const caseId = location.state?.case_id;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setLoading(true));
    const fetchCaseData = async () => {
      try {
        const response = await GetSingleCase(case_id);
        const caseData = response.data;
        // console.log("Cases:" + JSON.stringify(caseData.data));
        setSelectedDoctors(caseData.data.doctors || []);
        setSelectedAttorneys(caseData.data.attorneys || []);
        setSelectedExperts(caseData.data.experts || []);
        dispatch(setLoading(false));
      } catch (error) {
        console.error("Error fetching case data:", error);
        dispatch(setLoading(false));
      }
    };

    fetchCaseData();
  }, [case_id]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await GetAllUsers();
        // console.log("API Response:", response.data);

        if (response.data && response.data.data) {
          const { doctors, attorneys, experts } = response.data.data;

          setDoctors(
            doctors.map((doctor) => ({
              id: doctor.doctor_id,
              name: `${doctor.first_name} ${doctor.last_name}`,
            }))
          );

          setAttorneys(
            attorneys.map((attorney) => ({
              id: attorney.attorney_id,
              name: `${attorney.first_name} ${attorney.last_name}`,
            }))
          );

          setExperts(
            experts.map((expert) => ({
              id: expert.expert_id,
              name: `${expert.first_name} ${expert.last_name}`,
            }))
          );
        } else {
          console.error("Unexpected API response structure:", response.data);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleUpdateCase = () => {
    const teamData = {
      doctors: selectedDoctors.map((doctor) => doctor.id), 
      attorneys: selectedAttorneys.map((attorney) => attorney.id),
      experts: selectedExperts.map((expert) => expert.id),
    };
  
    onSubmit(teamData);
  };
  // console.log("ATT: ", selectedAttorneys)


  const handleSelect = (event, type) => {
    const value = event.target.value;
    const selectedItem = {
      id: value,
      name:
        type === "doctor"
          ? doctors.find((doctor) => doctor.id === value).name
          : type === "attorney"
          ? attorneys.find((attorney) => attorney.id === value).name
          : experts.find((expert) => expert.id === value)
              .name,
    };

    switch (type) {
      case "doctor":
        setSelectedDoctor(value);
        if (!selectedDoctors.some((doctor) => doctor.id === value)) {
          setSelectedDoctors([...selectedDoctors, selectedItem]);
        }
        break;
      case "attorney":
        setSelectedAttorney(value);
        if (!selectedAttorneys.some((attorney) => attorney.id === value)) {
          setSelectedAttorneys([...selectedAttorneys, selectedItem]);
        }
        break;
      case "expert":
        setSelectedExpert(value);
        if (
          !selectedExperts.some(
            (expert) => expert.id === value
          )
        ) {
          setSelectedExperts([...selectedExperts, selectedItem]);
        }
        break;
      default:
        break;
    }
  };

  const handleDelete = (itemId, type) => {
    switch (type) {
      case "doctor":
        setSelectedDoctors(
          selectedDoctors.filter((doctor) => doctor.id !== itemId)
        );
        break;
      case "attorney":
        setSelectedAttorneys(
          selectedAttorneys.filter((attorney) => attorney.id !== itemId)
        );
        break;
      case "expert":
        setSelectedExperts(
          selectedExperts.filter(
            (expert) => expert.id !== itemId
          )
        );
        break;
      default:
        break;
    }
  };

  // console.log("DOCS: ", doctors);
  // console.log("ATTT:", attorneys);
  // console.log("PROF: ", experts);

  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h4"
        component="h1"
        sx={{ fontWeight: "bold", textAlign: "left", mb: 1, color: "#797979" }}
      >
        Update Case
      </Typography>
      <Typography variant="subtitle1" sx={{ color: "grey", mb: 2 }}>
        Create a new case
      </Typography>
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }} />
      <Container maxWidth={false} sx={{ maxWidth: "1200px" }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControl fullWidth variant="outlined" sx={{ borderRadius: 2 }}>
              <InputLabel shrink>Doctor</InputLabel>
              <Select
                value={selectedDoctor}
                onChange={(e) => handleSelect(e, "doctor")}
                label="Doctor"
                displayEmpty
                notched
                renderValue={(selected) => {
                  return <em style={{ color: "gray" }}>Select the Doctor</em>;
                }}
                sx={{
                  "& .MuiSelect-select": {
                    "&:focus": {
                      backgroundColor: "transparent",
                    },
                  },
                }}
              >
                {doctors.map((doctor) => (
                  <MenuItem key={doctor.id} value={doctor.id}>
                    {doctor.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth variant="outlined" sx={{ borderRadius: 2 }}>
              <InputLabel shrink>Attorney</InputLabel>
              <Select
                value={selectedAttorney}
                onChange={(e) => handleSelect(e, "attorney")}
                label="Attorney"
                displayEmpty
                notched
                renderValue={(selected) => {
                  return <em style={{ color: "gray" }}>Select the Attorney</em>;
                }}
                sx={{
                  "& .MuiSelect-select": {
                    "&:focus": {
                      backgroundColor: "transparent",
                    },
                  },
                }}
              >
                {attorneys.map((attorney) => (
                  <MenuItem key={attorney.id} value={attorney.id}>
                    {attorney.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth variant="outlined" sx={{ borderRadius: 2 }}>
              <InputLabel shrink>Expert</InputLabel>
              <Select
                value={selectedExpert}
                onChange={(e) => handleSelect(e, "expert")}
                label="Expert"
                displayEmpty
                notched
                renderValue={(selected) => {
                  return (
                    <em style={{ color: "gray" }}>Select the Expert</em>
                  );
                }}
                sx={{
                  "& .MuiSelect-select": {
                    "&:focus": {
                      backgroundColor: "transparent",
                    },
                  },
                }}
              >
                {experts.map((expert) => (
                  <MenuItem key={expert.id} value={expert.id}>
                    {expert.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} container spacing={10}>
            <Grid item xs={4}>
              <Paper
                sx={{
                  p: 2,
                  minHeight: 300,
                  border: "1px solid grey",
                  boxShadow: "none",
                  borderRadius: 2,
                  position: "relative",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: -14,
                    left: 10,
                    bgcolor: "background.paper",
                    px: 1,
                  }}
                >
                  <Typography variant="caption" component="span">
                    Selected Doctors
                  </Typography>
                </Box>
                {selectedDoctors.map((doctor) => (
                  <Chip
                    key={doctor.id}
                    label={doctor.name} 
                    onDelete={() => handleDelete(doctor.id, "doctor")}
                    sx={{
                      m: 0.5,
                      borderRadius: "4px",
                      border: "1px solid #C8B4FF",
                      backgroundColor: "transparent",
                      color: "black",
                      "& .MuiChip-deleteIcon": {
                        color: "black",
                      },
                    }}
                  />
                ))}
              </Paper>
            </Grid>
            <Grid item xs={4}>
              <Paper
                sx={{
                  p: 2,
                  minHeight: 300,
                  border: "1px solid grey",
                  boxShadow: "none",
                  borderRadius: 2,
                  position: "relative",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: -14,
                    left: 10,
                    bgcolor: "background.paper",
                    px: 1,
                  }}
                >
                  <Typography variant="caption" component="span">
                    Selected Attorneys
                  </Typography>
                </Box>
                {selectedAttorneys.map((attorney) => (
                  <Chip
                    key={attorney.id}
                    label={attorney.name} 
                    onDelete={() => handleDelete(attorney.id, "attorney")}
                    sx={{
                      m: 0.5,
                      borderRadius: "4px",
                      border: "1px solid #C8B4FF",
                      backgroundColor: "transparent",
                      color: "black",
                      "& .MuiChip-deleteIcon": {
                        color: "black",
                      },
                    }}
                  />
                ))}
              </Paper>
            </Grid>

            <Grid item xs={4}>
              <Paper
                sx={{
                  p: 2,
                  minHeight: 300,
                  border: "1px solid grey",
                  boxShadow: "none",
                  borderRadius: 2,
                  position: "relative",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: -14,
                    left: 10,
                    bgcolor: "background.paper",
                    px: 1,
                  }}
                >
                  <Typography variant="caption" component="span">
                    Selected Experts
                  </Typography>
                </Box>
                {selectedExperts.map((expert) => (
                  <Chip
                    key={expert.id}
                    label={expert.name}
                    onDelete={() =>
                      handleDelete(expert.id, "expert")
                    }
                    sx={{
                      m: 0.5,
                      borderRadius: "4px",
                      border: "1px solid #C8B4FF",
                      backgroundColor: "transparent",
                      color: "black",
                      "& .MuiChip-deleteIcon": {
                        color: "black",
                      },
                    }}
                  />
                ))}
              </Paper>
            </Grid>
          </Grid>
          <Grid
            item
            xs={12}
            sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}
          >
            <Button
              onClick={handleUpdateCase}
              sx={{
                backgroundColor: "black",
                color: "white",
                borderRadius: 2,
                boxShadow: 1,
                "&:hover": {
                  backgroundColor: "grey.800",
                },
                width: "500px",
              }}
            >
              Update Case
            </Button>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default UpdateCaseCont;
