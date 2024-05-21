import React, { useState, useEffect, useContext } from "react";
import dayjs from 'dayjs';
import { apiGetProjectDevices, apiGetProjectUserBelong, apiDeleteProjectUserBelong, apiDeleteProject, apiGetStatistics, apiPostProjectDevices, apiGetProjectprogress, apiGetProjectName, apiPostAdminProjectDevices, apiDeleteAdminProjectDevices, apiGetProjectUsers, apiPostProjectUser, apiDeleteProjectUser, apiGetUserName, apiGetProjectTable } from '../api';
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
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { GlobalPermissionProvider, GlobalPermissionContext } from '../components/GlobalPermission';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import FolderCopyIcon from '@mui/icons-material/FolderCopy';

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
      main: '#696969',
    },
  },
});

const columnsListTW = [
  { field: 'project', headerName: '專案名稱', width: 200 },
];
const columnsTW = [
  { field: 'project', headerName: '專案名稱', width: 200 },
  { field: 'line', headerName: '線別', width: 200 },
  { field: 'device', headerName: '機台名稱', width: 200 },
  { field: 'ename', headerName: 'ename', width: 450 },
  { field: 'cname', headerName: 'cname', width: 300 }
];
const columnsprojectprogressTW = [
  { field: 'project_name', headerName: '專案名稱', width: 200 },
  { field: 'action', headerName: '流程', width: 200 },
  { field: 'status', headerName: '進度', width: 200 },
];
const empColumnsTW = [
  { field: 'badge', headerName: '員工編號', width: 250 },
  { field: 'username', headerName: '員工名稱', width: 250 },
  { field: 'permission', headerName: '權限', width: 250 },
];
const columnsProjectFromUserTW = [
  { field: 'project_id', headerName: 'project_id', width: 250 },
  { field: 'project', headerName: '專案名稱', width: 200 },
];
const permissionMap = {
  5: "系統管理者",
  4: "專案管理者",
  2: "專案負責人",
  1: "一般員工"
};

