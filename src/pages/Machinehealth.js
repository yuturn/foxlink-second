import React, { useState, useEffect, useContext } from "react";
import { apiGetStatistics, apiGetStatisticsDetails, apiGetStatisticsDetailsFilter, apiMarquee } from '../api'
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
import DialogContent from "@mui/material/DialogContent";
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Marquee from "./Marquee";
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
  const [lineName, setLineName] = useState();
  const [projectLineNameList, setProjectLineNameList] = useState([]);
  const [orderWeek, setOrderWeek] = useState('asc');
  const [weekOrderBy, setWeekOrderBy] = useState('label');
  const [orderDate, setOrder] = useState('asc');
  const [dateOrderBy, setDateOrderBy] = useState('label');
  const [dateData, setDateData] = useState({});
  const [projectToLineDeviceMap, setProjectToLineDeviceMap] = useState({});

  function ColorBox(props) {
    return (
      <ThemeProvider
        theme={{
          ...darkTheme,
          components: {
            MuiBox: {
              styleOverrides: { root: { width: "30px", height: "30px" } },
            },
          },
        }}
      >
        <DialogContent>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Box
              sx={{
                width: "30px",
                height: "30px",
                backgroundColor: "#ffc107", // 黄色
                marginRight: "10px",
              }}
            />
            <Typography sx={{ fontSize: 30 }}>{props.msg}</Typography>
          </div>
        </DialogContent>
      </ThemeProvider>
    );
  }

  const projectNameChange = (event) => {
    const selectedProject = event.target.value;
    setProjectName(selectedProject);
    if (selectedProject && projectToLineDeviceMap[selectedProject]) {
      const lineNames = Object.keys(projectToLineDeviceMap[selectedProject]);
      setProjectLineNameList(lineNames);
      setLineName('');
      setDeviceNameList([]);
      setDeviceName('');
    } else {
      setProjectLineNameList([]);
      setLineName('');
      setDeviceNameList([]);
      setDeviceName('');
    }
  };

  const projectLineNameChange = (event) => {
    const selectedLine = event.target.value;
    setLineName(selectedLine);
    if (projectName && projectToLineDeviceMap[projectName] && projectToLineDeviceMap[projectName][selectedLine]) {
      const devices = Array.from(projectToLineDeviceMap[projectName][selectedLine]).sort((a, b) => {
        const numA = parseInt(a.match(/Device_(\d+)/)[1], 10);
        const numB = parseInt(b.match(/Device_(\d+)/)[1], 10);
        return numA - numB;
      });
      setDeviceNameList(devices);
      setDeviceName('');
    } else {
      setDeviceNameList([]);
      setDeviceName('');
    }
  };

  const deviceNameChange = (event) => {
    if (event.target.value === 'null') {
      setDeviceName(null);
    } else {
      setDeviceName(event.target.value);
    }
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 5000,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    getProjectName(token);
    getProjectDetails();
    getProjectDetailsFilter();
    apiMarquee(token)
      .then((res) => {
        console.log(res.data); 
        setTimestampData(res.data); 
      })
      .catch((error) => {
        console.error(error);
      });
  }, [token, refreshKey]);


