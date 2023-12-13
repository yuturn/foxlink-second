import React, { useState, useEffect, useContext } from "react";
import { DataGrid } from '@mui/x-data-grid';
import { borders } from '@mui/system';
import { apiGetStatistics, apiGetStatisticsDetails, apiGetStatisticsDetailsFilter } from '../api'
import {
  Box,
  Card,
  Grid,
  FormControl,
  InputLabel,
  CardHeader,
  Typography,
  CardContent,
  Divider,
  palette,
  Select,
  MenuItem
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import LoadingButton from '@mui/lab/LoadingButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Paper from '@mui/material/Paper';
import { PieChart, pieArcLabelClasses } from '@mui/x-charts';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';

import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

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
      // Purple and green play nicely together.
      main: '#696969',
    },
  },
});

export default function Machinehealth({ token, setAlert, ...rest }) {
  const { globalVariable, updateGlobalVariable } = useContext(GlobalContext);
  const [isPaused, setIsPaused] = useState(false);
  const [projectNameList, setProjectNameList] = useState([]);
  const [projectName, setProjectName] = useState();
  const [deviceName, setDeviceName] = useState();
  const [deviceNameList, setDeviceNameList] = useState([]);

  const [orderWeek, setOrderWeek] = useState('asc');
  const [weekOrderBy, setWeekOrderBy] = useState('label');

  const [orderDate, setOrder] = useState('asc');
  const [dateOrderBy, setDateOrderBy] = useState('label');

  const [dateData, setDateData] = useState({});

  const projectNameChange = (event) => {
    if (event.target.value == 'null') {
      setProjectName(null);
    } else {
      setProjectName(event.target.value);
    }
  };
  const deviceNameChange = (event) => {
    if (event.target.value == 'null') {
      setDeviceName(null);
    } else {
      setDeviceName(event.target.value);
    }
  };
  const togglePause = () => {
    setIsPaused(!isPaused);
  };
  // function getCircleIcon(color) {
  //   if (color === "red") {
  //     return <RCircle />;
  //   } else if (color === "yellow") {
  //     return <YCircle />;
  //   } else if (color === "green") {
  //     return <GCircle />;
  //   } else if (color === "blue") {
  //     return <BCircle />;
  //   } else {
  //     return null; // 或者返回一个默认的图标
  //   }
  // }

  // const RCircle = () => {
  //   return (
  //     <BsFillCircleFill style={{ color: 'red', fontSize: '30px' }} />
  //   );
  // }
  // const YCircle = () => {
  //   return (
  //     <BsFillCircleFill style={{ color: 'yellow', fontSize: '30px' }} />
  //   );
  // }
  // const GCircle = () => {
  //   return (
  //     <BsFillCircleFill style={{ color: 'green', fontSize: '30px' }} />
  //   );
  // }
  // const BCircle = () => {
  //   return (
  //     <BsFillCircleFill style={{ color: '#4169e1', fontSize: '30px' }} />
  //   );
  // }

  // function getCircleIcon(lightColor) {
  //   if (lightColor === 1) {
  //     return <RCircle />;
  //   } else if (lightColor === 2) {
  //     return <YCircle />;
  //   } else if (lightColor === 3) {
  //     return <GCircle />;
  //   } else if (lightColor === 4) {
  //     return <BCircle />;
  //   } else {
  //     return null; // 或者返回一个默认的图标
  //   }
  // }
  const settings = {
    dots: true,
    infinite: true,
    speed: 5000,
    slidesToShow: 1,
    slidesToScroll: 1,
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


  // 使用另一个useEffect监听statisticDevices的变化
  useEffect(() => {
    getProjectName(token)
  }, [globalVariable]);

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
        const devicesList = res.data.map((project) => project);
        setDeviceNameList(devicesList);
      });

    getProjectDetails(token);
  }
  const getProjectDetails = () => {
    const data = {
      token: token,
    }
    apiGetStatisticsDetails(data)
      .then((res) => {
        console.log(res)
        setDateData(res.data)
      })
  }

  const getProjectDetailsFilter = () => {
    const data = {
      token: token,
      projectName: projectName,
      deviceName: deviceName
    }
    console.log(projectName)
    console.log(typeof (projectName))
    console.log(deviceName)
    console.log(typeof (projectName))
    apiGetStatisticsDetailsFilter(data)
      .then((res) => {
        console.log(res)
        setDateData(res.data)
        handleOpen("查詢成功")
      }).catch(err => { console.log(err); handleErrorOpen("查詢失敗" + err); })
  }

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

  function infoColor(happenLastTime) {
    if (happenLastTime === true) {
      return "#ffc107";
    } else {
      return null; // 或者返回一个默认的图标
    }
  }


  const [selectedSlide, setSelectedSlide] = useState(0);

  const handleSelectSlide = (index) => {
    setSelectedSlide(index);
  }

  const customRenderIndicator = (clickHandler, isSelected, index) => {
    const indicatorStyles = {
      background: isSelected ? "lightblue" : "lightgray",
      width: 15,
      height: 15,
      borderRadius: "50%",
      display: "inline-block",
      margin: "0 8px",
      cursor: "pointer",
    };

    return (
      <div
        style={indicatorStyles}
        onClick={() => {
          clickHandler();
          handleSelectSlide(index);
        }}
      />
    );
  };

  const tableContainerStyle = {
    tableContainer: {
      maxHeight: '380px', // 設置表格容器的最大高度
      overflowY: 'auto',  // 啟用垂直滾輪
    },
  };

  const tableCellStyle = {
    extendedCell: {
      // borderBottom: 'none', // 移除底部分隔線
      // paddingLeft: '20px',  // 調整內邊距以增加內容區域
      // paddingRight: '20px', // 調整內邊距以增加內容區域
    },
  };

  const handleSortRequest = (property) => {
    const isAsc = weekOrderBy === property && orderWeek === 'asc';
    setOrderWeek(isAsc ? 'desc' : 'asc');
    setWeekOrderBy(property);
  };

  const getComparator = (orderWeek) => {
    return orderWeek === 'desc'
      ? (a, b) => (a[weekOrderBy] > b[weekOrderBy] ? -1 : 1)
      : (a, b) => (a[weekOrderBy] > b[weekOrderBy] ? 1 : -1);
  };

  const handleSortRequestDate = (property) => {
    const isAsc = dateOrderBy === property && orderDate === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setDateOrderBy(property);
  };

  const getComparatorDate = (orderDate) => {
    return orderDate === 'desc'
      ? (a, b) => (a[dateOrderBy] > b[dateOrderBy] ? -1 : 1)
      : (a, b) => (a[dateOrderBy] > b[dateOrderBy] ? 1 : -1);
  };

  const createDeviceCardTW = (data, data2) => {
    return (
      <div>
        {Object.keys(data).map((project) => (
          <div key={project}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <LoadingButton variant="contained" color="info" onClick={togglePause}>
                {isPaused ? '恢復輪播' : '暫停輪播'}
              </LoadingButton>
            </Box>
            <Carousel
              showArrows={false}
              renderIndicator={customRenderIndicator}
              infiniteLoop={true}
              autoPlay={!isPaused}
              stopOnHover={true}
              interval={3000}
            >
              {Object.keys(data[project]).map((device) => {
                // Initialize counters for '異常' and '穩定'
                let abnormalCount = 0;
                let nonAbnormalCount = 0;

                // Loop through the data for the current device to count '異常' and '穩定'
                data[project][device].forEach((item) => {
                  if (item.lightColor === 1) {
                    abnormalCount++;
                  } else if (item.lightColor === 0) {
                    nonAbnormalCount++;
                  }
                });
                console.log(abnormalCount, nonAbnormalCount)
                let pieData = [
                  { value: nonAbnormalCount, label: '穩定' },
                  { value: abnormalCount, label: '異常' },
                ];

                return (
                  <div key={device}>
                    <Card>
                      <Box sx={{ bgcolor: '#696969' }}>
                        <CardHeader title={project + "-" + device} color="#696969" align="center" />
                      </Box>
                      <Grid container spacing={1}>
                        <Grid xs={3} sx={{ mt: 4 }}>
                          <Box border={1} sx={{ mt: 4, ml: 6, width: 120, height: 'auto' }}>
                            <Typography align="center" fontSize={25}>異常</Typography>
                            <Box sx={{ bgcolor: '#ff2600', width: 'auto', height: 'auto' }}>
                              <Typography align="center" fontSize={20}>{abnormalCount}</Typography>
                            </Box>
                          </Box>
                          <Box sx={{ mt: 6, ml: 2 }}>
                            <PieChart
                              colors={['#008f00', '#ff2600']}
                              series={[
                                {
                                  arcLabel: (item) => `${item.label} (${item.value})`,
                                  arcLabelMinAngle: 50,
                                  data: pieData,
                                },
                              ]}
                              sx={{
                                [`& .${pieArcLabelClasses.root}`]: {
                                  fill: 'default',
                                  fontWeight: 'bold',
                                },
                              }}
                              width={600}
                              height={300}
                            />
                          </Box>
                        </Grid>
                        <Grid xs={3} sx={{ mt: 4 }}>
                          <Box border={1} sx={{ mt: 4, ml: 6, width: 118, height: 'auto' }}>
                            <Typography align="center" fontSize={25}>穩定</Typography>
                            <Box sx={{ bgcolor: '#008f00', width: 'auto', height: 'auto' }}>
                              <Typography align="center" fontSize={20}>{nonAbnormalCount}</Typography>
                            </Box>
                          </Box>
                        </Grid>
                        <Grid item xs={6} md={6} lg={6}>
                          <TableContainer component={Paper} style={tableContainerStyle.tableContainer}>
                            <Table>
                              <TableHead style={{ backgroundColor: '#bfbfbf' }}>
                                <TableRow>
                                  <TableCell align="center" sx={{ height: 'auto', border: "1px solid black" }} colSpan={3}>
                                    <Typography fontSize={20}>週預測</Typography>
                                  </TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell align="center" sx={{ height: 'auto', border: "1px solid black" }}>
                                    <TableSortLabel
                                      active={weekOrderBy === 'label'}
                                      direction={weekOrderBy === 'label' ? orderWeek : 'asc'}
                                      onClick={() => handleSortRequest('label')}
                                    >
                                      <Typography fontSize={20}>類型</Typography>
                                    </TableSortLabel>
                                  </TableCell>
                                  <TableCell align="center" sx={{ height: 'auto', border: "1px solid black" }}>
                                    <Typography fontSize={20}>異常事件</Typography>
                                  </TableCell>
                                  <TableCell align="center" sx={{ height: 'auto', border: "1px solid black" }}>
                                    <TableSortLabel
                                      active={weekOrderBy === 'date'}
                                      direction={weekOrderBy === 'date' ? orderWeek : 'asc'}
                                      onClick={() => handleSortRequest('date')}
                                    >
                                      <Typography fontSize={20}>前次發生時間</Typography>
                                    </TableSortLabel>
                                  </TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {data[project][device].filter(columns => columns.frequency === "週預測").sort(getComparator(orderWeek)).map((columns) => (
                                  <TableRow key={columns.name}>
                                    <TableCell style={tableCellStyle.extendedCell} key={columns.id} align="center" sx={{ bgcolor: getColor(columns.lightColor) }}>
                                      <Typography fontSize={20}>{columns.lightColor === 0 ? "穩定" : "異常"}</Typography>
                                    </TableCell>
                                    <TableCell align="center" sx={{ height: 'auto', bgcolor: infoColor(columns.happenLastTime) }}>
                                      <Typography fontSize={20}>{columns.name}</Typography>
                                    </TableCell>
                                    <TableCell align="center" sx={{ height: 'auto', bgcolor: infoColor(columns.happenLastTime) }}>
                                      <Typography fontSize={20}>{columns.date}</Typography>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                          <TableContainer component={Paper} style={tableContainerStyle.tableContainer}>
                            <Table>
                              <TableHead style={{ backgroundColor: '#bfbfbf' }}>
                                <TableRow>
                                  <TableCell align="center" sx={{ height: 'auto', border: "1px solid black" }} colSpan={3}>
                                    <Typography fontSize={20} >日預測</Typography>
                                  </TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell align="center" sx={{ height: 'auto', border: "1px solid black" }}>
                                    <TableSortLabel
                                      active={dateOrderBy === 'label'}
                                      direction={dateOrderBy === 'label' ? orderDate : 'asc'}
                                      onClick={() => handleSortRequestDate('label')}
                                    >
                                      <Typography fontSize={20} >類型</Typography>
                                    </TableSortLabel>
                                  </TableCell>
                                  <TableCell align="center" sx={{ height: 'auto', border: "1px solid black" }}>
                                    <Typography fontSize={20} >異常事件</Typography>
                                  </TableCell>
                                  <TableCell align="center" sx={{ height: 'auto', border: "1px solid black" }}>
                                    <TableSortLabel
                                      active={dateOrderBy === 'date'}
                                      direction={dateOrderBy === 'date' ? orderDate : 'asc'}
                                      onClick={() => handleSortRequestDate('date')}
                                    >
                                      <Typography fontSize={20} >前次發生時間</Typography>
                                    </TableSortLabel>
                                  </TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {data2[project][device].filter(columns => columns.frequency === "日預測").sort(getComparatorDate(orderDate)).map((columns) => (
                                  <TableRow key={columns.name}>
                                    <TableCell style={tableCellStyle.extendedCell} key={columns.id} align="center" sx={{ bgcolor: getColor(columns.lightColor) }}>
                                      <Typography fontSize={20}>{columns.lightColor === 0 ? "異常" : "穩定"}</Typography>
                                    </TableCell>
                                    <TableCell align="center" sx={{ height: 'auto', bgcolor: infoColor(columns.happenLastTime) }}>
                                      <Typography fontSize={20}>{columns.name}</Typography>
                                    </TableCell>
                                    <TableCell align="center" sx={{ height: 'auto', bgcolor: infoColor(columns.happenLastTime) }}>
                                      <Typography fontSize={20}>{columns.date}</Typography>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </Grid>
                      </Grid>
                    </Card>
                  </div>
                );
              })}
            </Carousel>
          </div>
        ))}
      </div>
    );
  };

  const createDeviceCardCN = (data, data2) => {
    return (
      <div>
        {Object.keys(data).map((project) => (
          <div key={project}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <LoadingButton variant="contained" color="info" onClick={togglePause}>
                {isPaused ? '恢复轮播' : '暂停轮播'}
              </LoadingButton>
            </Box>
            <Carousel
              showArrows={false}
              renderIndicator={customRenderIndicator}
              infiniteLoop={true}
              autoPlay={!isPaused}
              stopOnHover={true}
              interval={3000}
            >
              {Object.keys(data[project]).map((device) => {
                // Initialize counters for '異常' and '穩定'
                let abnormalCount = 0;
                let nonAbnormalCount = 0;

                // Loop through the data for the current device to count '異常' and '穩定'
                data[project][device].forEach((item) => {
                  if (item.lightColor === 1) {
                    abnormalCount++;
                  } else if (item.lightColor === 0) {
                    nonAbnormalCount++;
                  }
                });
                console.log(abnormalCount, nonAbnormalCount)
                let pieData = [
                  { value: nonAbnormalCount, label: '稳定' },
                  { value: abnormalCount, label: '异常' },
                ];

                return (
                  <div key={device}>
                    <Card>
                      <Box sx={{ bgcolor: '#696969' }}>
                        <CardHeader title={project + "-" + device} color="#696969" align="center" />
                      </Box>
                      <Grid container spacing={1}>
                        <Grid xs={3} sx={{ mt: 4 }}>
                          <Box border={1} sx={{ mt: 4, ml: 6, width: 120, height: 'auto' }}>
                            <Typography align="center" fontSize={25}>异常</Typography>
                            <Box sx={{ bgcolor: '#ff2600', width: 'auto', height: 'auto' }}>
                              <Typography align="center" fontSize={20}>{abnormalCount}</Typography>
                            </Box>
                          </Box>
                          <Box sx={{ mt: 6, ml: 2 }}>
                            <PieChart
                              colors={['#008f00', '#ff2600']}
                              series={[
                                {
                                  arcLabel: (item) => `${item.label} (${item.value})`,
                                  arcLabelMinAngle: 50,
                                  data: pieData,
                                },
                              ]}
                              sx={{
                                [`& .${pieArcLabelClasses.root}`]: {
                                  fill: 'default',
                                  fontWeight: 'bold',
                                },
                              }}
                              width={600}
                              height={300}
                            />
                          </Box>
                        </Grid>
                        <Grid xs={3} sx={{ mt: 4 }}>
                          <Box border={1} sx={{ mt: 4, ml: 6, width: 118, height: 'auto' }}>
                            <Typography align="center" fontSize={25}>稳定</Typography>
                            <Box sx={{ bgcolor: '#008f00', width: 'auto', height: 'auto' }}>
                              <Typography align="center" fontSize={20}>{nonAbnormalCount}</Typography>
                            </Box>
                          </Box>
                        </Grid>
                        <Grid item xs={6} md={6} lg={6}>
                          <TableContainer component={Paper} style={tableContainerStyle.tableContainer}>
                            <Table>
                              <TableHead style={{ backgroundColor: '#bfbfbf' }}>
                                <TableRow>
                                  <TableCell align="center" sx={{ height: 'auto', border: "1px solid black" }} colSpan={3}>
                                    <Typography fontSize={20}>周预测</Typography>
                                  </TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell align="center" sx={{ height: 'auto', border: "1px solid black" }}>
                                    <TableSortLabel
                                      active={weekOrderBy === 'label'}
                                      direction={weekOrderBy === 'label' ? orderWeek : 'asc'}
                                      onClick={() => handleSortRequest('label')}
                                    >
                                      <Typography fontSize={20}>类型</Typography>
                                    </TableSortLabel>
                                  </TableCell>
                                  <TableCell align="center" sx={{ height: 'auto', border: "1px solid black" }}>
                                    <Typography fontSize={20}>异常事件</Typography>
                                  </TableCell>
                                  <TableCell align="center" sx={{ height: 'auto', border: "1px solid black" }}>
                                    <TableSortLabel
                                      active={weekOrderBy === 'date'}
                                      direction={weekOrderBy === 'date' ? orderWeek : 'asc'}
                                      onClick={() => handleSortRequest('date')}
                                    >
                                      <Typography fontSize={20}>前次发生时间</Typography>
                                    </TableSortLabel>
                                  </TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {data[project][device].filter(columns => columns.frequency === "週預測").sort(getComparator(orderWeek)).map((columns) => (
                                  <TableRow key={columns.name}>
                                    <TableCell style={tableCellStyle.extendedCell} key={columns.id} align="center" sx={{ bgcolor: getColor(columns.lightColor) }}>
                                      <Typography fontSize={20}>{columns.lightColor === 0 ? "穩定" : "異常"}</Typography>
                                    </TableCell>
                                    <TableCell align="center" sx={{ height: 'auto', bgcolor: infoColor(columns.happenLastTime) }}>
                                      <Typography fontSize={20}>{columns.name}</Typography>
                                    </TableCell>
                                    <TableCell align="center" sx={{ height: 'auto', bgcolor: infoColor(columns.happenLastTime) }}>
                                      <Typography fontSize={20}>{columns.date}</Typography>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                          <TableContainer component={Paper} style={tableContainerStyle.tableContainer}>
                            <Table>
                              <TableHead style={{ backgroundColor: '#bfbfbf' }}>
                                <TableRow>
                                  <TableCell align="center" sx={{ height: 'auto', border: "1px solid black" }} colSpan={3}>
                                    <Typography fontSize={20} >日预测</Typography>
                                  </TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell align="center" sx={{ height: 'auto', border: "1px solid black" }}>
                                    <TableSortLabel
                                      active={dateOrderBy === 'label'}
                                      direction={dateOrderBy === 'label' ? orderDate : 'asc'}
                                      onClick={() => handleSortRequestDate('label')}
                                    >
                                      <Typography fontSize={20} >类型</Typography>
                                    </TableSortLabel>
                                  </TableCell>
                                  <TableCell align="center" sx={{ height: 'auto', border: "1px solid black" }}>
                                    <Typography fontSize={20} >异常事件</Typography>
                                  </TableCell>
                                  <TableCell align="center" sx={{ height: 'auto', border: "1px solid black" }}>
                                    <TableSortLabel
                                      active={dateOrderBy === 'date'}
                                      direction={dateOrderBy === 'date' ? orderDate : 'asc'}
                                      onClick={() => handleSortRequestDate('date')}
                                    >
                                      <Typography fontSize={20} >前次发生时间</Typography>
                                    </TableSortLabel>
                                  </TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {data2[project][device].filter(columns => columns.frequency === "日預測").sort(getComparatorDate(orderDate)).map((columns) => (
                                  <TableRow key={columns.name}>
                                    <TableCell style={tableCellStyle.extendedCell} key={columns.id} align="center" sx={{ bgcolor: getColor(columns.lightColor) }}>
                                      <Typography fontSize={20}>{columns.lightColor === 0 ? "異常" : "穩定"}</Typography>
                                    </TableCell>
                                    <TableCell align="center" sx={{ height: 'auto', bgcolor: infoColor(columns.happenLastTime) }}>
                                      <Typography fontSize={20}>{columns.name}</Typography>
                                    </TableCell>
                                    <TableCell align="center" sx={{ height: 'auto', bgcolor: infoColor(columns.happenLastTime) }}>
                                      <Typography fontSize={20}>{columns.date}</Typography>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </Grid>
                      </Grid>
                    </Card>
                  </div>
                );
              })}
            </Carousel>
          </div>
        ))}
      </div>
    );
  };

  const createDeviceCardEN = (data, data2) => {
    return (
      <div>
        {Object.keys(data).map((project) => (
          <div key={project}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <LoadingButton variant="contained" color="info" onClick={togglePause}>
                {isPaused ? 'Resume carousel' : 'Pause carousel'}
              </LoadingButton>
            </Box>
            <Carousel
              showArrows={false}
              renderIndicator={customRenderIndicator}
              infiniteLoop={true}
              autoPlay={!isPaused}
              stopOnHover={true}
              interval={3000}
            >
              {Object.keys(data[project]).map((device) => {
                // Initialize counters for '異常' and '穩定'
                let abnormalCount = 0;
                let nonAbnormalCount = 0;

                // Loop through the data for the current device to count '異常' and '穩定'
                data[project][device].forEach((item) => {
                  if (item.lightColor === 1) {
                    abnormalCount++;
                  } else if (item.lightColor === 0) {
                    nonAbnormalCount++;
                  }
                });
                console.log(abnormalCount, nonAbnormalCount)
                let pieData = [
                  { value: nonAbnormalCount, label: 'Stablize' },
                  { value: abnormalCount, label: 'Abnormal' },
                ];

                return (
                  <div key={device}>
                    <Card>
                      <Box sx={{ bgcolor: '#696969' }}>
                        <CardHeader title={project + "-" + device} color="#696969" align="center" />
                      </Box>
                      <Grid container spacing={1}>
                        <Grid xs={3} sx={{ mt: 4 }}>
                          <Box border={1} sx={{ mt: 4, ml: 6, width: 120, height: 'auto' }}>
                            <Typography align="center" fontSize={25}>Abnormal</Typography>
                            <Box sx={{ bgcolor: '#ff2600', width: 'auto', height: 'auto' }}>
                              <Typography align="center" fontSize={20}>{abnormalCount}</Typography>
                            </Box>
                          </Box>
                          <Box sx={{ mt: 6, ml: 2 }}>
                            <PieChart
                              colors={['#008f00', '#ff2600']}
                              series={[
                                {
                                  arcLabel: (item) => `${item.label} (${item.value})`,
                                  arcLabelMinAngle: 50,
                                  data: pieData,
                                },
                              ]}
                              sx={{
                                [`& .${pieArcLabelClasses.root}`]: {
                                  fill: 'default',
                                  fontWeight: 'bold',
                                },
                              }}
                              width={600}
                              height={300}
                            />
                          </Box>
                        </Grid>
                        <Grid xs={3} sx={{ mt: 4 }}>
                          <Box border={1} sx={{ mt: 4, ml: 6, width: 118, height: 'auto' }}>
                            <Typography align="center" fontSize={25}>Stablize</Typography>
                            <Box sx={{ bgcolor: '#008f00', width: 'auto', height: 'auto' }}>
                              <Typography align="center" fontSize={20}>{nonAbnormalCount}</Typography>
                            </Box>
                          </Box>
                        </Grid>
                        <Grid item xs={6} md={6} lg={6}>
                          <TableContainer component={Paper} style={tableContainerStyle.tableContainer}>
                            <Table>
                              <TableHead style={{ backgroundColor: '#bfbfbf' }}>
                                <TableRow>
                                  <TableCell align="center" sx={{ height: 'auto', border: "1px solid black" }} colSpan={3}>
                                    <Typography fontSize={20}>Weekly predictions</Typography>
                                  </TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell align="center" sx={{ height: 'auto', border: "1px solid black" }}>
                                    <TableSortLabel
                                      active={weekOrderBy === 'label'}
                                      direction={weekOrderBy === 'label' ? orderWeek : 'asc'}
                                      onClick={() => handleSortRequest('label')}
                                    >
                                      <Typography fontSize={20}>Type</Typography>
                                    </TableSortLabel>
                                  </TableCell>
                                  <TableCell align="center" sx={{ height: 'auto', border: "1px solid black" }}>
                                    <Typography fontSize={20}>Unusual events</Typography>
                                  </TableCell>
                                  <TableCell align="center" sx={{ height: 'auto', border: "1px solid black" }}>
                                    <TableSortLabel
                                      active={weekOrderBy === 'date'}
                                      direction={weekOrderBy === 'date' ? orderWeek : 'asc'}
                                      onClick={() => handleSortRequest('date')}
                                    >
                                      <Typography fontSize={20}>Last occurrence time</Typography>
                                    </TableSortLabel>
                                  </TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {data[project][device].filter(columns => columns.frequency === "週預測").sort(getComparator(orderWeek)).map((columns) => (
                                  <TableRow key={columns.name}>
                                    <TableCell style={tableCellStyle.extendedCell} key={columns.id} align="center" sx={{ bgcolor: getColor(columns.lightColor) }}>
                                      <Typography fontSize={20}>{columns.lightColor === 0 ? "穩定" : "異常"}</Typography>
                                    </TableCell>
                                    <TableCell align="center" sx={{ height: 'auto', bgcolor: infoColor(columns.happenLastTime) }}>
                                      <Typography fontSize={20}>{columns.name}</Typography>
                                    </TableCell>
                                    <TableCell align="center" sx={{ height: 'auto', bgcolor: infoColor(columns.happenLastTime) }}>
                                      <Typography fontSize={20}>{columns.date}</Typography>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                          <TableContainer component={Paper} style={tableContainerStyle.tableContainer}>
                            <Table>
                              <TableHead style={{ backgroundColor: '#bfbfbf' }}>
                                <TableRow>
                                  <TableCell align="center" sx={{ height: 'auto', border: "1px solid black" }} colSpan={3}>
                                    <Typography fontSize={20} >Daily predictions</Typography>
                                  </TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell align="center" sx={{ height: 'auto', border: "1px solid black" }}>
                                    <TableSortLabel
                                      active={dateOrderBy === 'label'}
                                      direction={dateOrderBy === 'label' ? orderDate : 'asc'}
                                      onClick={() => handleSortRequestDate('label')}
                                    >
                                      <Typography fontSize={20} >Type</Typography>
                                    </TableSortLabel>
                                  </TableCell>
                                  <TableCell align="center" sx={{ height: 'auto', border: "1px solid black" }}>
                                    <Typography fontSize={20} >Unusual events</Typography>
                                  </TableCell>
                                  <TableCell align="center" sx={{ height: 'auto', border: "1px solid black" }}>
                                    <TableSortLabel
                                      active={dateOrderBy === 'date'}
                                      direction={dateOrderBy === 'date' ? orderDate : 'asc'}
                                      onClick={() => handleSortRequestDate('date')}
                                    >
                                      <Typography fontSize={20} >Last occurrence time</Typography>
                                    </TableSortLabel>
                                  </TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {data2[project][device].filter(columns => columns.frequency === "日預測").sort(getComparatorDate(orderDate)).map((columns) => (
                                  <TableRow key={columns.name}>
                                    <TableCell style={tableCellStyle.extendedCell} key={columns.id} align="center" sx={{ bgcolor: getColor(columns.lightColor) }}>
                                      <Typography fontSize={20}>{columns.lightColor === 0 ? "異常" : "穩定"}</Typography>
                                    </TableCell>
                                    <TableCell align="center" sx={{ height: 'auto', bgcolor: infoColor(columns.happenLastTime) }}>
                                      <Typography fontSize={20}>{columns.name}</Typography>
                                    </TableCell>
                                    <TableCell align="center" sx={{ height: 'auto', bgcolor: infoColor(columns.happenLastTime) }}>
                                      <Typography fontSize={20}>{columns.date}</Typography>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </Grid>
                      </Grid>
                    </Card>
                  </div>
                );
              })}
            </Carousel>
          </div>
        ))}
      </div>
    );
  };

  return (
    <ThemeProvider theme={darkTheme}>
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
      {globalVariable == "zh-tw" ? (
        <>
          <Card sx={{ mb: 3 }}>
            <Box sx={{ bgcolor: '#696969' }}>
              <CardHeader title="機況查詢頁面:" color="#62aaf4" />
            </Box>
            <Divider sx={{ borderBottomWidth: 3 }} />
            <CardContent>
              <Grid container spacing={1}>
                <Grid item xs={12} md={12}>
                  <Typography variant="h4" fontWeight="medium" mr={2}>
                    條件篩選:
                  </Typography>
                  <Box>
                    <Box sx={{ mt: 1, ml: 4 }} display="flex" component="form" role="form">
                      <Box align="center" display="flex">
                        <Typography variant="h5" fontWeight="medium" mr={2}>
                          專案名稱:
                        </Typography>
                      </Box>
                      <Box>
                        <FormControl>
                          <InputLabel id="operation-type-select-label">專案名稱</InputLabel>
                          <Select
                            labelId="permission-select-label"
                            id="permission-select"
                            value={projectName}
                            label="專案名稱"
                            onChange={projectNameChange}
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
                    </Box>
                    <Box sx={{ mt: 1, ml: 4 }} display="flex" component="form" role="form">
                      <Box align="center" display="flex">
                        <Typography align="center" variant="h5" mr={2}>
                          機台名稱:
                        </Typography>
                      </Box>
                      <Box>
                        <FormControl>
                          <InputLabel id="operation-type-select-label">機台名稱</InputLabel>
                          <Select
                            labelId="permission-select-label"
                            id="permission-select"
                            value={deviceName}
                            label="機台名稱"
                            onChange={deviceNameChange}
                            style={{ minWidth: "271px", height: "56px" }}
                          >
                            <MenuItem value="">清空欄位</MenuItem>
                            {deviceNameList.map((object) => {
                              if (object.project_name === projectName) {
                                return object.devices.map((device) => (
                                  <MenuItem key={device} value={device}>
                                    {device}
                                  </MenuItem>
                                ));
                              }
                            })}
                          </Select>
                        </FormControl>
                      </Box>
                    </Box>
                    <Box sx={{ ml: 4 }} display="flex">
                      <LoadingButton variant="contained"
                        size="large"
                        component="span"
                        color="info"
                        onClick={getProjectDetailsFilter}
                      >
                        查詢
                      </LoadingButton>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          {createDeviceCardTW(dateData, dateData)}
        </>
      ) : globalVariable == "zh-cn" ? (
        <>
          <Card sx={{ mb: 3 }}>
            <Box sx={{ bgcolor: '#696969' }}>
              <CardHeader title="机况查询页面:" color="#62aaf4" />
            </Box>
            <Divider sx={{ borderBottomWidth: 3 }} />
            <CardContent>
              <Grid container spacing={1}>
                <Grid item xs={12} md={12}>
                  <Typography variant="h4" fontWeight="medium" mr={2}>
                    条件筛选:
                  </Typography>
                  <Box>
                    <Box sx={{ mt: 1, ml: 4 }} display="flex" component="form" role="form">
                      <Box align="center" display="flex">
                        <Typography variant="h5" fontWeight="medium" mr={2}>
                          专案名称:
                        </Typography>
                      </Box>
                      <Box>
                        <FormControl>
                          <InputLabel id="operation-type-select-label">专案名称</InputLabel>
                          <Select
                            labelId="permission-select-label"
                            id="permission-select"
                            value={projectName}
                            label="专案名称"
                            onChange={projectNameChange}
                            style={{ minWidth: "271px", height: "56px" }}
                          >
                            <MenuItem value="">清空栏位</MenuItem>
                            {projectNameList.map((projectItem) => (
                              <MenuItem value={projectItem}>
                                {projectItem}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Box>
                    </Box>
                    <Box sx={{ mt: 1, ml: 4 }} display="flex" component="form" role="form">
                      <Box align="center" display="flex">
                        <Typography align="center" variant="h5" mr={2}>
                          机台名称:
                        </Typography>
                      </Box>
                      <Box>
                        <FormControl>
                          <InputLabel id="operation-type-select-label">机台名称</InputLabel>
                          <Select
                            labelId="permission-select-label"
                            id="permission-select"
                            value={deviceName}
                            label="机台名称"
                            onChange={deviceNameChange}
                            style={{ minWidth: "271px", height: "56px" }}
                          >
                            <MenuItem value="">清空栏位</MenuItem>
                            {deviceNameList.map((object) => {
                              if (object.project_name === projectName) {
                                return object.devices.map((device) => (
                                  <MenuItem key={device} value={device}>
                                    {device}
                                  </MenuItem>
                                ));
                              }
                            })}
                          </Select>
                        </FormControl>
                      </Box>
                    </Box>
                    <Box sx={{ ml: 4 }} display="flex">
                      <LoadingButton variant="contained"
                        size="large"
                        component="span"
                        color="info"
                        onClick={getProjectDetailsFilter}
                      >
                        查询
                      </LoadingButton>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          {createDeviceCardCN(dateData, dateData)}
        </>
      ) : (
        <>
          <Card sx={{ mb: 3 }}>
            <Box sx={{ bgcolor: '#696969' }}>
              <CardHeader title="Machine status page:" color="#62aaf4" />
            </Box>
            <Divider sx={{ borderBottomWidth: 3 }} />
            <CardContent>
              <Grid container spacing={1}>
                <Grid item xs={12} md={12}>
                  <Typography variant="h4" fontWeight="medium" mr={2}>
                    Conditional filtering:
                  </Typography>
                  <Box>
                    <Box sx={{ mt: 1, ml: 4 }} display="flex" component="form" role="form">
                      <Box align="center" display="flex">
                        <Typography variant="h5" fontWeight="medium" mr={2}>
                          Project name:
                        </Typography>
                      </Box>
                      <Box>
                        <FormControl>
                          <InputLabel id="operation-type-select-label">Project name</InputLabel>
                          <Select
                            labelId="permission-select-label"
                            id="permission-select"
                            value={projectName}
                            label="Project name"
                            onChange={projectNameChange}
                            style={{ minWidth: "271px", height: "56px" }}
                          >
                            <MenuItem value="">Clear field</MenuItem>
                            {projectNameList.map((projectItem) => (
                              <MenuItem value={projectItem}>
                                {projectItem}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Box>
                    </Box>
                    <Box sx={{ mt: 1, ml: 4 }} display="flex" component="form" role="form">
                      <Box align="center" display="flex">
                        <Typography align="center" variant="h5" mr={2}>
                          Machine name:
                        </Typography>
                      </Box>
                      <Box>
                        <FormControl>
                          <InputLabel id="operation-type-select-label">Machine name</InputLabel>
                          <Select
                            labelId="permission-select-label"
                            id="permission-select"
                            value={deviceName}
                            label="Machine name"
                            onChange={deviceNameChange}
                            style={{ minWidth: "271px", height: "56px" }}
                          >
                            <MenuItem value="">Clear field</MenuItem>
                            {deviceNameList.map((object) => {
                              if (object.project_name === projectName) {
                                return object.devices.map((device) => (
                                  <MenuItem key={device} value={device}>
                                    {device}
                                  </MenuItem>
                                ));
                              }
                            })}
                          </Select>
                        </FormControl>
                      </Box>
                    </Box>
                    <Box sx={{ ml: 4 }} display="flex">
                      <LoadingButton variant="contained"
                        size="large"
                        component="span"
                        color="info"
                        onClick={getProjectDetailsFilter}
                      >
                        search
                      </LoadingButton>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          {createDeviceCardEN(dateData, dateData)}
        </>
      )}
    </ThemeProvider>
  );
}