export default function Project({ token, setAlert, ...rest }) {
  const [selectedDevicesData, setSelectedDevicesData] = useState([]);
  const [selectedDeleteDevicesData, setSelectedDeleteDevicesData] = useState([]);
  const [selectedAdminDevicesData, setSelectedAdminDevicesData] = useState([]);
  const [selectedProjectRow, setSelectedProjectRow] = useState(null);
  const [selectedDevicesDataUser, setSelectedDevicesDataUser] = useState([]);
  const [selectedProjectDataBelong, setSelectedProjectDataBelong] = useState("");
  const [projectID, setProjectID] = useState("");
  const [project, setProject] = useState([]);
  const [permission, setPermission] = useState("");
  const [projectDeleteOpen, setProjectDeleteOpen] = useState(false);
  const [userDeleteOpen, setUserDeleteOpen] = useState(false);
  const [userDeleteBelongOpen, setUserDeleteBelongOpen] = useState(false);
  const [projectList, setProjectList] = useState([]);
  const [projectDeleteList, setProjectDeleteList] = useState([]);
  const [projectProcessList, setProjectProcessList] = useState([]);
  const [employeeName, setEmployeeName] = useState("");
  const [projectUsers, setProjectUsers] = useState([]);
  const [projectUsersBelong, setProjectUsersBelong] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const { globalVariable } = useContext(GlobalContext);
  const [loading, setLoading] = useState(false);
  const [projectIDSelect, setProjectIDSelect] = useState("");
  const { globalPermission } = useContext(GlobalPermissionContext);

  const projectSelectNameChange = (event) => {
    setProjectIDSelect(event.target.value);
    handleUpdateProjectUser();
  };

  const projectNameChange = (event) => {
    setProjectID(event.target.value);
    handleUpdateProjectUser();
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

  const userDeleteHandleClickOpen = () => {
    setUserDeleteOpen(true);
  };

  const userDeleteBelongHandleClickOpen = () => {
    setUserDeleteBelongOpen(true);
  };

  const userDeleteHandleClose = () => {
    setUserDeleteOpen(false);
  };

  const userDeleteHandleBelongClose = () => {
    setUserDeleteBelongOpen(false);
  };

  const [alertOpenProject, setAlertOpenProject] = useState(false);
  const [messageProject, setMessageProject] = useState('');

  const handleOpenProject = (message) => {
    setMessageProject(message);
    setAlertOpenProject(true);
  };

  const handleCloseProject = (event, reason) => {
    setAlertOpenProject(false);
  };

  const [errorAlertOpenProject, setErrorAlertOpenProject] = useState(false);
  const [errorMessageProject, setErrorMessageProject] = useState('');

  const handleErrorOpenProject = (message) => {
    setErrorMessageProject(message);
    setErrorAlertOpenProject(true);
  };

  const handleErrorCloseProject = (event, reason) => {
    setErrorAlertOpenProject(false);
  };

  const [alertOpenUser, setAlertOpenUser] = useState(false);
  const [messageUser, setMessageUser] = useState('');

  const handleOpenUser = (message) => {
    setMessageUser(message);
    setAlertOpenUser(true);
  };

  const handleCloseUser = (event, reason) => {
    setAlertOpenUser(false);
  };

  const [errorAlertOpenUser, setErrorAlertOpenUser] = useState(false);
  const [errorMessageUser, setErrorMessageUser] = useState('');

  const handleErrorOpenUser = (message) => {
    setErrorMessageUser(message);
    setErrorAlertOpenUser(true);
  };

  const handleErrorCloseUser = (event, reason) => {
    setErrorAlertOpenUser(false);
  };

  const projectDelete = () => {
    const data = {
      token: token,
      project: selectedDeleteDevicesData
    };
    apiDeleteProject(data)
      .then((res) => {
        handleOpenProject(globalVariable === "zh-tw" ? "刪除專案成功" : globalVariable === "zh-cn" ? "删除专案成功" : "Delete project successful");
        projectDeleteHandleClose();
      }).catch((error) => {
        console.error(error);
        handleErrorOpenProject(globalVariable === "zh-tw" ? ("刪除專案失敗" + error) : globalVariable === "zh-cn" ? ("删除专案失败:" + error) : ("Delete project failed:" + error));
      });
  };

  const projectAdminhandleDelete = () => {
    const data = {
      token: token,
      project: selectedAdminDevicesData.map(device => device.project).join(',')
    };
    apiDeleteAdminProjectDevices(data)
      .then((res) => {
        handleOpenProject(globalVariable === "zh-tw" ? "刪除專案成功" : globalVariable === "zh-cn" ? "删除专案成功" : "Delete project successful");
        setLoading(false);
        setProjectTableListPost(currentProjects =>
          currentProjects.filter(project =>
            !data.project.includes(project)
          )
        );
      }).catch((error) => {
        console.error(error);
        handleErrorOpenProject(globalVariable === "zh-tw" ? ("刪除專案失敗" + error) : globalVariable === "zh-cn" ? ("删除专案失败:" + error) : ("Delete project failed:" + error));
        setLoading(false);
      });
  };
  const [employeeResponse, setEmployeeResponse] = useState('');

  function handleOnclickGetUserName() {
    let userid = document.getElementById("userID").value;
    const data = {
      userID: userid,
      systemID: '1'
    };
    apiGetUserName(data)
      .then((res) => {
        console.log('Response received:', res);
        if (res.data && res.data.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
          const userName = res.data.data[0].user_name;
          setEmployeeName(userName);
          handleOpenUser(globalVariable === "zh-tw" ? "查詢成功" : globalVariable === "zh-cn" ? "查询成功" : "Search successful");
          setEmployeeResponse(userid);
        } else {
          setEmployeeResponse(userid);
        }
      })
      .catch((error) => {
        console.error('Error in API call:', error);
        if (error.response && error.response.data && error.response.data.detail) {
          setEmployeeResponse(`Error: ${error.response.data.detail}`);
        } else {
          setEmployeeResponse(`Error: ${error.message}`);
        }
      });
  }
  const [projectNameList, setProjectNameList] = useState([]);
  const getProjectName = (token) => {
    if (!token) {
      return;
    }

    apiGetStatistics(token)
      .then((res) => {
        const list = res.data.map((project) => project.project_name);
        setProjectNameList(list);
      });
  };

  function handleUpdateProjectUser() {
    if (!projectID) {
      return;
    }
    const data = {
      token: token,
      projectID: projectID
    };
    apiGetProjectUsers(data)
      .then((res) => {
        const newData = res.data.map((item, index) => ({
          ...item,
          id: index + 1,
          role: permissionMap[item.permission]
        }));
        setProjectUsers(newData);
      })
      .catch((error) => {
        console.error('Error fetching project data:', error);
      });
  }

  useEffect(() => {
    getProjectName(token);
    apiGetProjectName(token)
      .then((res) => {
        setProject(res.data);
      })
      .catch((error) => {
        console.error('Error fetching project data:', error);
      });
    handleUpdateProjectUser();
  }, [projectID, selectedDevicesDataUser]);

  const [selectionModel, setSelectionModel] = useState([]);

  function handleOnClickProjectAdd() {
    const data = {
      'name': projectIDSelect
    };
    apiGetProjectDevices(data)
      .then(response => {
        const responseData = response.data;
        const newData = responseData.map((item, index) => ({
          ...item,
          id: index + 1,
          selected: item.select ? item.select : 0,
          selectedDisplay: item.select ? (item.select === 1 ? '是' : '否') : '否',
          select: item.select
        }));
        const selectedIds = newData.filter((item) => item).map((item) => item.id);
        const unselectedItems = newData.filter((item) => item);
        setProjectList(unselectedItems);
        setSelectionModel(selectedIds);
        handleOpenProject(globalVariable === "zh-tw" ? "查詢成功" : globalVariable === "zh-cn" ? "查询成功" : "Search successful");
      })
      .catch(err => {
        handleErrorOpenProject(globalVariable === "zh-tw" ? ("查詢專案失敗: " + err) : globalVariable === "zh-cn" ? ("查询专案失败:" + err) : ("Query project failed:" + err));
      });
  }

  function handleOnClickProjectDelete() {
    const data = {
      token: token,
      'name': projectIDSelect
    };
    apiGetProjectDevices(data)
      .then(response => {
        const responseData = response.data;
        const newData = responseData.map((item, index) => ({
          ...item,
          id: index + 1,
          selected: item.select ? item.select : 0,
          selectedDisplay: item.select ? (item.select === 1 ? '是' : '否') : '否',
        }));
        const selectedIds = newData.filter((item) => item.select === 1).map((item) => item.id);
        const unselectedItems = newData.filter((item) => item.select === 1);
        setProjectDeleteList(unselectedItems);
        setSelectionModel(selectedIds);
        handleOpenProject(globalVariable === "zh-tw" ? "查詢成功" : globalVariable === "zh-cn" ? "查询成功" : "Search successful");
      })
      .catch(err => {
        handleErrorOpenProject(globalVariable === "zh-tw" ? ("查詢專案失敗: " + err) : globalVariable === "zh-cn" ? ("查询专案失败:" + err) : ("Query project failed:" + err));
      });
  }

  function handleOnClickProjectProcess() {
    apiGetProjectprogress(token)
      .then(response => {
        const responseData = response.data;
        const newData = responseData.map((item, index) => ({
          ...item,
          id: index + 1,
          project_name: item.project_name,
          action: item.action,
          status: item.status
        }));
        setProjectProcessList(newData);
        handleOpenProject(globalVariable === "zh-tw" ? "查詢專案進度成功" : globalVariable === "zh-cn" ? "查询专案进度成功" : "Search Project progress successful");
      })
      .catch(err => {
        handleErrorOpenProject(globalVariable === "zh-tw" ? ("查詢專案進度失敗: " + err) : globalVariable === "zh-cn" ? ("查询专案进度失败:" + err) : ("Query Project progress failed:" + err));
      });
  }

  const onRowsSelectionHandlerAdmin = (ids) => {
    const selectedRowsData = ids.map((id) => projectTableList.find((row) => row.id === id));
    const newData = selectedRowsData.map(item => {
      const { project } = item;
      return { project };
    });
    setSelectedAdminDevicesData(newData);
  };

  const onRowsSelectionHandler = (ids) => {
    const selectedRowsData = ids.map((id) => projectList.find((row) => row.id === id));
    const newData = selectedRowsData.map(item => {
      const { project, line, device, ename, cname } = item;
      return { project, line, device, ename, cname };
    });
    setSelectedDevicesData(newData);
  };

  const onRowsSelectionHandlerDelete = (ids) => {
    const selectedRowsData = ids.map((id) => projectList.find((row) => row.id === id));
    const newData = selectedRowsData.map(item => {
      const { project, line, device, ename, cname } = item;
      return { project, line, device, ename, cname };
    });
    setSelectedDeleteDevicesData(newData);
  };

  const onRowsSelectionHandlerUser = (ids) => {
    if (ids.length === 0) {
      setSelectedRow(null);
    } else {
      setSelectedRow(ids[0]);
    }
    const selectedRowsData = ids.map((id) => projectUsers.find((row) => row.id === id));
    setSelectedDevicesDataUser(selectedRowsData);
  };

  useEffect(() => {
    console.log("selectedProjectDataBelong updated:", selectedProjectDataBelong);
  }, [selectedProjectDataBelong]);

  const onRowsSelectionHandlerProjectFromUser = (ids) => {
    const selectedRowsProjectData = ids.map((id) => projectUsersBelong.find((row) => row.id === id));
    const newData = selectedRowsProjectData.map(item => {
      const project_id = item.project_id;
      return project_id;
    });
    setSelectedProjectDataBelong(newData[0]);
  };

  const [startDate, setStartDate] = useState(new Date());
  const formattedStartDate = dayjs(startDate).format('YYYY-MM-DD');

  function handleOnClickProjectPost() {
    if (!token) {
      return;
    }
    setLoading(true);
    const data = {
      token: token,
      project: selectedDevicesData,
      startDate: formattedStartDate
    };

    if (data.project === undefined || data.project.length === 0) {
      handleErrorOpenProject(globalVariable === "zh-tw" ? "尚未選取專案" : globalVariable === "zh-cn" ? "尚未选取专案" : "No project selected");
      setLoading(false);
    } else {
      handleOpenProject(globalVariable === "zh-tw" ? "正在進行專案前處理" : globalVariable === "zh-cn" ? "正在进行专案前处理" : "Project pre-processing in progress");
      apiPostProjectDevices(data)
        .then((res) => {
          handleOpenProject(globalVariable === "zh-tw" ? "新增專案成功" : globalVariable === "zh-cn" ? "新增专案成功" : "New project successful");
          setLoading(false);
        })
        .catch((err) => {
          handleErrorOpenProject(globalVariable === "zh-tw" ? "新增專案失敗" + err : globalVariable === "zh-cn" ? "新增专案失败" + err : "Failed to add new project" + err);
          setLoading(false);
        });
    }
  }

  const [projectTableListPost, setProjectTableListPost] = useState([]);

  function handleOnClickAdminProjectPost() {
    if (!token) {
      return;
    }
    setLoading(true);
    const data = {
      token: token,
      project: selectedAdminDevicesData.map(device => device.project)
    };

    if (data === undefined || data.length === 0) {
      handleErrorOpenProject(globalVariable === "zh-tw" ? "尚未選取專案" : globalVariable === "zh-cn" ? "尚未选取专案" : "No project selected");
      setLoading(false);
    } else {
      handleOpenProject(globalVariable === "zh-tw" ? "正在進行專案前處理" : globalVariable === "zh-cn" ? "正在进行专案前处理" : "Project pre-processing in progress");
      apiPostAdminProjectDevices(data)
        .then(res => {
          handleOpenProject(globalVariable === "zh-tw" ? "新增專案成功" : globalVariable === "zh-cn" ? "新增专案成功" : "New project successful");
          setLoading(false);
          setProjectTableListPost(data.project);
        }).catch(err => {
          handleErrorOpenProject(globalVariable === "zh-tw" ? "新增專案失敗" + err : globalVariable === "zh-cn" ? "新增专案失败" + err : "Failed to add new project" + err);
          setLoading(false);
        });
    }
  }

  function handleOnClickAddUserToProject() {
    const data = {
      token: token,
      project_id: projectID,
      user_id: document.getElementById('userID').value,
      permission: permission
    };
    apiPostProjectUser(data)
      .then(res => {
        handleOpenUser(globalVariable === "zh-tw" ? "新增成功" : globalVariable === "zh-cn" ? "新增成功" : "Added successfully");
      }).catch(err => {
        handleErrorOpenUser(globalVariable === "zh-tw" ? "新增user失敗" : globalVariable === "zh-cn" ? "新增user失败" : "Failed to add user");
      });
  }

  function getProjectFromUser() {
    const data = {
      token: token,
      user_id: document.getElementById('searchStaff').value,
    };
    apiGetProjectUserBelong(data)
      .then((res) => {
        const newData = res.data.map((item, index) => ({
          ...item,
          id: index + 1,
          project_id: item.project_id
        }));
        setProjectUsersBelong(newData);
      })
      .catch((error) => {
        console.error('Error fetching project data:', error);
      });
  }

  function deleteProjectFromUser() {
    const data = {
      token: token,
      user_id: document.getElementById('searchStaff').value,
      project_id: selectedProjectDataBelong
    };
    apiDeleteProjectUserBelong(data)
      .then(res => {
        handleOpenUser(globalVariable === "zh-tw" ? ('成功刪除User: ' + data.user_id) : globalVariable === "zh-cn" ? ('成功删除User: ' + data.user_id) : ('User deleted successfully: ' + data.user_id));
        userDeleteHandleBelongClose();
      }).catch(err => {
        handleErrorOpenUser(globalVariable === "zh-tw" ? "刪除User失敗" : globalVariable === "zh-cn" ? "删除User失败" : "Failed to delete User");
      });
  }

  function deleteProjectUser() {
    const data = {
      token: token,
      projectID: projectID,
      userID: selectedDevicesDataUser[0]['badge']
    };
    apiDeleteProjectUser(data)
      .then(res => {
        handleOpenUser(globalVariable === "zh-tw" ? ('成功刪除User: ' + data.userID) : globalVariable === "zh-cn" ? ('成功删除User: ' + data.userID) : ('User deleted successfully: ' + data.userID));
        userDeleteHandleClose();
      }).catch(err => {
        handleErrorOpenUser(globalVariable === "zh-tw" ? "刪除User失敗" : globalVariable === "zh-cn" ? "删除User失败" : "Failed to delete User");
      });
  }

  const [showFirstCard, setShowFirstCard] = useState(true);

  const handleShowFirstCard = () => {
    setShowFirstCard(true);
  };

  const handleShowSecondCard = () => {
    setShowFirstCard(false);
  };

  const [projectTableList, setProjectTableList] = useState([]);

  function handleOnClickProjectTable() {
    if (!token) {
      return;
    }
    apiGetProjectTable(token)
      .then((res) => {
        const newData = res.data.map((item, index) => ({
          ...item,
          id: index + 1,
          project: item,
        }));
        const selectedIds = newData.filter((item) => item.selected).map((item) => item.id);
        setProjectTableList(newData);
        setSelectionModel(selectedIds);
        handleOpenProject(globalVariable === "zh-tw" ? "查詢成功" : globalVariable === "zh-cn" ? "查询成功" : "Search successful");
      }).catch(err => {
        handleErrorOpenProject(globalVariable === "zh-tw" ? ("查询專案失敗: " + err) : globalVariable === "zh-cn" ? ("新增专案失败:" + err) : ("Query project failed:" + err));
      });
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <Box display="flex">
        <Box>
          <LoadingButton variant="contained" color="info" onClick={handleShowFirstCard} sx={{ mr: 1 }}>
            <FolderCopyIcon sx={{ mr: 2 }} />
            {globalVariable === "zh-tw" ? "專案管理" : globalVariable === "zh-cn" ? "专案管理" : "Project management"}
          </LoadingButton>
        </Box>
        {globalPermission >= 2 ? (
          <Box>
            <LoadingButton variant="contained" color="info" onClick={handleShowSecondCard} sx={{ mr: 1 }}>
              <AccountBoxIcon sx={{ mr: 2 }} />
              {globalVariable === "zh-tw" ? "人員管理" : globalVariable === "zh-cn" ? "人员管理" : "Employee management"}
            </LoadingButton>
          </Box>) : null}
      </Box>

      {showFirstCard ? (
        <Card>
          <Snackbar
            open={alertOpenProject}
            autoHideDuration={5000}
            onClose={handleCloseProject}
            variant="filled"
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'center'
            }}
          >
            <Alert onClose={handleCloseProject} severity='success' sx={{ width: '100%' }}>
              {messageProject}
            </Alert>
          </Snackbar>
          <Snackbar
            open={errorAlertOpenProject}
            autoHideDuration={5000}
            onClose={handleErrorCloseProject}
            variant="filled"
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'center'
            }}
          >
            <Alert onClose={handleErrorCloseProject} severity='error' sx={{ width: '100%' }}>
              {errorMessageProject}
            </Alert>
          </Snackbar>
          <Box sx={{ bgcolor: '#696969' }}>
            {globalVariable === "zh-tw" ? (
              <CardHeader title="專案" color="#696969" />
            ) : globalVariable === "zh-cn" ? (
              <CardHeader title="专案" color="#696969" />
            ) : (
              <CardHeader title="Project" color="#696969" />
            )}
          </Box>
          <Divider sx={{ borderBottomWidth: 3 }} />
          <CardContent>
            <Grid container spacing={1}>
              <Grid item xs={12} md={12}>

                <Box>
                  {globalPermission >= 3 ? (
                    <>
                      <Box component="form" role="form" mb={3}>
                        <Typography variant="h4" fontWeight="medium" mt={3}>
                          {globalVariable === "zh-tw" ? "新增專案" : globalVariable === "zh-cn" ? "新增专案" : "Add new project"}
                        </Typography>
                        <Box display="flex" alignItems="center" pt={3} px={2}>
                          <Typography variant="h5" fontWeight="medium" mr={2}>
                            {globalVariable === "zh-tw" ? "專案名稱:" : globalVariable === "zh-cn" ? "专案名称:" : "Project name:"}
                          </Typography>
                          <Box>
                            <FormControl>
                              <InputLabel id="operation-type-select-label">專案名稱</InputLabel>
                              <Select
                                labelId="permission-select-label"
                                id="permission-select"
                                value={projectIDSelect}
                                label="專案名稱"
                                onChange={projectSelectNameChange}
                                style={{ minWidth: "271px", height: "56px" }}
                              >
                                <MenuItem value="">清空欄位</MenuItem>
                                {projectNameList.map((projectItem) => (
                                  <MenuItem value={projectItem}>
                                    {projectItem}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Box>
                          <Box ml={2}>
                            <LoadingButton variant="contained" color="info" onClick={handleOnClickProjectAdd}>
                              {globalVariable === "zh-tw" ? "查詢" : globalVariable === "zh-cn" ? "查询" : "Search"}
                            </LoadingButton>
                          </Box>
                        </Box>
                      </Box>
                      <Box display="flex" alignItems="center" pt={3} px={2}>
                        {globalVariable === "zh-tw" ? (
                          <div style={{ height: 600, width: '100%' }}>
                            <DataGrid
                              isRowSelectable={(params) => params.row.select === 0}
                              rows={projectList}
                              columns={columnsTW}
                              initialState={{
                                pagination: {
                                  paginationModel: { pageSize: 5 },
                                },
                              }}
                              pageSizeOptions={[5]}
                              checkboxSelection
                              onSelectionModelChange={(ids) => onRowsSelectionHandler(ids)}
                              getRowCheckboxProps={(params) => ({
                                disabled: params.rows.select === 1
                              })}
                            />
                          </div>
                        ) : globalVariable === "zh-cn" ? (
                          <div style={{ height: 600, width: '100%' }}>
                            <DataGrid
                              isRowSelectable={(params) => params.row.select === 0}
                              rows={projectList}
                              columns={columnsTW}
                              initialState={{
                                pagination: {
                                  paginationModel: { pageSize: 5 },
                                },
                              }}
                              pageSizeOptions={[5]}
                              checkboxSelection
                              onSelectionModelChange={(ids) => onRowsSelectionHandler(ids)}
                              getRowCheckboxProps={(params) => ({
                                disabled: params.rows.select === 1
                              })}
                            />
                          </div>
                        ) : (
                          <div style={{ height: 600, width: '100%' }}>
                            <DataGrid
                              isRowSelectable={(params) => params.row.select === 0}
                              rows={projectList}
                              columns={columnsTW}
                              initialState={{
                                pagination: {
                                  paginationModel: { pageSize: 5 },
                                },
                              }}
                              pageSizeOptions={[5]}
                              checkboxSelection
                              onSelectionModelChange={(ids) => onRowsSelectionHandler(ids)}
                              getRowCheckboxProps={(params) => ({
                                disabled: params.rows.select === 1
                              })}
                            />
                          </div>
                        )}
                      </Box>

                      <Grid item xs={3}>
                        <Box component="form" role="form">
                          <Box display="flex" alignItems="center" pt={3}>
                            <Typography variant="h6" fontWeight="medium" mr={2}>
                              {globalVariable === "zh-tw" ? "開始:" : globalVariable === "zh-cn" ? "开始:" : "Start date:"}
                            </Typography>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <DatePicker
                                label={globalVariable === "zh-tw" ? "選擇日期" : globalVariable === "zh-cn" ? "选择日期" : "Select date"}
                                value={startDate}
                                onChange={(newValue) => {
                                  setStartDate(newValue);
                                }}
                                renderInput={(params) => <TextField size="medium" {...params} />}
                              />
                            </LocalizationProvider>
                          </Box>
                        </Box>
                      </Grid>
                      <Box display="flex" pt={3} px={2}>
                        <Box>
                          <LoadingButton loading={loading} variant="contained" color="info" onClick={handleOnClickProjectPost}>
                            {globalVariable === "zh-tw" ? "新增專案" : globalVariable === "zh-cn" ? "新增专案" : "Add new project"}
                          </LoadingButton>
                        </Box>
                      </Box>
                      <Divider sx={{ borderBottomWidth: 3, mt: 2 }} />
                    </>
                  ) : null}


                  <Box component="form" role="form" mb={3}>
                    {globalPermission >= 3 ? (
                      <>
                        <Typography variant="h4" fontWeight="medium" mt={3}>
                          {globalVariable === "zh-tw" ? "刪除專案" : globalVariable === "zh-cn" ? "删除专案" : "Delete project"}
                        </Typography>
                        <LoadingButton
                          variant="contained"
                          color="info"
                          onClick={handleOnClickProjectDelete}
                        >
                          {globalVariable === "zh-tw" ? "更新專案" : globalVariable === "zh-cn" ? "更新专案" : "Update project"}
                        </LoadingButton>
                        {globalPermission >= 3 ? (
                          <>
                            <LoadingButton
                              variant="contained"
                              color="error"
                              sx={{ ml: 3 }}
                              onClick={projectDeleteHandleClickOpen}
                            >
                              {globalVariable === "zh-tw" ? "刪除機台" : globalVariable === "zh-cn" ? "删除机台" : "Delete Machine"}
                            </LoadingButton>
                            <Dialog
                              open={projectDeleteOpen}
                              onClose={projectDeleteHandleClose}
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
                                  onClick={projectDelete}
                                  color="error"
                                  variant="contained"
                                >
                                  {globalVariable === "zh-tw" ? "刪除" : globalVariable === "zh-cn" ? "删除" : "Delete"}
                                </Button>
                                <Button
                                  onClick={projectDeleteHandleClose}
                                  color="info"
                                  variant="contained"
                                >
                                  {globalVariable === "zh-tw" ? "關閉" : globalVariable === "zh-cn" ? "关闭" : "Close"}
                                </Button>
                              </DialogActions>
                            </Dialog>
                          </>
                        ) : null}
                        <Box display="flex" alignItems="center" pt={3} px={2}>
                          {globalVariable === "zh-tw" ? (
                            <div style={{ height: 600, width: '100%' }}>
                              <DataGrid
                                rows={projectDeleteList}
                                columns={columnsTW}
                                initialState={{
                                  pagination: {
                                    paginationModel: { pageSize: 5 },
                                  },
                                }}
                                pageSizeOptions={[5]}
                                checkboxSelection
                                onSelectionModelChange={(ids) => onRowsSelectionHandlerDelete(ids)}
                              />
                            </div>
                          ) : globalVariable === "zh-cn" ? (
                            <div style={{ height: 600, width: '100%' }}>
                              <DataGrid
                                rows={projectDeleteList}
                                columns={columnsTW}
                                initialState={{
                                  pagination: {
                                    paginationModel: { pageSize: 5 },
                                  },
                                }}
                                pageSizeOptions={[5]}
                                checkboxSelection
                                onSelectionModelChange={(ids) => onRowsSelectionHandlerDelete(ids)}
                              />
                            </div>
                          ) : (
                            <div style={{ height: 600, width: '100%' }}>
                              <DataGrid
                                rows={projectDeleteList}
                                columns={columnsTW}
                                initialState={{
                                  pagination: {
                                    paginationModel: { pageSize: 5 },
                                  },
                                }}
                                pageSizeOptions={[5]}
                                checkboxSelection
                                onSelectionModelChange={(ids) => onRowsSelectionHandlerDelete(ids)}
                              />
                            </div>
                          )}
                        </Box>


                        <Divider sx={{ borderBottomWidth: 3, mt: 2, mb: 2 }} />
                      </>
                    ) : null}
                    <Box component="form" role="form" mb={3}>
                      <Typography variant="h4" fontWeight="medium" mt={3}>
                        {globalVariable === "zh-tw" ? "專案進度顯示" : globalVariable === "zh-cn" ? "专案进度显示" : "Project progress display project"}
                      </Typography>
                      <LoadingButton
                        variant="contained"
                        color="info"
                        onClick={handleOnClickProjectProcess}
                      >
                        {globalVariable === "zh-tw" ? "更新專案進度" : globalVariable === "zh-cn" ? "更新专案进度" : "Update project progress"}
                      </LoadingButton>
                      <Box display="flex" alignItems="center" pt={3} px={2}>
                        {globalVariable === "zh-tw" ? (
                          <div style={{ height: 600, width: '100%' }}>
                            <DataGrid
                              rows={projectProcessList}
                              columns={columnsprojectprogressTW}
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
                        ) : globalVariable === "zh-cn" ? (
                          <div style={{ height: 600, width: '100%' }}>
                            <DataGrid
                              rows={projectProcessList}
                              columns={columnsprojectprogressTW}
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
                        ) : (
                          <div style={{ height: 600, width: '100%' }}>
                            <DataGrid
                              rows={projectProcessList}
                              columns={columnsprojectprogressTW}
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
                        )}
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <Snackbar
            open={alertOpenUser}
            autoHideDuration={5000}
            onClose={handleCloseUser}
            variant="filled"
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'center'
            }}
          >
            <Alert onClose={handleCloseUser} severity='success' sx={{ width: '100%' }}>
              {messageUser}
            </Alert>
          </Snackbar>
          <Snackbar
            open={errorAlertOpenUser}
            autoHideDuration={5000}
            onClose={handleErrorCloseUser}
            variant="filled"
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'center'
            }}
          >
            <Alert onClose={handleErrorCloseUser} severity='error' sx={{ width: '100%' }}>
              {errorMessageUser}
            </Alert>
          </Snackbar>
          <Box sx={{ bgcolor: '#696969' }}>
            {globalVariable === "zh-tw" ? (
              <CardHeader title="專案人員" color="#696969" />
            ) : globalVariable === "zh-cn" ? (
              <CardHeader title="专案人员" color="#696969" />
            ) : (
              <CardHeader title="Project staff" color="#696969" />
            )}
          </Box>
          <Divider sx={{ borderBottomWidth: 3 }} />
          <CardContent>
            <Grid container spacing={1}>
              <Grid item xs={12} md={12}>
                <Box component="form" role="form" mb={3}>
                  <Typography variant="h4" fontWeight="medium" mt={3}>
                    {globalVariable === "zh-tw" ? "新增專案人員" : globalVariable === "zh-cn" ? "新增专案人员" : "Add new project staff"}
                  </Typography>
                  <Box display="flex" alignItems="center" pt={3} px={2}>
                    <Typography variant="h5" fontWeight="medium" mr={2}>
                      {globalVariable === "zh-tw" ? "員工ID" : globalVariable === "zh-cn" ? "员工ID" : "Employee ID"}
                    </Typography>
                    <Box mr={2}>
                      {globalVariable === "zh-tw" ? (
                        <TextField id="userID" type="search-staff" label="請輸入員工ID" />
                      ) : globalVariable === "zh-cn" ? (
                        <TextField id="userID" type="search-staff" label="请输入员工ID" />
                      ) : (
                        <TextField id="userID" type="search-staff" label="Please enter employee ID" />
                      )}
                    </Box>
                    <LoadingButton variant="contained" color="info" onClick={handleOnclickGetUserName}>
                      {globalVariable === "zh-tw" ? "查詢" : globalVariable === "zh-cn" ? "查询" : "Search"}
                    </LoadingButton>
                    {/* <Typography variant="h5" fontWeight="medium" ml={2}>
                      {employeeResponse}
                    </Typography> */}
                  </Box>
                  <Box display="flex" alignItems="center" pt={3} px={2}>
                    <Typography variant="h5" fontWeight="medium" mr={2}>
                      {globalVariable === "zh-tw" ? "人員名稱" : globalVariable === "zh-cn" ? "人员名称" : "Employee name"}
                    </Typography>
                    <Typography variant="h5" fontWeight="medium" mr={2}>
                      {employeeResponse}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" pt={3} px={2}>
                    <Typography variant="h5" fontWeight="medium" mr={2}>
                      {globalVariable === "zh-tw" ? "專案名稱:" : globalVariable === "zh-cn" ? "专案名称:" : "Project name:"}
                    </Typography>
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
                        {project && project.map((projectItem) => (
                          <MenuItem value={projectItem.id}>
                            {projectItem.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                  <Box display="flex" alignItems="center" pt={3} px={2}>
                    <Typography variant="h5" fontWeight="medium" mr={2}>
                      {globalVariable === "zh-tw" ? "指定權限:" : globalVariable === "zh-cn" ? "指定权限:" : "Specify permissions:"}
                    </Typography>
                    {globalVariable === "zh-tw" ? (
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
                          <MenuItem value={4}>系統管理者</MenuItem>
                          <MenuItem value={3}>專案管理者</MenuItem>
                          <MenuItem value={2}>專案負責人</MenuItem>
                          <MenuItem value={1}>一般員工</MenuItem>
                        </Select>
                      </FormControl>
                    ) : globalVariable === "zh-cn" ? (
                      <FormControl>
                        <InputLabel id="demo-simple-select-label">权限</InputLabel>
                        <Select
                          labelId="permission-select-label"
                          id="permission-select"
                          value={permission}
                          label="权限"
                          onChange={permissionChange}
                          style={{ minWidth: "200px", height: "45px" }}
                        >
                          <MenuItem value={4}>系统管理者</MenuItem>
                          <MenuItem value={3}>专案管理者</MenuItem>
                          <MenuItem value={2}>专案负责人</MenuItem>
                          <MenuItem value={1}>一般员工</MenuItem>
                        </Select>
                      </FormControl>
                    ) : (
                      <FormControl>
                        <InputLabel id="demo-simple-select-label">Permissions</InputLabel>
                        <Select
                          labelId="permission-select-label"
                          id="permission-select"
                          value={permission}
                          label="Permissions"
                          onChange={permissionChange}
                          style={{ minWidth: "200px", height: "45px" }}
                        >
                          <MenuItem value={4}>System administrator</MenuItem>
                          <MenuItem value={3}>Project manager</MenuItem>
                          <MenuItem value={2}>Project leader</MenuItem>
                          <MenuItem value={1}>Employee</MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  </Box>
                  {globalPermission >= 2 ? (
                    <>
                      <Box display="flex" alignItems="center" pt={3} px={2}>
                        <Box>
                          <LoadingButton variant="contained" color="info" onClick={handleOnClickAddUserToProject}>
                            {globalVariable === "zh-tw" ? "新增" : globalVariable === "zh-cn" ? "新增" : "New"}
                          </LoadingButton>
                        </Box>
                      </Box>
                    </>
                  ) : null}
                </Box>
                <Divider sx={{ borderBottomWidth: 3 }} />
                <Box component="form" role="form" mb={3}>
                  <Typography variant="h4" fontWeight="medium" mt={3}>
                    {globalVariable === "zh-tw" ? "刪除專案人員" : globalVariable === "zh-cn" ? "删除专案人员" : "Delete project employee"}
                  </Typography>
                  <Box display="flex" alignItems="center" pt={3} px={2}>
                    <Typography variant="h5" fontWeight="medium" mr={2}>
                      {globalVariable === "zh-tw" ? "專案名稱:" : globalVariable === "zh-cn" ? "专案名称:" : "Project name:"}
                    </Typography>
                    <Box mr={2}>
                      <FormControl>
                        <InputLabel id="demo-simple-select-label">{globalVariable === "zh-tw" ? "專案" : globalVariable === "zh-cn" ? "专案" : "Project"}</InputLabel>
                        <Select
                          labelId="permission-select-label"
                          id="permission-select"
                          value={projectID}
                          label={globalVariable === "zh-tw" ? "專案" : globalVariable === "zh-cn" ? "专案" : "Project"}
                          onChange={projectNameChange}
                          style={{ minWidth: "200px", height: "45px" }}
                        >
                          {project && project.map((projectItem) => (
                            <MenuItem value={projectItem.id}>
                              {projectItem.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                  </Box>
                </Box>
                <Box display="flex" alignItems="center" pt={3} px={2}>
                  {globalVariable === "zh-tw" ? (
                    <div style={{ height: 400, width: '100%' }}>
                      <DataGrid
                        rows={projectUsers}
                        columns={empColumnsTW}
                        initialState={{
                          pagination: {
                            paginationModel: { page: 0, pageSize: 5 },
                          },
                        }}
                        pageSizeOptions={[5, 10]}
                        checkboxSelection
                        hideFooterSelectedRowCount
                        selectionModel={selectedRow ? [selectedRow] : []}
                        onSelectionModelChange={(ids) => {
                          onRowsSelectionHandlerUser(ids);
                        }}
                      />
                    </div>
                  ) : globalVariable === "zh-cn" ? (
                    <div style={{ height: 400, width: '100%' }}>
                      <DataGrid
                        rows={projectUsers}
                        columns={empColumnsTW}
                        initialState={{
                          pagination: {
                            paginationModel: { page: 0, pageSize: 5 },
                          },
                        }}
                        pageSizeOptions={[5, 10]}
                        checkboxSelection
                        hideFooterSelectedRowCount
                        selectionModel={selectedRow ? [selectedRow] : []}
                        onSelectionModelChange={(ids) => {
                          onRowsSelectionHandlerUser(ids);
                        }}
                      />
                    </div>
                  ) : (
                    <div style={{ height: 400, width: '100%' }}>
                      <DataGrid
                        rows={projectUsers}
                        columns={empColumnsTW}
                        initialState={{
                          pagination: {
                            paginationModel: { page: 0, pageSize: 5 },
                          },
                        }}
                        pageSizeOptions={[5, 10]}
                        checkboxSelection
                        hideFooterSelectedRowCount
                        selectionModel={selectedRow ? [selectedRow] : []}
                        onSelectionModelChange={(ids) => {
                          onRowsSelectionHandlerUser(ids);
                        }}
                      />
                    </div>
                  )}
                </Box>
                {globalPermission >= 2 ? (
                  <>
                    <Box display="flex" pt={3} px={2}>
                      <Box>
                        <LoadingButton
                          variant="contained"
                          color="error"
                          onClick={userDeleteHandleClickOpen}
                        >
                          {globalVariable === "zh-tw" ? "刪除" : globalVariable === "zh-cn" ? "删除" : "Delete"}
                        </LoadingButton>
                        <Dialog
                          open={userDeleteOpen}
                          onClose={userDeleteHandleClose}
                          aria-labelledby="alert-dialog-permission"
                          aria-describedby="alert-dialog-permission"
                        >
                          <DialogTitle id="alert-dialog-title">{globalVariable === "zh-tw" ? "是否刪除專案人員?" : globalVariable === "zh-cn" ? "是否删除专案人员?" : "Delete project staff?"}</DialogTitle>
                          <DialogContent>
                            <DialogContentText id="alert-dialog-permission">
                              {globalVariable === "zh-tw" ? "按下刪除按鈕後將會刪除專案人員" : globalVariable === "zh-cn" ? "按下删除按钮后将会删除专案人员" : "Clicking the delete button will delete the project worker"}
                            </DialogContentText>
                          </DialogContent>
                          <DialogActions>
                            <LoadingButton
                              onClick={deleteProjectUser}
                              color="error"
                              variant="contained"
                            >
                              {globalVariable === "zh-tw" ? "刪除" : globalVariable === "zh-cn" ? "删除" : "Delete"}
                            </LoadingButton>
                            <LoadingButton
                              onClick={userDeleteHandleClose}
                              color="info"
                              variant="contained"
                            >
                              {globalVariable === "zh-tw" ? "關閉" : globalVariable === "zh-cn" ? "关闭" : "Close"}
                            </LoadingButton>
                          </DialogActions>
                        </Dialog>
                      </Box>
                    </Box>
                  </>
                ) : null}
                <Divider sx={{ borderBottomWidth: 3 }} />
                <Box component="form" role="form" mb={3}>
                  <Typography variant="h4" fontWeight="medium" mt={3}>
                    {globalVariable === "zh-tw" ? "查詢專案人員負責專案" : globalVariable === "zh-cn" ? "查询专案人员负责专案" : " Query the project personnel responsible for the project"}
                  </Typography>
                  <Box display="flex" alignItems="center" pt={3} px={2}>
                    <Typography variant="h5" fontWeight="medium" mr={2}>
                      {globalVariable === "zh-tw" ? "人員編號:" : globalVariable === "zh-cn" ? "人員編號:" : "User ID:"}
                    </Typography>
                    <Box mr={2}>
                      {globalVariable === "zh-tw" ? (
                        <TextField id="searchStaff" type="search-staff" label="人員名稱" />
                      ) : globalVariable === "zh-cn" ? (
                        <TextField id="searchStaff" type="search-staff" label="人員名称" />
                      ) : (
                        <TextField id="searchStaff" type="search-staff" label="User ID" />
                      )}
                    </Box>
                    <Box ml={2}>
                      <LoadingButton variant="contained" color="info" onClick={getProjectFromUser}>
                        {globalVariable === "zh-tw" ? "查詢" : globalVariable === "zh-cn" ? "查询" : "Search"}
                      </LoadingButton>
                    </Box>
                  </Box>
                </Box>
                <Box display="flex" alignItems="center" pt={3} px={2}>
                  {globalVariable === "zh-tw" ? (
                    <div style={{ height: 400, width: '100%' }}>
                      <DataGrid
                        rows={projectUsersBelong}
                        columns={columnsProjectFromUserTW}
                        initialState={{
                          pagination: {
                            paginationModel: { pageSize: 5 },
                          },
                        }}
                        pageSizeOptions={[5]}
                        checkboxSelection
                        onSelectionModelChange={(ids) => {
                          onRowsSelectionHandlerProjectFromUser(ids);
                        }}
                      />
                    </div>
                  ) : globalVariable === "zh-cn" ? (
                    <div style={{ height: 400, width: '100%' }}>
                      <DataGrid
                        rows={projectUsersBelong}
                        columns={columnsProjectFromUserTW}
                        initialState={{
                          pagination: {
                            paginationModel: { pageSize: 5 },
                          },
                        }}
                        pageSizeOptions={[5]}
                        checkboxSelection
                        onSelectionModelChange={(ids) => {
                          onRowsSelectionHandlerProjectFromUser(ids);
                        }}
                      />
                    </div>
                  ) : (
                    <div style={{ height: 400, width: '100%' }}>
                      <DataGrid
                        rows={projectUsersBelong}
                        columns={columnsProjectFromUserTW}
                        initialState={{
                          pagination: {
                            paginationModel: { pageSize: 5 },
                          },
                        }}
                        pageSizeOptions={[5]}
                        checkboxSelection
                        onSelectionModelChange={(ids) => {
                          onRowsSelectionHandlerProjectFromUser(ids);
                        }}
                      />
                    </div>
                  )}
                </Box>
                {globalPermission >= 2 ? (
                  <>
                    <Box display="flex" pt={3} px={2}>
                      <Box>
                        <LoadingButton
                          variant="contained"
                          color="error"
                          onClick={userDeleteBelongHandleClickOpen}
                        >
                          {globalVariable === "zh-tw" ? "刪除負責該專案之人員" : globalVariable === "zh-cn" ? "刪除負責該專案之人員" : "Delete the person responsible for the project"}
                        </LoadingButton>
                        <Dialog
                          open={userDeleteBelongOpen}
                          onClose={userDeleteHandleBelongClose}
                          aria-labelledby="alert-dialog-permission"
                          aria-describedby="alert-dialog-permission"
                        >
                          <DialogTitle id="alert-dialog-title">{globalVariable === "zh-tw" ? "是否刪除專案人員?" : globalVariable === "zh-cn" ? "是否删除专案人员?" : "Delete project staff?"}</DialogTitle>
                          <DialogContent>
                            <DialogContentText id="alert-dialog-permission">
                              {globalVariable === "zh-tw" ? "按下刪除按鈕後將會刪除專案人員" : globalVariable === "zh-cn" ? "按下删除按钮后将会删除专案人员" : "Clicking the delete button will delete the project worker"}
                            </DialogContentText>
                          </DialogContent>
                          <DialogActions>
                            <LoadingButton
                              onClick={deleteProjectFromUser}
                              color="error"
                              variant="contained"
                            >
                              {globalVariable === "zh-tw" ? "刪除" : globalVariable === "zh-cn" ? "删除" : "Delete"}
                            </LoadingButton>
                            <LoadingButton
                              onClick={userDeleteHandleBelongClose}
                              color="info"
                              variant="contained"
                            >
                              {globalVariable === "zh-tw" ? "關閉" : globalVariable === "zh-cn" ? "关闭" : "Close"}
                            </LoadingButton>
                          </DialogActions>
                        </Dialog>
                      </Box>
                    </Box>
                  </>
                ) : null}
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}
    </ThemeProvider>
  );
}
