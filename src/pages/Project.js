import React, { useState, useEffect } from "react";
import { apiGetProjectDevices, apiPostProjectDevices, apiGetProjectName, apiDeleteProject } from '../api'
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
import { type } from "@testing-library/user-event/dist/type";

// import { apiMissionEmergency, apiMissionNeedRepair } from "../api.js";


const darkTheme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#62aaf4',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#000000',
    },
    primary: {
      // Purple and green play nicely together.
      main: '#696969',
    },
  },
});

const columns = [
  { field: 'project', headerName: '專案名稱', width: 200 },
  { field: 'line', headerName: '線別', width: 200 },
  { field: 'device', headerName: '機台名稱', width: 200 },
  { field: 'ename', headerName: 'ename', width: 600 },
  { field: 'cname', headerName: 'cname', width: 300 }
];

const empColumns = [
  { field: 'id', headerName: '員工編號', width: 250 },
  { field: 'empName', headerName: '員工名稱', width: 250 },
  { field: 'permission', headerName: '權限', width: 250 },
];

const rows = [
  { "project": "d7x e75", "line": "1", "device": "Device 5", "ename": "Glue AOI", "cname": "防膠水檢測" },
  { "project": "d7x e75", "line": "1", "device": "Device 6", "ename": "Bushing", "cname": "Bushing組裝" },
  { "project": "d7x e75", "line": "1", "device": "Device 8", "ename": "Bracket", "cname": "Bracket組裝" },
  { "project": "d7x e75", "line": "2", "device": "Device 5", "ename": "Glue AOI", "cname": "防膠水檢測" },
  { "project": "d7x e75", "line": "2", "device": "Device 6", "ename": "Bushing", "cname": "Bushing組裝" },
  { "project": "d7x e75", "line": "2", "device": "Device 8", "ename": "Bracket", "cname": "Bracket組裝" },
  { "project": "d1y e77", "line": "1", "device": "Device 5", "ename": "Glue AOI", "cname": "防膠水檢測" },
  { "project": "d1y e77", "line": "1", "device": "Device 6", "ename": "Bushing", "cname": "Bushing組裝" },
  { "project": "d1y e77", "line": "1", "device": "Device 8", "ename": "Bracket", "cname": "Bracket組裝" },
  { "project": "d1y e77", "line": "2", "device": "Device 5", "ename": "Glue AOI", "cname": "防膠水檢測" },
  { "project": "d1y e77", "line": "2", "device": "Device 6", "ename": "Bushing", "cname": "Bushing組裝" },
];


const empRows = [
  { id: "c001", empName: '王小明', permission: '系統管理者' },
  { id: "c002", empName: '王小美', permission: '專案管理者' },
  { id: "c003", empName: '陳小新', permission: '專案負責人' },
  { id: "c004", empName: '羅聖閔', permission: '一般員工' },
  { id: "c005", empName: '李大同', permission: '系統管理者' },
  { id: "c006", empName: '林定遠', permission: '專案管理者' },
  { id: "c007", empName: '李小翔', permission: '專案負責人' },
  { id: "c008", empName: '許銘軒', permission: '一般員工' },
  { id: "c009", empName: '陳小龍', permission: '專案負責人' },
  { id: "c0010", empName: '江小婷', permission: '一般員工' },
  { id: "c0011", empName: '何美美', permission: '一般員工' },
];



