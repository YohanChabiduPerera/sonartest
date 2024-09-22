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
import {
  UpdateCompany,
  GetSingleCompany,
} from "../../../apis/CompanyManagementAPI";
import { useNavigate, useParams } from "react-router-dom";
import CheckCircleOutlineTwoToneIcon from "@mui/icons-material/CheckCircleOutlineTwoTone";
import DoDisturbAltTwoToneIcon from "@mui/icons-material/DoDisturbAltTwoTone";
import { useDispatch } from "react-redux";
import { setLoading } from "../../../store/loaderSlice";
import { GetAllAdmins } from "../../../apis/AdminManagementAPI";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const UpdateCompanyForm = () => {
  const [dateCreated, setDateCreated] = useState(null);
  const [error, setError] = useState(null);
  const [updateStatus, setUpdateStatus] = useState("");
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [companyName, setCompanyName] = useState("");
  const [address, setAddress] = useState("");
  const [admins, setAdmins] = useState([]);
  const [selectedAdminId, setSelectedAdminId] = useState(null);
  const [existingLogo, setExistingLogo] = useState("");
  const statuses = ["Active", "Inactive", "Pending"];
  const [status, setStatus] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { company_id } = useParams();
  const [logoBase64, setLogoBase64] = useState(null);

  /////////////////////////////
  // Configure AWS SDK
  const S3_BUCKET = "bucket-cm-17bfbd";
  const ACCESS_KEY = process.env.VITE_ACCESS_KEY;
  const SECRET_KEY = process.env.VITE_SECRET_KEY;
  const REGION = process.env.VITE_REGION;

  const s3Client = new S3Client({
    region: REGION,
    credentials: {
      accessKeyId: ACCESS_KEY,
      secretAccessKey: SECRET_KEY,
    },
  });

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        const response = await GetSingleCompany(company_id);
        if (response.data) {
          const { company_name, address, dateCreated, img_url, status } =
            response.data;
          setCompanyName(company_name);
          setAddress(address);
          setDateCreated(dateCreated);
          setExistingLogo(img_url);
          setStatus(status);

          if (img_url) {
            fetchImageData(img_url);
          }
        }
      } catch (error) {
        console.error("Error fetching company details:", error);
      }
    };

    const fetchImageData = async (img_url) => {
      try {
        const bucketName = img_url
          .split(".s3.amazonaws.com/")[0]
          .split("//")[1];
        const key = img_url.split(".s3.amazonaws.com/")[1];

        const getObjectParams = {
          Bucket: bucketName,
          Key: key,
        };

        const command = new GetObjectCommand(getObjectParams);
        const preSignedUrl = await getSignedUrl(s3Client, command, {
          expiresIn: 3600,
        });

        const response = await fetch(preSignedUrl);
        const blob = await response.blob();
        setLogoPreview(URL.createObjectURL(blob));
      } catch (error) {
        console.error("Error fetching image data:", error);
      } finally {
        dispatch(setLoading(false));
      }
    };

    if (company_id) {
      dispatch(setLoading(true));
      fetchCompanyDetails();
    }
  }, [company_id, dispatch]);

//   const handleFileChange = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       setLogoFile(file);
//       setLogoPreview(URL.createObjectURL(file));
//     }
//   };

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
  const handleFileNoChange = (event) => {
    const file = event
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
    formData.append("company_name", companyName);
    formData.append("address", address);
    formData.append("status", status);

    // console.log("existingLogo", existingLogo)
    if (existingLogo) {
      formData.append("img_url", existingLogo);
    }

    setError(null);
    setUpdateStatus("");
    dispatch(setLoading(true));

    for (let [key, value] of formData.entries()) {
      // console.log(key + ": " + value);
    }

    try {
      const response = await UpdateCompany(company_id, formData);
      // console.log("Company updated successfully:", response.data);
      setUpdateStatus("success");

      setTimeout(() => {
        dispatch(setLoading(false));
        navigate(`/company`);
      }, 2000);
    } catch (error) {
      setUpdateStatus("error");
      setError("An error occurred while updating the company.");

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
            Update Company
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{ color: "text.secondary", mb: 2 }}
          >
            Update Company Details
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
                InputProps={{ readOnly: true }}
                value={companyName}
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
            {/* <Grid item xs={12} sm={6}>
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
              <Autocomplete
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
              />
            </Grid> */}
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                id="status"
                label="Status"
                select
                fullWidth
                variant="outlined"
                value={status}
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
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                sx={{marginBottom: 2}}
              />
            </Grid>
            <Grid container spacing={2} alignItems="center">
              {/* Image Display */}
              <Grid item>
                {logoPreview ? (
                  <Box>
                    <img
                      src={logoPreview}
                      alt="Company Logo Preview"
                      style={{ width: 100, height: 100, objectFit: "cover" }}
                    />
                  </Box>
                ) : existingLogo ? (
                  <Box>
                    <img
                      src={existingLogo}
                      alt="Existing Company Logo"
                      style={{ width: 100, height: 100, objectFit: "cover" }}
                    />
                  </Box>
                ) : null}
              </Grid>

              {/* Upload Button */}
              <Grid item>
                <input
                  accept="image/*"
                  id="company-logo-upload"
                  type="file"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
                <label htmlFor="company-logo-upload">
                  <Button variant="contained" component="span">
                    Upload Company Logo
                  </Button>
                </label>
              </Grid>
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
            Update Company
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
              <Typography>Company updated successfully!</Typography>
            </Box>
          )}
          {updateStatus === "error" && (
            <Box
              sx={{
                mt: 2,
                p: 2,
                border: "1px dashed red",
                borderRadius: 1,
                display: "flex",
                alignItems: "center",
                color: "red",
              }}
            >
              <DoDisturbAltTwoToneIcon sx={{ mr: 1 }} />
              <Typography>{error}</Typography>
            </Box>
          )}
        </form>
      </Grid>
    </>
  );
};

export default UpdateCompanyForm;
