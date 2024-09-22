import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Paper,
  IconButton,
  TextField,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteConfirmationDialog from "../../../components/DeleteConfirmationDialog";
import { DeleteCompany, GetSingleCompany } from "../../../apis/CompanyManagementAPI";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLoading } from "../../../store/loaderSlice";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";

const ViewCompany = () => {
  let { company_id } = useParams();
  const [companies, setCompanies] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [logoPreview, setLogoPreview] = useState(null);

  useEffect(() => {
    dispatch(setLoading(true));
    const fetchData = async () => {
      try {
        // console.log("Fetching data for company_id: ", company_id);
        const response = await GetSingleCompany(company_id);
        const fetchedCompany = response.data;
        // console.log("Fetched company: ", fetchedCompany);

        setCompanies(fetchedCompany);
        dispatch(setLoading(false));
        if (fetchedCompany.img_url) {
            fetchImageData(fetchedCompany.img_url);
          }

      } catch (error) {
        console.error("Error fetching data: ", error);
        dispatch(setLoading(false));
      }
    };

    fetchData();
  }, [company_id]);

  const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false);

  const handleOpenDeleteConfirmation = () => {
    setOpenDeleteConfirmation(true);
  };

  const handleCloseDeleteConfirmation = () => {
    setOpenDeleteConfirmation(false);
  };

  const handleDelete = async (event) => {
    event.preventDefault();

    try {
      const response = await DeleteCompany(company_id);
      // console.log("Document Deleted successfully:");
    } catch (error) {
      // console.log("An error occurred while deleting the document.", error);
    } finally {
    }

    handleCloseDeleteConfirmation();
  };

  const handleUpdate = (event) => {
    event.preventDefault();
    navigate(`/company/update/${company_id}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      console.error("Invalid date:", dateString);
      return "Invalid Date";
    }

    return date.toISOString().split("T")[0];
  };

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

  const fetchImageData = async (img_url) => {
    try {
      // Extract bucket name and key from img_url
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

  return (
    <>
      <Box sx={{ p: 3 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{ fontWeight: "bold", textAlign: "left", mb: 1 }}
        >
          Company Overview
        </Typography>
        <Typography variant="subtitle1" sx={{ color: "text.secondary", mb: 2 }}>
          View Company Details Here{" "}
        </Typography>
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }} />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1,
            backgroundColor: "#39C7AD",
            padding: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" sx={{ color: "white", mr: 2 }}>
              {companies.company_name}
            </Typography>
          </Box>
          <Box>
            <Typography
              variant="subtitle1"
              component="span"
              sx={{ mr: 2, color: "white" }}
            >
              Company ID: {companies.company_id}
            </Typography>
            <IconButton
              size="small"
              sx={{ color: "white" }}
              onClick={handleUpdate}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              size="small"
              sx={{ color: "white" }}
              onClick={handleOpenDeleteConfirmation}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>

        <Paper
          sx={{ display: "flex", height: 400, overflow: "hidden", p: 2 }}
        >
          <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {logoPreview ? (
              <img
                src={logoPreview}
                alt="Company Logo"
                style={{ maxWidth: "100%", maxHeight: "100%" }}
              />
            ) : (
              <Typography variant="subtitle1" sx={{ color: "text.secondary" }}>
                No Logo Available
              </Typography>
            )}
          </Box>
          <Box sx={{ flex: 2, display: 'flex', alignItems: 'center', gap: 2, pl: 4 }}>
  <Box sx={{ flex: 1 }}>
    <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>
      Date Created
    </Typography>
    <TextField
      value={formatDate(companies.dateCreated)}
      InputProps={{ readOnly: true }}
      fullWidth
      variant="outlined"
      size="small"
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
  </Box>
  <Box sx={{ flex: 2 }}>
    <Typography variant="body2" sx={{ mb: 1, fontWeight: 'bold' }}>
      Address
    </Typography>
    <TextField
      value={companies.address || ""}
      InputProps={{ readOnly: true }}
      fullWidth
      variant="outlined"
      size="small"
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
  </Box>
</Box>

        </Paper>

        <DeleteConfirmationDialog
          open={openDeleteConfirmation}
          handleClose={handleCloseDeleteConfirmation}
          handleDelete={handleDelete}
        />
      </Box>
    </>
  );
};

export default ViewCompany;
