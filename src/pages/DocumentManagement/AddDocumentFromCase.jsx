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
import { CreateDocument } from "../../apis/DocumentManagement";
import DeleteIcon from "@mui/icons-material/Delete";
import { Autocomplete } from "@mui/material";
import { GetAllClaimants, GetAllUsers } from "../../apis/UserManagementAPI";
import { GetAllCases, GetSingleCase } from "../../apis/CaseManagementAPI";
import { useDispatch } from "react-redux";
import { setLoading } from "../../store/loaderSlice";
import CheckCircleOutlineTwoToneIcon from "@mui/icons-material/CheckCircleOutlineTwoTone";
import DoDisturbAltTwoToneIcon from "@mui/icons-material/DoDisturbAltTwoTone";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import crypto from "crypto-js";
import { getCompanyIdFromToken } from "../../utils/auth";

const AddDocumentFromCase = () => {
  const [date, setDate] = useState("");
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
  const [type, setType] = useState("");
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [pdfPreview, setPdfPreview] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const statuses = ["Active", "Inactive", "Pending"];
  const [status, setStatus] = useState("");
  const [claimants, setClaimants] = useState([]);
  const [selectedClaimantId, setSelectedClaimantId] = useState(null);
  const [experts, setExperts] = useState([]);
  const [selectedExpertId, setSelectedExpertId] = useState(null);
  const [caseName, setCaseName] = useState([]);
  //   const [selectedCaseId, setSelectedCaseId] = useState(null);
  const dispatch = useDispatch();
  const { case_id } = useParams();
  const [selectedClaimant, setSelectedClaimant] = useState(null);
  const [selectedCase, setSelectedCase] = useState(null);

  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const [updateStatus, setUpdateStatus] = useState("");
  let getObjectParams = {};
  const generateHash = (input) => {
    return crypto.SHA256(input).toString(crypto.enc.Hex);
  };
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await GetAllClaimants();
        if (response.data && response.data.data) {
          setClaimants(response.data.data);
          console.log("RES", response.data.data);
        }
        // if (
        //   response.data &&
        //   response.data.data &&
        //   response.data.data.experts
        // ) {
        //   setExperts(response.data.data.experts);
        // }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchCaseName = async () => {
      try {
        const caseDetails = await GetSingleCase(case_id);
        if (caseDetails) {
          setCaseName(caseDetails.data.data.caseName);
          console.log("CASENAME", caseDetails.data.data.caseName);
        }
      } catch (error) {
        console.error("Error fetching caseName:", error);
      }
    };

    fetchCaseName();
  }, []);

  useEffect(() => {
    import("pdfjs-dist").then(async (pdfjsLib) => {
      const pdfjsWorker = await import("pdfjs-dist/build/pdf.worker.mjs");
      pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
    });
  }, []);

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

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const files = e.dataTransfer.files;
    handleFiles(files);
  };

  const handleFileUpload = (e) => {
    const files = e.target.files;
    handleFiles(files);
  };

  const handleFiles = async (files) => {
    if (files && files[0]) {
      setFile(files[0]);
      if (files[0].type === "application/pdf") {
        await renderPdfPreview(files[0]);
      } else {
        setPdfPreview(null);
      }
    }
  };

  const renderPdfPreview = async (file) => {
    const fileReader = new FileReader();
    fileReader.onload = async function () {
      const typedarray = new Uint8Array(this.result);
      try {
        const pdfjsLib = await import("pdfjs-dist");
        const pdf = await pdfjsLib.getDocument(typedarray).promise;
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 1 });
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        await page.render({ canvasContext: context, viewport: viewport })
          .promise;
        setPdfPreview(canvas.toDataURL());
      } catch (error) {
        console.error("Error rendering PDF:", error);
        setPdfPreview(null);
      }
    };
    fileReader.readAsArrayBuffer(file);
  };

  /////////////////////////////
  // Configure AWS SDK
  const S3_BUCKET = "bucket-cm-ad3823";
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

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      alert("Please upload a PDF file.");
      return;
    }

    setUpdateStatus("");
    dispatch(setLoading(true));

    try {
      // Upload file to S3
      const params = {
        Bucket: S3_BUCKET,
        Key: `${event.target.caseId.value}/${event.target.documentName.value}.pdf`,
        Body: file,
        ContentType: "application/pdf",
      };

      const uploadCommand = new PutObjectCommand(params);
      await s3Client.send(uploadCommand);

      const getObjectParams = {
        Bucket: S3_BUCKET,
        Key: params.Key,
      };

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        const base64String = reader.result.split(",")[1];

        const docData = {
          case_id: case_id,
          claimant_id: selectedClaimant ? selectedClaimant.claimant_id : null,
          claimant_nic: selectedClaimant ? selectedClaimant.NIC : null,
          expert_id: "",
          description: event.target.description.value,
          type,
          company_id: getCompanyIdFromToken(),
          status,
          name: event.target.documentName.value,
          fileParams: getObjectParams,
          file_type: "pdf",
        };

        try {
          const response = await CreateDocument(docData);
          // console.log("Document added successfully:", response.data);
          setUpdateStatus("success");

          setTimeout(() => {
            dispatch(setLoading(false));
            navigate("/document");
          }, 2000);
        } catch (error) {
          console.error("An error occurred while adding the document:", error);
          setUpdateStatus("error");

          setTimeout(() => {
            dispatch(setLoading(false));
          }, 2000);
        }
      };
    } catch (error) {
      console.error("An error occurred while uploading the file:", error);
      setUpdateStatus("error");

      setTimeout(() => {
        dispatch(setLoading(false));
      }, 2000);
    }
  };

  const handleTypeChange = (event) => {
    setType(event.target.value);
  };

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
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
        New Document
      </Typography>
      <Typography variant="subtitle1" sx={{ color: "text.secondary", mb: 2 }}>
        Add Your Document Here
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
                height: "90%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                cursor: "pointer",
                position: "relative", // Add relative positioning
                mr: 15,
                ml: 5,
                bgcolor: dragging ? "grey.100" : "background.paper",
              }}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleBrowseClick}
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
                <>
                  <CloudUploadIcon
                    sx={{ fontSize: 40, mb: 2, color: "blue" }}
                  />
                  <Typography variant="body1">
                    Drag your files or{" "}
                    <span
                      style={{ color: "blue", textDecoration: "underline" }}
                    >
                      browse
                    </span>
                  </Typography>
                </>
              )}
              <input
                type="file"
                hidden
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="application/pdf"
              />
              {pdfPreview && (
                <DeleteIcon
                  onClick={handleDeleteClick}
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    color: "red",
                    cursor: "pointer",
                  }}
                />
              )}
            </Paper>
          </Grid>
          <Grid item xs={12} md={6} sx={{ pr: 20 }}>
            <TextField
              fullWidth
              id="caseId"
              name="caseId"
              label="Case Name"
              variant="outlined"
              value={caseName}
              //   sx={{ mb: 2 }}
              InputProps={{ readOnly: true }}
              sx={{
                marginBottom: "16px",
                "& .MuiInputBase-root": {
                  backgroundColor: "#ACACAC29",
                },
                "& .MuiInputBase-input": {
                  color: "#5D7285",
                },
                mb: 2,
              }}
            />
            <Autocomplete
              id="claimantId"
              options={claimants}
              getOptionLabel={(option) => option.NIC}
              value={selectedClaimant}
              onChange={(event, newValue) => {
                setSelectedClaimant(newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  name="claimantId"
                  label="Claimant NIC"
                  variant="outlined"
                  fullWidth
                />
              )}
              SelectProps={{
                MenuProps: {
                  PaperProps: {
                    style: {
                      maxHeight: 48 * 5 + 8, 
                    },
                  },
                },
              }}
              sx={{ mb: 3 }}
            />
            {/* <Autocomplete
              id="expertId"
              options={experts.map(
                (expert) => expert.expert_id
              )}
              value={selectedExpertId}
              onChange={(event, newValue) => {
                setSelectedExpertId(newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  name="expertId"
                  label="Expert ID"
                  variant="outlined"
                  fullWidth
                />
              )}
              sx={{ mb: 2 }}
            /> */}
            <TextField
              fullWidth
              id="documentName"
              name="documentName"
              label="Document Name"
              variant="outlined"
              sx={{ mb: 2 }}
              required
            />
            <TextField
              margin="dense"
              id="type"
              label="Type"
              select
              fullWidth
              variant="outlined"
              value={type}
              onChange={handleTypeChange}
              sx={{ mb: 2 }}
              required
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
              {types.map((lang) => (
                <MenuItem key={lang} value={lang}>
                  {lang}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              id="description"
              label="Description"
              variant="outlined"
              multiline
              rows={4}
              sx={{ mb: 2 }}
              required
            />
            <TextField
              margin="dense"
              id="status"
              label="Status"
              select
              fullWidth
              variant="outlined"
              value={status}
              onChange={handleStatusChange}
              required
            >
              {statuses.map((lang) => (
                <MenuItem key={lang} value={lang}>
                  {lang}
                </MenuItem>
              ))}
            </TextField>
            <Grid
              item
              xs={12}
              sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}
            >
              <Button
                type="submit"
                sx={{
                  backgroundColor: "black",
                  color: "white",
                  borderRadius: 2,
                  boxShadow: 1,
                  "&:hover": {
                    backgroundColor: "grey.800",
                  },
                  width: "200px",
                }}
              >
                Add Document
              </Button>
            </Grid>
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
                <Typography>
                  There is an Error in Adding this Document
                </Typography>
              </Box>
            )}
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default AddDocumentFromCase;
