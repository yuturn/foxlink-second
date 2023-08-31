import React, { useState, useEffect } from "react";
import { Avatar, Box, Card, CardContent, Grid, 
  Typography, Dialog, DialogTitle, DialogContent, Button, DialogActions
} from '@mui/material';
import ReportGmailerrorredSharpIcon from '@mui/icons-material/ReportGmailerrorredSharp';

const CONTENT = {
  title : "紧急通报",
}

export function Emergency({list_data, ...rest}) {
  useEffect(()=> {
    if(list_data.length > 0){
      const display = list_data.map(
        mission => {
          return (
            <Card sx={{m:1, minWidth: "500px"
          }} key={mission.mission_id}>
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
                  装置 ID : {mission.device.device_id}
                  </Typography>
                  <Typography>
                  装置名称 : {mission.device.device_id}
                  </Typography>
                  {/* <Typography>
                  类别 : {mission.category}
                  </Typography>
                  <Typography>
                  说明 : {mission.description}
                  </Typography>
                  <Typography>
                  assignees : {
                    mission.assignees && 
                    mission.assignees.map(user=>{
                      return (
                        <Card key={user.username}>
                          <CardContent>
                          <Typography
                              color="textSecondary"
                              gutterBottom
                              variant="overline"
                              fontSize="small"
                          >
                            ID : {user.username}
                          </Typography>
                          <Typography fontSize="small">
                            full_name : {user.full_name}
                          </Typography>
                          </CardContent>
                        </Card>
                      )
                    })
                  }
                  </Typography> */}
              </CardContent>
            </Card>
          )
        }
      )
      setData(display);
    }
    else{
      const display = <Card sx={{m:1}} key="no-data"><CardContent>
        暂时无紧急通报任务
        </CardContent></Card>;
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
            紧急通报
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
              backgroundColor: 'error.main',
              height: 56,
              width: 56
            }}
          >
            <ReportGmailerrorredSharpIcon />
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
