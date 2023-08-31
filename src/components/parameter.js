import React, { useState, useEffect } from "react";

import { Box, Dialog, DialogTitle, DialogContent, Button, DialogActions, TableBody
} from '@mui/material';

import ExcelTableView from "../components/excel-table-view";

export function Parameter({csv_data, ...rest}) {
  useEffect(()=> {
    setData(csv_data);
}, [])
  const [data, setData] = useState();
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  
  return (
    <Box sx={{ pt: 3, display: 'flex',
    justifyContent: 'center' }} >
      <Button variant="contained" onClick={handleClickOpen}>
        查看 Parameter
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullScreen
      >
        <DialogTitle id="alert-dialog-title">
        参数
        </DialogTitle>
        <DialogContent>
          {
            data && 
            <ExcelTableView keys={data['keys']} datas={data['datas']}/>
          }
        </DialogContent>
        <DialogActions sx={{ pt: 3, display: 'flex',
          justifyContent: 'center' }}>
            <Button onClick={handleClose} autoFocus variant="contained" size="large">
            关闭
            </Button>
        </DialogActions>
      </Dialog>
      </Box>
  );
} 
