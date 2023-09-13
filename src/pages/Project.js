import React, { useState } from "react";

import {
  Box,
  Card,
  CardHeader,
  CardContent,
  Divider,
  Grid,
  Typography,
  TextField,
  FormControl,
  InputLabel
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { DataGrid } from '@mui/x-data-grid';
// import dialog
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { createTheme, ThemeProvider } from '@mui/material/styles';

// import { apiMissionEmergency, apiMissionNeedRepair } from "../api.js";


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

const columns = [
  { field: 'id', headerName: 'ID', width: 150 },
  { field: 'machineName', headerName: '機台名稱', width: 400 }
];

const empColumns = [
  { field: 'id', headerName: 'ID', width: 150 },
  { field: 'badge', headerName: '員工編號', width: 250 },
  { field: 'empName', headerName: '員工名稱', width: 250 },

];

const rows = [
  { id: 1, machineName: 'Device1' },
  { id: 2, machineName: 'Device2' },
  { id: 3, machineName: 'Device3' },
  { id: 4, machineName: 'Device4' },
  { id: 5, machineName: 'Device5' },
  { id: 6, machineName: 'Device6' },
  { id: 7, machineName: 'Device7' },
  { id: 8, machineName: 'Device8' },
  { id: 9, machineName: 'Device9' },
  { id: 10, machineName: 'Device10' },
  { id: 11, machineName: 'Device11' },
];

const empRows = [
  { id: 1, badge: "c001", empName: '王小明' },
  { id: 2, badge: "c002", empName: '王小美' },
  { id: 3, badge: "c003", empName: '陳小新' },
  { id: 4, badge: "c004", empName: '羅聖閔' },
  { id: 5, badge: "c005", empName: '李大同' },
  { id: 6, badge: "c006", empName: '林定遠' },
  { id: 7, badge: "c007", empName: '李小翔' },
  { id: 8, badge: "c008", empName: '許銘軒' },
  { id: 9, badge: "c009", empName: '陳小龍' },
  { id: 10, badge: "c0010", empName: '江小婷' },
  { id: 11, badge: "c0011", empName: '何美美' },
];

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
          <CardHeader title="專案" color="#62aaf4" />
        </Box>
        <Divider sx={{ borderBottomWidth: 3 }} />
        <CardContent>
          <Grid container spacing={1}>
            <Grid item xs={12} md={12}>
              <Box>
                <Box component="form" role="form" mb={3}>
                  <Typography variant="h4" fontWeight="medium" mt={3}>
                    新增專案
                  </Typography>
                  <Box display="flex" alignItems="center" pt={3} px={2}>
                    <Typography variant="h5" fontWeight="medium" mr={2}>
                      專案名稱:
                    </Typography>
                    <Box mr={2}>
                      <TextField type="search-staff" label="專案名稱" />
                    </Box>
                    <LoadingButton variant="contained" color="info">
                      新增
                    </LoadingButton>
                  </Box>
                </Box>
                <Divider sx={{ borderBottomWidth: 3 }} />
                <Box component="form" role="form" mb={3}>
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
                <Divider sx={{ borderBottomWidth: 3 }} />
                <Box component="form" role="form" mb={3}>
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
                <Box display="flex" alignItems="center" pt={3} px={2}>
                  <div style={{ height: 400, width: '100%' }}>
                    <DataGrid
                      rows={empRows}
                      columns={empColumns}
                      initialState={{
                        pagination: {
                          paginationModel: { page: 0, pageSize: 5 },
                        },
                      }}
                      pageSizeOptions={[5, 10]}
                      checkboxSelection
                    />
                  </div>
                </Box>
                <Box display="flex" pt={3} px={2}>
                  <Box>
                    <LoadingButton variant="contained" color="error">
                      刪除
                    </LoadingButton>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Card sx={{ mt: 2 }}>
        <Box sx={{ bgcolor: 'info.main' }}>
          <CardHeader title="專案機台" color="#62aaf4" />
        </Box>
        <Divider sx={{ borderBottomWidth: 3 }} />
        <CardContent>
          <Grid container spacing={1} mt={2}>
            <Grid xs={12} sx={{ md: 12 }}>
              <Box pt={4} pb={3} px={3}>
                <Box display="flex" alignItems="center" px={2} mb={3}>
                  <Typography variant="h4" fontWeight="medium" mr={2}>
                    編輯專案機台
                  </Typography>
                  <Box display="flex" alignItems="center" pt={3} px={2}>
                    <Typography variant="h5" fontWeight="medium" mr={2}>
                      專案名稱:
                    </Typography>
                    <Box mr={2}>
                      <TextField type="search-staff" label="請輸入專案名稱" />
                    </Box>
                    <Box ml={2}>
                      <LoadingButton variant="contained" color="info">
                        查詢
                      </LoadingButton>
                    </Box>
                  </Box>
                </Box>
                <Divider sx={{ borderBottomWidth: 3 }} />
                <Box display="flex" alignItems="center" pt={3} px={2}>
                  <div style={{ height: 600, width: '100%' }}>
                    <DataGrid
                      rows={rows}
                      columns={columns}
                      initialState={{
                        pagination: {
                          paginationModel: { page: 0, pageSize: 5 },
                        },
                      }}
                      pageSizeOptions={[5, 10]}
                      checkboxSelection
                    />
                  </div>
                </Box>
                <Box display="flex" pt={3} px={2}>
                  <Box>
                    <LoadingButton variant="contained" color="info">
                      新增
                    </LoadingButton>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </ThemeProvider>

  );
}