import React, { useState, useEffect, useRef } from "react";

import {
  Box,
  Card,
  CardHeader,
  CardContent,
  Divider,
  Grid,
  Button,
  Typography,
  TextField,
  FormControl,
  InputLabel
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

// import dialog
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Emergency } from "../components/emergency.js";
import { MissionNeedRepair } from "../components/mission-need-repair.js";
import { WorkshopPicker } from "../components/workshop-picker.js";

import { apiMissionEmergency, apiMissionNeedRepair } from "../api.js";


const darkTheme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#62aaf4',
      paper: '#e7f2fd',
    },
    text: {
      primary: '#000000',
    },
    primary: {
      // Purple and green play nicely together.
      main: '#2196f3',
    },
  },
});

export default function Project({ token, ...rest }) {
  const [age, setAge] = useState("");
  const [projectDeleteOpen, setProjectDeleteOpen] = useState(false);

  const handleChange = (event) => {
    setAge(event.target.value);
  };
  const projectDeleteHandleClickOpen = () => {
    setProjectDeleteOpen(true);
  };
  const projectDeleteHandleClose = () => {
    setProjectDeleteOpen(false);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Card>
        <Box sx={{ bgcolor: 'info.main' }}>
          <CardHeader title="專案頁面" color="#62aaf4" />
        </Box>
        <Divider sx={{ borderBottomWidth: 3 }} />
        <CardContent>
          <Grid container spacing={1}>
            <Grid item xs={12} md={12}>
              <Box pt={4} pb={3} px={3}>
                <Box component="form" role="form">
                  <Typography variant="h4" fontWeight="medium">
                    新增專案
                  </Typography>
                  <Box display="flex" alignItems="center" pt={3} px={2}>
                    <Typography variant="h5" fontWeight="medium" mr={2}>
                      名稱:
                    </Typography>
                    <Box mr={2}>
                      <TextField type="projec-name" label="專案名稱" />
                    </Box>
                    <LoadingButton variant="contained" color="info">
                      新增
                    </LoadingButton>
                  </Box>
                  <Typography variant="h4" fontWeight="medium" mt={3}>
                    刪除專案
                  </Typography>
                  <Box display="flex" alignItems="center" pt={3} px={2}>
                    <Typography variant="h5" fontWeight="medium" mr={2}>
                      專案名稱:
                    </Typography>
                    <Box mr={2}>
                      <FormControl>
                        <InputLabel id="demo-simple-select-label">專案</InputLabel>
                        <Select
                          labelId="permission-select-label"
                          id="permission-select"
                          value={age}
                          label="專案"
                          onChange={handleChange}
                          style={{ minWidth: "200px", height: "45px" }}
                        >
                          <MenuItem value={10}>專案 A</MenuItem>
                          <MenuItem value={20}>專案 B</MenuItem>
                          <MenuItem value={30}>專案 C</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                    <LoadingButton
                      variant="contained"
                      color="error"
                      onClick={projectDeleteHandleClickOpen}
                    >
                      刪除專案
                    </LoadingButton>
                    <Dialog
                      open={projectDeleteOpen}
                      onClose={projectDeleteHandleClose}
                      aria-labelledby="alert-dialog-permission"
                      aria-describedby="alert-dialog-permission"
                    >
                      <DialogTitle id="alert-dialog-title">是否刪除專案?</DialogTitle>
                      <DialogContent>
                        <DialogContentText id="alert-dialog-permission">
                          按下刪除按鈕後將會刪除專案
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                        <LoadingButton
                          onClick={projectDeleteHandleClose}
                          color="error"
                          autoFocus
                          variant="contained"
                        >
                          刪除
                        </LoadingButton>
                        <LoadingButton
                          onClick={projectDeleteHandleClose}
                          color="info"
                          autoFocus
                          variant="contained"
                        >
                          关闭
                        </LoadingButton>
                      </DialogActions>
                    </Dialog>
                  </Box>
                </Box>
                <Typography variant="h4" fontWeight="medium" mt={3}>
                  編輯專案人員
                </Typography>
                <Box display="flex" alignItems="center" pt={3} px={2}>
                  <Typography variant="h5" fontWeight="medium" mr={2}>
                    專案名稱:
                  </Typography>
                  <FormControl>
                    <InputLabel id="demo-simple-select-label">專案</InputLabel>
                    <Select
                      labelId="permission-select-label"
                      id="permission-select"
                      value={age}
                      label="專案"
                      onChange={handleChange}
                      style={{ minWidth: "200px", height: "45px" }}
                    >
                      <MenuItem value={10}>專案 A</MenuItem>
                      <MenuItem value={20}>專案 B</MenuItem>
                      <MenuItem value={30}>專案 C</MenuItem>
                    </Select>
                  </FormControl>
                  <Box ml={2}>
                    <LoadingButton variant="contained" color="info">
                      查詢
                    </LoadingButton>
                  </Box>
                </Box>
                <Box display="flex" alignItems="center" pt={3} px={2}>
                  <Typography variant="h5" fontWeight="medium" mr={2}>
                    人員查詢:
                  </Typography>
                  <Box mr={2}>
                    <TextField type="search-staff" label="請輸入帳號" />
                  </Box>
                  <LoadingButton variant="contained" color="info">
                    查詢
                  </LoadingButton>
                </Box>
                <Box display="flex" alignItems="center" pt={3} px={2}>
                  <Typography variant="h5" fontWeight="medium" mr={2}>
                    人員名稱:
                  </Typography>
                  <Box mr={2}>
                    <TextField type="add-staff" label="人員新增" />
                  </Box>
                  <LoadingButton variant="contained" color="info">
                    新增
                  </LoadingButton>
                </Box>
              </Box>
              <Divider sx={{ borderBottomWidth: 3 }} />
            </Grid>
          </Grid>
          <Grid container spacing={1} mt={1}>
            <Grid xs={{ md: 12 }}>
              <Box pt={4} pb={3} px={3}>
                <Typography variant="h4" fontWeight="medium" mt={3}>
                  編輯專案機台
                </Typography>
                <Box display="flex" alignItems="center" pt={3} px={2}>
                  <Typography variant="h5" fontWeight="medium" mr={2}>
                    專案名稱:
                  </Typography>
                  <FormControl>
                    <InputLabel id="demo-simple-select-label">專案</InputLabel>
                    <Select
                      labelId="permission-select-label"
                      id="permission-select"
                      value={age}
                      label="專案"
                      onChange={handleChange}
                      style={{ minWidth: "200px", height: "45px" }}
                    >
                      <MenuItem value={10}>專案 A</MenuItem>
                      <MenuItem value={20}>專案 B</MenuItem>
                      <MenuItem value={30}>專案 C</MenuItem>
                    </Select>
                  </FormControl>
                  <Box ml={2}>
                    <LoadingButton variant="contained" color="info">
                      查詢
                    </LoadingButton>
                  </Box>
                </Box>
                <Box display="flex" alignItems="center" pt={3} px={2}>
                  <Typography variant="h5" fontWeight="medium" mr={2}>
                    新增機台:
                  </Typography>
                  <Box mr={2}>
                    <TextField type="search-staff" label="請輸入機台名稱" />
                  </Box>
                  <LoadingButton variant="contained" color="info">
                    新增
                  </LoadingButton>
                </Box>
              </Box>
              <Divider sx={{ borderBottomWidth: 3 }} />
            </Grid>
          </Grid>
          <Grid container spacing={1} mt={1}>
            <Grid sx={{ md: 12 }}>
              <Box pt={4} pb={3} px={3}>
                <Typography variant="h4" fontWeight="medium" mt={3}>
                  編輯機台事件
                </Typography>
                <Box display="flex" alignItems="center" pt={3} px={2}>
                  <Typography variant="h5" fontWeight="medium" mr={2}>
                    專案名稱:
                  </Typography>
                  <FormControl>
                    <InputLabel id="demo-simple-select-label">專案</InputLabel>
                    <Select
                      labelId="permission-select-label"
                      id="permission-select"
                      value={age}
                      label="專案"
                      onChange={handleChange}
                      style={{ minWidth: "200px", height: "45px" }}
                    >
                      <MenuItem value={10}>專案 A</MenuItem>
                      <MenuItem value={20}>專案 B</MenuItem>
                      <MenuItem value={30}>專案 C</MenuItem>
                    </Select>
                  </FormControl>
                  <Box ml={2}>
                    <LoadingButton variant="contained" color="info">
                      查詢
                    </LoadingButton>
                  </Box>
                </Box>
                <Box display="flex" alignItems="center" pt={3} px={2}>
                  <Typography variant="h5" fontWeight="medium" mr={2}>
                    機台名稱:
                  </Typography>
                  <FormControl>
                    <InputLabel id="demo-simple-select-label">機台</InputLabel>
                    <Select
                      labelId="permission-select-label"
                      id="permission-select"
                      value={age}
                      label="機台"
                      onChange={handleChange}
                      style={{ minWidth: "200px", height: "45px" }}
                    >
                      <MenuItem value={10}>機台 A</MenuItem>
                      <MenuItem value={20}>機台 B</MenuItem>
                      <MenuItem value={30}>機台 C</MenuItem>
                    </Select>
                  </FormControl>
                  <Box ml={2}>
                    <LoadingButton variant="contained" color="info">
                      查詢
                    </LoadingButton>
                  </Box>
                </Box>
                <Box display="flex" alignItems="center" pt={3} px={2}>
                  <Typography variant="h5" fontWeight="medium" mr={2}>
                    事件名稱:
                  </Typography>
                  <Box mr={2}>
                    <TextField type="search-staff" label="請輸入事件名稱" />
                  </Box>
                  <LoadingButton variant="contained" color="info">
                    新增
                  </LoadingButton>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </ThemeProvider>

  );
}