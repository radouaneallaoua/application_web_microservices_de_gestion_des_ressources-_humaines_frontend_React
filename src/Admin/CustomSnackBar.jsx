import { Alert, Snackbar } from "@mui/material";
import React from "react";

const CustomSnackBar = ({ isOpen, duration, onClose, type, message }) => {
  return (
    <Snackbar open={isOpen} autoHideDuration={duration} onClose={onClose}>
      <Alert
        onClose={onClose}
        severity={type}
        variant="filled"
        sx={{ width: "100%" }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};
export default CustomSnackBar;
