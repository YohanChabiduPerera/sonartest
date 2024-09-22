import React, { useState, useEffect } from "react";
import { Typography, Box, Grid, TextField } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { GetSingleDocument } from "../../apis/DocumentManagement";
import { useDispatch } from "react-redux";
import { setLoading } from "../../store/loaderSlice";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Button, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";

const ViewDocument = () => {
  const { document_id } = useParams();
  const [pdfFile, setPdfFile] = useState(null);
  const [documentData, setDocumentData] = useState({
    doc_id: document_id || "",
    company_id: "",
    name: "",
    description: "",
    type: "",
    claimant_id: "",
    expert_id: "",
    case_id: "",
    dateCreated: "",
    status: "",
    url: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);


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
    dispatch(setLoading(true));
    const fetchDocumentData = async () => {
      try {
        const response = await GetSingleDocument(document_id);
        const documents = response.data.data;
        setDocumentData(documents);

        if (documents.url) {
          const bucketName = documents.url.split(".")[0].split("//")[1];
          const key = documents.url.split(".com/")[1];
          const getObjectParams = {
            Bucket: bucketName,
            Key: key,
          };

          const command = new GetObjectCommand(getObjectParams);
          const preSignedUrl = await getSignedUrl(s3Client, command, {
            expiresIn: 3600,
          }); 

          const pdfUrl = preSignedUrl;
          const response = await fetch(pdfUrl);
          const blob = await response.blob();
          setPdfFile(URL.createObjectURL(blob));
        }
        dispatch(setLoading(false)); 
      } catch (error) {
        console.error("Error fetching document data:", error);
        dispatch(setLoading(false));
      }
    };

    if (document_id) {
      fetchDocumentData();
    }
  }, [document_id]);

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    setIsSuperAdmin(userRole === "super_admin");
  }, []);

  const handleUpdateClick = () => {
    navigate(`/document/update/${document_id}`);
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

  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h4"
        component="h1"
        sx={{ fontWeight: "bold", textAlign: "left", mb: 1 }}
      >
        {documentData.name}
      </Typography>
      <Typography variant="subtitle1" sx={{ color: "text.secondary", mb: 2 }}>
        Document ID: {document_id}
      </Typography>
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }} />
      <Grid container spacing={3}>
        <Grid item xs={12} sm={8}>
          <Box
            sx={{
              border: "2px solid blue",
              padding: "10px",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              height: "100%",
            }}
          >
            {pdfFile ? (
              <iframe
                src={pdfFile}
                name={documentData.doc_id}
                style={{
                  width: "100%",
                  height: "100%",
                  border: "none",
                  flexGrow: 1,
                }}
                title="PDF Viewer"
              />
            ) : (
              <Typography variant="body1">Loading PDF...</Typography>
            )}
          </Box>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
            <Button
              variant="contained"
              startIcon={
                <IconButton
                  sx={{
                    color: "white",
                    backgroundColor: "white",
                    borderRadius: "50%",
                    p: 0.5,
                    mr: 1,
                  }}
                  disabled
                >
                  <EditIcon sx={{ color: "white" }} />
                </IconButton>
              }
              sx={{
                backgroundColor: "#39C7AD",
                color: "white",
                "&:hover": {
                  backgroundColor: "#2ea78a",
                },
                borderRadius: 8,
              }}
              onClick={handleUpdateClick}
            >
              Update
            </Button>
          </Box>
          <TextField
            autoFocus
            margin="dense"
            name="documentID"
            label="Document ID"
            type="text"
            fullWidth
            variant="outlined"
            value={documentData.doc_id}
            InputLabelProps={{ shrink: true }}
            disabled
            sx={{
              marginBottom: 3,
              "& .MuiInputBase-input.Mui-disabled": {
                WebkitTextFillColor: "#000000",
              },
              "& .MuiInputLabel-root.Mui-disabled": {
                color: "rgba(0, 0, 0, 0.6)",
              },
            }}
          />
          <TextField
            margin="dense"
            name="document_name"
            label="Document Name"
            type="text"
            fullWidth
            variant="outlined"
            value={documentData.name}
            InputLabelProps={{ shrink: true }}
            disabled
            sx={{
              marginBottom: 3,
              "& .MuiInputBase-input.Mui-disabled": {
                WebkitTextFillColor: "#000000",
              },
              "& .MuiInputLabel-root.Mui-disabled": {
                color: "rgba(0, 0, 0, 0.6)",
              },
            }}
          />
          <TextField
            margin="dense"
            name="document_type"
            label="Document Type"
            type="text"
            fullWidth
            variant="outlined"
            value={documentData.type}
            InputLabelProps={{ shrink: true }}
            disabled
            sx={{
              marginBottom: 3,
              "& .MuiInputBase-input.Mui-disabled": {
                WebkitTextFillColor: "#000000",
              },
              "& .MuiInputLabel-root.Mui-disabled": {
                color: "rgba(0, 0, 0, 0.6)",
              },
            }}
          />
          <TextField
            margin="dense"
            name="description"
            label="Description"
            type="text"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={documentData.description}
            InputLabelProps={{ shrink: true }}
            disabled
            sx={{
              marginBottom: 3,
              "& .MuiInputBase-input.Mui-disabled": {
                WebkitTextFillColor: "#000000",
              },
              "& .MuiInputLabel-root.Mui-disabled": {
                color: "rgba(0, 0, 0, 0.6)",
              },
            }}
          />
          <TextField
            margin="dense"
            name="caseId"
            label="Case ID"
            type="text"
            fullWidth
            variant="outlined"
            value={documentData.case_id}
            InputLabelProps={{ shrink: true }}
            disabled
            sx={{
              marginBottom: 3,
              "& .MuiInputBase-input.Mui-disabled": {
                WebkitTextFillColor: "#000000",
              },
              "& .MuiInputLabel-root.Mui-disabled": {
                color: "rgba(0, 0, 0, 0.6)",
              },
            }}
          />
          <TextField
            margin="dense"
            name="claimantName"
            label="Claimant Name"
            type="text"
            fullWidth
            variant="outlined"
            value={documentData.claimant_id}
            InputLabelProps={{ shrink: true }}
            disabled
            sx={{
              marginBottom: 3,
              "& .MuiInputBase-input.Mui-disabled": {
                WebkitTextFillColor: "#000000",
              },
              "& .MuiInputLabel-root.Mui-disabled": {
                color: "rgba(0, 0, 0, 0.6)",
              },
            }}
          />
          <TextField
            margin="dense"
            name="dateCreated"
            label="Date Created"
            type="text"
            fullWidth
            variant="outlined"
            value={formatDate(documentData.dateCreated)}
            InputLabelProps={{ shrink: true }}
            disabled
            sx={{
              marginBottom: 3,
              "& .MuiInputBase-input.Mui-disabled": {
                WebkitTextFillColor: "#000000",
              },
              "& .MuiInputLabel-root.Mui-disabled": {
                color: "rgba(0, 0, 0, 0.6)",
              },
            }}
          />
          <TextField
            margin="dense"
            name="status"
            label="Status"
            type="text"
            fullWidth
            variant="outlined"
            value={documentData.status}
            InputLabelProps={{ shrink: true }}
            disabled
            sx={{
              "& .MuiInputBase-input.Mui-disabled": {
                WebkitTextFillColor: "#000000",
              },
              "& .MuiInputLabel-root.Mui-disabled": {
                color: "rgba(0, 0, 0, 0.6)",
              },
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default ViewDocument;
