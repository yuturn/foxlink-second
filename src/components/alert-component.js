import React, { useState } from "react";
import { Container, Snackbar, Box, Typography } from "@mui/material";
import MuiAlert from '@mui/material/Alert';

export const AlertComponent = ({ open, setOpen, message, severity, duration }) => {
  const [state, setState] = useState({
    vertical: 'top',
    horizontal: 'center',
  });
  const { vertical, horizontal } = state;
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') { return; }
    setOpen(false);
  }

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  return (
    <Snackbar open={open} autoHideDuration={duration} onClose={handleClose} anchorOrigin={{ vertical, horizontal }} >
      <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
        <Typography variant="h6">
          {String(message)}
        </Typography>
      </Alert>
    </Snackbar>
  );
};


