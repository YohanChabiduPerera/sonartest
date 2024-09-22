import React, { useState, useRef, useEffect } from "react";
import {
  Typography,
  Box,
  TextField,
  Grid,
  Button,
  MenuItem,
} from "@mui/material";
import { GetSingleCase } from "../../apis/CaseManagementAPI";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLoading } from "../../store/loaderSlice";
import { getCompanyIdFromToken } from "../../utils/auth";
const UpdateCase = ({ case_id, onNext }) => {
  const [endDate, setEndDate] = useState("");
  const [dragging, setDragging] = useState(false);
  const navigate = useNavigate();
  const [pdfPreview, setPdfPreview] = useState(null);
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  const statuses = ["Active", "Inactive", "Pending", "On Hold", "Completed"];
  const [status, setStatus] = useState("");
  const [cases, setCases] = useState({
    caseName: "",
    claimant_id: "",
    estimated_end_date: "",
    description: "",
  });
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setLoading(true));
    const fetchCaseData = async () => {
      try {
        const response = await GetSingleCase(case_id);
        const caseData = response.data;
        setCases(caseData.data);
        setStatus(caseData.data.status)
        setEndDate(caseData.data.estimated_end_date || ""); 
        dispatch(setLoading(false));
      } catch (error) {
        console.error("Error fetching case data:", error);
        dispatch(setLoading(false));
      }
    };

    fetchCaseData();
  }, [case_id]);

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCases((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  const handleDateChange = (event) => {
    const newDate = event.target.value;
    setEndDate(newDate);
    setCases((prevData) => ({
      ...prevData,
      estimated_end_date: newDate,
    }));
  };

  const handleNext = async (event) => {
    event.preventDefault();

    const caseData = {
      caseName: cases.caseName,
      // claimant_id: cases.claimant_id,
      estimated_end_date: endDate,
      description: cases.description,
      company_id: getCompanyIdFromToken(),
      status: status,
      // ...(file && { fileContent: await getBase64(file) }),
    };

    onNext(caseData);
  };

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

  const handleDeleteClick = () => {
    setPdfPreview(null);
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
        Update Case
      </Typography>
      <Typography variant="subtitle1" sx={{ color: "text.secondary", mb: 2 }}>
        Update case here
      </Typography>
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }} />
      <form onSubmit={handleNext}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              margin="dense"
              name="caseName"
              label="Case Name"
              type="text"
              variant="outlined"
              value={cases.caseName}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
            />
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
              <TextField
                fullWidth
                margin="dense"
                name="claimant_id"
                label="Claimant ID"
                type="text"
                variant="outlined"
                value={cases.claimant_id}
                InputProps={{ readOnly: true }}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
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
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
              <TextField
                fullWidth
                margin="dense"
                name="estimated_end_date"
                label="End Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={endDate}
                onChange={handleDateChange}
              />
            </Box>
            <TextField
              fullWidth
              margin="dense"
              name="description"
              label="Description"
              type="text"
              variant="outlined"
              multiline
              rows={4}
              value={cases.description}
              onChange={handleChange}
              sx={{ mb: 2 }}
              InputLabelProps={{ shrink: true }}
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
            >
              {statuses.map((lang) => (
                <MenuItem key={lang} value={lang}>
                  {lang}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
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
      </form>
    </Box>
  );
};

export default UpdateCase;
