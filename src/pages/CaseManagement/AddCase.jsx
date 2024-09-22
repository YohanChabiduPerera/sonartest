import React, { useState, useRef, useEffect } from "react";
import {
  Typography,
  Box,
  TextField,
  Grid,
  Button,
  Paper,
  MenuItem,
  Autocomplete,
  Container,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import { CreateCase } from "../../apis/CaseManagementAPI";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { GetAllClaimants, GetAllUsers } from "../../apis/UserManagementAPI";
import crypto from "crypto-js";
import { useDispatch } from "react-redux";
import { setLoading } from "../../store/loaderSlice";
import { getCompanyIdFromToken, getUserIdFromToken } from "../../utils/auth";

const AddCase = ({ onNext }) => {
  const [endDate, setEndDate] = useState(null);
  const [dragging, setDragging] = useState(false);
  const navigate = useNavigate();
  const [pdfPreview, setPdfPreview] = useState(null);
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  const statuses = ["Active", "Completed"];
  const [status, setStatus] = useState("");
  const [claimants, setClaimants] = useState([]);
  const [selectedClaimant, setSelectedClaimant] = useState(null);
  const dispatch = useDispatch();
  const [documents, setDocuments] = useState([
    { file: null, name: "", type: "", description: "" },
  ]);
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

  let getObjectParams = {};
  const generateHash = (input) => {
    return crypto.SHA256(input).toString(crypto.enc.Hex);
  };

  const generateCustomID = (companyId) => {
    const seed = `${companyId}-${Date.now()}`;
    const hash = generateHash(seed).slice(0, 6);
    return `cs-${hash}`;
  };

  const customCaseId = generateCustomID(getCompanyIdFromToken());

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await GetAllClaimants();
        if (response.data && response.data.data) {
          setClaimants(response.data.data);
          console.log("RES", response.data.data);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    import("pdfjs-dist").then(async (pdfjsLib) => {
      const pdfjsWorker = await import("pdfjs-dist/build/pdf.worker.mjs");
      pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
    });
  }, []);

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  /////////////////////////////
  // Configure AWS SDK
  const S3_BUCKET = `bucket-${getCompanyIdFromToken()}`;
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

  const handleDocumentChange = (index, field, value) => {
    const newDocuments = [...documents];
    newDocuments[index][field] = value;
    setDocuments(newDocuments);
  };

  const handleAddDocument = () => {
    setDocuments([
      ...documents,
      { file: null, name: "", type: "", description: "" },
    ]);
  };

  const handleRemoveDocument = (index) => {
    const newDocuments = documents.filter((_, i) => i !== index);
    setDocuments(newDocuments);
  };

  const handleFileUploadMultiple = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      handleDocumentChange(index, "file", file);
      handleDocumentChange(index, "fileName", file.name);
    }
  };

  const handleNext = async (event) => {
    event.preventDefault();

    const validDocuments = documents.filter(
      (doc) =>
        doc.file &&
        doc.name &&
        doc.name.trim() !== "" &&
        doc.type &&
        doc.type.trim() !== ""
    );

    if (validDocuments.length === 0) {
      alert("Please upload at least one document with all required details.");
      return;
    }

    dispatch(setLoading(true));

    try {
      let uploadedDocuments = [];

      for (const doc of validDocuments) {
        const docName = doc.name.trim();
        const docType = doc.type.trim();
        const docDescription = doc.description ? doc.description.trim() : "";

        if (doc.file && docName && docType) {
          const params = {
            Bucket: S3_BUCKET,
            Key: `${customCaseId}/${docName}.pdf`,
            Body: doc.file,
            ContentType: "application/pdf",
          };

          const uploadCommand = new PutObjectCommand(params);
          await s3Client.send(uploadCommand);

          uploadedDocuments.push({
            document_name: docName,
            fileParams: {
              Bucket: S3_BUCKET,
              Key: params.Key,
            },
            document_type: docType,
            description: docDescription,
          });
        }
      }

      const caseData = {
        case_id: customCaseId,
        caseName: event.target.caseName.value.trim(),
        claimant_id: selectedClaimant ? selectedClaimant.claimant_id : null,
        claimant_nic: selectedClaimant ? selectedClaimant.NIC : null,
        estimated_end_date: endDate,
        description: event.target.description.value.trim(),
        status,
        company_id: getCompanyIdFromToken(),
        admin_id: getUserIdFromToken(),
        documentDetails: uploadedDocuments,
      };

      onNext(caseData);
    } catch (error) {
      console.error("Error uploading file(s):", error);
      alert("An error occurred while uploading the file(s). Please try again.");
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Typography
        variant="h4"
        component="h1"
        sx={{ fontWeight: "bold", textAlign: "left", mb: 1 }}
      >
        New Case
      </Typography>
      <Typography variant="subtitle1" sx={{ color: "text.secondary", mb: 2 }}>
        Create a new case
      </Typography>
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }} />
      <form onSubmit={handleNext}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box sx={{ width: "100%" }}>
              {documents.map((doc, index) => (
                <Paper
                  key={index}
                  elevation={2}
                  sx={{
                    p: 2,
                    border: "2px dashed #39C7AD",
                    mb: 2,
                    bgcolor: "background.paper",
                  }}
                >
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={4}>
                      <Button variant="contained" component="label" fullWidth>
                        Browse
                        <input
                          type="file"
                          hidden
                          onChange={(e) => handleFileUploadMultiple(e, index)}
                          accept="application/pdf"
                        />
                      </Button>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        label="Document Name"
                        value={doc.name}
                        onChange={(e) =>
                          handleDocumentChange(index, "name", e.target.value)
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        select
                        fullWidth
                        label="Document Type"
                        value={doc.type}
                        onChange={(e) =>
                          handleDocumentChange(index, "type", e.target.value)
                        }
                      >
                        {types.map((type) => (
                          <MenuItem key={type} value={type}>
                            {type}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Button
                        onClick={() => handleRemoveDocument(index)}
                        sx={{ color: "red" }}
                      >
                        <DeleteIcon />
                      </Button>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Document Description"
                        multiline
                        rows={3}
                        value={doc.description}
                        onChange={(e) =>
                          handleDocumentChange(
                            index,
                            "description",
                            e.target.value
                          )
                        }
                      />
                    </Grid>

                    {doc.fileName && (
                      <Grid item xs={12}>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          Uploaded: {doc.fileName}
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                </Paper>
              ))}
              <Button onClick={handleAddDocument} sx={{ mt: 2 }}>
                Add Document
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12} md={6} sx={{ pr: 20 }}>
            <TextField
              fullWidth
              id="caseName"
              label="Case Name"
              placeholder="Case Name"
              variant="outlined"
              sx={{ mb: 3 }}
              required
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
              sx={{ mb: 3 }}
            />
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
              <TextField
                fullWidth
                label="End Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                sx={{ mb: 3 }}
                required
              />
            </Box>
            <TextField
              fullWidth
              id="description"
              label="Description"
              variant="outlined"
              multiline
              rows={4}
              sx={{ mb: 3 }}
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
              sx={{ mb: 3 }}
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
                Next
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

export default AddCase;
