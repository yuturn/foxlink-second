import React, { useState, useEffect, useContext } from "react";
import { apiPostAutoTrain, apiGetProjectDevices, apiGetProjectUserBelong, apiDeleteProjectUserBelong, apiGetStatistics, apiPostProjectDevices, apiGetProjectprogress, apiGetProjectName, apiPostAdminProjectDevices, apiDeleteProject, apiDeleteAdminProjectDevices, apiGetProjectUsers, apiPostProjectUser, apiDeleteProjectUser, apiGetUserName, apiGetProjectTable } from '../api'
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
  InputLabel,
  Button
} from '@mui/material';
import { GlobalContext } from '../components/GlobalContext';
import LoadingButton from '@mui/lab/LoadingButton';
import { DataGrid } from '@mui/x-data-grid';
// import dialog
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { FormControlLabel } from '@mui/material';
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import { type } from "@testing-library/user-event/dist/type";
import Switch from '@mui/material/Switch';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import FolderCopyIcon from '@mui/icons-material/FolderCopy';
import { Construction } from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";


const darkTheme = createTheme({
  palette: {
    mode: 'light',
    background: { default: '#62aaf4', paper: '#FFFFFF' },
    text: { primary: '#000000' },
    primary: { main: '#696969' },
  },
});

const Android12Switch = styled(Switch)(({ theme }) => ({
  padding: 8,
  '& .MuiSwitch-track': {
    borderRadius: 22 / 2,
    backgroundColor: '#808080', // Default (off) color
    '&::before, &::after': {
      content: '""',
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      width: 16,
      height: 16,
    },
    '&::before': {
      left: 12,
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(theme.palette.getContrastText('#007BFF'))}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
    },
    '&::after': {
      right: 12,
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(theme.palette.getContrastText('#007BFF'))}" d="M19,13H5V11H19V13Z" /></svg>')`,
    },
  },
  '& .MuiSwitch-thumb': {
    boxShadow: 'none',
    width: 16,
    height: 16,
    margin: 2,
    backgroundColor: '#808080',
  },
  '& .Mui-checked .MuiSwitch-thumb': {
    backgroundColor: '#007BFF', // Blue when checked
  },
  '& .Mui-checked + .MuiSwitch-track': {
    backgroundColor: '#00bbff', // Green when checked
  },
}));

