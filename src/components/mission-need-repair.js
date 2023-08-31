import React, { useState, useEffect } from "react";

import {
  Avatar, Box, Card, CardContent, Grid,
  Typography, Dialog, DialogTitle, DialogContent, Button, DialogActions
} from '@mui/material';
import BrokenImageSharpIcon from '@mui/icons-material/BrokenImageSharp';

const CONTENT = {
  title: "无人维修之任务",

}

export function MissionNeedRepair({ list_data, ...rest }) {
  useEffect(() => {
    if (list_data.length > 0) {
      const display = list_data.map(
        mission => {
          return (
            <Card sx={{
              m: 1, minWidth: "500px"
            }}
              key={mission.mission_id}>
              <CardContent>
                <Typography
                  color="textSecondary"
                  gutterBottom
                  variant="overline"
                  fontSize="large"
                >
                  任务 ID : {mission.mission_id}
                </Typography>
                <Typography>
                  任务名称 : {mission.name}
                </Typography>
                <Typography>
                  任务信息 : {mission.description}
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
              无人维修之任务
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
