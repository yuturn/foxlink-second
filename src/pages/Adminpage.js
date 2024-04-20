import React, { useState, useEffect, useContext } from "react";
import {
  apiGetProjectTable,
  apiDeleteAdminProjectDevices,
  apiGetProjectName,
  apiPostAdminProjectDevices,
} from '../api';
import {
  Box,
  CardHeader,
  LoadingButton,
  DataGrid,
  FormControlLabel,
  styled,
  createTheme,
  ThemeProvider,
  Switch
} from '@mui/material';
import { GlobalContext } from '../components/GlobalContext';

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

const Android12Switch = styled(Switch)(({ theme }) => ({
  padding: 8,
  '& .MuiSwitch-track': {
    borderRadius: 22 / 2,
    backgroundColor: '#fff',  // Default (off) color
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
    backgroundColor: '#fff',
  },
  '& .Mui-checked .MuiSwitch-thumb': {
    backgroundColor: '#007BFF',
  },
  '& .Mui-checked + .MuiSwitch-track': {
    backgroundColor: '#007BFF',
  },
}));

function Adminpage({ token, ...rest }) {
  const { globalVariable } = useContext(GlobalContext);
  const [projectTableList, setProjectTableList] = useState([]);

  useEffect(() => {
    if (token) {
      apiGetProjectName(token)
        .then((res) => {
          const formattedData = res.data.map((item, index) => ({
            id: index + 1,
            name: item,
            select: false
          }));
          setProjectTableList(formattedData);
        })
        .catch((error) => console.error('Error fetching project data:', error));
    }
  }, [token]);

  const handleOnClickProjectTable = () => {
    apiGetProjectTable(token)
      .then((res) => {
        const formattedData = res.data.map((item, index) => ({
          id: index + 1,
          name: item,
          select: false
        }));
        setProjectTableList(formattedData);
      })
      .catch((error) => console.error('Error fetching project data:', error));
  };

  const handleSwitchChange = (id, event) => {
    const newState = event.target.checked;
    setProjectTableList(current =>
      current.map(row => 
        row.id === id ? { ...row, select: newState } : row
      )
    );
  };

  const columns = [
    { field: 'name', headerName: globalVariable === "zh-tw" ? "專案名稱" : globalVariable === "zh-cn" ? "专案名称" : "Project name", width: 200 },
    { field: 'switch', headerName: globalVariable === "zh-tw" ? "是否加入專案中" : globalVariable === "zh-cn" ? "是否加入专案中" : "Whether to join the project", width: 200,
      renderCell: (params) => (
        <FormControlLabel
          control={
            <Android12Switch
              checked={params.row.select}
              onChange={(event) => handleSwitchChange(params.row.id, event)}
              color="primary"
            />
          }
          label=""
        />
      )
    },
  ];

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ bgcolor: "#696969" }}>
        <CardHeader title={globalVariable === "zh-tw" ? "專案表單" : globalVariable === "zh-cn" ? "专案表单" : "Project list"} color="#696969" />
        <LoadingButton variant="contained" color="info" onClick={handleOnClickProjectTable}>
          {globalVariable === "zh-tw" ? "查詢現有專案" : globalVariable === "zh-cn" ? "查询现有专案" : "Query existing projects"}
        </LoadingButton>
        <Box display="flex" pt={3} px={2} mb={3}>
          <DataGrid
            rows={projectTableList}
            columns={columns}
            pageSize={5}
            disableSelectionOnClick
          />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default Adminpage;
