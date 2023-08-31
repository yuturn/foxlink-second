import React, { useState, useRef } from "react";
import { DataGrid } from '@mui/x-data-grid';
import {
  Box,
  Card,
  Grid,
  FormControl,
  InputLabel,
  CardHeader,
  Typography
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { BsFillCircleFill } from "react-icons/bs";

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

  function getCircleIcon(color) {
    if (color === "red") {
      return <RCircle />;
    } else if (color === "yellow") {
      return <YCircle />;
    } else if (color === "green") {
      return <GCircle />;
    } else {
      return null; // 或者返回一个默认的图标
    }
  }

  const RCircle = () => {
    return (
      <BsFillCircleFill style={{ color: 'red', fontSize: '30px' }} />
    );
  }
  const YCircle = () => {
    return (
      <BsFillCircleFill style={{ color: 'yellow', fontSize: '30px' }} />
    );
  }
  const GCircle = () => {
    return (
      <BsFillCircleFill style={{ color: 'green', fontSize: '30px' }} />
    );
  }

  function getCircleIcon(value) {
    if (value === 1) {
      return <RCircle />;
    } else if (value === 2) {
      return <YCircle />;
    } else if (value === 3) {
      return <GCircle />;
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
          value: 1
        },
        {
          id: 2,
          name: "tray盤站故障",
          value: 2
        },
        {
          id: 3,
          name: "UV檢測站故障",
          value: 3
        },
        {
          id: 4,
          name: "Glue異常",
          value: 3
        }
      ],
      "Devive6": [
        {
          id: 1,
          name: "1#插針定位氣缸故障",
          value: 3
        },
        {
          id: 2,
          name: "2#插針定位氣缸故障",
          value: 2
        },
        {
          id: 3,
          name: "2#插針站故障",
          value: 1
        },
        {
          id: 4,
          name: "主撥料站故障",
          value: 1
        },
        {
          id: 5,
          name: "出料撥料氣缸氣缸故障",
          value: 2
        },
        {
          id: 6,
          name: "出料翻轉氣缸氣缸故障",
          value: 3
        },
        {
          id: 7,
          name: "壓入檢測站故障",
          value: 2
        },
        {
          id: 8,
          name: "撥料上下1氣缸故障",
          value: 3
        },
        {
          id: 9,
          name: "撥料上下2氣缸故障",
          value: 3
        },
        {
          id: 10,
          name: "撥料上下3氣缸故障",
          value: 2
        },
        {
          id: 11,
          name: "撥料上下4氣缸故障",
          value: 3
        },
        {
          id: 12,
          name: "進料錯位氣缸故障",
          value: 2
        },
        {
          id: 13,
          name: "整形氣缸故障",
          value: 3
        },
        {
          id: 14,
          name: "House擋料氣缸故障",
          value: 3
        },
        {
          id: 15,
          name: "NG排料氣缸故障",
          value: 2
        },
        {
          id: 16,
          name: "軸7-2#送料馬達故障",
          value: 3
        },
        {
          id: 17,
          name: "Bush異常",
          value: 2
        }
      ],
      "Device8": [
        {
          id: 1,
          name: "出料撥爪橫移氣缸故障",
          value: 1
        },
        {
          id: 2,
          name: "出料站氣缸故障",
          value: 2
        },
        {
          id: 3,
          name: "出料翻轉氣缸故障",
          value: 3
        },
        {
          id: 4,
          name: "轉盤下料站故障",
          value: 3
        },
        {
          id: 5,
          name: "軸4-House旋轉馬達故障",
          value: 2
        },
        {
          id: 6,
          name: "軸5-House供料PP馬達故障",
          value: 1
        },
        {
          id: 7,
          name: "軸8-DD取料PP夾爪氣缸故障",
          value: 2
        },
        {
          id: 8,
          name: "軸10-出料搬送上下故障",
          value: 3
        },
        {
          id: 9,
          name: "DD取料PP夾爪氣缸故障",
          value: 3
        },
        {
          id: 10,
          name: "DD轉盤工位3壓入氣缸故障",
          value: 2
        },
        {
          id: 11,
          name: "DD轉盤站故障",
          value: 1
        },
        {
          id: 12,
          name: "house上料站故障",
          value: 2
        },
        {
          id: 13,
          name: "House供料PP夾爪氣缸故障",
          value: 3
        },
        {
          id: 14,
          name: "Shell異常",
          value: 3
        },
        {
          id: 15,
          name: "Shell尾料裁切氣缸故障",
          value: 2
        }
      ]
    }
  }

  const createDataTable = (data) => {
    return Object.keys(data).map((project) => (
      Object.keys(data[project]).map((device) => (
        <Card key={device} sx={{ mt: 2 }}>
          <Box sx={{ bgcolor: 'info.main' }}>
            <CardHeader title={project + "-" + device} color="#62aaf4" />
          </Box>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                {data[project][device].map((columns) => (
                  <TableCell key={columns.id} align="center">
                    {columns.name}
                  </TableCell>
                ))}
              </TableHead>
              <TableBody>
                {data[project][device].map((columns) => (
                  <TableCell key={columns.id} align="center">
                    {getCircleIcon(columns.value)}
                  </TableCell>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      ))
    ));
  };

  return (
    <ThemeProvider theme={darkTheme}>
      {createDataTable(columns)}
    </ThemeProvider>
  );
}