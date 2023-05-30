import React, { useState, useEffect } from "react";

import {
  Avatar, Box, Card, CardContent, Grid,
  Typography, Dialog, DialogTitle, DialogContent, Button, DialogActions
} from '@mui/material';
import BrokenImageSharpIcon from '@mui/icons-material/BrokenImageSharp';

const CONTENT = {
  title: "经常异常装置",

}

export function CrashedDevices({ list_data, ...rest }) {
  useEffect(() => {
    if (list_data.length > 0) {
      const display = list_data.map(
        device => {
          return (
            <Card sx={{
              m: 1, minWidth: "500px"
            }}
              key={device.device}>
              <CardContent>
                <Typography
                  color="textSecondary"
                  gutterBottom
                  variant="overline"
                  fontSize="large"
                >
                  {device.device_id}
                </Typography>
                <Typography>
                  装置名称 : {device.device_cname}
                </Typography>
                <Typography>
                  異常次數 : {device.count}
                </Typography>
              </CardContent>
            </Card>
          )
        }
      )
      setData(display);
    }
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
    <Card
      sx={{ height: '100%' }}

    >
      <CardContent>
        <Grid
          container
          spacing={3}
          sx={{ justifyContent: 'space-between' }}
        >
          <Grid item>
            <Typography
              color="textSecondary"
              gutterBottom
              variant="overline"
              fontSize="large"
            >
              经常异常装置
            </Typography>
            <Typography
              color="textPrimary"
              variant="h4"
            >
              {list_data.length}
            </Typography>
          </Grid>
          <Grid item>
            <Avatar
              sx={{
                backgroundColor: 'info.main',
                height: 56,
                width: 56
              }}
            >
              <BrokenImageSharpIcon />
            </Avatar>
          </Grid>
        </Grid>
        <Box sx={{ pt: 3 }}>
          <Button variant="contained" onClick={handleClickOpen}>
            查看
          </Button>
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {CONTENT.title}
            </DialogTitle>
            <DialogContent>
              {
                data
              }
            </DialogContent>
            <DialogActions >
              <Button onClick={handleClose} autoFocus variant="contained">
                关闭
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </CardContent>
    </Card>
  );
} 