export default function Project({ token, setAlert, ...rest }) {
  const [selectedDevicesData, setSelectedDevicesData] = useState();
  const [projectID, setProjectID] = useState("");
  const [project, setProject] = useState([]);
  const [projectName, setProjectName] = useState("");
  const [permission, setPermission] = useState("");
  const [projectDeleteOpen, setProjectDeleteOpen] = useState(false);
  const [projectList, setProjectList] = useState([]);
  const [employeeName, setEmployeeName] = useState("");

  const projectNameChange = (event) => {
    setProjectID(event.target.value);
  };
  const permissionChange = (event) => {
    setPermission(event.target.value);
  };
  const projectDeleteHandleClickOpen = () => {
    setProjectDeleteOpen(true);
  };
  const projectDeleteHandleClose = () => {
    setProjectDeleteOpen(false);
  };

  const projectDelete = () => {
    const data = {
      token: token,
      projectID: projectID
    }
    console.log(data)
    apiDeleteProject(data)
      .then(() => {
        projectDeleteHandleClose(); // 请求完成后关闭对话框
      })
      .catch((error) => {
        // 处理错误
        console.error(error);
      });
  };

  function handleUpdateProject() {
    apiGetProjectName(token)
      .then((res) => {
        setProject(res.data);
        console.log(project)
      })
      .catch((error) => {
        console.error('Error fetching project data:', error);
      });
  }
  useEffect(() => {
    // 在这里调用你的 API 获取项目数据
    apiGetProjectName(token)
      .then((res) => {
        setProject(res.data);
        console.log(project)
      })
      .catch((error) => {
        console.error('Error fetching project data:', error);
      });
  }, []); // 空数组作为第二个参数，表示仅在组件加载时调用 useEffect

  //Get資料庫裡project裡面的device詳細清單
  function handleOnClickProject() {
    console.log(document.getElementById('searchProject').value)
    let search = document.getElementById('searchProject').value;
    const data = {
      'name': search
    }
    apiGetProjectDevices(data)
      .then(data => {
        console.log(data.data)
        const newData = data.data.map((item, index) => ({
          ...item,
          id: index + 1, // 使用唯一的值作為 id
        }));
        console.log(newData)
        setProjectList(newData);
        console.log(projectList)
      }).catch(err => { console.log(err) })
  };

  //取得datagrid裡面所有select的資料
  const onRowsSelectionHandler = (ids) => {
    console.log(ids)
    console.log(type(ids))
    console.log(projectList)
    const selectedRowsData = ids.map((id) => projectList.find((row) => row.id === id))
    const newData = selectedRowsData.map(item => {
      // 創建一個新物件，只包含你要保留的欄位
      const { project, line, device, ename, cname } = item;
      return { project, line, device, ename, cname };
    });
    setSelectedDevicesData(newData);
    console.log(newData);
  };

  function handleOnClickProjectPost() {
    console.log(selectedDevicesData)
    const data = {
      token: token,
      devicePostData: selectedDevicesData
    }
    apiPostProjectDevices(data)
      .then(res => {
        if (res === null) {
          setAlert({
            'open': true,
            'msg': `資料建立完成`,
            'type': 'warning',
            'duration': 10000
          })
        }
      }).catch(err => { console.log(err) })
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Card>
        <Box sx={{ bgcolor: '#696969' }}>
          <CardHeader title="專案" color="#696969" />
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
                      <TextField id="searchProject" type="search-staff" label="專案名稱" />
                    </Box>
                    <Box ml={2}>
                      <LoadingButton variant="contained" color="info" onClick={handleOnClickProject}>
                        查詢
                      </LoadingButton>
                    </Box>
                  </Box>
                </Box>
                <Box display="flex" alignItems="center" pt={3} px={2}>
                  <div style={{ height: 600, width: '100%' }}>
                    <DataGrid
                      rows={projectList}
                      columns={columns}
                      initialState={{
                        pagination: {
                          paginationModel: { pageSize: 5 },
                        },
                      }}
                      pageSizeOptions={[5]}
                      checkboxSelection
                      onSelectionModelChange={(ids) => onRowsSelectionHandler(ids)}
                    />
                  </div>
                </Box>
                <Box display="flex" pt={3} px={2}>
                  <Box>
                    <LoadingButton variant="contained" color="info" onClick={handleOnClickProjectPost}>
                      新增專案
                    </LoadingButton>
                  </Box>
                </Box>
                <Divider sx={{ borderBottomWidth: 3, mt: 2 }} />
                <Box component="form" role="form" mb={3}>
                  <Typography variant="h4" fontWeight="medium" mt={3}>
                    刪除專案
                  </Typography>
                  <LoadingButton
                    variant="contained"
                    color="info"
                    onClick={handleUpdateProject}
                  >
                    更新專案
                  </LoadingButton>
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
                          value={projectID}
                          label="專案"
                          onChange={projectNameChange}
                          style={{ minWidth: "200px", height: "45px" }}
                        >
                          {project.map((projectItem) => (
                            <MenuItem value={projectItem.id}>
                              {projectItem.name}
                            </MenuItem>
                          ))}
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
                        <Button
                          onClick={projectDelete}
                          color="#f44336"
                          variant="contained"
                        >
                          刪除
                        </Button>
                        <LoadingButton
                          onClick={projectDeleteHandleClose}
                          color="info"
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
                    新增專案人員
                  </Typography>
                  <Box display="flex" alignItems="center" pt={3} px={2}>
                    <Typography variant="h5" fontWeight="medium" mr={2}>
                      員工ID:
                    </Typography>
                    <Box mr={2}>
                      <TextField type="search-staff" label="請輸入員工ID" />
                    </Box>
                    <LoadingButton variant="contained" color="info">
                      查詢
                    </LoadingButton>
                  </Box>
                  <Box display="flex" alignItems="center" pt={3} px={2}>
                    <Typography variant="h5" fontWeight="medium" mr={2}>
                      人員名稱:
                    </Typography>
                    <Typography variant="h5" fontWeight="medium" mr={2}>
                      {employeeName}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" pt={3} px={2}>
                    <Typography variant="h5" fontWeight="medium" mr={2}>
                      專案名稱:
                    </Typography>
                    {/* <FormControl>
                      <InputLabel id="demo-simple-select-label">專案</InputLabel>
                      <Select
                        labelId="permission-select-label"
                        id="permission-select"
                        value={projectName}
                        label="專案"
                        onChange={projectNameChange}
                        style={{ minWidth: "200px", height: "45px" }}
                      >
                        <MenuItem value={10}>D7X</MenuItem>
                        <MenuItem value={20}>D6X</MenuItem>
                        <MenuItem value={30}>D1Y</MenuItem>
                      </Select>
                    </FormControl> */}
                  </Box>
                  <Box display="flex" alignItems="center" pt={3} px={2}>
                    <Typography variant="h5" fontWeight="medium" mr={2}>
                      指定權限:
                    </Typography>
                    <FormControl>
                      <InputLabel id="demo-simple-select-label">權限</InputLabel>
                      <Select
                        labelId="permission-select-label"
                        id="permission-select"
                        value={permission}
                        label="權限"
                        onChange={permissionChange}
                        style={{ minWidth: "200px", height: "45px" }}
                      >
                        <MenuItem value={10}>系統管理者</MenuItem>
                        <MenuItem value={20}>專案管理者</MenuItem>
                        <MenuItem value={30}>專案負責人</MenuItem>
                        <MenuItem value={40}>一般員工</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                  <Box display="flex" alignItems="center" pt={3} px={2}>
                    <Box>
                      <LoadingButton variant="contained" color="info">
                        新增
                      </LoadingButton>
                    </Box>
                  </Box>
                </Box>
                <Divider sx={{ borderBottomWidth: 3 }} />
                <Box component="form" role="form" mb={3}>
                  <Typography variant="h4" fontWeight="medium" mt={3}>
                    刪除專案人員
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
                          value={project}
                          label="專案"
                          onChange={projectNameChange}
                          style={{ minWidth: "200px", height: "45px" }}
                        >
                          <MenuItem value={10}>D7X</MenuItem>
                          <MenuItem value={20}>D6X</MenuItem>
                          <MenuItem value={30}>D1Y</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                  </Box>
                </Box>
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
                    <LoadingButton
                      variant="contained"
                      color="error"
                      onClick={projectDeleteHandleClickOpen}
                    >
                      刪除
                    </LoadingButton>
                    <Dialog
                      open={projectDeleteOpen}
                      onClose={projectDeleteHandleClose}
                      aria-labelledby="alert-dialog-permission"
                      aria-describedby="alert-dialog-permission"
                    >
                      <DialogTitle id="alert-dialog-title">是否刪除專案人員?</DialogTitle>
                      <DialogContent>
                        <DialogContentText id="alert-dialog-permission">
                          按下刪除按鈕後將會刪除專案人員
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
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </ThemeProvider>

  );
}