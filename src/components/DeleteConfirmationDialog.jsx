import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import CloseIcon from "@mui/icons-material/Close";

const DeleteConfirmationDialog = ({ open, handleClose, handleDelete }) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        style: { backdropFilter: "blur(5px)", padding: 25, borderRadius: 20 },
      }}
      sx={{
        "& .MuiBackdrop-root": {
          backdropFilter: "blur(5px)",
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: "bold", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        Delete Profile
        <IconButton
          onClick={handleClose}
          sx={{
            color: "#f44336",
            backgroundColor: "white",
            "&:hover": {
              backgroundColor: "#f44336",
              color: "white",
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Are you sure you want to delete this profile?
        </Typography>
        <Box
          sx={{ bgcolor: "#FFD9D9", borderLeft: "4px solid red", p: 2, mb: 2 }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <WarningAmberOutlinedIcon sx={{ color: "#771505", mr: 1 }} />
            <Typography
              variant="body1"
              sx={{ color: "#771505", fontWeight: "bold" }}
            >
              Warning
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: "#BC4C2E" }}>
            By deleting this profile, you won't be able to access the
            details again.
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleDelete}
          variant="contained"
          sx={{
            backgroundColor: "#4F4F4F",
            color: "white",
            "&:hover": {
              backgroundColor: "white",
              color: "#4F4F4F",
            },
            mr: 2,
          }}
        >
          Yes, Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmationDialog;
