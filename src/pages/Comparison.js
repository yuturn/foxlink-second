import React, { useState, useEffect } from "react";
import { apiGetCompareList, apiGetCompareSearch } from '../api'
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
// import dialog
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Paper from '@mui/material/Paper';

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { createTheme, ThemeProvider } from '@mui/material/styles';
// import { LineChart } from '@mui/x-charts/LineChart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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
const tableContainerStyle = {
  tableContainer: {
    maxHeight: '400px', // 設置表格容器的最大高度
    overflowY: 'auto',  // 啟用垂直滾輪
  },
};

const tableContainerDialogStyle = {
  tableContainer: {
    maxHeight: '400px', // 設置表格容器的最大高度
    overflowY: 'auto',  // 啟用垂直滾輪
  },
};

const data = [
  { id: 1, projectName: 'D7X E75', device: 'device1', line: '1', date: '2023/10/26', accuracyDate: '75.66%', trend: '查看' },
  { id: 2, projectName: 'D2Y E75', device: 'device2', line: '2', date: '2023/10/28', accuracyDate: '50.00%', trend: '查看' },
  { id: 3, projectName: 'X61 E75', device: 'device3', line: '3', date: '2023/10/31', accuracyDate: '77.62%', trend: '查看' },
  { id: 4, projectName: 'D7X E75', device: 'device4', line: '4', date: '2023/11/20', accuracyDate: '63.14%', trend: '查看' },
  { id: 5, projectName: 'D2Y E75', device: 'device5', line: '2', date: '2023/12/26', accuracyDate: '88.95%', trend: '查看' },
  { id: 6, projectName: 'X61 E75', device: 'device6', line: '3', date: '2023/12/29', accuracyDate: '47.54%', trend: '查看' },
];

const data6 = [
  {
    name: '10/15',
    value: 65.85,
  },
  {
    name: '10/16',
    value: 78.56,
  },
  {
    name: '10/17',
    value: 30.67,
  },
  {
    name: '10/18',
    value: 44.44,
  },
  {
    name: '10/19',
    value: 59.25,
  },
  {
    name: '10/20',
    value: 84.79,
  },
  {
    name: '10/21',
    value: 34.08,
  },
];


const detailData1 = [
  [
    {
      "id": 6695,
      "projectName": "d7x e75",
      "line": 1,
      "date": "2023-11-13",
      "accuracyDate": "0.98",
      "devices": {
        "Device_5": {
          "events": [
            {
              "name": "Glue异常",
              "predict": 0,
              "true": 0,
              "accuracy": 1
            },
            {
              "name": "UV检测站故障",
              "predict": 0,
              "true": 0,
              "accuracy": 1
            },
            {
              "name": "料盘取料上下气缸故障",
              "predict": 0,
              "true": 0,
              "accuracy": 1
            },
            {
              "name": "tray盘站故障",
              "predict": 0,
              "true": 0,
              "accuracy": 1
            },
            {
              "name": "House平移定位气缸故障",
              "predict": 0,
              "true": 0,
              "accuracy": 1
            }
          ],
          "device_accuracy": 1,
          "cname": "防水膠檢測"
        },
        "Device_6": {
          "events": [
            {
              "name": "Bush异常",
              "predict": 0,
              "true": 0,
              "accuracy": 1
            },
            {
              "name": "NG排料气缸故障",
              "predict": 0,
              "true": 0,
              "accuracy": 1
            },
            {
              "name": "压入检测站故障",
              "predict": 0,
              "true": 0,
              "accuracy": 1
            },
            {
              "name": "出料拨料气缸气缸故障",
              "predict": 0,
              "true": 0,
              "accuracy": 1
            },
            {
              "name": "主拨料站故障",
              "predict": 0,
              "true": 0,
              "accuracy": 1
            },
            {
              "name": "拨料上下4气缸故障",
              "predict": 0,
              "true": 0,
              "accuracy": 1
            },
            {
              "name": "拨料上下3气缸故障",
              "predict": 0,
              "true": 0,
              "accuracy": 1
            },
            {
              "name": "轴7-2#送料马达故障",
              "predict": 0,
              "true": 0,
              "accuracy": 1
            },
            {
              "name": "1#插针定位气缸故障",
              "predict": 1,
              "true": 0,
              "accuracy": 0
            },
            {
              "name": "House挡料气缸故障",
              "predict": 0,
              "true": 0,
              "accuracy": 1
            },
            {
              "name": "2#插针定位气缸故障",
              "predict": 0,
              "true": 0,
              "accuracy": 1
            },
            {
              "name": "拨料上下1气缸故障",
              "predict": 0,
              "true": 0,
              "accuracy": 1
            },
            {
              "name": "拨料上下2气缸故障",
              "predict": 0,
              "true": 0,
              "accuracy": 1
            },
            {
              "name": "进料错位气缸故障",
              "predict": 0,
              "true": 0,
              "accuracy": 1
            },
            {
              "name": "出料翻转气缸气缸故障",
              "predict": 0,
              "true": 0,
              "accuracy": 1
            },
            {
              "name": "2#尾料裁切气缸故障",
              "predict": 0,
              "true": 0,
              "accuracy": 1
            }
          ],
          "device_accuracy": 0.9523809523809523,
          "cname": "Bushing組裝"
        }
      },
      "trend": "查看"
    }
  ]
];