// 這邊創一個handleRefresh功能是有關refresh按鈕，主要是按一下+1，那這邊就是為了產生變化讓上面的useEffect去監聽他，以便做到刷新功能

  const handleRefresh = () => {
    setRefreshKey(prevKey => prevKey + 1);
    if (projectName && deviceName && lineName) {
      getProjectDetailsFilter();
    } else {
      console.log("Project Name or Device Name not set.");
      if (globalVariable === "zh-tw") {
        handleErrorOpen("請選擇完整查詢條件");
      } else if (globalVariable === "zh-cn") {
        handleErrorOpen("请选择完整查询条件");
      } else {
        handleErrorOpen("Please select complete query criteria");
      }
    }
  };

  function getColor(lightColor) {
    if (lightColor === 1) {
      return "#ff2600";
    } else if (lightColor === 0) {
      return "#008f00";
    } else {
      return null; // 或者返回一个默认的图标
    }
  }

  const [timeStampData, setTimestampData] = useState("");

  const fetchTimestampData = (token) => {
    if (!token) {
      return;
    }

    apiMarquee(token)
      .then((res) => {
        console.log(res.data);
        setTimestampData(res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };


  const getProjectName = (token) => {
    if (!token) {
      return;
    }

    apiGetStatistics(token)
      .then((res) => {
        const projectToLineDeviceMap = res.data.reduce((acc, project) => {
          const { project_name, line, devices } = project;
          acc[project_name] = acc[project_name] || {};
          line.forEach((lineNumber, index) => {
            const device = devices[index];
            if (device) {
              acc[project_name][lineNumber] = acc[project_name][lineNumber] || new Set();
              acc[project_name][lineNumber].add(device);
            }
          });
          return acc;
        }, {});

        const projectNameList = Object.keys(projectToLineDeviceMap);
        setProjectNameList(projectNameList);

        const firstProject = projectNameList[0];
        if (firstProject && projectToLineDeviceMap[firstProject]) {
          const lineNameList = Object.keys(projectToLineDeviceMap[firstProject]);
          setProjectLineNameList(lineNameList);

          const firstLine = lineNameList[0];
          if (firstLine && projectToLineDeviceMap[firstProject][firstLine]) {
            const devices = Array.from(projectToLineDeviceMap[firstProject][firstLine]).sort((a, b) => {
              const numA = parseInt(a.match(/Device_(\d+)/)[1], 10);
              const numB = parseInt(b.match(/Device_(\d+)/)[1], 10);
              return numA - numB;
            });
            setDeviceNameList(devices);
          }
        }

        setProjectToLineDeviceMap(projectToLineDeviceMap);
      });
  };

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
      lineName: lineName,
      deviceName: deviceName
    }
    console.log(projectName)
    console.log(typeof (projectName))
    console.log(deviceName)
    console.log(typeof (deviceName))
    apiGetStatisticsDetailsFilter(data)
      .then((res) => {
        console.log(res)
        setDateData(res.data)
        handleOpen((globalVariable === "zh-tw" ? "查詢成功" : globalVariable === "zh-cn" ? "查询成功" : "Search successful"))
      }).catch(err => { console.log(err); handleErrorOpen((globalVariable === "zh-tw" ? "查詢失敗:API請求失敗" : globalVariable === "zh-cn" ? "查询失败:API请求失败" : "Query failed: API request failed")); })
  }

  const [alertOpen, setAlertOpen] = React.useState(false);
  const [message, setMessage] = useState('');
  const handleOpen = (message) => {
    setMessage(message);
    setAlertOpen(true);
  };
  const handleClose = (event, reason) => {
    setAlertOpen(false);
  };

  const [errorAlertOpen, setErrorAlertOpen] = React.useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const handleErrorOpen = (message) => {
    setErrorMessage(message);
    setErrorAlertOpen(true);
  };
  const handleErrorClose = (event, reason) => {
    setErrorAlertOpen(false);
  };

  function infoColor(happened_times) {
    if (happened_times != 0) {
      return "#ffc107";
    } else {
      return null;
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
      maxHeight: '380px',
      overflowY: 'auto',
    },
  };

  const tableCellStyle = {
    extendedCell: {
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
    const groupByDeviceAndLine = (data) => {
        const groupedData = {};

        Object.keys(data).forEach((project) => {
            if (!groupedData[project]) {
                groupedData[project] = {};
            }

            Object.keys(data[project]).forEach((device) => {
                data[project][device].forEach((item) => {
                    const line = item.line;
                    if (!groupedData[project][device]) {
                        groupedData[project][device] = {};
                    }
                    if (!groupedData[project][device][line]) {
                        groupedData[project][device][line] = [];
                    }
                    groupedData[project][device][line].push(item);
                });
            });
        });

        return groupedData;
    };

    const groupedData = groupByDeviceAndLine(data);
    const groupedData2 = groupByDeviceAndLine(data2);

    return (
        <div>
            {Object.keys(groupedData).sort().map((project) => (
                <div key={project}>
                    <Carousel
                        showArrows={false}
                        renderIndicator={customRenderIndicator}
                        infiniteLoop={true}
                        autoPlay={!isPaused}
                        stopOnHover={true}
                        interval={3000}
                    >
                        {Object.keys(groupedData[project]).sort().map((device) => (
                            Object.keys(groupedData[project][device]).sort().map((line) => {
                                const deviceData = groupedData[project][device][line];
                                const deviceData2 = groupedData2[project][device][line] || [];

                                let abnormalCount = 0;
                                let nonAbnormalCount = 0;
                                deviceData.forEach((item) => {
                                    if (item.steady === 1) {
                                        abnormalCount++;
                                    } else if (item.steady === 0) {
                                        nonAbnormalCount++;
                                    }
                                });

                                let pieData = [
                                    { value: nonAbnormalCount, label: '穩定' },
                                    { value: abnormalCount, label: '異常' },
                                ];

                                return (
                                    <div key={device + line}>
                                        <Card>
                                            <Box sx={{ bgcolor: '#696969' }}>
                                                <CardHeader
                                                    title={`${project}@ 線號 ${line}@ ${device}`}
                                                    color="#696969"
                                                    align="center"
                                                />
                                            </Box>
                                            <Grid container spacing={1}>
                                                <Grid item xs={3} sx={{ mt: 4 }}>
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
                                                <Grid item xs={3} sx={{ mt: 4 }}>
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
                                                            <TableHead style={{ position: "sticky", top: 0, zIndex: 2, backgroundColor: "#bfbfbf" }}>
                                                                <TableRow>
                                                                    <TableCell align="center" sx={{ height: 'auto', border: "1px solid black" }} colSpan={5}>
                                                                        <Typography fontSize={20}>
                                                                            週預測
                                                                            {deviceData
                                                                                .filter((columns) => columns.frequency === "週預測")
                                                                                .map((item) => `${item.ori_date}-${item.pred_date}`)[0]}
                                                                        </Typography>
                                                                    </TableCell>
                                                                </TableRow>
                                                                <TableRow>
                                                                    <TableCell align="center" sx={{ height: 'auto', border: "1px solid black" }}>
                                                                        <TableSortLabel
                                                                            active={weekOrderBy === 'category'}
                                                                            direction={weekOrderBy === 'category' ? orderWeek : 'asc'}
                                                                            onClick={() => handleSortRequest('category')}
                                                                        >
                                                                            <Typography fontSize={20}>Category</Typography>
                                                                        </TableSortLabel>
                                                                    </TableCell>
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
                                                                    <TableCell align="center" sx={{ height: 'auto', border: "1px solid black" }}>
                                                                        <Typography fontSize={20}>發生次數</Typography>
                                                                    </TableCell>
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>
                                                                {deviceData.filter(columns => columns.frequency === "週預測").sort(getComparator(orderWeek)).map((columns) => (
                                                                    <TableRow key={columns.name}>
                                                                        <TableCell align="center" sx={{ height: 'auto', bgcolor: infoColor(columns.happened_times) }}>
                                                                            <Typography fontSize={20}>{columns.category}</Typography>
                                                                        </TableCell>
                                                                        <TableCell style={tableCellStyle.extendedCell} key={columns.id} align="center" sx={{ bgcolor: getColor(columns.steady) }}>
                                                                            <Typography fontSize={20}>{columns.steady === 0 ? "穩定" : "異常"}</Typography>
                                                                        </TableCell>
                                                                        <TableCell align="center" sx={{ height: 'auto', bgcolor: infoColor(columns.happened_times) }}>
                                                                            <Typography fontSize={20}>{columns.name}</Typography>
                                                                        </TableCell>
                                                                        <TableCell align="center" sx={{ height: 'auto', bgcolor: infoColor(columns.happened_times) }}>
                                                                            <Typography fontSize={20}>{columns.happenLastTime}</Typography>
                                                                        </TableCell>
                                                                        <TableCell align="center" sx={{ height: 'auto', bgcolor: infoColor(columns.happened_times) }}>
                                                                            <Typography fontSize={20}>{columns.happened_times}</Typography>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                ))}
                                                            </TableBody>
                                                        </Table>
                                                    </TableContainer>
                                                    <TableContainer component={Paper} style={tableContainerStyle.tableContainer}>
                                                        <Table>
                                                            <TableHead style={{ position: "sticky", top: 0, zIndex: 2, backgroundColor: "#bfbfbf" }}>
                                                                <TableRow>
                                                                    <TableCell align="center" sx={{ height: 'auto', border: "1px solid black" }} colSpan={5}>
                                                                        <Typography fontSize={20}>
                                                                            日預測
                                                                            {deviceData2
                                                                                .filter((columns) => columns.frequency === "日預測")
                                                                                .map((item) => `${item.pred_date}`)[0]}
                                                                        </Typography>
                                                                    </TableCell>
                                                                </TableRow>
                                                                <TableRow>
                                                                    <TableCell align="center" sx={{ height: 'auto', border: "1px solid black" }}>
                                                                        <TableSortLabel
                                                                            active={dateOrderBy === 'category'}
                                                                            direction={dateOrderBy === 'category' ? orderDate : 'asc'}
                                                                            onClick={() => handleSortRequestDate('category')}
                                                                        >
                                                                            <Typography fontSize={20} >Category</Typography>
                                                                        </TableSortLabel>
                                                                    </TableCell>
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
                                                                    <TableCell align="center" sx={{ height: 'auto', border: "1px solid black" }}>
                                                                        <Typography fontSize={20} >發生次數</Typography>
                                                                    </TableCell>
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>
                                                                {deviceData2.filter(columns => columns.frequency === "日預測").sort(getComparatorDate(orderDate)).map((columns) => (
                                                                    <TableRow key={columns.name}>
                                                                        <TableCell align="center" sx={{ height: 'auto', bgcolor: infoColor(columns.happened_times) }}>
                                                                            <Typography fontSize={20}>{columns.category}</Typography>
                                                                        </TableCell>
                                                                        <TableCell style={tableCellStyle.extendedCell} key={columns.id} align="center" sx={{ bgcolor: getColor(columns.steady) }}>
                                                                            <Typography fontSize={20}>{columns.steady === 0 ? "穩定" : "異常"}</Typography>
                                                                        </TableCell>
                                                                        <TableCell align="center" sx={{ height: 'auto', bgcolor: infoColor(columns.happened_times) }}>
                                                                            <Typography fontSize={20}>{columns.name}</Typography>
                                                                        </TableCell>
                                                                        <TableCell align="center" sx={{ height: 'auto', bgcolor: infoColor(columns.happened_times) }}>
                                                                            <Typography fontSize={20}>{columns.happenLastTime}</Typography>
                                                                        </TableCell>
                                                                        <TableCell align="center" sx={{ height: 'auto', bgcolor: infoColor(columns.happened_times) }}>
                                                                            <Typography fontSize={20}>{columns.happened_times}</Typography>
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
                            })
                        ))}
                    </Carousel>
                </div>
            ))}
        </div>
    );
};
const createDeviceCardCN = (data, data2) => {
  const groupByDeviceAndLine = (data) => {
      const groupedData = {};

      Object.keys(data).forEach((project) => {
          if (!groupedData[project]) {
              groupedData[project] = {};
          }

          Object.keys(data[project]).forEach((device) => {
              data[project][device].forEach((item) => {
                  const line = item.line;
                  if (!groupedData[project][device]) {
                      groupedData[project][device] = {};
                  }
                  if (!groupedData[project][device][line]) {
                      groupedData[project][device][line] = [];
                  }
                  groupedData[project][device][line].push(item);
              });
          });
      });

      return groupedData;
  };

  const groupedData = groupByDeviceAndLine(data);
  const groupedData2 = groupByDeviceAndLine(data2);

  return (
      <div>
          {Object.keys(groupedData).sort().map((project) => (
              <div key={project}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  </Box>
                  <Carousel
                      showArrows={false}
                      renderIndicator={customRenderIndicator}
                      infiniteLoop={true}
                      autoPlay={!isPaused}
                      stopOnHover={true}
                      interval={3000}
                  >
                      {Object.keys(groupedData[project]).sort().map((device) => (
                          Object.keys(groupedData[project][device]).sort().map((line) => {
                              const deviceData = groupedData[project][device][line];
                              const deviceData2 = groupedData2[project][device][line] || [];

                              let abnormalCount = 0;
                              let nonAbnormalCount = 0;
                              deviceData.forEach((item) => {
                                  if (item.steady === 1) {
                                      abnormalCount++;
                                  } else if (item.steady === 0) {
                                      nonAbnormalCount++;
                                  }
                              });

                              let pieData = [
                                  { value: nonAbnormalCount, label: '稳定' },
                                  { value: abnormalCount, label: '异常' },
                              ];

                              return (
                                  <div key={device + line}>
                                      <Card>
                                          <Box sx={{ bgcolor: '#696969' }}>
                                              <CardHeader
                                                  title={`${project}@ 线号 ${line}@ ${device}`}
                                                  color="#696969"
                                                  align="center"
                                              />
                                          </Box>
                                          <Grid container spacing={1}>
                                              <Grid item xs={3} sx={{ mt: 4 }}>
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
                                              <Grid item xs={3} sx={{ mt: 4 }}>
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
                                                          <TableHead style={{ position: "sticky", top: 0, zIndex: 2, backgroundColor: "#bfbfbf" }}>
                                                              <TableRow>
                                                                  <TableCell align="center" sx={{ height: 'auto', border: "1px solid black" }} colSpan={5}>
                                                                      <Typography fontSize={20}>
                                                                          周预测
                                                                          {deviceData
                                                                              .filter((columns) => columns.frequency === "週預測")
                                                                              .map((item) => `${item.ori_date}-${item.pred_date}`)[0]}
                                                                      </Typography>
                                                                  </TableCell>
                                                              </TableRow>
                                                              <TableRow>
                                                                  <TableCell align="center" sx={{ height: 'auto', border: "1px solid black" }}>
                                                                      <TableSortLabel
                                                                          active={weekOrderBy === 'category'}
                                                                          direction={weekOrderBy === 'category' ? orderWeek : 'asc'}
                                                                          onClick={() => handleSortRequest('category')}
                                                                      >
                                                                          <Typography fontSize={20}>category</Typography>
                                                                      </TableSortLabel>
                                                                  </TableCell>
                                                                  <TableCell align="center" sx={{ height: 'auto', border: "1px solid black" }}>
                                                                      <TableSortLabel
                                                                          active={weekOrderBy === 'label'}
                                                                          direction={weekOrderBy === 'label' ? orderWeek : 'asc'}
                                                                          onClick={() => handleSortRequest('label')}
                                                                      >
                                                                          <Typography fontSize={20}>类型</Typography>
                                                                      </TableSortLabel>
                                                                  </TableCell>
                                                                  <TableCell align="center" sx={{ height: 'auto', border: "1px solid黑" }}>
                                                                      <Typography fontSize={20}>异常事件</Typography>
                                                                  </TableCell>
                                                                  <TableCell align="center" sx={{ height: 'auto', border: "1px solid黑" }}>
                                                                      <TableSortLabel
                                                                          active={weekOrderBy === 'date'}
                                                                          direction={weekOrderBy === 'date' ? orderWeek : 'asc'}
                                                                          onClick={() => handleSortRequest('date')}
                                                                      >
                                                                          <Typography fontSize={20}>前次发生时间</Typography>
                                                                      </TableSortLabel>
                                                                  </TableCell>
                                                                  <TableCell align="center" sx={{ height: 'auto', border: "1px solid黑" }}>
                                                                      <Typography fontSize={20}>发生次数</Typography>
                                                                  </TableCell>
                                                              </TableRow>
                                                          </TableHead>
                                                          <TableBody>
                                                              {deviceData.filter(columns => columns.frequency === "週預測").sort(getComparator(orderWeek)).map((columns) => (
                                                                  <TableRow key={columns.name}>
                                                                      <TableCell align="center" sx={{ height: 'auto', bgcolor: infoColor(columns.happened_times) }}>
                                                                          <Typography fontSize={20}>{columns.category}</Typography>
                                                                      </TableCell>
                                                                      <TableCell style={tableCellStyle.extendedCell} key={columns.id} align="center" sx={{ bgcolor: getColor(columns.steady) }}>
                                                                          <Typography fontSize={20}>{columns.steady === 0 ? "稳定" : "异常"}</Typography>
                                                                      </TableCell>
                                                                      <TableCell align="center" sx={{ height: 'auto', bgcolor: infoColor(columns.happened_times) }}>
                                                                          <Typography fontSize={20}>{columns.name}</Typography>
                                                                      </TableCell>
                                                                      <TableCell align="center" sx={{ height: 'auto', bgcolor: infoColor(columns.happened_times) }}>
                                                                          <Typography fontSize={20}>{columns.happenLastTime}</Typography>
                                                                      </TableCell>
                                                                      <TableCell align="center" sx={{ height: 'auto', bgcolor: infoColor(columns.happened_times) }}>
                                                                          <Typography fontSize={20}>{columns.happened_times}</Typography>
                                                                      </TableCell>
                                                                  </TableRow>
                                                              ))}
                                                          </TableBody>
                                                      </Table>
                                                  </TableContainer>
                                                  <TableContainer component={Paper} style={tableContainerStyle.tableContainer}>
                                                      <Table>
                                                          <TableHead style={{ position: "sticky", top: 0, zIndex: 2, backgroundColor: "#bfbfbf" }}>
                                                              <TableRow>
                                                                  <TableCell align="center" sx={{ height: 'auto', border: "1px solid black" }} colSpan={5}>
                                                                      <Typography fontSize={20}>
                                                                          日预测
                                                                          {deviceData2
                                                                              .filter((columns) => columns.frequency === "日預測")
                                                                              .map((item) => `${item.pred_date}`)[0]}
                                                                      </Typography>
                                                                  </TableCell>
                                                              </TableRow>
                                                              <TableRow>
                                                                  <TableCell align="center" sx={{ height: 'auto', border: "1px solid black" }}>
                                                                      <TableSortLabel
                                                                          active={dateOrderBy === 'category'}
                                                                          direction={dateOrderBy === 'category' ? orderDate : 'asc'}
                                                                          onClick={() => handleSortRequestDate('category')}
                                                                      >
                                                                          <Typography fontSize={20} >Category</Typography>
                                                                      </TableSortLabel>
                                                                  </TableCell>
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
                                                                  <TableCell align="center" sx={{ height: 'auto', border: "1px solid black" }}>
                                                                      <Typography fontSize={20}>发生次数</Typography>
                                                                  </TableCell>
                                                              </TableRow>
                                                          </TableHead>
                                                          <TableBody>
                                                              {deviceData2.filter(columns => columns.frequency === "日預測").sort(getComparatorDate(orderDate)).map((columns) => (
                                                                  <TableRow key={columns.name}>
                                                                      <TableCell align="center" sx={{ height: 'auto', bgcolor: infoColor(columns.happened_times) }}>
                                                                          <Typography fontSize={20}>{columns.category}</Typography>
                                                                      </TableCell>
                                                                      <TableCell style={tableCellStyle.extendedCell} key={columns.id} align="center" sx={{ bgcolor: getColor(columns.steady) }}>
                                                                          <Typography fontSize={20}>{columns.steady === 0 ? "稳定" : "异常"}</Typography>
                                                                      </TableCell>
                                                                      <TableCell align="center" sx={{ height: 'auto', bgcolor: infoColor(columns.happened_times) }}>
                                                                          <Typography fontSize={20}>{columns.name}</Typography>
                                                                      </TableCell>
                                                                      <TableCell align="center" sx={{ height: 'auto', bgcolor: infoColor(columns.happened_times) }}>
                                                                          <Typography fontSize={20}>{columns.happenLastTime}</Typography>
                                                                      </TableCell>
                                                                      <TableCell align="center" sx={{ height: 'auto', bgcolor: infoColor(columns.happened_times) }}>
                                                                          <Typography fontSize={20}>{columns.happened_times}</Typography>
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
                          })
                      ))}
                  </Carousel>
              </div>
          ))}
      </div>
  );
};

  
const createDeviceCardEN = (data, data2) => {
  const groupByDeviceAndLine = (data) => {
      const groupedData = {};

      Object.keys(data).forEach((project) => {
          if (!groupedData[project]) {
              groupedData[project] = {};
          }

          Object.keys(data[project]).forEach((device) => {
              data[project][device].forEach((item) => {
                  const line = item.line;
                  if (!groupedData[project][device]) {
                      groupedData[project][device] = {};
                  }
                  if (!groupedData[project][device][line]) {
                      groupedData[project][device][line] = [];
                  }
                  groupedData[project][device][line].push(item);
              });
          });
      });

      return groupedData;
  };

  const groupedData = groupByDeviceAndLine(data);
  const groupedData2 = groupByDeviceAndLine(data2);

  return (
      <div>
          {Object.keys(groupedData).sort().map((project) => (
              <div key={project}>
                  <Carousel
                      showArrows={false}
                      renderIndicator={customRenderIndicator}
                      infiniteLoop={true}
                      autoPlay={!isPaused}
                      stopOnHover={true}
                      interval={3000}
                  >
                      {Object.keys(groupedData[project]).sort().map((device) => (
                          Object.keys(groupedData[project][device]).sort().map((line) => {
                              const deviceData = groupedData[project][device][line];
                              const deviceData2 = groupedData2[project][device][line] || [];

                              let abnormalCount = 0;
                              let nonAbnormalCount = 0;
                              deviceData.forEach((item) => {
                                  if (item.steady === 1) {
                                      abnormalCount++;
                                  } else if (item.steady === 0) {
                                      nonAbnormalCount++;
                                  }
                              });

                              let pieData = [
                                  { value: nonAbnormalCount, label: 'Stabilize' },
                                  { value: abnormalCount, label: 'Abnormal' },
                              ];

                              return (
                                  <div key={device + line}>
                                      <Card>
                                          <Box sx={{ bgcolor: '#696969' }}>
                                              <CardHeader
                                                  title={`${project}@ line ${line}@ ${device}`}
                                                  color="#696969"
                                                  align="center"
                                              />
                                          </Box>
                                          <Grid container spacing={1}>
                                              <Grid item xs={3} sx={{ mt: 4 }}>
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
                                              <Grid item xs={3} sx={{ mt: 4 }}>
                                                  <Box border={1} sx={{ mt: 4, ml: 6, width: 118, height: 'auto' }}>
                                                      <Typography align="center" fontSize={25}>Stabilize</Typography>
                                                      <Box sx={{ bgcolor: '#008f00', width: 'auto', height: 'auto' }}>
                                                          <Typography align="center" fontSize={20}>{nonAbnormalCount}</Typography>
                                                      </Box>
                                                  </Box>
                                              </Grid>
                                              <Grid item xs={6} md={6} lg={6}>
                                                  <TableContainer component={Paper} style={tableContainerStyle.tableContainer}>
                                                      <Table>
                                                          <TableHead style={{ position: "sticky", top: 0, zIndex: 2, backgroundColor: "#bfbfbf" }}>
                                                              <TableRow>
                                                                  <TableCell align="center" sx={{ height: 'auto', border: "1px solid black" }} colSpan={5}>
                                                                      <Typography fontSize={20}>
                                                                          Weekly predictions
                                                                          {deviceData
                                                                              .filter((columns) => columns.frequency === "週預測")
                                                                              .map((item) => `${item.ori_date}-${item.pred_date}`)[0]}
                                                                      </Typography>
                                                                  </TableCell>
                                                              </TableRow>
                                                              <TableRow>
                                                                  <TableCell align="center" sx={{ height: 'auto', border: "1px solid black" }}>
                                                                      <TableSortLabel
                                                                          active={weekOrderBy === 'category'}
                                                                          direction={weekOrderBy === 'category' ? orderWeek : 'asc'}
                                                                          onClick={() => handleSortRequest('category')}
                                                                      >
                                                                          <Typography fontSize={20}>Category</Typography>
                                                                      </TableSortLabel>
                                                                  </TableCell>
                                                                  <TableCell align="center" sx={{ height: 'auto', border: "1px solid black" }}>
                                                                      <TableSortLabel
                                                                          active={weekOrderBy === 'label'}
                                                                          direction={weekOrderBy === 'label' ? orderWeek : 'asc'}
                                                                          onClick={() => handleSortRequest('label')}
                                                                      >
                                                                          <Typography fontSize={20}>Type</Typography>
                                                                      </TableSortLabel>
                                                                  </TableCell>
                                                                  <TableCell align="center" sx={{ height: 'auto', border: "1px solid黑" }}>
                                                                      <Typography fontSize={20}>Unusual events</Typography>
                                                                  </TableCell>
                                                                  <TableCell align="center" sx={{ height: 'auto', border: "1px solid黑" }}>
                                                                      <TableSortLabel
                                                                          active={weekOrderBy === 'date'}
                                                                          direction={weekOrderBy === 'date' ? orderWeek : 'asc'}
                                                                          onClick={() => handleSortRequest('date')}
                                                                      >
                                                                          <Typography fontSize={20}>Last occurrence time</Typography>
                                                                      </TableSortLabel>
                                                                  </TableCell>
                                                                  <TableCell align="center" sx={{ height: 'auto', border: "1px solid黑" }}>
                                                                      <Typography fontSize={20}>Number of occurrences</Typography>
                                                                  </TableCell>
                                                              </TableRow>
                                                          </TableHead>
                                                          <TableBody>
                                                              {deviceData.filter(columns => columns.frequency === "週預測").sort(getComparator(orderWeek)).map((columns) => (
                                                                  <TableRow key={columns.name}>
                                                                      <TableCell align="center" sx={{ height: 'auto', bgcolor: infoColor(columns.happened_times) }}>
                                                                          <Typography fontSize={20}>{columns.category}</Typography>
                                                                      </TableCell>
                                                                      <TableCell style={tableCellStyle.extendedCell} key={columns.id} align="center" sx={{ bgcolor: getColor(columns.steady) }}>
                                                                          <Typography fontSize={20}>{columns.steady === 0 ? "Stabilize" : "Abnormal"}</Typography>
                                                                      </TableCell>
                                                                      <TableCell align="center" sx={{ height: 'auto', bgcolor: infoColor(columns.happened_times) }}>
                                                                          <Typography fontSize={20}>{columns.name}</Typography>
                                                                      </TableCell>
                                                                      <TableCell align="center" sx={{ height: 'auto', bgcolor: infoColor(columns.happened_times) }}>
                                                                          <Typography fontSize={20}>{columns.happenLastTime}</Typography>
                                                                      </TableCell>
                                                                      <TableCell align="center" sx={{ height: 'auto', bgcolor: infoColor(columns.happened_times) }}>
                                                                          <Typography fontSize={20}>{columns.happened_times}</Typography>
                                                                      </TableCell>
                                                                  </TableRow>
                                                              ))}
                                                          </TableBody>
                                                      </Table>
                                                  </TableContainer>
                                                  <TableContainer component={Paper} style={tableContainerStyle.tableContainer}>
                                                      <Table>
                                                          <TableHead style={{ position: "sticky", top: 0, zIndex: 2, backgroundColor: "#bfbfbf" }}>
                                                              <TableRow>
                                                                  <TableCell align="center" sx={{ height: 'auto', border: "1px solid black" }} colSpan={5}>
                                                                      <Typography fontSize={20}>
                                                                          Daily predictions
                                                                          {deviceData2
                                                                              .filter((columns) => columns.frequency === "日預測")
                                                                              .map((item) => `${item.pred_date}`)[0]}
                                                                      </Typography>
                                                                  </TableCell>
                                                              </TableRow>
                                                              <TableRow>
                                                                  <TableCell align="center" sx={{ height: 'auto', border: "1px solid black" }}>
                                                                      <TableSortLabel
                                                                          active={dateOrderBy === 'category'}
                                                                          direction={dateOrderBy === 'category' ? orderDate : 'asc'}
                                                                          onClick={() => handleSortRequestDate('category')}
                                                                      >
                                                                          <Typography fontSize={20} >Category</Typography>
                                                                      </TableSortLabel>
                                                                  </TableCell>
                                                                  <TableCell align="center" sx={{ height: 'auto', border: "1px solid black" }}>
                                                                      <TableSortLabel
                                                                          active={dateOrderBy === 'label'}
                                                                          direction={dateOrderBy === 'label' ? orderDate : 'asc'}
                                                                          onClick={() => handleSortRequestDate('label')}
                                                                      >
                                                                          <Typography fontSize={20} >Type</Typography>
                                                                      </TableSortLabel>
                                                                  </TableCell>
                                                                  <TableCell align="center" sx={{ height: 'auto', border: "1px solid黑" }}>
                                                                      <Typography fontSize={20} >Unusual events</Typography>
                                                                  </TableCell>
                                                                  <TableCell align="center" sx={{ height: 'auto', border: "1px solid黑" }}>
                                                                      <TableSortLabel
                                                                          active={dateOrderBy === 'date'}
                                                                          direction={dateOrderBy === 'date' ? orderDate : 'asc'}
                                                                          onClick={() => handleSortRequestDate('date')}
                                                                      >
                                                                          <Typography fontSize={20} >Last occurrence time</Typography>
                                                                      </TableSortLabel>
                                                                  </TableCell>
                                                                  <TableCell align="center" sx={{ height: 'auto', border: "1px solid黑" }}>
                                                                      <Typography fontSize={20}>Number of occurrences</Typography>
                                                                  </TableCell>
                                                              </TableRow>
                                                          </TableHead>
                                                          <TableBody>
                                                              {deviceData2.filter(columns => columns.frequency === "日預測").sort(getComparatorDate(orderDate)).map((columns) => (
                                                                  <TableRow key={columns.name}>
                                                                      <TableCell align="center" sx={{ height: 'auto', bgcolor: infoColor(columns.happened_times) }}>
                                                                          <Typography fontSize={20}>{columns.category}</Typography>
                                                                      </TableCell>
                                                                      <TableCell style={tableCellStyle.extendedCell} key={columns.id} align="center" sx={{ bgcolor: getColor(columns.steady) }}>
                                                                          <Typography fontSize={20}>{columns.steady === 0 ? "Stabilize" : "Abnormal"}</Typography>
                                                                      </TableCell>
                                                                      <TableCell align="center" sx={{ height: 'auto', bgcolor: infoColor(columns.happened_times) }}>
                                                                          <Typography fontSize={20}>{columns.name}</Typography>
                                                                      </TableCell>
                                                                      <TableCell align="center" sx={{ height: 'auto', bgcolor: infoColor(columns.happened_times) }}>
                                                                          <Typography fontSize={20}>{columns.happenLastTime}</Typography>
                                                                      </TableCell>
                                                                      <TableCell align="center" sx={{ height: 'auto', bgcolor: infoColor(columns.happened_times) }}>
                                                                          <Typography fontSize={20}>{columns.happened_times}</Typography>
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
                          })
                      ))}
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
      {globalVariable === "zh-tw" ? (
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
                        <Typography variant="h5" fontWeight="medium" mr={2} mt={2}>
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
                    <Grid container spacing={2} sx={{ mt: 1, ml: 6 }} component="form">
                      <Grid item>
                        <Typography variant="h5" fontWeight="medium" mr={2} mt={1} mb={1}>
                          線別:
                        </Typography>
                      </Grid>
                      <Grid item>
                        <FormControl>
                          <InputLabel>線別</InputLabel>
                          <Select
                            value={lineName}
                            label="線別"
                            onChange={projectLineNameChange}
                            style={{ minWidth: "271px", height: "56px" }}
                          >
                            <MenuItem value="">清空欄位</MenuItem>
                            {projectLineNameList.map((projectItem) => (
                              <MenuItem value={projectItem}>{projectItem}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>
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
                            {deviceNameList.map((device) => (
                              <MenuItem key={device} value={device}>{device}</MenuItem>
                            ))}
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
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', mr: '100px' }}>
              <LoadingButton variant="contained" color="info" onClick={togglePause}>
                {isPaused ? '恢復輪播' : '暫停輪播'}
              </LoadingButton>
              <Marquee msg={timeStampData} />
              <LoadingButton variant="contained" color="info" onClick={handleRefresh} style={{ display: 'flex', alignItems: 'center', marginLeft: '10px' }}>
                刷新
              </LoadingButton>
              <ColorBox msg="已發生過之異常事件"></ColorBox>
            </div>
          </Box>
          {createDeviceCardTW(dateData, dateData)}
        </>
      ) : globalVariable === "zh-cn" ? (
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
                        <Typography variant="h5" fontWeight="medium" mr={2} mt={2}>
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
                    <Grid container spacing={2} sx={{ mt: 1, ml: 6 }} component="form">
                      <Grid item>
                        <Typography variant="h5" fontWeight="medium" mr={2} mt={1} mb={1}>
                          线别:
                        </Typography>
                      </Grid>
                      <Grid item>
                        <FormControl>
                          <InputLabel id="operation-type-select-label">线别</InputLabel>
                          <Select
                            labelId="permission-select-label"
                            id="permission-select"
                            value={lineName}
                            label="线别"
                            onChange={projectLineNameChange}
                            style={{ minWidth: "271px", height: "56px" }}
                          >
                            <MenuItem value="">清空栏位</MenuItem>
                            {projectLineNameList.map((projectItem) => (
                              <MenuItem value={projectItem}>
                                {projectItem}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>
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
                            {deviceNameList.map((device) => (
                              <MenuItem key={device} value={device}>{device}</MenuItem>
                            ))}
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
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', mr: '100px' }}>
              <LoadingButton variant="contained" color="info" onClick={togglePause}>
                {isPaused ? '恢复轮播' : '暂停轮播'}
              </LoadingButton>
              <Marquee msg={timeStampData} />
              <LoadingButton variant="contained" color="info" onClick={handleRefresh} style={{ display: 'flex', alignItems: 'center', marginLeft: '10px' }}>
                刷新
              </LoadingButton>
              <ColorBox msg="已发生过之异常事件"></ColorBox>
            </div>
          </Box>
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
                        <Typography variant="h5" fontWeight="medium" mr={2} mt={2}>
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
                    <Grid container spacing={2} sx={{ mt: 1, ml: 6 }} component="form">
                      <Grid item>
                        <Typography variant="h5" fontWeight="medium" mr={2} mt={1} mb={1}>
                          Line:
                        </Typography>
                      </Grid>
                      <Grid item>
                        <FormControl>
                          <InputLabel id="operation-type-select-label">Line</InputLabel>
                          <Select
                            labelId="permission-select-label"
                            id="permission-select"
                            value={lineName}
                            label="Line"
                            onChange={projectLineNameChange}
                            style={{ minWidth: "271px", height: "56px" }}
                          >
                            <MenuItem value="">Clear field</MenuItem>
                            {projectLineNameList.map((projectItem) => (
                              <MenuItem value={projectItem}>
                                {projectItem}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>
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
                            {deviceNameList.map((device) => (
                              <MenuItem key={device} value={device}>{device}</MenuItem>
                            ))}
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
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', mr: '100px' }}>
              <LoadingButton variant="contained" color="info" onClick={togglePause}>
                {isPaused ? 'Resume carousel' : 'Pause carousel'}
              </LoadingButton>
              <Marquee msg={timeStampData} />
              <LoadingButton variant="contained" color="info" onClick={handleRefresh} style={{ display: 'flex', alignItems: 'center', marginLeft: '10px' }}>
                refresh
              </LoadingButton>
              <ColorBox msg="Abnormal events that have occurred"></ColorBox>
            </div>
          </Box>
          {createDeviceCardEN(dateData, dateData)}
        </>
      )
      }
    </ThemeProvider >
  );
}
