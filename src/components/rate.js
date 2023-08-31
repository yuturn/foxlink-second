import React, { useState, useEffect } from "react";

import {
  Avatar, Box, Card, CardContent, Grid, LinearProgress,
  Typography, Dialog, DialogTitle, DialogContent, Button, DialogActions
} from '@mui/material';
import InsertChartIcon from '@mui/icons-material/InsertChartOutlined';

const CONTENT = {
  title: "出勤人员",
}


export function Rate({ list_data, ...rest }) {
  useEffect(() => {
    if (list_data.length > 0) {
      const display = list_data[0].login_users.map(
        employees => {
          return (
            <Card sx={{
              m: 1, minWidth: "500px"
            }}
              key={employees.username}>
              <CardContent>
                <Typography
                  color="textSecondary"
                  gutterBottom
                  variant="overline"
                  fontSize="large"
                >
                  员工编号 : {employees.badge}
                </Typography>
                <Typography>
                  员工姓名 : {employees.username}
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
              出勤比例
            </Typography>
            <Typography
              color="textPrimary"
              variant="h4"
            >
              {((list_data[0].percentage) * 100).toFixed(2)}%
            </Typography>
          </Grid>
          <Grid item>
            <Avatar
              sx={{
                backgroundColor: 'secondary.main',
                height: 56,
                width: 56
              }}
            >
              <InsertChartIcon />
            </Avatar>
          </Grid>
        </Grid>
        <Box sx={{ pt: 3 }}>
          <LinearProgress
            value={list_data}
            variant="determinate"
          />
        </Box>
        <Box sx={{ pt: 3 }}>
          <Button variant="contained" onClick={handleClickOpen}>
            查看
          </Button>
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            sx={{ width: '100%' }}
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


// export const Rate = ({ rate, ...rest }) => (
//   <Card
//     sx={{ height: '100%' }}
//   >
//     <CardContent>
//       <Grid
//         container
//         spacing={3}
//         sx={{ justifyContent: 'space-between' }}
//       >
//         <Grid item>
//           <Typography
//             color="textSecondary"
//             gutterBottom
//             variant="overline"
//             fontSize="large"
//           >
//             出勤比例
//           </Typography>
//           <Typography
//             color="textPrimary"
//             variant="h4"
//           >
//             {(rate).toFixed(2)}%
//           </Typography>
//         </Grid>
//         <Grid item>
//           <Avatar
//             sx={{
//               backgroundColor: 'secondary.main',
//               height: 56,
//               width: 56
//             }}
//           >
//             <InsertChartIcon />
//           </Avatar>
//         </Grid>
//       </Grid>
//       <Box sx={{ pt: 3 }}>
//         <LinearProgress
//           value={rate}
//           variant="determinate"
//         />
//       </Box>
//     </CardContent>
//   </Card>
// );
