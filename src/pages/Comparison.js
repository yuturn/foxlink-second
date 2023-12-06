import React, { useState, useEffect } from "react";
import { apiGetCompareList, apiGetCompareSearch, apiGetCompareAnalysis } from '../api'
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
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import ShowChartIcon from '@mui/icons-material/ShowChart';
import StackedLineChartIcon from '@mui/icons-material/StackedLineChart';
import TimelineIcon from '@mui/icons-material/Timeline';

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

export default function Project({ token, ...rest }) {
  const [projectName, setProjectName] = useState();
  const [line, setLine] = useState();
  const [type, setType] = useState();
  const today = new Date();
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
  const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
  const [startDate, setStartDate] = useState(startOfDay);
  const [endDate, setEndDate] = useState(endOfDay);
  const [detailOpen, setDetailOpen] = useState(false);
  const [projectNameList, setProjectNameList] = useState([]);
  const [lineList, setLineList] = useState([]);
  const [compareListData, setCompareListData] = useState([]);
  const [searchDateData, setSearchDateData] = useState([]);
  const [currentAccuracyInfo, setCurrentAccuracyInfo] = useState(null);
  const [detailData, setDetailData] = useState({});
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);


  //折線圖function
  const LineChartExample = () => {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          width={1000}
          height={500}
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="準確率" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  // 使用另一个useEffect监听statisticDevices的变化
  useEffect(() => {
    getProjectName(token)
  }, []);

  //這邊取得下拉選單的專案名稱及線號
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
  //按查看進去的Detail table
  const [orderDetail, setDetailOrder] = useState('asc');
  const [detailOrderBy, setDetailOrderBy] = useState('label');
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
  //點擊查看Detail的table sort
  const handleSortRequestDetail = (property) => {
    const isAsc = detailOrderBy === property && orderDetail === 'asc';
    setDetailOrder(isAsc ? 'desc' : 'asc');
    setDetailOrderBy(property);
  };
  const getComparatorDetail = (property) => {
    return (a, b) => {
      if (orderDetail === 'desc') {
        return a[detailOrderBy] > b[detailOrderBy] ? -1 : 1;
      } else {
        return a[detailOrderBy] > b[detailOrderBy] ? 1 : -1;
      }
    };
  };

  //確認是穩定還是異常給出對應顏色
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
  //信心水準顏色
  function getColorFaithful(faithful) {
    // 1 是有信心
    if (faithful === 1) {
      return "#ffffff";
      // 0 是沒信心
    } else if (faithful === 0) {
      return "#ff7f50";
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
  //這邊是當Type(週日預測)改變後做事情
  const handleChangeType = (event) => {
    setType(event.target.value);
  };
  //這邊是查詢專案線號的按鈕
  const handleClickProjectSearch = () => {
    setLoading(true)
    const data = {
      startDate: new Date(startDate).toISOString().split('T')[0] + ' ' + new Date(startDate).toTimeString().split(' ')[0].replace(/:/g, '%3A'),
      endDate: new Date(endDate).toISOString().split('T')[0] + ' ' + new Date(endDate).toTimeString().split(' ')[0].replace(/:/g, '%3A'),
      type: currentPage === 1 ? 'day' : 'week',
      project_name: projectName,
      line: line,
      token: token
    }
    console.log(data)
    apiGetCompareSearch(data)
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setSearchDateData(res.data)
          handleOpen("查詢成功")
          setLoading(false)
        } else {
          setSearchDateData([])
          handleErrorOpen("查詢失敗:沒有資料")
          setLoading(false)
        }
      }).catch((error) => {
        console.error("API 请求失败", error);
        setSearchDateData([]);
        handleErrorOpen("查詢失敗:API請求失敗");
        setLoading(false)
      });
  };
  //這邊是查詢折線圖的按鈕
  const handleClickChartSearch = () => {
    setLoading(true)
    const data = {
      startDate: new Date(startDate).toISOString().split('T')[0] + ' 00%3A00%3A00',
      endDate: new Date(endDate).toISOString().split('T')[0] + ' 00%3A00%3A00',
      type: type,
      project_name: projectName,
      line: line,
      token: token
    }
    console.log(data)
    apiGetCompareAnalysis(data)
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setChartData(res.data)
          handleOpen("查詢成功")
          setLoading(false)
        } else {
          setChartData([])
          handleErrorOpen("查詢失敗:沒有資料")
          setLoading(false)
        }
      }).catch((error) => {
        console.error("API 请求失败", error);
        setChartData([]);
        handleErrorOpen("查詢失敗:API請求失敗");
        setLoading(false)
      });
  };
  //查看按鈕(detail table)
  const detailHandleClickOpen = (projectName, line, date) => {
    setDetailOpen(true);
    const data = {
      project_name: projectName,
      line: line,
      startDate: new Date(date).toISOString().split('T')[0] + '%2000%3A00%3A00',
      endDate: new Date(date).toISOString().split('T')[0] + '%2000%3A00%3A00',
      type: currentPage === 1 ? 'day' : 'week',
      token: token
    };
    console.log(data)
    apiGetCompareSearch(data)
      .then((res) => {
        console.log(res.data);
        if (data.type == 'day') {
          setCurrentAccuracyInfo(res.data[0]['accuracyDate']);
        } else {
          setCurrentAccuracyInfo(res.data[0]['accuracyWeek']);
        }
        console.log(res.data[0]['devices']);
        setDetailData(res.data[0]['devices'])
      });
  };
  const detailHandleClickClose = () => {
    setDetailOpen(false);
  };

  //這邊的變數決定哪一個頁面
  const [currentPage, setCurrentPage] = useState(1);
  // 舊版控制頁面按鈕
  // const handleShowFirstCard = () => {
  //   setCurrentPage(1);
  //   setSearchDateData([]);
  // };
  // const handleShowSecondCard = () => {
  //   setCurrentPage(2);
  //   setSearchDateData([]);
  // };
  // const handleShowThirdCard = () => {
  //   setCurrentPage(3);
  //   setSearchDateData([]);
  //   // 可以根据需要添加其他逻辑
  // };
  //這邊使用ToggleButton控制顯示頁面
  const handleChange = (event, newValue) => {
    if (newValue != null) {
      setCurrentPage(newValue);
    }
  };

  useEffect(() => {
    setSearchDateData([]);
    // 这里可以根据新的 currentPage 做一些其他的操作
  }, [currentPage]);

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

  return (
    <ThemeProvider theme={darkTheme}>
      <Box display="flex">
        <ToggleButtonGroup
          color="info"
          value={currentPage}
          exclusive
          onChange={handleChange}
          aria-label="Platform"
        >
          <ToggleButton value={1}><ShowChartIcon sx={{ mr: 2 }} />日預測</ToggleButton>
          <ToggleButton value={2}><StackedLineChartIcon sx={{ mr: 2 }} />週預測</ToggleButton>
          <ToggleButton value={3}><TimelineIcon sx={{ mr: 2 }} />準確率圖表</ToggleButton>
        </ToggleButtonGroup>
        {/* <Box>
          <LoadingButton variant="contained" color="info" onClick={handleShowFirstCard} sx={{ mr: 1 }}>
            日預測
          </LoadingButton>
        </Box>
        <Box>
          <LoadingButton variant="contained" color="info" onClick={handleShowSecondCard} sx={{ mr: 1 }}>
            週預測
          </LoadingButton>
        </Box>
        <Box>
          <LoadingButton variant="contained" color="info" onClick={handleShowThirdCard}>
            準確率圖表
          </LoadingButton>
        </Box> */}
      </Box>
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
      {currentPage === 1 ? (
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
                            <MenuItem value="">清空欄位</MenuItem>
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
                            <MenuItem value="">清空欄位</MenuItem>
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
                  <LoadingButton loading={loading} variant="contained" color="info" align="center" onClick={handleClickProjectSearch} style={{ width: '150px' }}>
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
                    <TableHead style={{ backgroundColor: '#bfbfbf' }}>
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
                              <LoadingButton variant="contained" color="info" align="center" onClick={() => detailHandleClickOpen(info.projectName, info.line, info.date)}>
                                {(info.accuracyDate * 100).toFixed(2)}%
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
                                <DialogTitle id="alert-dialog-title-accuracy" sx={{ backgroundColor: "#bfbfbf" }}>設備預測明細</DialogTitle>
                                <DialogContent sx={{ marginTop: '1px', marginBottom: '1px' }} >
                                  <TableContainer style={tableContainerStyle.tableContainer} sx={{ mt: 3 }}>
                                    <Table>
                                      <TableHead>
                                        <TableRow>
                                          <TableCell align="center" sx={{ border: "1px solid black" }}>
                                            <Typography fontSize={20}>設備編號</Typography>
                                          </TableCell>
                                          {Object.keys(detailData).map((detailTitle) => (
                                            <TableCell align="center" sx={{ border: "1px solid black" }}>
                                              <Typography fontSize={20}>{detailTitle}</Typography>
                                            </TableCell>
                                          ))}
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
                                            <Typography fontSize={20}>總計</Typography>
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
                                    {Object.entries(detailData).map(([deviceKey, device]) => (
                                      <Grid item xs={6} key={deviceKey}>
                                        <TableContainer style={tableContainerDialogStyle.tableContainer}>
                                          <Table>
                                            <TableHead style={{ backgroundColor: '#696969' }}>
                                              <TableRow>
                                                <TableCell align="center" sx={{ height: 'auto', border: "1px solid black", backgroundColor: "#bfbfbf" }} colSpan={4}>
                                                  <Typography fontSize={20}>{`${deviceKey} ${device.cname}`}</Typography>
                                                </TableCell>
                                              </TableRow>
                                              <TableRow>
                                                <TableCell align="center" sx={{ height: 'auto', border: "1px solid black", backgroundColor: "#e0ffff" }}>
                                                  <TableSortLabel
                                                    active={detailOrderBy === 'category'}
                                                    direction={detailOrderBy === 'category' ? orderDetail : 'asc'}
                                                    onClick={() => handleSortRequestDetail('category')}
                                                  >
                                                    <Typography fontSize={20}>Category</Typography>
                                                  </TableSortLabel>
                                                </TableCell>
                                                <TableCell align="center" sx={{ height: 'auto', border: "1px solid black", backgroundColor: "#e0ffff" }}>
                                                  <Typography fontSize={20}>Message</Typography>
                                                </TableCell>
                                                <TableCell align="center" sx={{ height: 'auto', border: "1px solid black", backgroundColor: "#e0ffff" }}>
                                                  <Typography fontSize={20}>實際</Typography>
                                                </TableCell>
                                                <TableCell align="center" sx={{ height: 'auto', border: "1px solid black", backgroundColor: "#e0ffff" }}>
                                                  <Typography fontSize={20}>預測</Typography>
                                                </TableCell>
                                              </TableRow>
                                            </TableHead>
                                            <TableBody>
                                              {device.events.sort(getComparatorDetail(order)).map((columns) => (
                                                <TableRow key={columns.name}>
                                                  <TableCell align="center" sx={{ bgcolor: getColorFaithful(columns.faithful), height: 'auto', border: "1px solid black" }}>
                                                    <Typography fontSize={20}>{columns.category}</Typography>
                                                  </TableCell>
                                                  <TableCell align="center" sx={{ bgcolor: getColorFaithful(columns.faithful), height: 'auto', border: "1px solid black" }}>
                                                    <Typography fontSize={20}>{columns.name}</Typography>
                                                  </TableCell>
                                                  <TableCell align="center" sx={{ bgcolor: getColorFaithful(columns.faithful), height: 'auto', border: "1px solid black" }}>
                                                    <Typography fontSize={20}>{columns.true}</Typography>
                                                  </TableCell>
                                                  <TableCell align="center" sx={{ bgcolor: getColor(columns.predict), height: 'auto', border: "1px solid black" }}>
                                                    <Typography fontSize={20}>{columns.predict == 0 ? '穩定' : '異常'}</Typography>
                                                  </TableCell>
                                                </TableRow>
                                              ))}
                                            </TableBody>
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
      ) : currentPage === 2 ? (
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
                            <MenuItem value="">清空欄位</MenuItem>
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
                            <MenuItem value="">清空欄位</MenuItem>
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
                  <LoadingButton loading={loading} variant="contained" color="info" align="center" onClick={handleClickProjectSearch} style={{ width: '150px' }}>
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
                    <TableHead style={{ backgroundColor: '#bfbfbf' }}>
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
                              <LoadingButton variant="contained" color="info" align="center" onClick={() => detailHandleClickOpen(info.projectName, info.line, info.date)}>
                                {(info.accuracyWeek * 100).toFixed(2)}%
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
                                            <Typography fontSize={20}>設備編號</Typography>
                                          </TableCell>
                                          {Object.keys(detailData).map((detailTitle) => (
                                            <TableCell align="center" sx={{ border: "1px solid black" }}>
                                              <Typography fontSize={20}>{detailTitle}</Typography>
                                            </TableCell>
                                          ))}
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
                                            <Typography fontSize={20}>總計</Typography>
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
                                    {Object.entries(detailData).sort(getComparator(order)).map(([deviceKey, device]) => (
                                      <Grid item xs={6} key={deviceKey}>
                                        <TableContainer style={tableContainerDialogStyle.tableContainer}>
                                          <Table>
                                            <TableHead style={{ backgroundColor: '#696969' }}>
                                              <TableRow>
                                                <TableCell align="center" sx={{ height: 'auto', border: "1px solid black", backgroundColor: "#e0ffff" }} colSpan={4}>
                                                  <Typography fontSize={20}>{`${deviceKey} ${device.cname}`}</Typography>
                                                </TableCell>
                                              </TableRow>
                                              <TableRow>
                                                <TableCell align="center" sx={{ height: 'auto', border: "1px solid black", backgroundColor: "#e0ffff" }}>
                                                  <TableSortLabel
                                                    active={detailOrderBy === 'category'}
                                                    direction={detailOrderBy === 'category' ? orderDetail : 'asc'}
                                                    onClick={() => handleSortRequestDetail('category')}
                                                  >
                                                    <Typography fontSize={20}>Category</Typography>
                                                  </TableSortLabel>
                                                </TableCell>
                                                <TableCell align="center" sx={{ height: 'auto', border: "1px solid black", backgroundColor: "#e0ffff" }}>
                                                  <Typography fontSize={20}>Message</Typography>
                                                </TableCell>
                                                <TableCell align="center" sx={{ height: 'auto', border: "1px solid black", backgroundColor: "#e0ffff" }}>
                                                  <Typography fontSize={20}>實際</Typography>
                                                </TableCell>
                                                <TableCell align="center" sx={{ height: 'auto', border: "1px solid black", backgroundColor: "#e0ffff" }}>
                                                  <Typography fontSize={20}>預測</Typography>
                                                </TableCell>
                                              </TableRow>
                                            </TableHead>
                                            <TableBody>
                                              {device.events.sort(getComparatorDetail(order)).map((columns) => (
                                                <TableRow key={columns.name}>
                                                  <TableCell align="center" sx={{ bgcolor: getColorFaithful(columns.faithful), height: 'auto', border: "1px solid black" }}>
                                                    <Typography fontSize={20}>{columns.category}</Typography>
                                                  </TableCell>
                                                  <TableCell align="center" sx={{ bgcolor: getColorFaithful(columns.faithful), height: 'auto', border: "1px solid black" }}>
                                                    <Typography fontSize={20}>{columns.name}</Typography>
                                                  </TableCell>
                                                  <TableCell align="center" sx={{ bgcolor: getColorFaithful(columns.faithful), height: 'auto', border: "1px solid black" }}>
                                                    <Typography fontSize={20}>{columns.true}</Typography>
                                                  </TableCell>
                                                  <TableCell align="center" sx={{ bgcolor: getColor(columns.predict), height: 'auto', border: "1px solid black" }}>
                                                    <Typography fontSize={20}>{columns.predict == 0 ? '穩定' : '異常'}</Typography>
                                                  </TableCell>
                                                </TableRow>
                                              ))}
                                            </TableBody>
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
            <CardHeader title="準確率圖表" color="#696969" />
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
              <Grid item xs={2}>
                <Box>
                  <Box component="form" role="form">
                    <Box display="flex" alignItems="center" pt={3} >
                      <Typography variant="h6" fontWeight="medium" mr={2}>
                        類別:
                      </Typography>
                      <Box>
                        <FormControl>
                          <InputLabel id="demo-simple-select-label">專案</InputLabel>
                          <Select
                            labelId="permission-select-label"
                            id="permission-select"
                            value={type}
                            label="類別"
                            onChange={handleChangeType}
                            style={{ minWidth: "150px", height: "45px" }}
                          >
                            <MenuItem value='day'>
                              日預測
                            </MenuItem>
                            <MenuItem value='week'>
                              週預測
                            </MenuItem>
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
                          console.log('Selected Start Date:', newValue);
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
                          console.log('Selected Start Date:', newValue);
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
                  <LoadingButton loading={loading} variant="contained" color="info" align="center" onClick={handleClickChartSearch} style={{ width: '150px' }}>
                    查詢
                  </LoadingButton>
                </Box>
              </Grid>
            </Grid>
            <Divider sx={{ borderBottomWidth: 3, mt: 4 }} />
            <Box display="flex" alignItems="center" justifyContent="center" pt={3} >
              <div style={{ width: '1150px', height: '700px' }}>
                {LineChartExample()}
              </div>
            </Box>
          </CardContent>
        </Card>
      )}
    </ThemeProvider >
  );
}