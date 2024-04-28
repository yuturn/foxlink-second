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
import { FormControlLabel } from '@mui/material';
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import { type } from "@testing-library/user-event/dist/type";
import Switch from '@mui/material/Switch';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import FolderCopyIcon from '@mui/icons-material/FolderCopy';
import { Construction } from "@mui/icons-material";


const darkTheme = createTheme({
  palette: {
    mode: 'light',
    background: { default: '#62aaf4', paper: '#FFFFFF' },
    text: { primary: '#000000' },
    primary: { main: '#696969' },
  },
});

const Android12Switch = styled(Switch)({
  padding: 8,
  '& .MuiSwitch-track': {
    borderRadius: 22 / 2,
    backgroundColor: '#fff',
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
      backgroundImage: 'desired-icon-url',
    },
    '&::after': {
      right: 12,
      backgroundImage: 'desired-icon-url',
    },
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: '#fff',
    '&.Mui-checked': {
      backgroundColor: '#007BFF',
    },
  },
  '& .Mui-checked + .MuiSwitch-track': {
    backgroundColor: '#007BFF',
  },
});

function Adminpage({ token }) {
  const { globalVariable } = useContext(GlobalContext);
  const [projectTableList, setProjectTableList] = useState([]);
  const [loading, setLoading] = useState(false);

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
      deleteProject(selectedRow.name);
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

  const deleteProject = (projectName) => {
    if (!token) return;
    // Ensure that we are sending a string, not an array
    apiDeleteAdminProjectDevices({ token, project: projectName }) // Change here
      .then(() => {
        console.log("Project deleted:", projectName);
      })
      .catch((error) => {
        console.error("Failed to delete project:", error);
      });
  };
  useEffect(() => {
    apiGetProjectTable(token)
      .then((res) => {
        // 假設 res.data 是一個物件陣列，且每個物件中有一個 'select' 屬性
        const sortedData = res.data
          .map((item, index) => ({
            id: index + 1,
            name: item.name,
            select: item.select,
          }))
          .sort((a, b) => b.select - a.select); // 將已選擇的項目排序到前面

        setProjectTableList(sortedData);
        console.log("Sorted data loaded");
      })
      .catch((error) => {
        console.error("Failed to fetch data:", error);
      });
  }, [token]); // token 作為依賴，確保在 token 變更時重新取得數據

  const columns = [
    { field: 'name', headerName: globalVariable === "zh-tw" ? "專案名稱" : globalVariable === "zh-cn" ? "专案名称" : "Project name", width: 200 },
    {
      field: 'select',
      headerName: globalVariable === "zh-tw" ? "是否加入專案中" : globalVariable === "zh-cn" ? "是否加入专案中" : "Whether to join the project", width: 200,
      width: 150,
      renderCell: (params) => (
        <FormControlLabel
          control={
            <Android12Switch
              checked={params.value}
              onChange={(event) => handleSwitchChange(params.id, event)}
            />
          }
          label=""
        />
      ),
    },
  ];

  return (
    <ThemeProvider theme={darkTheme}>
      <Box >
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
                sortModel: [{ field: 'select', sort: 'desc' }],
              },
            }}
          />

        </div>
      </Box>
    </ThemeProvider>
  );
}

export default Adminpage;