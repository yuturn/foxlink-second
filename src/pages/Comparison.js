import React, { useState, useEffect } from "react";
import { apiGetProjectDevices } from '../api'
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
// import { Line } from 'react-chartjs-2';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
// } from 'chart.js';
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend
// );

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

const data = [
  { id: 1, projectName: 'D7X E75', line: '1', date: '2023/10/26', accuracy: '75.66%', trend: '查看' },
  { id: 2, projectName: 'D2Y E75', line: '2', date: '2023/10/28', accuracy: '50.00%', trend: '查看' },
  { id: 3, projectName: 'X61 E75', line: '3', date: '2023/10/31', accuracy: '77.62%', trend: '查看' },
  { id: 4, projectName: 'D7X E75', line: '4', date: '2023/11/20', accuracy: '63.14%', trend: '查看' },
  { id: 5, projectName: 'D2Y E75', line: '2', date: '2023/12/26', accuracy: '88.95%', trend: '查看' },
  { id: 6, projectName: 'X61 E75', line: '3', date: '2023/12/29', accuracy: '47.54%', trend: '查看' },
];

const linechart = {
  xData: [
    '10 / 21', '10 / 22', '10 / 23', '10 / 24', '10 / 25', '10/26', '10/27'
  ],
  yData: [
    59.25, 84.79, 34.08, 42.85, 59.63, 100.00, 0
  ]
}

const detailData = [
  { id: 1, device: 'device1', deviceName: 'deviceName1', accuracy: '75.66%' },
  { id: 2, device: 'device2', deviceName: 'deviceName2', accuracy: '50.00%' },
  { id: 3, device: 'device3', deviceName: 'deviceName3', accuracy: '77.62%' },
  { id: 4, device: 'device4', deviceName: 'deviceName4', accuracy: '63.14%' },
  { id: 5, device: 'device5', deviceName: 'deviceName5', accuracy: '88.95%' },
  { id: 6, device: 'device6', deviceName: 'deviceName6', accuracy: '47.54%' },
];

const getAve = () => {
  let count = 0
  let total = 0
  detailData.map((num) => (
    count++,
    total = total + num.accuracy
  )
  )
  return total / count
}

const columns = {
  "D7X E75": {
    "device1": [
      {
        name: "料盤取材上下氣缸故障",
        true: 2,
        predict: 1,
      },
      {
        name: "tray盤站故障",
        true: 2,
        predict: 2,
      },
      {
        name: "UV檢測站故障",
        true: 1,
        predict: 1,
      },
    ]
  }
}

const columns2 = {
  "D7X E75": {
    "device1": [
      {
        name: "壓入檢測站故障",
        true: 2,
        predict: 1,
      },
      {
        name: "Glue異常",
        true: 2,
        predict: 1,
      },
      {
        name: "出料撥料氣缸氣缸故障",
        true: 1,
        predict: 1,
      },
      {
        name: "撥料上下2氣缸故障",
        true: 2,
        predict: 2,
      },
      {
        name: "NG排料氣缸故障",
        true: 1,
        predict: 1,
      },
    ]
  }
}

