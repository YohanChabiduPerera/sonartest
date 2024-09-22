import React, { useState, useRef, useEffect } from "react";
import {
  Typography,
  Box,
  TextField,
  Grid,
  Button,
  Paper,
  MenuItem,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useNavigate, useParams } from "react-router-dom";
import {
  GetSingleDocument,
  UpdateSingleDocument,
} from "../../apis/DocumentManagement";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import CheckCircleOutlineTwoToneIcon from "@mui/icons-material/CheckCircleOutlineTwoTone";
import DoDisturbAltTwoToneIcon from "@mui/icons-material/DoDisturbAltTwoTone";
import { useDispatch } from "react-redux";
import { setLoading } from "../../store/loaderSlice";

const UpdateDocument = () => {
  const { document_id } = useParams();
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [pdfPreview, setPdfPreview] = useState(null);
  const [documents, setDocuments] = useState({
    name: "",
    type: "",
    description: "",
    status: "",
  });
  const types = [
    "RAF1",
    "RAF4",
    "OSR",
    "HR",
    "NR",
    "AR",
    "XR",
    "POE",
    "PAYSLIP",
    "CP",
    "IP",
    "OT",
    "OT_TAKE_IN",
    "EP",
    "MAXILLO",
    "PLASTIC_SURGEON",
    "OTHER",
  ];
  const statuses = ["Active", "Inactive", "Pending", "On Hold", "Completed"];

  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const [updateStatus, setUpdateStatus] = useState("");
  const dispatch = useDispatch();

  let pdfUrl = "";
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
    import("pdfjs-dist").then(async (pdfjsLib) => {
      const pdfjsWorker = await import("pdfjs-dist/build/pdf.worker.mjs");
      pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
    });

    const fetchDocumentData = async () => {
      dispatch(setLoading(true));
      try {
        const response = await GetSingleDocument(document_id);
        const documentData = response.data;
        setDocuments(documentData.data);

        if (documentData.data.url) {
          // console.log("doc data", documentData.data.url);
          const bucketName = documentData.data.url.split(".")[0].split("//")[1];
          const key = documentData.data.url.split(".com/")[1];
          const getObjectParams = {
            Bucket: bucketName,
            Key: key,
          };

          const command = new GetObjectCommand(getObjectParams);
          const preSignedUrl = await getSignedUrl(s3Client, command, {
            expiresIn: 3600,
          });
          // console.log("PREURL: ", preSignedUrl);

          const response = await fetch(preSignedUrl);
          const blob = await response.blob();
          // console.log("BLOB", blob);
          const blobUrl = URL.createObjectURL(blob);
          setFile(blobUrl);

          await renderPdfPreview(blobUrl);
        }
      } catch (error) {
        console.error("Error fetching document data:", error);
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchDocumentData();
  }, [document_id]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };

  const renderPdfPreview = async (fileUrl) => {
    try {
      const pdfjsLib = await import("pdfjs-dist");
      const pdf = await pdfjsLib.getDocument(fileUrl).promise;
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 1 });
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      await page.render({ canvasContext: context, viewport: viewport }).promise;
      setPdfPreview(canvas.toDataURL());
    } catch (error) {
      console.error("Error rendering PDF:", error);
      setPdfPreview(null);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setDocuments((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setUpdateStatus("");
    dispatch(setLoading(true));
    try {
      const response = await UpdateSingleDocument(document_id, documents);
      // console.log("Document updated successfully:", response);
      setUpdateStatus("success");
      setTimeout(() => {
        dispatch(setLoading(false));
        navigate("/document");
      }, 2000);
    } catch (error) {
      setUpdateStatus("error");
      console.error("Error updating document:", error);
      setTimeout(() => {
        dispatch(setLoading(false));
      }, 2000);
    }
  };

  const handleDeleteClick = () => {
    setPdfPreview(null);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h4"
        component="h1"
        sx={{ fontWeight: "bold", textAlign: "left", mb: 1 }}
      >
        Update Document
      </Typography>
      <Typography variant="subtitle1" sx={{ color: "text.secondary", mb: 2 }}>
        Update Your Document Here
      </Typography>
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }} />
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper
              elevation={2}
              sx={{
                p: 2,
                border: "2px dashed blue",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                cursor: "pointer",
                position: "relative",
                mr: 15,
                ml: 5,
              }}
            >
              {pdfPreview ? (
                <img
                  src={pdfPreview}
                  alt="PDF preview"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              ) : (
                <Typography variant="body1">
                  PDF Preview not available
                </Typography>
              )}
            </Paper>
          </Grid>
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              pr: 20,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
            }}
          >
            <TextField
              fullWidth
              margin="dense"
              type="text"
              name="name"
              label="Document Name"
              variant="outlined"
              value={documents.name}
              onChange={handleChange}
              sx={{ mb: 2 }}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              margin="dense"
              name="type"
              label="Type"
              select
              fullWidth
              variant="outlined"
              value={documents.type}
              onChange={handleChange}
              sx={{ mb: 2 }}
              SelectProps={{
                MenuProps: {
                  PaperProps: {
                    style: {
                      maxHeight: 48 * 5 + 8, 
                    },
                  },
                },
              }}
            >
              {types.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              margin="dense"
              name="status"
              label="Status"
              select
              fullWidth
              variant="outlined"
              value={documents.status}
              onChange={handleChange}
              sx={{ mb: 2 }}
            >
              {statuses.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              margin="dense"
              name="description"
              label="Description"
              type="text"
              variant="outlined"
              multiline
              rows={4}
              value={documents.description}
              onChange={handleChange}
              sx={{ mb: 2 }}
              InputLabelProps={{ shrink: true }}
            />

            <Button
              onClick={handleSubmit}
              sx={{
                backgroundColor: "black",
                color: "white",
                borderRadius: 2,
                boxShadow: 1,
                "&:hover": {
                  backgroundColor: "grey.800",
                },
                mt: 2,
                alignSelf: "flex-end",
              }}
            >
              Update Document
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
                  There is an Error in Updating this Document
                </Typography>
              </Box>
            )}
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default UpdateDocument;