export default function Project({ token, ...rest }) {
  const [projectName, setProjectName] = useState("");
  const [device, setDevice] = useState("");
  const [line, setLine] = useState("");
  const today = new Date();
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
  const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
  const [startDate, setStartDate] = useState(startOfDay);
  const [endDate, setEndDate] = useState(endOfDay);
  const [accuracyOpen, setAccuracyOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [dialogProjectName, setDialogProjectName] = useState('D7X E75');
  const [projectNameList, setProjectNameList] = useState([]);
  const [deviceList, setDeviceList] = useState([]);
  const [lineList, setLineList] = useState([]);
  const [compareListData, setCompareListData] = useState([]);
  const [searchDateData, setSearchDateData] = useState([]);
  const [currentAccuracyInfo, setCurrentAccuracyInfo] = useState(null);
  const [currentLineInfo, setCurrentLineInfo] = useState(null);
  const [detailData, setDetailData] = useState({});
  const LineChartExample = () => {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          width={1000}
          height={500}
          data={data6}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="value" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  // useEffect(() => {
  //   console.log(startDate)
  //   console.log(startDate.$y + '/' + startDate.$M + 1 + '/' + startDate.$D)
  // }, [console.log(startDate), console.log(new Date(startDate).toISOString())]);

  // 使用另一个useEffect监听statisticDevices的变化
  useEffect(() => {
    getProjectName(token)
  }, []);

  const getProjectName = (token) => {
    if (!token) {
      // 没有token，不执行操作
      return;
    }

    apiGetCompareList(token)
      .then((res) => {
        console.log(res);
        setCompareListData(res.data)
        const list = res.data.map((project) => project.project_name);
        setProjectNameList(list);
      });
  }

  //一開始的table
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('label');
  //按查看進去的week table
  const [orderWeek, setWeekOrder] = useState('asc');
  const [weekOrderBy, setWeekOrderBy] = useState('label');
  //按查看進去的date table
  const [orderDate, setDateOrder] = useState('asc');
  const [dateOrderBy, setDateOrderBy] = useState('label');

  //一開始的table sort
  const handleSortRequest = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };
  const getComparator = (order) => {
    return order === 'desc'
      ? (a, b) => (a[orderBy] > b[orderBy] ? -1 : 1)
      : (a, b) => (a[orderBy] > b[orderBy] ? 1 : -1);
  };
  //點擊查看week的table sort
  const handleSortRequestWeek = (property) => {
    const isAsc = weekOrderBy === property && orderWeek === 'asc';
    setWeekOrder(isAsc ? 'desc' : 'asc');
    setWeekOrderBy(property);
  };
  const getComparatorWeek = (orderWeek) => {
    return orderWeek === 'desc'
      ? (a, b) => (a[weekOrderBy] > b[weekOrderBy] ? -1 : 1)
      : (a, b) => (a[weekOrderBy] > b[weekOrderBy] ? 1 : -1);
  };
  //點擊查看date的table sort
  const handleSortRequestDate = (property) => {
    const isAsc = dateOrderBy === property && orderDate === 'asc';
    setDateOrder(isAsc ? 'desc' : 'asc');
    setDateOrderBy(property);
  };
  const getComparatorDate = (orderDate) => {
    return orderDate === 'desc'
      ? (a, b) => (a[dateOrderBy] > b[dateOrderBy] ? -1 : 1)
      : (a, b) => (a[dateOrderBy] > b[dateOrderBy] ? 1 : -1);
  };

  function getColor(lightColor) {
    // 1 是異常
    if (lightColor === 1) {
      return "#ff2600";
      // 0 是穩定
    } else if (lightColor === 0) {
      return "#008f00";
    } else {
      return null; // 或者返回一个默认的图标
    }
  }

  //這邊是當projectName改變後做事情
  const handleChangeProject = (event) => {
    const selectedProjectName = event.target.value;
    setProjectName(selectedProjectName);
    const selectedProject = compareListData.find(item => item.project_name === selectedProjectName);
    console.log(selectedProject)
    if (selectedProject) {
      // 将设备名称转换为数组
      const lines = selectedProject.lines;
      setLineList(lines); // 将设备数组作为选项 
      // 不更改线号选项
    }
    // 清空Line选项
    setLine('');
  };
  //這邊是當lineName改變後做事情
  const handleChangeLine = (event) => {
    setLine(event.target.value);
  };

  const handleChangeSearch = () => {
    const data = {
      startDate: new Date(startDate).toISOString().split('T')[0] + ' ' + new Date(startDate).toTimeString().split(' ')[0].replace(/:/g, '%3A'),
      endDate: new Date(endDate).toISOString().split('T')[0] + ' ' + new Date(endDate).toTimeString().split(' ')[0].replace(/:/g, '%3A'),
      type: showFirstCard ? 'day' : 'week',
      project_name: projectName,
      line: line,
      token: token
    }
    apiGetCompareSearch(data)
      .then((res) => {
        setSearchDateData(res.data)
      });
  };
  const accuracyHandleClickOpen = (projectName, date, accuracy) => {
    setAccuracyOpen(true);
    setDialogProjectName(projectName);
    const data = {
      project_name: projectName,
      device_name: device,
      line: line,
      date: new Date(date).toISOString().split('T')[0] + '%2000%3A00%3A00',
      accuracy: accuracy,
      type: showFirstCard ? 'day' : 'week',
    };

    setCurrentAccuracyInfo(data);
  };
  const accuracyHandleClickClose = () => {
    setAccuracyOpen(false);
  };
  const detailHandleClickOpen = (projectName, line, date) => {
    setDetailOpen(true);
    setDialogProjectName(projectName);
    const data = {
      project_name: projectName,
      line: line,
      startDate: new Date(date).toISOString().split('T')[0] + '%2000%3A00%3A00',
      endDate: new Date(date).toISOString().split('T')[0] + '%2000%3A00%3A00',
      type: showFirstCard ? 'day' : 'week',
      token: token
    };
    console.log(data)
    apiGetCompareSearch(data)
      .then((res) => {
        console.log(res.data);
        setCurrentAccuracyInfo(res.data[0]['accuracyDate']);
        setCurrentLineInfo(res.data[0]['line']);
        console.log(res.data[0]['devices']);
        setDetailData(res.data[0]['devices'])
      });
  };
  const detailHandleClickClose = () => {
    setDetailOpen(false);
  };

  const [showFirstCard, setShowFirstCard] = useState(true);

  const handleShowFirstCard = () => {
    setShowFirstCard(true);
    setSearchDateData([]);
  };

  const handleShowSecondCard = () => {
    setShowFirstCard(false);
    setSearchDateData([]);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Box display="flex">
        <Box>
          <LoadingButton variant="contained" color="info" onClick={handleShowFirstCard} sx={{ mr: 1 }}>
            日預測
          </LoadingButton>
        </Box>
        <Box>
          <LoadingButton variant="contained" color="info" onClick={handleShowSecondCard}>
            週預測
          </LoadingButton>
        </Box>
      </Box>
      {showFirstCard ? (
        <Card>
          <Box sx={{ bgcolor: '#696969' }}>
            <CardHeader title="日預測" color="#696969" />
          </Box>
          <CardContent>
            <Typography variant="h4" fontWeight="medium" mt={3}>
              預測與實際結果比對查詢
            </Typography>
            <Grid container spacing={1}>
              <Grid item xs={2}>
                <Box>
                  <Box component="form" role="form">
                    <Box display="flex" alignItems="center" pt={3} >
                      <Typography variant="h6" fontWeight="medium" mr={2}>
                        專案:
                      </Typography>
                      <Box mr={2}>
                        <FormControl>
                          <InputLabel id="demo-simple-select-label">專案</InputLabel>
                          <Select
                            labelId="permission-select-label"
                            id="permission-select"
                            value={projectName}
                            label="專案"
                            onChange={handleChangeProject}
                            style={{ minWidth: "150px", height: "45px" }}
                          >
                            {projectNameList.map((projectItem) => (
                              <MenuItem value={projectItem}>
                                {projectItem}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={2}>
                <Box>
                  <Box component="form" role="form">
                    <Box display="flex" alignItems="center" pt={3} >
                      <Typography variant="h6" fontWeight="medium" mr={2}>
                        線號:
                      </Typography>
                      <Box>
                        <FormControl>
                          <InputLabel id="demo-simple-select-label">專案</InputLabel>
                          <Select
                            labelId="permission-select-label"
                            id="permission-select"
                            value={line}
                            label="線號"
                            onChange={handleChangeLine}
                            style={{ minWidth: "150px", height: "45px" }}
                          >
                            {lineList.map((lineItem) => (
                              <MenuItem value={lineItem}>
                                {lineItem}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={3}>
                <Box component="form" role="form">
                  <Box display="flex" alignItems="center" pt={3} >
                    <Typography variant="h6" fontWeight="medium" mr={2}>
                      開始:
                    </Typography>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="選擇日期"
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
              <Grid item xs={3}>
                <Box component="form" role="form">
                  <Box display="flex" alignItems="center" pt={3} >
                    <Typography variant="h6" fontWeight="medium" mr={2}>
                      結束:
                    </Typography>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="選擇日期"
                        value={endDate}
                        onChange={(newValue) => {
                          setEndDate(newValue);
                        }}
                        renderInput={(params) => <TextField size="medium" {...params} />}
                      />
                    </LocalizationProvider>
                  </Box>
                </Box>
              </Grid>
            </Grid>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Box display="flex" alignItems="center" justifyContent="center" pt={3} >
                  <LoadingButton variant="contained" color="info" align="center" onClick={handleChangeSearch} style={{ width: '150px' }}>
                    查詢
                  </LoadingButton>
                </Box>
              </Grid>
            </Grid>
            <Divider sx={{ borderBottomWidth: 3, mt: 4 }} />
            <Grid container spacing={1} sx={{ mt: 4 }}>
              <Grid xs={12}>
                <TableContainer component={Paper} style={tableContainerStyle.tableContainer}>
                  <Table>
                    <TableHead style={{ backgroundColor: '#696969' }}>
                      <TableRow>
                        <TableCell align="center" sx={{ borderBottom: 0 }}>
                          <TableSortLabel
                            active={orderBy === 'label'}
                            direction={orderBy === 'label' ? order : 'asc'}
                            onClick={() => handleSortRequest('label')}
                          >
                            <Typography fontSize={20}>專案</Typography>
                          </TableSortLabel>
                        </TableCell>
                        <TableCell align="center" sx={{ borderBottom: 0 }}>
                          <TableSortLabel
                            active={orderBy === 'line'}
                            direction={orderBy === 'line' ? order : 'asc'}
                            onClick={() => handleSortRequest('line')}
                          >
                            <Typography fontSize={20}>線別</Typography>
                          </TableSortLabel>
                        </TableCell>
                        <TableCell align="center" sx={{ borderBottom: 0 }}>
                          <TableSortLabel
                            active={orderBy === 'date'}
                            direction={orderBy === 'date' ? order : 'asc'}
                            onClick={() => handleSortRequest('date')}
                          >
                            <Typography fontSize={20}>時間</Typography>
                          </TableSortLabel>
                        </TableCell>
                        <TableCell align="center" sx={{ borderBottom: 0 }}>
                          <TableSortLabel
                            active={orderBy === 'accuracyDate'}
                            direction={orderBy === 'accuracyDate' ? order : 'asc'}
                            onClick={() => handleSortRequest('accuracyDate')}
                          >
                            <Typography fontSize={20}>預測準確率</Typography>
                          </TableSortLabel>
                        </TableCell>
                        <TableCell align="center" sx={{ borderBottom: 0 }}>
                          <TableSortLabel>
                            <Typography fontSize={20}>預測趨勢</Typography>
                          </TableSortLabel>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {searchDateData.sort(getComparator(order)).map((info) => {
                        return (
                          <TableRow key={info.name}>
                            <TableCell align="center">
                              <Typography fontSize={20}>{info.projectName}</Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Typography fontSize={20}>{info.line}</Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Typography fontSize={20}>{info.date}</Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Typography fontSize={20}>
                                <LoadingButton variant="contained" color="info" align="center" onClick={() => accuracyHandleClickOpen(info.projectName, info.date, info.accuracyDate)}>
                                  {(info.accuracyDate * 100).toFixed(2)}%
                                </LoadingButton>
                              </Typography>
                              <Dialog
                                open={accuracyOpen}
                                onClose={accuracyHandleClickClose}
                                aria-labelledby="alert-dialog-accuracy"
                                aria-describedby="alert-dialog-accuracy"
                                sx={{
                                  "& .MuiDialog-container": {
                                    "& .MuiPaper-root": {
                                      width: "100%",
                                      minWidth: "1100px",  // Set your width here
                                    },
                                  },
                                }}
                              >
                                <DialogTitle id="alert-dialog-title-accuracy" sx={{ backgroundColor: "#696969" }}>{dialogProjectName}</DialogTitle>
                                <DialogContent>
                                  <div style={{ width: '1000px', height: '550px' }}>
                                    {LineChartExample()}
                                  </div>
                                </DialogContent>
                                <DialogActions>
                                  <LoadingButton onClick={accuracyHandleClickClose} autoFocus variant="contained">
                                    关闭
                                  </LoadingButton>
                                </DialogActions>
                              </Dialog>
                            </TableCell>
                            <TableCell align="center">
                              <LoadingButton variant="contained" color="info" align="center" onClick={() => detailHandleClickOpen(info.projectName, info.line, info.date)}>
                                {info.trend}
                              </LoadingButton>
                              <Dialog
                                open={detailOpen}
                                onClose={detailHandleClickClose}
                                aria-labelledby="alert-dialog-accuracy"
                                aria-describedby="alert-dialog-accuracy"
                                sx={{
                                  "& .MuiDialog-container": {
                                    "& .MuiPaper-root": {
                                      width: "100%",
                                      minWidth: "1500px", // Set your width here
                                      minHeight: "800px",
                                    },
                                  },
                                }}
                              >
                                <DialogTitle id="alert-dialog-title-accuracy" sx={{ backgroundColor: "#696969" }}>設備預測明細</DialogTitle>
                                <DialogContent sx={{ marginTop: '1px', marginBottom: '1px' }} >
                                  <TableContainer style={tableContainerStyle.tableContainer} sx={{ mt: 3 }}>
                                    <Table>
                                      <TableHead>
                                        <TableRow>
                                          <TableCell align="center" sx={{ border: "1px solid black" }}>
                                            <Typography fontSize={20}>線號</Typography>
                                          </TableCell>
                                          <TableCell align="center" sx={{ border: "1px solid black" }} colSpan={2}>
                                            <Typography fontSize={20}>{currentLineInfo}</Typography>
                                          </TableCell>
                                          <TableCell align="center" sx={{ border: "1px solid black" }}>
                                            <Typography fontSize={20}>總計</Typography>
                                          </TableCell>
                                        </TableRow>
                                        <TableRow>
                                          <TableCell align="center" sx={{ border: "1px solid black" }}>
                                            <Typography fontSize={20}>設備名稱</Typography>
                                          </TableCell>
                                          {Object.values(detailData).map((detailInfo) => (
                                            <TableCell align="center" sx={{ border: "1px solid black" }}>
                                              <Typography fontSize={20}>{detailInfo.cname}</Typography>
                                            </TableCell>
                                          ))}
                                          <TableCell align="center" sx={{ border: "1px solid black" }}>
                                            <Typography fontSize={20}></Typography>
                                          </TableCell>
                                        </TableRow>
                                        <TableRow>
                                          <TableCell align="center" sx={{ border: "1px solid black" }}>
                                            <Typography fontSize={20}>預測準確率</Typography>
                                          </TableCell>
                                          {Object.values(detailData).map((detailInfo) => (
                                            <TableCell align="center" sx={{ border: "1px solid black" }}>
                                              <Typography fontSize={20}>{(detailInfo.device_accuracy * 100).toFixed(2)}%</Typography>
                                            </TableCell>
                                          ))}
                                          <TableCell align="center" sx={{ border: "1px solid black" }}>
                                            <Typography fontSize={20}>{(currentAccuracyInfo * 100).toFixed(2)}%</Typography>
                                          </TableCell>
                                        </TableRow>
                                      </TableHead>
                                    </Table>
                                  </TableContainer>
                                  <Grid container spacing={1} sx={{ mt: 2 }}>
                                    {Object.values(detailData).sort(getComparator(order)).map((device) => (
                                      <Grid item xs={6} key={device.cname}>
                                        <TableContainer style={tableContainerDialogStyle.tableContainer}>
                                          <Table>
                                            <TableHead style={{ backgroundColor: '#696969' }}>
                                              <TableRow>
                                                <TableCell align="center" sx={{ height: 'auto', border: "1px solid black" }} colSpan={4}>
                                                  <Typography fontSize={20}>{device.cname} 日預測(10/26)</Typography>
                                                </TableCell>
                                              </TableRow>
                                              <TableRow>
                                                <TableCell align="center" sx={{ height: 'auto', border: "1px solid black" }}>
                                                  <Typography fontSize={20}>異常事件</Typography>
                                                </TableCell>
                                                <TableCell align="center" sx={{ height: 'auto', border: "1px solid black" }}>
                                                  <TableSortLabel
                                                    active={dateOrderBy === 'true'}
                                                    direction={dateOrderBy === 'true' ? orderDate : 'asc'}
                                                    onClick={() => handleSortRequestDate('true')}
                                                  >
                                                    <Typography fontSize={20}>實際</Typography>
                                                  </TableSortLabel>
                                                </TableCell>
                                                <TableCell align="center" sx={{ height: 'auto', border: "1px solid black" }}>
                                                  <TableSortLabel
                                                    active={dateOrderBy === 'predict'}
                                                    direction={dateOrderBy === 'predict' ? orderDate : 'asc'}
                                                    onClick={() => handleSortRequestDate('predict')}
                                                  >
                                                    <Typography fontSize={20}>預測</Typography>
                                                  </TableSortLabel>
                                                </TableCell>
                                                <TableCell align="center" sx={{ height: 'auto', border: "1px solid black" }}>
                                                  <TableSortLabel
                                                    active={dateOrderBy === 'accuracy'}
                                                    direction={dateOrderBy === 'accuracy' ? orderDate : 'asc'}
                                                    onClick={() => handleSortRequestDate('accuracy')}
                                                  >
                                                    <Typography fontSize={20}>準確率</Typography>
                                                  </TableSortLabel>
                                                </TableCell>
                                              </TableRow>
                                            </TableHead>
                                            <TableBody>
                                              {device.events.sort(getComparator(order)).map((columns) => (
                                                <TableRow key={columns.name}>
                                                  <TableCell align="center" sx={{ height: 'auto', border: "1px solid black" }}>
                                                    <Typography fontSize={20}>{columns.name}</Typography>
                                                  </TableCell>
                                                  <TableCell align="center" sx={{ bgcolor: getColor(columns.true), height: 'auto', border: "1px solid black" }}>
                                                    <Typography fontSize={20}>{columns.true == 0 ? '穩定' : '異常'}</Typography>
                                                  </TableCell>
                                                  <TableCell align="center" sx={{ bgcolor: getColor(columns.predict), height: 'auto', border: "1px solid black" }}>
                                                    <Typography fontSize={20}>{columns.predict == 0 ? '穩定' : '異常'}</Typography>
                                                  </TableCell>
                                                  <TableCell align="center" sx={{ height: 'auto', border: "1px solid black" }}>
                                                    <Typography fontSize={20}>{columns.accuracy === 1 ? '100%' : '0%'}</Typography>
                                                  </TableCell>
                                                </TableRow>
                                              ))}
                                            </TableBody>
                                          </Table>
                                        </TableContainer>
                                        <TableContainer style={tableContainerStyle.tableContainer}>
                                          <Table>
                                            <TableHead style={{ backgroundColor: '#696969' }}>
                                              <TableRow>
                                                <TableCell align="center" sx={{ bgcolor: '#bfbfbf', height: 'auto', border: "1px solid black" }} colSpan={3}>
                                                  <Typography fontSize={20}>準確率總計</Typography>
                                                </TableCell>
                                                <TableCell align="center" sx={{ bgcolor: '#bfbfbf', height: 'auto', border: "1px solid black" }} colSpan={2}>
                                                  <Typography fontSize={20}>{(device.device_accuracy * 100).toFixed(2)}%</Typography>
                                                </TableCell>
                                              </TableRow>
                                            </TableHead>
                                          </Table>
                                        </TableContainer>
                                      </Grid>
                                    ))}
                                  </Grid>
                                </DialogContent>
                                <DialogActions>
                                  <LoadingButton onClick={detailHandleClickClose} autoFocus variant="contained">
                                    关闭
                                  </LoadingButton>
                                </DialogActions>
                              </Dialog>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <Box sx={{ bgcolor: '#696969' }}>
            <CardHeader title="週預測" color="#696969" />
          </Box>
          <CardContent>
            <Typography variant="h4" fontWeight="medium" mt={3}>
              預測與實際結果比對查詢
            </Typography>
            <Grid container spacing={1}>
              <Grid item xs={2}>
                <Box>
                  <Box component="form" role="form">
                    <Box display="flex" alignItems="center" pt={3} >
                      <Typography variant="h6" fontWeight="medium" mr={2}>
                        專案:
                      </Typography>
                      <Box mr={2}>
                        <FormControl>
                          <InputLabel id="demo-simple-select-label">專案</InputLabel>
                          <Select
                            labelId="permission-select-label"
                            id="permission-select"
                            value={projectName}
                            label="專案"
                            onChange={handleChangeProject}
                            style={{ minWidth: "150px", height: "45px" }}
                          >
                            {projectNameList.map((projectItem) => (
                              <MenuItem value={projectItem}>
                                {projectItem}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={2}>
                <Box>
                  <Box component="form" role="form">
                    <Box display="flex" alignItems="center" pt={3} >
                      <Typography variant="h6" fontWeight="medium" mr={2}>
                        線號:
                      </Typography>
                      <Box>
                        <FormControl>
                          <InputLabel id="demo-simple-select-label">專案</InputLabel>
                          <Select
                            labelId="permission-select-label"
                            id="permission-select"
                            value={line}
                            label="線號"
                            onChange={handleChangeLine}
                            style={{ minWidth: "150px", height: "45px" }}
                          >
                            {lineList.map((lineItem) => (
                              <MenuItem value={lineItem}>
                                {lineItem}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={3}>
                <Box component="form" role="form">
                  <Box display="flex" alignItems="center" pt={3} >
                    <Typography variant="h6" fontWeight="medium" mr={2}>
                      開始:
                    </Typography>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="選擇日期"
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
              <Grid item xs={3}>
                <Box component="form" role="form">
                  <Box display="flex" alignItems="center" pt={3} >
                    <Typography variant="h6" fontWeight="medium" mr={2}>
                      結束:
                    </Typography>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="選擇日期"
                        value={endDate}
                        onChange={(newValue) => {
                          setEndDate(newValue);
                        }}
                        renderInput={(params) => <TextField size="medium" {...params} />}
                      />
                    </LocalizationProvider>
                  </Box>
                </Box>
              </Grid>
            </Grid>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Box display="flex" alignItems="center" justifyContent="center" pt={3} >
                  <LoadingButton variant="contained" color="info" align="center" onClick={handleChangeSearch} style={{ width: '150px' }}>
                    查詢
                  </LoadingButton>
                </Box>
              </Grid>
            </Grid>
            <Divider sx={{ borderBottomWidth: 3, mt: 4 }} />
            <Grid container spacing={1} sx={{ mt: 4 }}>
              <Grid xs={12}>
                <TableContainer component={Paper} style={tableContainerStyle.tableContainer}>
                  <Table>
                    <TableHead style={{ backgroundColor: '#696969' }}>
                      <TableRow>
                        <TableCell align="center" sx={{ borderBottom: 0 }}>
                          <TableSortLabel
                            active={orderBy === 'label'}
                            direction={orderBy === 'label' ? order : 'asc'}
                            onClick={() => handleSortRequest('label')}
                          >
                            <Typography fontSize={20}>專案</Typography>
                          </TableSortLabel>
                        </TableCell>
                        <TableCell align="center" sx={{ borderBottom: 0 }}>
                          <TableSortLabel
                            active={orderBy === 'line'}
                            direction={orderBy === 'line' ? order : 'asc'}
                            onClick={() => handleSortRequest('line')}
                          >
                            <Typography fontSize={20}>線別</Typography>
                          </TableSortLabel>
                        </TableCell>
                        <TableCell align="center" sx={{ borderBottom: 0 }}>
                          <TableSortLabel
                            active={orderBy === 'date'}
                            direction={orderBy === 'date' ? order : 'asc'}
                            onClick={() => handleSortRequest('date')}
                          >
                            <Typography fontSize={20}>時間</Typography>
                          </TableSortLabel>
                        </TableCell>
                        <TableCell align="center" sx={{ borderBottom: 0 }}>
                          <TableSortLabel
                            active={orderBy === 'accuracyDate'}
                            direction={orderBy === 'accuracyDate' ? order : 'asc'}
                            onClick={() => handleSortRequest('accuracyDate')}
                          >
                            <Typography fontSize={20}>預測準確率</Typography>
                          </TableSortLabel>
                        </TableCell>
                        <TableCell align="center" sx={{ borderBottom: 0 }}>
                          <TableSortLabel>
                            <Typography fontSize={20}>預測趨勢</Typography>
                          </TableSortLabel>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {searchDateData.sort(getComparator(order)).map((info) => {
                        return (
                          <TableRow key={info.name}>
                            <TableCell align="center">
                              <Typography fontSize={20}>{info.projectName}</Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Typography fontSize={20}>{info.line}</Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Typography fontSize={20}>{info.date}</Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Typography fontSize={20}>
                                <LoadingButton variant="contained" color="info" align="center" onClick={() => accuracyHandleClickOpen(info.projectName, info.date, info.accuracyDate)}>
                                  {(info.accuracyDate * 100).toFixed(2)}%
                                </LoadingButton>
                              </Typography>
                              <Dialog
                                open={accuracyOpen}
                                onClose={accuracyHandleClickClose}
                                aria-labelledby="alert-dialog-accuracy"
                                aria-describedby="alert-dialog-accuracy"
                                sx={{
                                  "& .MuiDialog-container": {
                                    "& .MuiPaper-root": {
                                      width: "100%",
                                      minWidth: "1100px",  // Set your width here
                                    },
                                  },
                                }}
                              >
                                <DialogTitle id="alert-dialog-title-accuracy" sx={{ backgroundColor: "#696969" }}>{dialogProjectName}</DialogTitle>
                                <DialogContent>
                                  <div style={{ width: '1000px', height: '550px' }}>
                                    {LineChartExample()}
                                  </div>
                                </DialogContent>
                                <DialogActions>
                                  <LoadingButton onClick={accuracyHandleClickClose} autoFocus variant="contained">
                                    关闭
                                  </LoadingButton>
                                </DialogActions>
                              </Dialog>
                            </TableCell>
                            <TableCell align="center">
                              <LoadingButton variant="contained" color="info" align="center" onClick={() => detailHandleClickOpen(info.projectName, info.line, info.date)}>
                                {info.trend}
                              </LoadingButton>
                              <Dialog
                                open={detailOpen}
                                onClose={detailHandleClickClose}
                                aria-labelledby="alert-dialog-accuracy"
                                aria-describedby="alert-dialog-accuracy"
                                sx={{
                                  "& .MuiDialog-container": {
                                    "& .MuiPaper-root": {
                                      width: "100%",
                                      minWidth: "1500px", // Set your width here
                                      minHeight: "800px",
                                    },
                                  },
                                }}
                              >
                                <DialogTitle id="alert-dialog-title-accuracy" sx={{ backgroundColor: "#696969" }}>設備預測明細</DialogTitle>
                                <DialogContent sx={{ marginTop: '1px', marginBottom: '1px' }} >
                                  <TableContainer style={tableContainerStyle.tableContainer} sx={{ mt: 3 }}>
                                    <Table>
                                      <TableHead>
                                        <TableRow>
                                          <TableCell align="center" sx={{ border: "1px solid black" }}>
                                            <Typography fontSize={20}>線號</Typography>
                                          </TableCell>
                                          <TableCell align="center" sx={{ border: "1px solid black" }} colSpan={2}>
                                            <Typography fontSize={20}>{currentLineInfo}</Typography>
                                          </TableCell>
                                          <TableCell align="center" sx={{ border: "1px solid black" }}>
                                            <Typography fontSize={20}>總計</Typography>
                                          </TableCell>
                                        </TableRow>
                                        <TableRow>
                                          <TableCell align="center" sx={{ border: "1px solid black" }}>
                                            <Typography fontSize={20}>設備名稱</Typography>
                                          </TableCell>
                                          {Object.values(detailData).map((detailInfo) => (
                                            <TableCell align="center" sx={{ border: "1px solid black" }}>
                                              <Typography fontSize={20}>{detailInfo.cname}</Typography>
                                            </TableCell>
                                          ))}
                                          <TableCell align="center" sx={{ border: "1px solid black" }}>
                                            <Typography fontSize={20}></Typography>
                                          </TableCell>
                                        </TableRow>
                                        <TableRow>
                                          <TableCell align="center" sx={{ border: "1px solid black" }}>
                                            <Typography fontSize={20}>預測準確率</Typography>
                                          </TableCell>
                                          {Object.values(detailData).map((detailInfo) => (
                                            <TableCell align="center" sx={{ border: "1px solid black" }}>
                                              <Typography fontSize={20}>{(detailInfo.device_accuracy * 100).toFixed(2)}%</Typography>
                                            </TableCell>
                                          ))}
                                          <TableCell align="center" sx={{ border: "1px solid black" }}>
                                            <Typography fontSize={20}>{(currentAccuracyInfo * 100).toFixed(2)}%</Typography>
                                          </TableCell>
                                        </TableRow>
                                      </TableHead>
                                    </Table>
                                  </TableContainer>
                                  <Grid container spacing={1} sx={{ mt: 2 }}>
                                    {Object.values(detailData).sort(getComparator(order)).map((device) => (
                                      <Grid item xs={6} key={device.cname}>
                                        <TableContainer style={tableContainerDialogStyle.tableContainer}>
                                          <Table>
                                            <TableHead style={{ backgroundColor: '#696969' }}>
                                              <TableRow>
                                                <TableCell align="center" sx={{ height: 'auto', border: "1px solid black" }} colSpan={4}>
                                                  <Typography fontSize={20}>{device.cname} 週預測(10/26)</Typography>
                                                </TableCell>
                                              </TableRow>
                                              <TableRow>
                                                <TableCell align="center" sx={{ height: 'auto', border: "1px solid black" }}>
                                                  <Typography fontSize={20}>異常事件</Typography>
                                                </TableCell>
                                                <TableCell align="center" sx={{ height: 'auto', border: "1px solid black" }}>
                                                  <TableSortLabel
                                                    active={dateOrderBy === 'true'}
                                                    direction={dateOrderBy === 'true' ? orderDate : 'asc'}
                                                    onClick={() => handleSortRequestDate('true')}
                                                  >
                                                    <Typography fontSize={20}>實際</Typography>
                                                  </TableSortLabel>
                                                </TableCell>
                                                <TableCell align="center" sx={{ height: 'auto', border: "1px solid black" }}>
                                                  <TableSortLabel
                                                    active={dateOrderBy === 'predict'}
                                                    direction={dateOrderBy === 'predict' ? orderDate : 'asc'}
                                                    onClick={() => handleSortRequestDate('predict')}
                                                  >
                                                    <Typography fontSize={20}>預測</Typography>
                                                  </TableSortLabel>
                                                </TableCell>
                                                <TableCell align="center" sx={{ height: 'auto', border: "1px solid black" }}>
                                                  <TableSortLabel
                                                    active={dateOrderBy === 'accuracy'}
                                                    direction={dateOrderBy === 'accuracy' ? orderDate : 'asc'}
                                                    onClick={() => handleSortRequestDate('accuracy')}
                                                  >
                                                    <Typography fontSize={20}>準確率</Typography>
                                                  </TableSortLabel>
                                                </TableCell>
                                              </TableRow>
                                            </TableHead>
                                            <TableBody>
                                              {device.events.sort(getComparator(order)).map((columns) => (
                                                <TableRow key={columns.name}>
                                                  <TableCell align="center" sx={{ height: 'auto', border: "1px solid black" }}>
                                                    <Typography fontSize={20}>{columns.name}</Typography>
                                                  </TableCell>
                                                  <TableCell align="center" sx={{ bgcolor: getColor(columns.true), height: 'auto', border: "1px solid black" }}>
                                                    <Typography fontSize={20}>{columns.true == 0 ? '穩定' : '異常'}</Typography>
                                                  </TableCell>
                                                  <TableCell align="center" sx={{ bgcolor: getColor(columns.predict), height: 'auto', border: "1px solid black" }}>
                                                    <Typography fontSize={20}>{columns.predict == 0 ? '穩定' : '異常'}</Typography>
                                                  </TableCell>
                                                  <TableCell align="center" sx={{ height: 'auto', border: "1px solid black" }}>
                                                    <Typography fontSize={20}>{columns.accuracy === 1 ? '100%' : '0%'}</Typography>
                                                  </TableCell>
                                                </TableRow>
                                              ))}
                                            </TableBody>
                                          </Table>
                                        </TableContainer>
                                        <TableContainer style={tableContainerStyle.tableContainer}>
                                          <Table>
                                            <TableHead style={{ backgroundColor: '#696969' }}>
                                              <TableRow>
                                                <TableCell align="center" sx={{ bgcolor: '#bfbfbf', height: 'auto', border: "1px solid black" }} colSpan={3}>
                                                  <Typography fontSize={20}>準確率總計</Typography>
                                                </TableCell>
                                                <TableCell align="center" sx={{ bgcolor: '#bfbfbf', height: 'auto', border: "1px solid black" }} colSpan={2}>
                                                  <Typography fontSize={20}>{(device.device_accuracy * 100).toFixed(2)}%</Typography>
                                                </TableCell>
                                              </TableRow>
                                            </TableHead>
                                          </Table>
                                        </TableContainer>
                                      </Grid>
                                    ))}
                                  </Grid>
                                </DialogContent>
                                <DialogActions>
                                  <LoadingButton onClick={detailHandleClickClose} autoFocus variant="contained">
                                    关闭
                                  </LoadingButton>
                                </DialogActions>
                              </Dialog>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}
    </ThemeProvider >
  );
}