export default function Project({ token, ...rest }) {
  const [projectID, setProjectID] = useState("");
  const [line, setLine] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [accuracyOpen, setAccuracyOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [dialogProjectName, setDialogProjectName] = useState('D7X E75');
  const [xAxisData, setXAxisData] = useState([]);

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
    if (lightColor === 1) {
      return "#C5291C";
    } else if (lightColor === 2) {
      return "#4CA85A";
    } else {
      return null; // 或者返回一个默认的图标
    }
  }

  const handleChangeProject = (event) => {
    setProjectID(event.target.value);
  };
  const handleChangeLine = (event) => {
    setLine(event.target.value);
  };
  const accuracyHandleClickOpen = (projectName, date) => {
    setAccuracyOpen(true);
    setDialogProjectName(projectName);
  };
  const accuracyHandleClickClose = () => {
    setAccuracyOpen(false);
  };

  const detailHandleClickOpen = (projectName) => {
    setDetailOpen(true);
    setDialogProjectName(projectName);
  };
  const detailHandleClickClose = () => {
    setDetailOpen(false);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Card>
        <Box sx={{ bgcolor: '#696969' }}>
          <CardHeader title="預測與結果比對查詢" color="#696969" />
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
                          value={projectID}
                          label="專案"
                          onChange={handleChangeProject}
                          style={{ minWidth: "150px", height: "45px" }}
                        >
                          <MenuItem value={1}>D7X E75</MenuItem>
                          <MenuItem value={2}>D2Y E75</MenuItem>
                          <MenuItem value={3}>X61 E75</MenuItem>
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
                          <MenuItem value={1}>1</MenuItem>
                          <MenuItem value={2}>2</MenuItem>
                          <MenuItem value={3}>3</MenuItem>
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
            <Grid item xs={1}>
              <Box display="flex" alignItems="center" pt={3} >
                <LoadingButton variant="contained" color="info" align="center">
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
                          active={orderBy === 'accuracy'}
                          direction={orderBy === 'accuracy' ? order : 'asc'}
                          onClick={() => handleSortRequest('accuracy')}
                        >
                          <Typography fontSize={20}>預測準確率</Typography>
                        </TableSortLabel>
                      </TableCell>
                      <TableCell align="center" sx={{ borderBottom: 0 }}>
                        <TableSortLabel
                          active={orderBy === 'trend'}
                          direction={orderBy === 'trend' ? order : 'asc'}
                          onClick={() => handleSortRequest('trend')}
                        >
                          <Typography fontSize={20}>預測趨勢</Typography>
                        </TableSortLabel>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.sort(getComparator(order)).map((info) => {
                      const options = {
                        responsive: true,
                        plugins: {
                          legend: {
                            position: 'top',
                          },
                          title: {
                            display: true,
                            text: dialogProjectName + '的趨勢圖',
                          },
                        },
                      };
                      const lineChartData = {
                        labels: linechart.xData,
                        datasets: [
                          {
                            label: dialogProjectName,
                            data: linechart.yData,
                            borderColor: 'rgb(53, 162, 235)',
                            backgroundColor: 'rgba(53, 162, 235, 0.5)',
                          }
                        ]
                      };
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
                              <LoadingButton variant="contained" color="info" align="center" onClick={() => accuracyHandleClickOpen(info.projectName, info.date)}>
                                {info.accuracy}
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
                                  {/* <Line options={options} data={lineChartData} /> */}
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
                            <LoadingButton variant="contained" color="info" align="center" onClick={() => detailHandleClickOpen(info.projectName)}>
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
                                          <Typography fontSize={20}>設備編號</Typography>
                                        </TableCell>
                                        {detailData.map((detailInfo) => (
                                          <TableCell align="center" sx={{ border: "1px solid black" }}>
                                            <Typography fontSize={20}>{detailInfo.device}</Typography>
                                          </TableCell>
                                        ))}
                                        <TableCell align="center" sx={{ border: "1px solid black" }}>
                                          <Typography fontSize={20}>總計</Typography>
                                        </TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell align="center" sx={{ border: "1px solid black" }}>
                                          <Typography fontSize={20}>設備名稱</Typography>
                                        </TableCell>
                                        {detailData.map((detailInfo) => (
                                          <TableCell align="center" sx={{ border: "1px solid black" }}>
                                            <Typography fontSize={20}>{detailInfo.deviceName}</Typography>
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
                                        {detailData.map((detailInfo) => (
                                          <TableCell align="center" sx={{ border: "1px solid black" }}>
                                            <Typography fontSize={20}>{detailInfo.accuracy}</Typography>
                                          </TableCell>
                                        ))}
                                        <TableCell align="center" sx={{ border: "1px solid black" }}>
                                          <Typography fontSize={20}>{getAve()}</Typography>
                                        </TableCell>
                                      </TableRow>
                                    </TableHead>
                                  </Table>
                                </TableContainer>
                                <Grid container spacing={1} sx={{ mt: 2 }}>
                                  <Grid item xs={6}>
                                    <TableContainer style={tableContainerStyle.tableContainer}>
                                      <Table>
                                        <TableHead style={{ backgroundColor: '#696969' }}>
                                          <TableRow>
                                            <TableCell align="center" sx={{ height: 'auto', border: "1px solid black" }} colSpan={3}>
                                              <Typography fontSize={20}>週預測(10/30-11/03)</Typography>
                                            </TableCell>
                                          </TableRow>
                                          <TableRow>
                                            <TableCell align="center" sx={{ height: 'auto', border: "1px solid black" }} colSpan={1}>
                                              <Typography fontSize={20}>異常事件</Typography>
                                            </TableCell>
                                            <TableCell align="center" sx={{ height: 'auto', border: "1px solid black" }} colSpan={1}>
                                              <TableSortLabel
                                                active={weekOrderBy === 'true'}
                                                direction={weekOrderBy === 'true' ? orderWeek : 'asc'}
                                                onClick={() => handleSortRequestWeek('true')}
                                              >
                                                <Typography fontSize={20}>實際</Typography>
                                              </TableSortLabel>
                                            </TableCell>
                                            <TableCell align="center" sx={{ height: 'auto', border: "1px solid black" }} colSpan={1}>
                                              <TableSortLabel
                                                active={weekOrderBy === 'predict'}
                                                direction={weekOrderBy === 'predict' ? orderWeek : 'asc'}
                                                onClick={() => handleSortRequestWeek('predict')}
                                              >
                                                <Typography fontSize={20}>預測</Typography>
                                              </TableSortLabel>
                                            </TableCell>
                                          </TableRow>
                                        </TableHead>
                                        <TableBody>
                                          {columns["D7X E75"].device1.sort(getComparatorWeek(orderWeek)).map((columns) => (
                                            <TableRow key={columns.name}>
                                              <TableCell align="center" sx={{ height: 'auto', border: "1px solid black" }}>
                                                <Typography fontSize={20}>{columns.name}</Typography>
                                              </TableCell>
                                              <TableCell align="center" sx={{ bgcolor: getColor(columns.true), height: 'auto', border: "1px solid black" }}>
                                                <Typography fontSize={20}>{columns.true}</Typography>
                                              </TableCell>
                                              <TableCell align="center" sx={{ bgcolor: getColor(columns.predict), height: 'auto', border: "1px solid black" }}>
                                                <Typography fontSize={20}>{columns.predict}</Typography>
                                              </TableCell>
                                            </TableRow>
                                          ))}
                                        </TableBody>
                                      </Table>
                                    </TableContainer>
                                  </Grid>
                                  <Grid item xs={6}>
                                    <TableContainer style={tableContainerStyle.tableContainer}>
                                      <Table>
                                        <TableHead style={{ backgroundColor: '#696969' }}>
                                          <TableRow>
                                            <TableCell align="center" sx={{ height: 'auto', border: "1px solid black" }} colSpan={3}>
                                              <Typography fontSize={20}>日預測(10/26)</Typography>
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
                                          </TableRow>
                                        </TableHead>
                                        <TableBody>
                                          {columns2["D7X E75"].device1.sort(getComparatorDate(orderDate)).map((columns) => (
                                            <TableRow key={columns.name}>
                                              <TableCell align="center" sx={{ height: 'auto', border: "1px solid black" }}>
                                                <Typography fontSize={20}>{columns.name}</Typography>
                                              </TableCell>
                                              <TableCell align="center" sx={{ bgcolor: getColor(columns.true), height: 'auto', border: "1px solid black" }}>
                                                <Typography fontSize={20}>{columns.true}</Typography>
                                              </TableCell>
                                              <TableCell align="center" sx={{ bgcolor: getColor(columns.predict), height: 'auto', border: "1px solid black" }}>
                                                <Typography fontSize={20}>{columns.predict}</Typography>
                                              </TableCell>
                                            </TableRow>
                                          ))}
                                        </TableBody>
                                      </Table>
                                    </TableContainer>
                                  </Grid>
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
    </ThemeProvider >
  );
}