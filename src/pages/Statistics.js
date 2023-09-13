import React, { useState, useRef } from "react";
import { DataGrid } from '@mui/x-data-grid';
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
  palette
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { PieChart, pieArcLabelClasses } from '@mui/x-charts';
import Slider from "react-slick";

const darkTheme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#62aaf4',
      paper: '#e7f2fd',
    },
    text: {
      primary: '#000000',
    },
    primary: {
      // Purple and green play nicely together.
      main: '#2196f3',
    },
  },
});

export default function Statistics({ token, setAlert, ...rest }) {

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
    if (lightColor === 1) {
      return "red";
    } else if (lightColor === 2) {
      return "yellow";
    } else if (lightColor === 3) {
      return "green";
    } else if (lightColor === 4) {
      return "#4169e1";
    } else {
      return null; // 或者返回一个默认的图标
    }
  }

  function getPie(device) {
    if (device === "Device5") {
      return pieData;
    } else if (device === "Device6") {
      return pieData2;
    } else if (device === "Device8") {
      return pieData3;
    } else {
      return null; // 或者返回一个默认的图标
    }
  }

  const columns = {
    "d7x": {
      "Device5": [
        {
          id: 1,
          name: "料盤取材上下氣缸故障",
          lightColor: 1,
          value: 10,
          label: '異常增加'
        },
        {
          id: 2,
          name: "tray盤站故障",
          lightColor: 2,
          value: 10,
          label: '需注意'
        },
        {
          id: 3,
          name: "UV檢測站故障",
          lightColor: 3,
          value: 10,
          label: '穩定'
        },
        {
          id: 4,
          name: "Glue異常",
          lightColor: 4,
          value: 10,
          label: '事件減少'
        }
      ],
      "Device6": [
        {
          id: 1,
          name: "1#插針定位氣缸故障",
          lightColor: 3,
          value: 7,
          label: '穩定'
        },
        {
          id: 2,
          name: "2#插針定位氣缸故障",
          lightColor: 2,
          value: 7,
          label: '需注意'
        },
        {
          id: 3,
          name: "2#插針站故障",
          lightColor: 1,
          value: 2,
          label: '異常增加'
        },
        {
          id: 4,
          name: "主撥料站故障",
          lightColor: 1,
          value: 2,
          label: '異常增加'
        },
        {
          id: 5,
          name: "出料撥料氣缸氣缸故障",
          lightColor: 2,
          value: 7,
          label: '需注意'
        },
        {
          id: 6,
          name: "出料翻轉氣缸氣缸故障",
          lightColor: 3,
          value: 7,
          label: '穩定'
        },
        {
          id: 7,
          name: "壓入檢測站故障",
          lightColor: 2,
          value: 7,
          label: '需注意'
        },
        {
          id: 8,
          name: "撥料上下1氣缸故障",
          lightColor: 3,
          value: 7,
          label: '穩定'
        },
        {
          id: 9,
          name: "撥料上下2氣缸故障",
          lightColor: 3,
          value: 7,
          label: '穩定'
        },
        {
          id: 10,
          name: "撥料上下3氣缸故障",
          lightColor: 2,
          value: 7,
          label: '需注意'
        },
        {
          id: 11,
          name: "撥料上下4氣缸故障",
          lightColor: 3,
          value: 7,
          label: '穩定'
        },
        {
          id: 12,
          name: "進料錯位氣缸故障",
          lightColor: 2,
          value: 7,
          label: '需注意'
        },
        {
          id: 13,
          name: "整形氣缸故障",
          lightColor: 4,
          value: 1,
          label: '事件減少'
        },
        {
          id: 14,
          name: "House擋料氣缸故障",
          lightColor: 3,
          value: 7,
          label: '穩定'
        },
        {
          id: 15,
          name: "NG排料氣缸故障",
          lightColor: 2,
          value: 7,
          label: '需注意'
        },
        {
          id: 16,
          name: "軸7-2#送料馬達故障",
          lightColor: 3,
          value: 7,
          label: '穩定'
        },
        {
          id: 17,
          name: "Bush異常",
          lightColor: 2,
          value: 7,
          label: '需注意'
        }
      ],
      "Device8": [
        {
          id: 1,
          name: "出料撥爪橫移氣缸故障",
          lightColor: 1,
          value: 2,
          label: '異常增加'
        },
        {
          id: 2,
          name: "出料站氣缸故障",
          lightColor: 2,
          value: 7,
          label: '需注意'
        },
        {
          id: 3,
          name: "出料翻轉氣缸故障",
          lightColor: 3,
          value: 7,
          label: '穩定'
        },
        {
          id: 4,
          name: "轉盤下料站故障",
          lightColor: 3,
          value: 7,
          label: '穩定'
        },
        {
          id: 5,
          name: "軸4-House旋轉馬達故障",
          lightColor: 4,
          value: 1,
          label: '事件減少'
        },
        {
          id: 6,
          name: "軸5-House供料PP馬達故障",
          lightColor: 1,
          value: 2,
          label: '異常增加'
        },
        {
          id: 7,
          name: "軸8-DD取料PP夾爪氣缸故障",
          lightColor: 2,
          value: 7,
          label: '需注意'
        },
        {
          id: 8,
          name: "軸10-出料搬送上下故障",
          lightColor: 3,
          value: 7,
          label: '穩定'
        },
        {
          id: 9,
          name: "DD取料PP夾爪氣缸故障",
          lightColor: 3,
          value: 7,
          label: '穩定'
        },
        {
          id: 10,
          name: "DD轉盤工位3壓入氣缸故障",
          lightColor: 2,
          value: 7,
          label: '需注意'
        },
        {
          id: 11,
          name: "DD轉盤站故障",
          lightColor: 1,
          value: 2,
          label: '異常增加'
        },
        {
          id: 12,
          name: "house上料站故障",
          lightColor: 2,
          value: 7,
          label: '需注意'
        },
        {
          id: 13,
          name: "House供料PP夾爪氣缸故障",
          lightColor: 3,
          value: 7,
          label: '穩定'
        },
        {
          id: 14,
          name: "Shell異常",
          lightColor: 3,
          value: 7,
          label: '穩定'
        },
        {
          id: 15,
          name: "Shell尾料裁切氣缸故障",
          lightColor: 4,
          value: 1,
          label: '事件減少'
        }
      ]
    }
  }

  const pieData = [
    { value: 1, label: '異常增加' },
    { value: 1, label: '需注意' },
    { value: 1, label: '穩定' },
    { value: 1, label: '事件減少' },
  ];
  const pieData2 = [
    { value: 11, label: '異常增加' },
    { value: 8, label: '需注意' },
    { value: 5, label: '穩定' },
    { value: 17, label: '事件減少' },
  ];
  const pieData3 = [
    { value: 6, label: '異常增加' },
    { value: 10, label: '需注意' },
    { value: 14, label: '穩定' },
    { value: 4, label: '事件減少' },
  ];
  const size = {
    width: 400,
    height: 200,
  };


  // const createDeviceCard = (data) => {
  //   return Object.keys(data).map((project) => (
  //     Object.keys(data[project]).map((device) => (
  //       <div>
  //         <Card key={device} sx={{ mt: 2 }}>
  //           <Box sx={{ bgcolor: 'info.main' }}>
  //             <CardHeader title={project + "-" + device} color="#62aaf4" align="center" />
  //           </Box>
  //           <TableContainer component={Paper}>
  //             <Grid container spacing={2}>
  //               <Grid xs={3}>
  //                 <Box border={1} sx={{ mt: 4, ml: 6, width: 120, height: 'auto' }}>
  //                   <Typography align="center" fontSize={25}>異常增加</Typography>
  //                   <Box sx={{ bgcolor: 'red', width: 'auto', height: 'auto' }}>
  //                     <Typography align="center" fontSize={20}>lightColor</Typography>
  //                   </Box>
  //                 </Box>
  //                 <Box border={1} sx={{ mt: 4, ml: 6, width: 118, height: 'auto' }}>
  //                   <Typography align="center" fontSize={25}>需注意</Typography>
  //                   <Box sx={{ bgcolor: 'yellow', width: 'auto', height: 'auto' }}>
  //                     <Typography align="center" fontSize={20}>lightColor</Typography>
  //                   </Box>
  //                 </Box>
  //                 <Box border={1} sx={{ mt: 4, ml: 6, width: 118, height: 'auto' }}>
  //                   <Typography align="center" fontSize={25}>穩定</Typography>
  //                   <Box sx={{ bgcolor: 'green', width: 'auto', height: 'auto' }}>
  //                     <Typography align="center" fontSize={20}>lightColor</Typography>
  //                   </Box>
  //                 </Box>
  //                 <Box border={1} sx={{ mt: 4, ml: 6, width: 118, height: 'auto' }}>
  //                   <Typography align="center" fontSize={25}>事件減少</Typography>
  //                   <Box sx={{ bgcolor: '#4169e1', width: 'auto', height: 'auto' }}>
  //                     <Typography align="center" fontSize={20}>lightColor</Typography>
  //                   </Box>
  //                 </Box>
  //               </Grid>
  //               <Grid xs={9}>
  //                 <Box sx={{ mt: 16 }}>
  //                   <PieChart
  //                     colors={['red', 'yellow', 'green', '#4169e1']}
  //                     series={[
  //                       {
  //                         arcLabel: (item) => `${item.label} (${item.value})`,
  //                         arcLabelMinAngle: 50,
  //                         data: getPie(device),
  //                       },
  //                     ]}
  //                     sx={{
  //                       [`& .${pieArcLabelClasses.root}`]: {
  //                         fill: 'default',
  //                         fontWeight: 'bold',
  //                       },
  //                     }}
  //                     width={600}
  //                     height={300}
  //                   />
  //                 </Box>
  //               </Grid>
  //             </Grid>
  //             <Divider
  //               sx={{
  //                 borderColor: '#2D3748',
  //                 my: 3,
  //                 height: 1.5
  //               }}
  //             />
  //             <Table sx={{ minWidth: 650 }}>
  //               <TableHead style={{ backgroundColor: '#2196f3', color: 'white' }}>
  //                 <TableCell align="left" sx={{ width: 50 }}><Typography fontSize={20}>類型</Typography></TableCell>
  //                 <TableCell align="left" sx={{ mr: 20 }}><Typography fontSize={20}>事件</Typography></TableCell>
  //               </TableHead>
  //               <TableBody>
  //                 {data[project][device].map((columns) => (
  //                   <TableRow
  //                     key={columns.name}
  //                   >
  //                     <TableCell key={columns.id} align="center">
  //                       <Grid container spacing={1}>
  //                         <Grid xs={9}>
  //                           <Box align="center" sx={{ bgcolor: getColor(columns.lightColor), width: 100, height: 'auto' }}>
  //                             <Typography fontSize={20}>{columns.label}</Typography>
  //                           </Box>
  //                         </Grid>
  //                         <Grid xs={3}>
  //                           <Box align="left" sx={{ width: 400, height: 'auto', ml: 20 }}>
  //                             <Typography fontSize={20}>{columns.name}</Typography>
  //                           </Box>
  //                         </Grid>
  //                       </Grid>
  //                     </TableCell>
  //                   </TableRow>
  //                 ))}
  //               </TableBody>
  //             </Table>
  //           </TableContainer>
  //         </Card>
  //       </div>
  //     ))
  //   ));
  // };

  const [nav1, setNav1] = useState();
  const [nav2, setNav2] = useState();
  const slider1 = useRef();
  const slider2 = useRef();

  return (
    <ThemeProvider theme={darkTheme}>
      {/* {createDeviceCard(columns)} */}
      <div style={{ padding: "0 30px", background: "#ccc" }}>
        <Slider
          asNavFor={nav2}
          ref={slider1 => setNav2(slider1)}
        >
          <div>
            <h3>1</h3>
          </div>
          <div>
            <h3>2</h3>
          </div>
          <div>
            <h3>3</h3>
          </div>
          <div>
            <h3>4</h3>
          </div>
          <div>
            <h3>5</h3>
          </div>
          <div>
            <h3>6</h3>
          </div>
        </Slider>
      </div>
    </ThemeProvider>
  );
}