function Adminpage({ token }) {
  const { globalVariable } = useContext(GlobalContext);
  const [projectTableList, setProjectTableList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [projectDeleteOpen, setProjectDeleteOpen] = useState(false);
  const [deleteProjectName, setDeleteProjectName] = useState("");
  const [preprocessingMonths, setPreprocessingMonths] = useState('365');
  const [monthsBeforeRetrain, setMonthsBeforeRetrain] = useState('180');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const fetchProjectList = () => {
    if (!token) {
      console.error("No token provided");
      return;
    }
    setLoading(true);
    apiGetProjectTable(token)
      .then((res) => {
        const newData = Object.entries(res.data).map(([key, valueArray], index) => ({
          id: index + 1,
          name: key,
          select: valueArray[0].select
        }));
        setProjectTableList(newData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch projects:", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProjectList();
  }, [token]);

  const handleSwitchChange = (id, event) => {
    const newState = event.target.checked;
    const newRows = projectTableList.map(row =>
      row.id === id ? { ...row, select: newState } : row
    );
    setProjectTableList(newRows);

    const selectedRow = newRows.find(row => row.id === id);
    if (newState) {
      postProject(selectedRow.name);
    } else {
      setDeleteProjectName(selectedRow.name);
      setProjectDeleteOpen(true);
    }
  };

  const postProject = (projectName) => {
    if (!token) return;
    apiPostAdminProjectDevices({ token, project: [projectName] })
      .then(() => {
        console.log("Project added:", projectName);
      })
      .catch((error) => {
        console.error("Failed to add project:", error);
      });
  };

  const confirmDeleteProject = () => {
    if (!token || !deleteProjectName) return;
    apiDeleteAdminProjectDevices({ token, project: deleteProjectName })
      .then(() => {
        console.log("Project deleted:", deleteProjectName);
        setProjectDeleteOpen(false);
        setDeleteProjectName("");
        fetchProjectList();
      })
      .catch((error) => {
        console.error("Failed to delete project:", error);
      });
  };

  const handleCloseDialog = () => {
    setProjectDeleteOpen(false);
    if (!deleteProjectName) {
      fetchProjectList();
    }
  };

  const apiPostTrainTimeStart = () => {
    const data = {
      token,
      preprocessing_months: parseInt(preprocessingMonths, 10),
      months_before_retrain: parseInt(monthsBeforeRetrain, 10),
      description: globalVariable === "zh-tw" ? "固定時間自動訓練" : globalVariable === "zh-cn" ? "固定时间自动训练" : "Scheduled Auto Training"
    };

    apiPostAutoTrain(data)
      .then((response) => {
        setSnackbarMessage(globalVariable === "zh-tw" ? "重新訓練間隔時間（天）&輸入回推時間（天）已設定成功" : globalVariable === "zh-cn" ? "重新训练间隔时间（天）&输入回推时间（天）已设置成功" : "Retrain Interval Days & Enter Retrospective Days have been successfully set");
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
      })
      .catch((error) => {
        setSnackbarMessage(globalVariable === "zh-tw" ? "設定失敗" : globalVariable === "zh-cn" ? "设置失败" : "Setting failed");
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        console.error('Error:', error);
      });
  };

  const columns = [
    { field: 'name', headerName: globalVariable === "zh-tw" ? "專案名稱" : globalVariable === "zh-cn" ? "专案名称" : "Project name", width: 200 },
    {
      field: 'select',
      headerName: globalVariable === "zh-tw" ? "是否加入專案中" : globalVariable === "zh-cn" ? "是否加入专案中" : "Whether to join the project", width: 200,
      renderCell: (params) => (
        <FormControlLabel
          control={
            <Android12Switch
              checked={params.value}
              onChange={(event) => handleSwitchChange(params.id, event)}
              color="default"
            />
          }
          label=""
        />
      ),
    },
  ];

  const handleSnackbarClose = () => setSnackbarOpen(false);

  return (
    <ThemeProvider theme={darkTheme}>
      <Box>
        <CardHeader title={globalVariable === "zh-tw" ? "專案表單" : globalVariable === "zh-cn" ? "专案表单" : "Project list"} color="#696969" />
        <Divider sx={{ my: 1 }} />
        <LoadingButton loading={loading} onClick={fetchProjectList} variant="contained" color="primary">
          {globalVariable === "zh-tw" ? "查詢現有專案" : globalVariable === "zh-cn" ? "查询现有专案" : "Query existing projects"}
        </LoadingButton>
        <div style={{ height: 725, width: '100%' }}>
          <DataGrid
            rows={projectTableList}
            columns={columns}
            pageSize={12}
            disableSelectionOnClick
            initialState={{
              sorting: {
                sortModel: [{ field: 'name', sort: 'asc' }],
              },
            }}
          />
        </div>
        <Dialog
          open={projectDeleteOpen}
          onClose={handleCloseDialog}
          aria-labelledby="alert-dialog-project"
          aria-describedby="alert-dialog-project"
        >
          <DialogTitle id="alert-dialog-title">
            {globalVariable === "zh-tw" ? "是否刪除機台?" : globalVariable === "zh-cn" ? "是否删除机台?" : "Delete Machine?"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-permission">
              {globalVariable === "zh-tw" ? "按下刪除按鈕後將會刪除機台" : globalVariable === "zh-cn" ? "按下删除按钮后将会删除机台" : "Clicking the delete button will delete the Machine"}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={confirmDeleteProject}
              color="error"
              variant="contained"
            >
              {globalVariable === "zh-tw" ? "刪除" : globalVariable === "zh-cn" ? "删除" : "Delete"}
            </Button>
            <Button
              onClick={() => {
                setProjectDeleteOpen(false);
                fetchProjectList(); // Add this line to re-fetch project list on dialog close
              }}
              color="info"
              variant="contained"
            >
              {globalVariable === "zh-tw" ? "關閉" : globalVariable === "zh-cn" ? "关闭" : "Close"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      <Grid container spacing={2} mt={1}>
        <Grid item xs={12} md={6}>
          <Card>
            <Box sx={{ bgcolor: '#696969' }}>
              <CardHeader title={globalVariable === "zh-tw" ? "訓練資料週期之設定" : globalVariable === "zh-cn" ? "训练数据周期之设定" : "Training Data Cycle Setting"} color="#62aaf4" />
            </Box>
            <Box component="form" sx={{ p: 3 }} role="form">
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={4}>
                  <Typography variant="h6" fontWeight="medium">
                    {globalVariable === "zh-tw" ? "資料回推時間（天）:" : globalVariable === "zh-cn" ? "数据回推时间（天）:" : "Data Retrospective Days:"}
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <TextField
                    type="number"
                    size="medium"
                    fullWidth
                    label={globalVariable === "zh-tw" ? "輸入回推時間（天）" : globalVariable === "zh-cn" ? "输入回推时间（天）" : "Enter Retrospective Days"}
                    value={preprocessingMonths}
                    onChange={(e) => setPreprocessingMonths(e.target.value)}
                  />
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="h6" fontWeight="medium">
                    {globalVariable === "zh-tw" ? "重新訓練間隔時間（天）:" : globalVariable === "zh-cn" ? "重新训练间隔时间（天）:" : "Retrain Interval Days:"}
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <TextField
                    type="number"
                    size="medium"
                    fullWidth
                    label={globalVariable === "zh-tw" ? "輸入重新訓練間隔時間（天）" : globalVariable === "zh-cn" ? "输入重新训练间隔时间（天）" : "Enter Retrain Interval Days"}
                    value={monthsBeforeRetrain}
                    onChange={(e) => setMonthsBeforeRetrain(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} display="flex" justifyContent="center">
                  <LoadingButton variant="contained" color="info" onClick={apiPostTrainTimeStart}>
                    {globalVariable === "zh-tw" ? "確定" : globalVariable === "zh-cn" ? "确定" : "Confirm"}
                  </LoadingButton>
                </Grid>
              </Grid>
            </Box>
          </Card>
        </Grid>
      </Grid>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }} // 中间上方位置
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}

export default Adminpage;
