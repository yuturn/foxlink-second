import React from "react";
import {Snackbar} from "@mui/material";
import MuiAlert from '@mui/material/Alert';

export default function SnackbarAlert({open, type, message, setAlert}) {
    const Alert = React.forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {return;}
        setAlert({
            'open': false,
        })
    }
    return (
        <div>
             <Snackbar open={open} autoHideDuration={1000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert onClose={handleClose} severity={type} sx={{ width: '100%' }}>
                    {message}
                </Alert>
            </Snackbar>  
        </div>
    )
}