import React, { useState, useEffect, useContext } from "react";
import { apiGetProjectDevices, apiGetProjectUserBelong, apiDeleteProjectUserBelong, apiGetStatistics, apiPostProjectDevices, apiGetProjectprogress, apiGetProjectName, apiPostAdminProjectDevices, apiDeleteProject, apiDeleteAdminProjectDevices, apiGetProjectUsers, apiPostProjectUser, apiDeleteProjectUser, apiGetUserName, apiGetProjectTable } from '../api'
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

import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { type } from "@testing-library/user-event/dist/type";

import AccountBoxIcon from '@mui/icons-material/AccountBox';
import FolderCopyIcon from '@mui/icons-material/FolderCopy';
import { Construction } from "@mui/icons-material";


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
const columnsListTW = [
  { field: 'project', headerName: '專案名稱', width: 200 },
  // { field: 'selectedDisplay', headerName: '已於專案中', width: 200 },
];
const columnsTW = [
  { field: 'project', headerName: '專案名稱', width: 200 },
  { field: 'selectedDisplay', headerName: '已於專案中', width: 200 },
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
const columnsListCN = [
  { field: 'project', headerName: '专案名称', width: 200 },
  // { field: 'selectedDisplay', headerName: '已于专案中', width: 200 },
];
const columnsCN = [
  { field: 'project', headerName: '专案名称', width: 200 },
  { field: 'selectedDisplay', headerName: '已于专案中', width: 200 },
  { field: 'line', headerName: '线别', width: 200 },
  { field: 'device', headerName: '机台名称', width: 200 },
  { field: 'ename', headerName: 'ename', width: 450 },
  { field: 'cname', headerName: 'cname', width: 300 }
];
const columnsprojectprogressCN = [
  { field: 'project_name', headerName: '专案名称', width: 200 },
  { field: 'action', headerName: '流程', width: 200 },
  { field: 'status', headerName: '进度', width: 200 },
];
const columnsListEN = [
  { field: 'project', headerName: 'Project name', width: 200 },
  // { field: 'selectedDisplay', headerName: 'Already in project', width: 200 },
];
const columnsEN = [
  { field: 'project', headerName: 'Project name', width: 200 },
  { field: 'selectedDisplay', headerName: 'Already in project', width: 200 },
  { field: 'line', headerName: 'Line', width: 200 },
  { field: 'device', headerName: 'Machine name', width: 200 },
  { field: 'ename', headerName: 'ename', width: 450 },
  { field: 'cname', headerName: 'cname', width: 300 }
];
const columnsprojectprogressEN = [
  { field: 'project_name', headerName: 'Project name', width: 200 },
  { field: 'action', headerName: 'Process', width: 200 },
  { field: 'status', headerName: 'Progress', width: 200 },
];
const empColumnsTW = [
  { field: 'badge', headerName: '員工編號', width: 250 },
  { field: 'username', headerName: '員工名稱', width: 250 },
  { field: 'permission', headerName: '權限', width: 250 },
];
const empColumnsCN = [
  { field: 'badge', headerName: '员工编号', width: 250 },
  { field: 'username', headerName: '员工名称', width: 250 },
  { field: 'permission', headerName: '权限', width: 250 },
];
const empColumnsEN = [
  { field: 'badge', headerName: 'Employee ID', width: 250 },
  { field: 'username', headerName: 'Employee name', width: 250 },
  { field: 'permission', headerName: 'Permissions', width: 250 },
];

const columnsProjectFromUserTW = [
  // { field: 'badge', headerName: '員工編號', width: 250 },
  { field: 'project_id', headerName: 'project_id', width: 250 },
  { field: 'project', headerName: '專案名稱', width: 200 },
  // { field: 'permission', headerName: '權限', width: 250 },
  // { field: 'selectedDisplay', headerName: 'Already in project', width: 200 },
];
const columnsProjectFromUserCN = [
  // { field: 'badge', headerName: '員工編號', width: 250 },
  { field: 'project_id', headerName: 'project_id', width: 250 },
  { field: 'project', headerName: '专案名称', width: 200 },
  // { field: 'permission', headerName: '权限', width: 250 },
  // { field: 'selectedDisplay', headerName: 'Already in project', width: 200 },
];
const columnsProjectFromUserEN = [
  { field: 'project_id', headerName: 'project_id', width: 250 },
  // { field: 'badge', headerName: 'Employee ID', width: 250 },
  { field: 'project', headerName: 'Project name', width: 200 },
  // { field: 'permission', headerName: 'Permissions', width: 250 },
  // { field: 'selectedDisplay', headerName: 'Already in project', width: 200 },
];
const permissionMap = {
  5: "系統管理者",
  4: "專案管理者",
  2: "專案負責人",
  1: "一般員工"
};



export default function Project({ token, setAlert, ...rest }) {
  const [selectedDevicesData, setSelectedDevicesData] = useState();
  const [selectedDeleteDevicesData, setSelectedDeleteDevicesData] = useState();
  const [selectedAdminDevicesData, setSelectedAdminDevicesData] = useState();
  const [selectedProjectRow, setSelectedProjectRow] = useState(null);//存取user所負責的project的row data
  const [selectedDevicesDataUser, setSelectedDevicesDataUser] = useState();
  const [selectedProjectDataBelong, setSelectedProjectDataBelong] = useState();//存取
  const [projectID, setProjectID] = useState("");
  const [project, setProject] = useState([]);
  const [permission, setPermission] = useState("");
  const [projectDeleteOpen, setProjectDeleteOpen] = useState(false);
  const [userDeleteOpen, setUserDeleteOpen] = useState(false);
  const [projectList, setProjectList] = useState([]);
  const [projectDeleteList, setProjectDeleteList] = useState([]);
  const [projectProcessList, setProjectProcessList] = useState([]);
  const [employeeName, setEmployeeName] = useState("");
  const [projectUsers, setProjectUsers] = useState([]);
  const [projectUsersBelong, setProjectUsersBelong] = useState([]);//存取user所負責的project
  const [selectedRow, setSelectedRow] = useState(null);
  const { globalVariable, updateGlobalVariable } = useContext(GlobalContext);
  const [loading, setLoading] = useState(false);
  const [projectIDSelect, setProjectIDSelect] = useState("");
  //下拉式選單的onchange
  const projectSelectNameChange = (event) => {
    console.log("有更改projectIDSelect")
    setProjectIDSelect(event.target.value);
    console.log(event.target.value)
    console.log(projectIDSelect)
    handleUpdateProjectUser()
  };

  const projectNameChange = (event) => {
    console.log("有更改projectID")
    setProjectID(event.target.value);
    console.log(event.target.value)
    console.log(projectID)
    handleUpdateProjectUser()
  };
  const permissionChange = (event) => {
    setPermission(event.target.value);
  };
  //打開刪除project Dialog的function
  const projectDeleteHandleClickOpen = () => {
    setProjectDeleteOpen(true);
  };
  //關閉刪除project Dialog的function
  const projectDeleteHandleClose = () => {
    setProjectDeleteOpen(false);
  };
  //打開刪除project worker Dialog的function
  const userDeleteHandleClickOpen = () => {
    setUserDeleteOpen(true);
  };
  //關閉刪除project worker Dialog的function
  const userDeleteHandleClose = () => {
    setUserDeleteOpen(false);
  };

  //success alert
  const [alertOpen, setAlertOpen] = React.useState(false);
  const [message, setMessage] = useState(''); // 状态来存储消息内容
  const handleOpen = (message) => {
    setMessage(message); // 设置消息内容
    setAlertOpen(true);
  };
  const handleClose = (event, reason) => {
    setAlertOpen(false);
  };

  //error alert
  const [errorAlertOpen, setErrorAlertOpen] = React.useState(false);
  const [errorMessage, setErrorMessage] = useState(''); // 状态来存储消息内容
  const handleErrorOpen = (message) => {
    setErrorMessage(message); // 设置消息内容
    setErrorAlertOpen(true);
  };
  const handleErrorClose = (event, reason) => {
    setErrorAlertOpen(false);
  };

  const projectDelete = () => {
    const data = {
      token: token,
      project: selectedDeleteDevicesData
    }
    console.log(data)
    apiDeleteProject(data)
      .then((res) => {
        handleOpen((globalVariable === "zh-tw" ? "刪除專案成功" : globalVariable === "zh-cn" ? "删除专案成功" : "Delete project successful"));
      }).catch((error) => {
        // 处理错误
        console.error(error);
        handleErrorOpen((globalVariable === "zh-tw" ? ("刪除專案失敗" + error) : globalVariable === "zh-cn" ? ("删除专案失败:" + error) : ("Delete project failed:" + error)));
      });
  };
  //刪除project的function
  const projectAdminhandleDelete = () => {
    const data = {
      token: token,
      project: selectedAdminDevicesData.map(device => device.project).join(',')
    }
    console.log(data)
    console.log(data.project)
    apiDeleteAdminProjectDevices(data)
      .then((res) => {
        handleOpen((globalVariable === "zh-tw" ? "刪除專案成功" : globalVariable === "zh-cn" ? "删除专案成功" : "Delete project successful"));
        setLoading(false)
        // 假设data.project是一个包含要删除项目ID的数组
        setProjectTableListPost(currentProjects =>
          currentProjects.filter(project =>
            !data.project.includes(project)
          )
        );

      }).catch((error) => {
        // 处理错误
        console.error(error);
        handleErrorOpen((globalVariable === "zh-tw" ? ("刪除專案失敗" + error) : globalVariable === "zh-cn" ? ("删除专案失败:" + error) : ("Delete project failed:" + error)));
        setLoading(false)
      });
  };
  //更新目前的project，看還有哪些
  // function handleUpdateProject() {
  //   apiGetProjectName(token)
  //     .then((res) => {
  //       setProject(res.data);
  //       console.log(res.data)
  //     })
  //     .catch((error) => {
  //       setProject([]);
  //       console.error('Error fetching project data:', error);
  //     });
  // }
  //此function是用來取User name
  function handleOnclickGetUserName() {
    let userid = document.getElementById("userID").value
    const data = {
      userID: userid,
      systemID: '1'
    }
    apiGetUserName(data)
      .then((res) => {
        setEmployeeName(res.data.data[0].user_name)
        handleOpen((globalVariable === "zh-tw" ? "查詢成功" : globalVariable === "zh-cn" ? "查询成功" : "Search successful"))
      })
      .catch((error) => {
        console.error('Error fetching project data:', error);
      });
  }
  // const projectNameChange = (event) => {
  //   if (event.target.value === 'null') {
  //     setProjectName(null);
  //   } else {
  //     setProjectName(event.target.value);
  //   }
  // };
  const [projectNameList, setProjectNameList] = useState([]);
  const getProjectName = (token) => {
    if (!token) {
      // 没有token，不执行操作
      return;
    }

    apiGetStatistics(token)
      .then((res) => {
        console.log(res);
        const list = res.data.map((project) => project.project_name);
        setProjectNameList(list);
        // const devicesList = res.data.map((project) => project);
        // setDeviceNameList(devicesList);
      });


  }
  //此function是用來取的project的Users
  function handleUpdateProjectUser() {
    // 检查 projectID 是否有效
    if (!projectID) {
      return;
    }
    const data = {
      token: token,
      projectID: projectID
    }
    apiGetProjectUsers(data)
      .then((res) => {
        const newData = res.data.map((item, index) => ({
          ...item,
          id: index + 1,
          role: permissionMap[item.permission]
        }));
        console.log(newData)
        setProjectUsers(newData)
      })
      .catch((error) => {
        console.error('Error fetching project data:', error);
      });
  }
  //useeffect來控制某些東西
  useEffect(() => {
    getProjectName(token)//projectid改變我會call這隻api
    // 在这里调用你的 API 获取项目数据(project的名稱)
    apiGetProjectName(token)
      .then((res) => {
        setProject(res.data);
        console.log(project)
      })
      .catch((error) => {
        console.error('Error fetching project data:', error);
      });
    handleUpdateProjectUser();
  }, [projectID, selectedDevicesDataUser]); // 空数组作为第二个参数，表示仅在组件加载时调用 useEffect

  const [selectionModel, setSelectionModel] = React.useState([]);

  //Get資料庫裡project裡面的device詳細清單
  // function handleOnClickProject() {
  //   console.log(document.getElementById('searchProject').value)
  //   let search = document.getElementById('searchProject').value;
  //   const data = {
  //     'name': search
  //   }
  //   apiGetProjectDevices(data)
  //     .then(data => {
  //       console.log(data.data)
  //       //因為Mui dataGrid這個套件要有一個id的欄位當作基準，但是api回傳資料沒有，所以這邊做一個id的欄位讓dataGrid可以順利渲染
  //       const newData = data.data.map((item, index) => ({
  //         ...item,
  //         id: index + 1, // 使用唯一的值作為 id
  //         selectedDisplay: item.selected ? '是' : '否',
  //       }));
  //       const selectedIds = newData.filter((item) => item.selected).map((item) => item.id);
  //       // console.log(newData)
  //       setProjectList(newData);
  //       setSelectionModel(selectedIds); // 設定初始的選中狀態
  //       // console.log(projectList)
  //       handleOpen((globalVariable === "zh-tw" ? "查詢成功" : globalVariable === "zh-cn" ? "查询成功" : "Search successful"))
  //     }).catch(err => { console.log(err); handleErrorOpen((globalVariable === "zh-tw" ? ("查詢專案失敗: " + err) : globalVariable === "zh-cn" ? ("查询专案失败:" + err) : ("Query project failed:" + err))); })
  // };
  //////////////////////// 新增專案按鈕onclick
  function handleOnClickProjectAdd() {
    console.log(projectIDSelect)
    // console.log(document.getElementById('permission-select').value)
    // let search = document.getElementById('permission-select').value;
    const data = {
      'name': projectIDSelect
    }
    apiGetProjectDevices(data)
      .then(response => {
        const responseData = response.data;

        // 修改 API 返回的数据结构，确保包含 select 字段
        const newData = responseData.map((item, index) => ({
          ...item,
          id: index + 1, // 使用唯一的值作为 id
          selected: item.select ? item.select : 0, // 如果 select 字段不存在，默认为 0
          selectedDisplay: item.select ? (item.select === 1 ? '是' : '否') : '否', // 根据 select 字段的值确定显示内容
        }));

        // 根据 select 字段过滤已选择的项目
        const selectedIds = newData.filter((item) => item).map((item) => item.id);

        // 根据 select 字段为 0 的项目
        const unselectedItems = newData.filter((item) => item);

        // 将未选择的项目进行进一步处理，例如显示在表格中或执行其他操作
        console.log("所有的项目：", unselectedItems);

        // 根据 select 字段的值设置表格数据和初始选中状态
        setProjectList(unselectedItems);
        setSelectionModel(selectedIds);
        handleOpen((globalVariable === "zh-tw" ? "查詢成功" : globalVariable === "zh-cn" ? "查询成功" : "Search successful"));
      })
      .catch(err => {
        console.log(err);
        handleErrorOpen((globalVariable === "zh-tw" ? ("查詢專案失敗: " + err) : globalVariable === "zh-cn" ? ("查询专案失败:" + err) : ("Query project failed:" + err)));
      });
  }

  ///////////刪除專案列表
  function handleOnClickProjectDelete() {
    // console.log(document.getElementById('searchProject').value)
    // let search = document.getElementById('searchProject').value;
    const data = {
      token: token,
      'name': projectIDSelect
    }
    apiGetProjectDevices(data)
      .then(response => {
        const responseData = response.data;
        console.log(response.data)

        // 修改 API 返回的数据结构，确保包含 select 字段
        const newData = responseData.map((item, index) => ({
          ...item,
          id: index + 1, // 使用唯一的值作为 id
          selected: item.select ? item.select : 0, // 如果 select 字段不存在，默认为 0
          selectedDisplay: item.select ? (item.select === 1 ? '是' : '否') : '否', // 根据 select 字段的值确定显示内容
        }));

        // 根据 select 字段过滤已选择的项目
        const selectedIds = newData.filter((item) => item.select === 1).map((item) => item.id);

        // 根据 select 字段为 1 的项目
        const unselectedItems = newData.filter((item) => item.select === 1);

        // // 将未选择的项目进行进一步处理，例如显示在表格中或执行其他操作
        // console.log("未选择的项目：", unselectedItems);

        // 根据 select 字段的值设置表格数据和初始选中状态
        setProjectDeleteList(unselectedItems);
        setSelectionModel(selectedIds);
        handleOpen((globalVariable === "zh-tw" ? "查詢成功" : globalVariable === "zh-cn" ? "查询成功" : "Search successful"));
      })
      .catch(err => {
        console.log(err);
        handleErrorOpen((globalVariable === "zh-tw" ? ("查詢專案失敗: " + err) : globalVariable === "zh-cn" ? ("查询专案失败:" + err) : ("Query project failed:" + err)));
      });
  }

  //////////////////////// 
  //////////////顯示專案名稱、流程、進度api導入//////////////
  function handleOnClickProjectProcess() {
    apiGetProjectprogress(token)
      .then(response => {
        console.log(response.data);
        const responseData = response.data;

        // 修改 API 返回的数据结构，确保包含 select 字段
        const newData = responseData.map((item, index) => ({
          ...item,
          id: index + 1, // 使用唯一的值作为 id
          project_name: item.project_name,
          action: item.action,
          status: item.status
        }));


        // 根据 select 字段的值设置表格数据和初始选中状态
        setProjectProcessList(newData);

        handleOpen((globalVariable === "zh-tw" ? "查詢專案進度成功" : globalVariable === "zh-cn" ? "查询专案进度成功" : "Search Project progress successful"));
      })
      .catch(err => {
        console.log(err);
        handleErrorOpen((globalVariable === "zh-tw" ? ("查詢專案進度失敗: " + err) : globalVariable === "zh-cn" ? ("查询专案进度失败:" + err) : ("Query Project progress failed:" + err)));
      });
  }
  ///////////////////////////////////////////////////////////
  //取得datagrid裡面所有select的資料(device)
  const onRowsSelectionHandlerAdmin = (ids) => {
    console.log(ids)
    console.log(type(ids))
    console.log(projectTableList)
    const selectedRowsData = ids.map((id) => projectTableList.find((row) => row.id === id))
    const newData = selectedRowsData.map(item => {
      // 創建一個新物件，只包含你要保留的欄位
      const { project } = item;
      return { project };
    });
    setSelectedAdminDevicesData(newData);
    console.log(newData);
  };
  //取得datagrid裡面所有select的資料(device)
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
  // 刪除專案的選擇整列的function
  const onRowsSelectionHandlerDelete = (ids) => {
    console.log(ids)
    console.log(type(ids))
    console.log(projectList)
    const selectedRowsData = ids.map((id) => projectList.find((row) => row.id === id))
    const newData = selectedRowsData.map(item => {
      // 創建一個新物件，只包含你要保留的欄位
      const { project, line, device, ename, cname } = item;
      return { project, line, device, ename, cname };
    });
    setSelectedDeleteDevicesData(newData);
    console.log(newData);
  };
  //取得datagrid裡面所有select的資料(project userID)
  const onRowsSelectionHandlerUser = (ids) => {
    if (ids.length === 0) {
      setSelectedRow(null); // 没有选中行
    } else {
      setSelectedRow(ids[0]); // 只保留第一个选中的行
    }
    const selectedRowsData = ids.map((id) => projectUsers.find((row) => row.id === id))
    setSelectedDevicesDataUser(selectedRowsData);
  };
  useEffect(() => {

    console.log("selectedProjectDataBelong updated:", selectedProjectDataBelong);
  }, [selectedProjectDataBelong]);
  //取得datagrid裡面所有select的資料(project)
  const onRowsSelectionHandlerProjectFromUser = (ids) => {
    // 处理选中行逻辑
    const selectedRowsProjectData = ids.map((id) => projectUsersBelong.find((row) => row.id === id))
    const newData = selectedRowsProjectData.map(item => {
      // 創建一個新物件，只包含你要保留的欄位
      const project_id = item.project_id;
      return project_id;
    });
    console.log(newData)
    setSelectedProjectDataBelong(newData[0]); // 更新状态
    console.log(selectedProjectDataBelong)
  }
  //////////////////////////////////////////////////////////////
  //依照所選擇的device去post資料
  function handleOnClickProjectPost() {
    if (!token) {
      // 没有token，不执行操作
      return;
    }
    setLoading(true)
    const data = {
      token: token,
      project: selectedDevicesData

    }
    console.log(data)
    if (data.project === undefined || data.project.length === 0) {
      handleErrorOpen((globalVariable === "zh-tw" ? ("尚未選取專案") : globalVariable === "zh-cn" ? ("尚未选取专案") : ("No project selected")))
      setLoading(false)
    } else {
      handleOpen((globalVariable === "zh-tw" ? "正在進行專案前處理" : globalVariable === "zh-cn" ? "正在进行专案前处理" : "Project pre-processing in progress"));
      apiPostProjectDevices(data)
        .then(res => {
          handleOpen((globalVariable === "zh-tw" ? "新增專案成功" : globalVariable === "zh-cn" ? "新增专案成功" : "New project successful"));
          setLoading(false)
        }).catch(err => {
          console.log(err);
          handleErrorOpen((globalVariable === "zh-tw" ? ("新增專案失敗" + err) : globalVariable === "zh-cn" ? ("新增专案失败" + err) : ("Failed to add new project" + err)))
          setLoading(false)
        })
    }
  };
  const [projectTableListPost, setProjectTableListPost] = useState([]);
  //////////////////////////////////////////////////////////
  function handleOnClickAdminProjectPost() {
    if (!token) {
      // 没有token，不执行操作
      return;
    }
    setLoading(true)
    const data = {
      token: token,
      project: selectedAdminDevicesData.map(device => device.project)
    }
    console.log(data)
    console.log(data.project[0])
    console.log(data.project)
    if (data === undefined || data.length === 0) {
      handleErrorOpen((globalVariable === "zh-tw" ? ("尚未選取專案") : globalVariable === "zh-cn" ? ("尚未选取专案") : ("No project selected")))
      setLoading(false)
    } else {
      handleOpen((globalVariable === "zh-tw" ? "正在進行專案前處理" : globalVariable === "zh-cn" ? "正在进行专案前处理" : "Project pre-processing in progress"));
      apiPostAdminProjectDevices(data)
        .then(res => {
          handleOpen((globalVariable === "zh-tw" ? "新增專案成功" : globalVariable === "zh-cn" ? "新增专案成功" : "New project successful"));
          setLoading(false)
          setProjectTableListPost(data.project)
          console.log(projectTableListPost)
        }).catch(err => {
          console.log(err);
          handleErrorOpen((globalVariable === "zh-tw" ? ("新增專案失敗" + err) : globalVariable === "zh-cn" ? ("新增专案失败" + err) : ("Failed to add new project" + err)))
          setLoading(false)
        })
    }
  };
  ///////////////////////////////////////////////////////////////
  //新增user到專案
  function handleOnClickAddUserToProject() {
    const data = {
      token: token,
      project_id: projectID,
      user_id: document.getElementById('userID').value,
      permission: permission
    }
    apiPostProjectUser(data)
      .then(res => {
        handleOpen((globalVariable === "zh-tw" ? "新增成功" : globalVariable === "zh-cn" ? "新增成功" : "Added successfully"))
      }).catch(err => { console.log(err); handleErrorOpen((globalVariable === "zh-tw" ? "新增user失敗" : globalVariable === "zh-cn" ? "新增user失败" : "Failed to add user")); })
  };
  //查詢user負責之專案
  function getProjectFromUser() {
    const data = {
      token: token,
      user_id: document.getElementById('searchStaff').value,
      //要設定一個const ...useState來存資料，並用useeffect去取資料
    }
    apiGetProjectUserBelong(data)
      .then((res) => {
        const newData = res.data.map((item, index) => ({
          ...item,
          id: index + 1,
          project_id: item.project_id
          // role: permissionMap[item.permission]
        }));
        console.log(newData)
        setProjectUsersBelong(newData)
      })
      .catch((error) => {
        console.error('Error fetching project data:', error);
      });
  }
  //刪除user負責之專案
  function deleteProjectFromUser() {
    const data = {
      token: token,
      user_id: document.getElementById('searchStaff').value,
      project_id: selectedProjectDataBelong//有機會變成是只能一次刪一個project(要測試)
    }
    console.log(data)
    apiDeleteProjectUserBelong(data)
      .then(res => {
        handleOpen((globalVariable === "zh-tw" ? ('成功刪除User: ' + data.userID) : globalVariable === "zh-cn" ? ('成功删除User: ' + data.userID) : ('User deleted successfully: ' + data.userID)))
        // 关闭对话框
        userDeleteHandleClose();
      }).catch(err => { console.log(err); handleErrorOpen((globalVariable === "zh-tw" ? "刪除User失敗" : globalVariable === "zh-cn" ? "删除User失败" : "Failed to delete User")) })
  };
  //刪除project user
  function deleteProjectUser() {
    const data = {
      token: token,
      projectID: projectID,
      userID: selectedDevicesDataUser[0]['badge']
    }
    console.log(data)
    apiDeleteProjectUser(data)
      .then(res => {
        handleOpen((globalVariable === "zh-tw" ? ('成功刪除User: ' + data.userID) : globalVariable === "zh-cn" ? ('成功删除User: ' + data.userID) : ('User deleted successfully: ' + data.userID)))
        // 关闭对话框
        userDeleteHandleClose();
      }).catch(err => { console.log(err); handleErrorOpen((globalVariable === "zh-tw" ? "刪除User失敗" : globalVariable === "zh-cn" ? "删除User失败" : "Failed to delete User")) })
  };

  const [showFirstCard, setShowFirstCard] = useState(true);
  const [showSecondCard, setShowSecondCard] = useState(true);

  const handleShowFirstCard = () => {
    setShowFirstCard(true);
  };

  const handleShowSecondCard = () => {
    setShowFirstCard(false);
    // setShowSecondCard(true)
  };
  // const handleShowThirdCard = () => {
  //   setShowFirstCard(false);
  //   setShowFirstCard(false);
  // };
  const getRowClassName = (params) => {
    console.log(params.row.selected); // 检查这里的输出
    return params.row.selected ? { backgroundColor: '#ffc107' } : {};
  };
  // const fetchtableData = () => {
  //   apiProjectTable(token)
  //     .then((res) => {
  //       console.log(res.data); // 确保你能够看到这个时间戳在控制台中输出
  //       // 在这里对返回的时间戳进行处理
  //       setTimestampData(res.data); // 将时间戳保存到状态中，以便在组件中使用
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     });
  // };
  const [projectTableList, setProjectTableList] = useState([])
  //  Get資料庫裡project裡面的project詳細清單
  function handleOnClickProjectTable() {
    if (!token) {
      // 没有token，不执行操作
      return;
    }
    apiGetProjectTable(token)
      .then((res) => {
        console.log(res.data)
        //因為Mui dataGrid這個套件要有一個id的欄位當作基準，但是api回傳資料沒有，所以這邊做一個id的欄位讓dataGrid可以順利渲染
        const newData = res.data.map((item, index) => ({
          ...item,
          id: index + 1, // 使用唯一的值作為 id
          project: item,
          // selectedDisplay: item.selected ? '是' : '否',
        }));
        const selectedIds = newData.filter((item) => item.selected).map((item) => item.id);
        // console.log(newData)
        setProjectTableList(newData);
        setSelectionModel(selectedIds); // 設定初始的選中狀態
        console.log(projectTableList)
        handleOpen((globalVariable === "zh-tw" ? "查詢成功" : globalVariable === "zh-cn" ? "查询成功" : "search successful"))
      }).catch(err => { console.log(err); handleErrorOpen((globalVariable === "zh-tw" ? ("查询專案失敗: " + err) : globalVariable === "zh-cn" ? ("新增专案失败:" + err) : ("Query project failed:" + err))); })
  };

  return (
    <ThemeProvider theme={darkTheme}>

      <Box display="flex">
        <Box>
          <LoadingButton variant="contained" color="info" onClick={handleShowFirstCard} sx={{ mr: 1 }}>
            <FolderCopyIcon sx={{ mr: 2 }} />
            {globalVariable === "zh-tw" ? "專案管理" : globalVariable === "zh-cn" ? "专案管理" : "Project management"}
          </LoadingButton>
        </Box>
        <Box>
          <LoadingButton variant="contained" color="info" onClick={handleShowSecondCard} sx={{ mr: 1 }}>
            <AccountBoxIcon sx={{ mr: 2 }} />
            {globalVariable === "zh-tw" ? "人員管理" : globalVariable === "zh-cn" ? "人员管理" : "Employee management"}
          </LoadingButton>
        </Box>

      </Box>
      {showFirstCard ? (
        <Card>
          {/* ////////////////////////////////////// 建立一個list可供選擇project要串api_table*/}
          <Card display="flex" alignItems="center" pt={3} px={2}>
            <Box sx={{ bgcolor: "#696969" }}>
              {globalVariable === "zh-tw" ? (
                <CardHeader title="專案表單" color="#696969" />
              ) : globalVariable === "zh-cn" ? (
                <CardHeader title="专案表单" color="#696969" />
              ) : (
                <CardHeader title="Project list" color="#696969" />
              )}
            </Box>
            {/* 利用project/table這支api去的到一個陣列，裡面會有每個專案的名字，建構一個table裏面包含了checkbox,已於專案中 */}
            <div style={{ display: 'flex', alignItems: 'center', mr: '100px' }}>
              <LoadingButton variant="contained" color="info" onClick={handleOnClickProjectTable} >
                {globalVariable === "zh-tw" ? "查詢現有專案" : globalVariable === "zh-cn" ? "查询现有专案" : "Query existing projects"}
              </LoadingButton>

              <LoadingButton loading={loading} variant="contained" color="info" onClick={() => { handleOnClickAdminProjectPost(); }}>
                {globalVariable === "zh-tw" ? "新增專案至專案選擇表" : globalVariable === "zh-cn" ? "新增专案至专案选择表" : "Add newAdd a new project to the project selection list project"}
              </LoadingButton>

              <LoadingButton loading={loading} variant="contained" color="error" onClick={() => { projectAdminhandleDelete(); }}>
                {globalVariable === "zh-tw" ? "刪除所選專案" : globalVariable === "zh-cn" ? "删除所选专案" : "Delete selected projects"}
              </LoadingButton>
            </div>


            <Box display="flex" pt={3} px={2} mb={3}>
              <div style={{ height: 600, width: "100%" }}>
                {globalVariable === "zh-tw" ? (
                  <div style={{ height: 600, width: '100%' }}>
                    <DataGrid
                      rows={projectTableList}
                      columns={columnsListTW}
                      initialState={{
                        pagination: {
                          paginationModel: { pageSize: 5 },
                        },
                      }}
                      pageSizeOptions={[5]}
                      checkboxSelection
                      onSelectionModelChange={(ids) => onRowsSelectionHandlerAdmin(ids)}
                    />
                  </div>
                ) : globalVariable === "zh-cn" ? (
                  <div style={{ height: 600, width: '100%' }}>
                    <DataGrid
                      rows={projectTableList}
                      columns={columnsListCN}
                      initialState={{
                        pagination: {
                          paginationModel: { pageSize: 5 },
                        },
                      }}
                      pageSizeOptions={[5]}
                      checkboxSelection
                      onSelectionModelChange={(ids) => onRowsSelectionHandlerAdmin(ids)}
                    />
                  </div>
                ) : (
                  <div style={{ height: 600, width: '100%' }}>
                    <DataGrid
                      rows={projectTableList}
                      columns={columnsListEN}
                      initialState={{
                        pagination: {
                          paginationModel: { pageSize: 5 },
                        },
                      }}
                      pageSizeOptions={[5]}
                      checkboxSelection
                      onSelectionModelChange={(ids) => onRowsSelectionHandlerAdmin(ids)}
                    />
                  </div>
                )}

              </div>
            </Box>


          </Card>
          <Divider sx={{ borderBottomWidth: 3, mt: 2 }} />
          {/* ////////////////////////////////////// */}
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
            <Snackbar
              open={alertOpen}
              autoHideDuration={5000}
              onClose={handleClose}
              variant="filled"
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'center'
              }}
            >
              <Alert onClose={handleClose} severity='success' sx={{ width: '100%' }}>
                {message}
              </Alert>
            </Snackbar>
            <Snackbar
              open={errorAlertOpen}
              autoHideDuration={5000}
              onClose={handleErrorClose}
              variant="filled"
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'center'
              }}
            >
              <Alert onClose={handleErrorClose} severity='error' sx={{ width: '100%' }}>
                {errorMessage}
              </Alert>
            </Snackbar>
            <Grid container spacing={1}>
              <Grid item xs={12} md={12}>
                <Box>
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

                      {/* <Box mr={2} sx={{ minWidth: 200 }}>
                          <Select
                            labelId="permission-select-label"
                            id="permission-select"
                            value={projectIDSelect}
                            onChange={projectSelectNameChange}

                          >
                            <MenuItem value="">清空欄位</MenuItem>
                            {projectTableListPost.map((project) => (
                              <MenuItem value={project}>
                                {project}

                              </MenuItem>

                            ))}
                          </Select>
                        </Box> */}
                      <Box ml={2}>
                        <LoadingButton variant="contained" color="info" onClick={handleOnClickProjectAdd}>
                          {globalVariable === "zh-tw" ? "查詢" : globalVariable === "zh-cn" ? "查询" : "Search"}
                        </LoadingButton>
                      </Box>
                    </Box>

                  </Box>


                  {/* <Box>
                  <Box component="form" role="form" mb={3}>
                    <Typography variant="h4" fontWeight="medium" mt={3}>
                      {globalVariable === "zh-tw" ? "新增專案" : globalVariable === "zh-cn" ? "新增专案" : "Add new project"}
                    </Typography>
                    <FormControl>
                      <Box display="flex" alignItems="center" pt={3} px={2}>
                        <Typography variant="h5" fontWeight="medium" mr={2}>
                          {globalVariable === "zh-tw" ? "專案名稱:" : globalVariable === "zh-cn" ? "专案名称:" : "Project name:"}
                        </Typography>
                        <Box mr={2}>
                          {globalVariable === "zh-tw" ? (//要改value onchange
                            <Select id="searchProject" multiple type="search-staff" label="專案名稱" value={projectTableListPost} onChange={projectSelectNameChange} style={{ minWidth: "200px", height: "45px" }}/>
                          ) : globalVariable === "zh-cn" ? (
                            <Select id="searchProject" multiple type="search-staff" label="专案名称" value={projectTableListPost} onChange={projectSelectNameChange} style={{ minWidth: "200px", height: "45px" }}/>
                          ) : (
                            <Select id="searchProject" multiple type="search-staff" label="Project name" value={projectTableListPost} onChange={projectSelectNameChange} style={{ minWidth: "200px", height: "45px" }}/>
                          )}
                        </Box>
                        <Box ml={2}>
                          <LoadingButton variant="contained" color="info" onClick={handleOnClickProjectAdd}>
                            {globalVariable === "zh-tw" ? "查詢" : globalVariable === "zh-cn" ? "查询" : "Search"}
                          </LoadingButton>
                        </Box>
                      </Box>
                    </FormControl>
                  </Box> */}
                  <Box display="flex" alignItems="center" pt={3} px={2}>
                    {globalVariable === "zh-tw" ? (
                      <div style={{ height: 600, width: '100%' }}>
                        <DataGrid
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
                        />
                      </div>
                    ) : globalVariable === "zh-cn" ? (
                      <div style={{ height: 600, width: '100%' }}>
                        <DataGrid
                          rows={projectList}
                          columns={columnsCN}
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
                          rows={projectList}
                          columns={columnsEN}
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
                  <Box display="flex" pt={3} px={2}>
                    <Box>
                      <LoadingButton loading={loading} variant="contained" color="info" onClick={() => { handleOnClickProjectPost(); }}>
                        {globalVariable === "zh-tw" ? "新增專案" : globalVariable === "zh-cn" ? "新增专案" : "Add new project"}
                      </LoadingButton>
                    </Box>
                  </Box>

                  <Divider sx={{ borderBottomWidth: 3, mt: 2 }} />

                  <Box component="form" role="form" mb={3}>
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

                    <LoadingButton
                      variant="contained"
                      color="error"
                      sx={{ ml: 3 }}
                      onClick={() => {
                        console.log("Delete button clicked");
                        projectDeleteHandleClickOpen();
                      }}
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
                          onClick={() => {
                            console.log("Delete button clicked 裡面的");
                            projectDelete();
                            // handleOnClickProjectPost()

                          }}
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
                    {/* ///////////////////////////////////// */}
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
                            columns={columnsCN}
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
                            columns={columnsEN}
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
                      {/* //////////////////// */}

                      {/* {/* <Typography variant="h5" fontWeight="medium" mr={2}>
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
                            {project.map((projectItem) => (
                              <MenuItem value={projectItem.id}>
                                {projectItem.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl> */}
                    </Box>
                    {/* ////////////////////////專案名稱、專案流程、專案進度(未完成)/////////////////////////// */}
                    <Divider sx={{ borderBottomWidth: 3, mt: 2, mb: 2 }} />
                    <Box component="form" role="form" mb={3}>
                      <Typography variant="h4" fontWeight="medium" mt={3}>
                        {globalVariable === "zh-tw" ? "專案進度顯示" : globalVariable === "zh-cn" ? "专案进度显示" : "Project progress display project"}
                      </Typography>

                      <LoadingButton
                        variant="contained"
                        color="info"
                        onClick={handleOnClickProjectProcess}////////////要改，資料要改成新的API，並進行資料處理
                      >
                        {globalVariable === "zh-tw" ? "更新專案進度" : globalVariable === "zh-cn" ? "更新专案进度" : "Update projectprogress"}
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
                              columns={columnsprojectprogressCN}
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
                              columns={columnsprojectprogressEN}
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
                      {/* /////////////////////////////////////////////////// */}
                      {/* 原本刪除機台的位置 */}
                      {/* <LoadingButton
                        variant="contained"
                        color="error"
                        onClick={() => {
                          console.log("Delete button clicked");
                          projectDeleteHandleClickOpen();
                        }}
                      >
                        {globalVariable === "zh-tw" ? "刪除機台" : globalVariable === "zh-cn" ? "删除机台" : "Delete Machine"}
                      </LoadingButton> */}
                      {/* <Dialog
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
                            onClick={() => {
                              console.log("Delete button clicked 裡面的");
                              // projectDelete();
                              handleOnClickProjectPost()
                            }}
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
                      </Dialog> */}
                    </Box>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ) : (
        <Card>
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
                  </Box>
                  <Box display="flex" alignItems="center" pt={3} px={2}>
                    <Typography variant="h5" fontWeight="medium" mr={2}>
                      {globalVariable === "zh-tw" ? "人員名稱" : globalVariable === "zh-cn" ? "人员名称" : "Employee name"}
                    </Typography>
                    <Typography variant="h5" fontWeight="medium" mr={2}>
                      {employeeName}
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
                        {project.map((projectItem) => (
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
                          <MenuItem value={5}>系統管理者</MenuItem>
                          <MenuItem value={4}>專案管理者</MenuItem>
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
                          <MenuItem value={5}>系统管理者</MenuItem>
                          <MenuItem value={4}>专案管理者</MenuItem>
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
                          <MenuItem value={5}>System administrator</MenuItem>
                          <MenuItem value={4}>Project manager</MenuItem>
                          <MenuItem value={2}>Project leader</MenuItem>
                          <MenuItem value={1}>Employee</MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  </Box>
                  <Box display="flex" alignItems="center" pt={3} px={2}>
                    <Box>
                      <LoadingButton variant="contained" color="info" onClick={handleOnClickAddUserToProject}>
                        {globalVariable === "zh-tw" ? "新增" : globalVariable === "zh-cn" ? "新增" : "New"}
                      </LoadingButton>
                    </Box>
                  </Box>
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
                          {project.map((projectItem) => (
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
                        selectionModel={selectedRow ? [selectedRow] : []} // 通过 selectedRow 控制选中状态
                        onSelectionModelChange={(ids) => {
                          onRowsSelectionHandlerUser(ids);
                        }}
                      />
                    </div>
                  ) : globalVariable === "zh-cn" ? (
                    <div style={{ height: 400, width: '100%' }}>
                      <DataGrid
                        rows={projectUsers}
                        columns={empColumnsCN}
                        initialState={{
                          pagination: {
                            paginationModel: { page: 0, pageSize: 5 },
                          },
                        }}
                        pageSizeOptions={[5, 10]}
                        checkboxSelection
                        hideFooterSelectedRowCount
                        selectionModel={selectedRow ? [selectedRow] : []} // 通过 selectedRow 控制选中状态
                        onSelectionModelChange={(ids) => {
                          onRowsSelectionHandlerUser(ids);
                        }}
                      />
                    </div>
                  ) : (
                    <div style={{ height: 400, width: '100%' }}>
                      <DataGrid
                        rows={projectUsers}
                        columns={empColumnsEN}
                        initialState={{
                          pagination: {
                            paginationModel: { page: 0, pageSize: 5 },
                          },
                        }}
                        pageSizeOptions={[5, 10]}
                        checkboxSelection
                        hideFooterSelectedRowCount
                        selectionModel={selectedRow ? [selectedRow] : []} // 通过 selectedRow 控制选中状态
                        onSelectionModelChange={(ids) => {
                          onRowsSelectionHandlerUser(ids);
                        }}
                      />
                    </div>
                  )}
                </Box>
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
                          onClick={() => { deleteProjectUser(); }}
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
                {/* //////////////////////////////////// */}
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
                    {/* <FormControl>
                        <InputLabel id="demo-simple-select-label">{globalVariable === "zh-tw" ? "人員編號" : globalVariable === "zh-cn" ? "人員編號" : "User ID"}</InputLabel> */}
                    {/* <Select
                          labelId="permission-select-label"
                          id="permission-select"
                          value={projectID}//要改
                          label={globalVariable === "zh-tw" ? "專案" : globalVariable === "zh-cn" ? "专案" : "Project"}
                          onChange={projectNameChange}//要改成人員namechange
                          style={{ minWidth: "200px", height: "45px" }}
                        >
                          {project.map((projectItem) => (
                            <MenuItem value={projectItem.id}>
                              {projectItem.name}
                            </MenuItem>
                          ))}
                        </Select> */}
                    {/* </FormControl> */}
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
                        checkboxSelection// 通过 selectedRow 控制选中状态
                        onSelectionModelChange={(ids) => {
                          onRowsSelectionHandlerProjectFromUser(ids);
                        }}
                      />
                    </div>
                  ) : globalVariable === "zh-cn" ? (
                    <div style={{ height: 400, width: '100%' }}>
                      <DataGrid
                        rows={projectUsersBelong}
                        columns={columnsProjectFromUserCN}
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
                        columns={columnsProjectFromUserEN}
                        initialState={{
                          pagination: {
                            paginationModel: { pageSize: 5 },
                          },
                        }}
                        pageSizeOptions={[5]}
                        checkboxSelection// 通过 selectedRow 控制选中状态
                        onSelectionModelChange={(ids) => {
                          onRowsSelectionHandlerProjectFromUser(ids);
                        }}
                      />
                    </div>
                  )}
                </Box>
                <Box display="flex" pt={3} px={2}>
                  <Box>
                    <LoadingButton
                      variant="contained"
                      color="error"
                      onClick={userDeleteHandleClickOpen}
                    >
                      {globalVariable === "zh-tw" ? "刪除負責該專案之人員" : globalVariable === "zh-cn" ? "刪除負責該專案之人員" : "Delete the person responsible for the project"}
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
                          onClick={() => { deleteProjectFromUser(); }}
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
                {/* //////////////////////////////////// */}
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}
    </ThemeProvider >

  );
}