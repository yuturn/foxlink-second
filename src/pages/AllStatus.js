import React, { useState, useRef, useEffect } from "react";
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

export default function Statistics({ token, setAlert, ...rest }) {
    const [orderWeek, setOrderWeek] = useState('asc');
    const [weekOrderBy, setWeekOrderBy] = useState('label');

    const [orderDate, setOrder] = useState('asc');
    const [dateOrderBy, setDateOrderBy] = useState('label');

    const [isPaused, setIsPaused] = useState(false);

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

    function getColor(lightColor) {
        if (lightColor === 1) {
            return "#C5291C";
        } else if (lightColor === 2) {
            return "#4CA85A";
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
        } else if (device === "Device15") {
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
                    value: 2,
                    label: '異常',
                    date: '2022/01/02 15:00',
                    frequency: '週預測'
                },
                {
                    id: 2,
                    name: "tray盤站故障",
                    lightColor: 1,
                    value: 2,
                    label: '異常',
                    date: '2022/09/26 10:30',
                    frequency: '週預測'
                },
                {
                    id: 3,
                    name: "UV檢測站故障",
                    lightColor: 2,
                    value: 2,
                    label: '非異常',
                    date: '2022/01/02 15:00',
                    frequency: '日預測'
                },
                {
                    id: 4,
                    name: "Glue異常",
                    lightColor: 2,
                    value: 2,
                    label: '非異常',
                    date: '2022/11/15 22:30',
                    frequency: '週預測'
                }
            ],
            "Device6": [
                {
                    id: 1,
                    name: "1#插針定位氣缸故障",
                    lightColor: 2,
                    value: 7,
                    label: '非異常',
                    date: '2022/11/15 22:30',
                    frequency: '週預測'
                },
                {
                    id: 2,
                    name: "2#插針定位氣缸故障",
                    lightColor: 1,
                    value: 7,
                    label: '異常',
                    date: '2022/01/02 15:00',
                    frequency: '日預測'
                },
                {
                    id: 3,
                    name: "2#插針站故障",
                    lightColor: 1,
                    value: 2,
                    label: '異常',
                    date: '2022/11/15 22:30',
                    frequency: '週預測'
                },
                {
                    id: 4,
                    name: "主撥料站故障",
                    lightColor: 1,
                    value: 2,
                    label: '異常',
                    date: '2022/04/02 14:00',
                    frequency: '日預測'
                },
                {
                    id: 5,
                    name: "出料撥料氣缸氣缸故障",
                    lightColor: 1,
                    value: 7,
                    label: '異常',
                    date: '2022/05/23 15:00',
                    frequency: '日預測'
                },
                {
                    id: 6,
                    name: "出料翻轉氣缸氣缸故障",
                    lightColor: 2,
                    value: 7,
                    label: '非異常',
                    date: '2022/11/15 22:30',
                    frequency: '週預測'
                },
                {
                    id: 7,
                    name: "壓入檢測站故障",
                    lightColor: 1,
                    value: 7,
                    label: '異常',
                    date: '2022/02/05 18:00',
                    frequency: '週預測'
                },
                {
                    id: 8,
                    name: "撥料上下1氣缸故障",
                    lightColor: 2,
                    value: 7,
                    label: '非異常',
                    date: '2022/08/17 08:30',
                    frequency: '週預測'
                },
                {
                    id: 9,
                    name: "撥料上下2氣缸故障",
                    lightColor: 2,
                    value: 7,
                    label: '非異常',
                    date: '2022/02/05 18:00',
                    frequency: '週預測'
                },
                {
                    id: 10,
                    name: "撥料上下3氣缸故障",
                    lightColor: 1,
                    value: 7,
                    label: '異常',
                    date: '2022/02/05 18:00',
                    frequency: '週預測'
                },
                {
                    id: 11,
                    name: "撥料上下4氣缸故障",
                    lightColor: 2,
                    value: 7,
                    label: '非異常',
                    date: '2022/02/05 18:00',
                    frequency: '週預測'
                },
                {
                    id: 12,
                    name: "進料錯位氣缸故障",
                    lightColor: 1,
                    value: 7,
                    label: '異常',
                    date: '2022/02/05 18:00',
                    frequency: '週預測'
                },
                {
                    id: 13,
                    name: "整形氣缸故障",
                    lightColor: 2,
                    value: 1,
                    label: '非異常',
                    date: '2022/12/13 18:12',
                    frequency: '週預測'
                },
                {
                    id: 14,
                    name: "House擋料氣缸故障",
                    lightColor: 2,
                    value: 7,
                    label: '非異常',
                    date: '2022/02/05 18:00',
                    frequency: '週預測'
                },
                {
                    id: 15,
                    name: "NG排料氣缸故障",
                    lightColor: 1,
                    value: 7,
                    label: '異常',
                    date: '2022/02/05 18:00',
                    frequency: '週預測'
                },
                {
                    id: 16,
                    name: "軸7-2#送料馬達故障",
                    lightColor: 2,
                    value: 7,
                    label: '非異常',
                    date: '2022/02/05 18:00',
                    frequency: '週預測'
                },
                {
                    id: 17,
                    name: "Bush異常",
                    lightColor: 1,
                    value: 7,
                    label: '異常',
                    date: '2022/02/05 18:00',
                    frequency: '週預測'
                }
            ],
            "Device8": [
                {
                    id: 1,
                    name: "出料撥爪橫移氣缸故障",
                    lightColor: 1,
                    value: 2,
                    label: '異常',
                    date: '2022/04/24 06:00',
                    frequency: '日預測'
                },
                {
                    id: 2,
                    name: "出料站氣缸故障",
                    lightColor: 1,
                    value: 7,
                    label: '異常',
                    date: '2022/02/05 18:00',
                    frequency: '週預測'
                },
                {
                    id: 3,
                    name: "出料翻轉氣缸故障",
                    lightColor: 2,
                    value: 7,
                    label: '非異常',
                    date: '2022/04/24 06:00',
                    frequency: '日預測'
                },
                {
                    id: 4,
                    name: "轉盤下料站故障",
                    lightColor: 2,
                    value: 7,
                    label: '非異常',
                    date: '2022/02/05 18:00',
                    frequency: '週預測'
                },
                {
                    id: 5,
                    name: "軸4-House旋轉馬達故障",
                    lightColor: 2,
                    value: 1,
                    label: '非異常',
                    date: '2022/02/05 18:00',
                    frequency: '週預測'
                },
                {
                    id: 6,
                    name: "軸5-House供料PP馬達故障",
                    lightColor: 1,
                    value: 2,
                    label: '異常',
                    date: '2022/02/05 18:00',
                    frequency: '週預測'
                },
                {
                    id: 7,
                    name: "軸8-DD取料PP夾爪氣缸故障",
                    lightColor: 1,
                    value: 7,
                    label: '異常',
                    date: '2022/02/05 18:00',
                    frequency: '週預測'
                },
                {
                    id: 8,
                    name: "軸10-出料搬送上下故障",
                    lightColor: 2,
                    value: 7,
                    label: '非異常',
                    date: '2022/02/05 18:00',
                    frequency: '週預測'
                },
                {
                    id: 9,
                    name: "DD取料PP夾爪氣缸故障",
                    lightColor: 2,
                    value: 7,
                    label: '非異常',
                    date: '2022/02/05 18:00',
                    frequency: '週預測'
                },
                {
                    id: 10,
                    name: "DD轉盤工位3壓入氣缸故障",
                    lightColor: 1,
                    value: 7,
                    label: '異常',
                    date: '2022/04/24 06:00',
                    frequency: '日預測'
                },
                {
                    id: 11,
                    name: "DD轉盤站故障",
                    lightColor: 1,
                    value: 2,
                    label: '異常',
                    date: '2022/02/05 18:00',
                    frequency: '週預測'
                },
                {
                    id: 12,
                    name: "house上料站故障",
                    lightColor: 1,
                    value: 7,
                    label: '異常',
                    date: '2022/12/12 12:00',
                    frequency: '週預測'
                },
                {
                    id: 13,
                    name: "House供料PP夾爪氣缸故障",
                    lightColor: 2,
                    value: 7,
                    label: '非異常',
                    date: '2022/10/10 10:00',
                    frequency: '週預測'
                },
                {
                    id: 14,
                    name: "Shell異常",
                    lightColor: 2,
                    value: 7,
                    label: '非異常',
                    date: '2022/04/24 06:00',
                    frequency: '日預測'
                },
                {
                    id: 15,
                    name: "Shell尾料裁切氣缸故障",
                    lightColor: 2,
                    value: 1,
                    label: '非異常',
                    date: '2022/02/15 12:15',
                    frequency: '週預測'
                }
            ]
        },
        "d1x": {
            "Device5": [
                {
                    id: 1,
                    name: "料盤取材上下氣缸故障",
                    lightColor: 1,
                    value: 10,
                    label: '異常',
                    date: '2022/01/02 15:00',
                    frequency: '週預測'
                },
                {
                    id: 2,
                    name: "tray盤站故障",
                    lightColor: 1,
                    value: 10,
                    label: '異常',
                    date: '2022/09/26 10:30',
                    frequency: '週預測'
                },
                {
                    id: 3,
                    name: "UV檢測站故障",
                    lightColor: 2,
                    value: 10,
                    label: '非異常',
                    date: '2022/01/02 15:00',
                    frequency: '日預測'
                },
                {
                    id: 4,
                    name: "Glue異常",
                    lightColor: 2,
                    value: 10,
                    label: '非異常',
                    date: '2022/11/15 22:30',
                    frequency: '週預測'
                }
            ],
            "Device6": [
                {
                    id: 1,
                    name: "1#插針定位氣缸故障",
                    lightColor: 2,
                    value: 7,
                    label: '非異常',
                    date: '2022/11/15 22:30',
                    frequency: '週預測'
                },
                {
                    id: 2,
                    name: "2#插針定位氣缸故障",
                    lightColor: 1,
                    value: 7,
                    label: '異常',
                    date: '2022/01/02 15:00',
                    frequency: '日預測'
                },
                {
                    id: 3,
                    name: "2#插針站故障",
                    lightColor: 1,
                    value: 2,
                    label: '異常',
                    date: '2022/11/15 22:30',
                    frequency: '週預測'
                },
                {
                    id: 4,
                    name: "主撥料站故障",
                    lightColor: 1,
                    value: 2,
                    label: '異常',
                    date: '2022/04/02 14:00',
                    frequency: '日預測'
                },
                {
                    id: 5,
                    name: "出料撥料氣缸氣缸故障",
                    lightColor: 1,
                    value: 7,
                    label: '異常',
                    date: '2022/05/23 15:00',
                    frequency: '日預測'
                },
                {
                    id: 6,
                    name: "出料翻轉氣缸氣缸故障",
                    lightColor: 2,
                    value: 7,
                    label: '非異常',
                    date: '2022/11/15 22:30',
                    frequency: '週預測'
                },
                {
                    id: 7,
                    name: "壓入檢測站故障",
                    lightColor: 1,
                    value: 7,
                    label: '異常',
                    date: '2022/02/05 18:00',
                    frequency: '週預測'
                },
                {
                    id: 8,
                    name: "撥料上下1氣缸故障",
                    lightColor: 2,
                    value: 7,
                    label: '非異常',
                    date: '2022/08/17 08:30',
                    frequency: '週預測'
                },
                {
                    id: 9,
                    name: "撥料上下2氣缸故障",
                    lightColor: 2,
                    value: 7,
                    label: '非異常',
                    date: '2022/02/05 18:00',
                    frequency: '週預測'
                },
                {
                    id: 10,
                    name: "撥料上下3氣缸故障",
                    lightColor: 1,
                    value: 7,
                    label: '異常',
                    date: '2022/02/05 18:00',
                    frequency: '週預測'
                },
                {
                    id: 11,
                    name: "撥料上下4氣缸故障",
                    lightColor: 2,
                    value: 7,
                    label: '非異常',
                    date: '2022/02/05 18:00',
                    frequency: '週預測'
                },
                {
                    id: 12,
                    name: "進料錯位氣缸故障",
                    lightColor: 1,
                    value: 7,
                    label: '異常',
                    date: '2022/02/05 18:00',
                    frequency: '週預測'
                },
                {
                    id: 13,
                    name: "整形氣缸故障",
                    lightColor: 2,
                    value: 1,
                    label: '非異常',
                    date: '2022/12/13 18:12',
                    frequency: '週預測'
                },
                {
                    id: 14,
                    name: "House擋料氣缸故障",
                    lightColor: 2,
                    value: 7,
                    label: '非異常',
                    date: '2022/02/05 18:00',
                    frequency: '週預測'
                },
                {
                    id: 15,
                    name: "NG排料氣缸故障",
                    lightColor: 1,
                    value: 7,
                    label: '異常',
                    date: '2022/02/05 18:00',
                    frequency: '週預測'
                },
                {
                    id: 16,
                    name: "軸7-2#送料馬達故障",
                    lightColor: 2,
                    value: 7,
                    label: '非異常',
                    date: '2022/02/05 18:00',
                    frequency: '週預測'
                },
                {
                    id: 17,
                    name: "Bush異常",
                    lightColor: 1,
                    value: 7,
                    label: '異常',
                    date: '2022/02/05 18:00',
                    frequency: '週預測'
                }
            ],
            "Device8": [
                {
                    id: 1,
                    name: "出料撥爪橫移氣缸故障",
                    lightColor: 1,
                    value: 2,
                    label: '異常',
                    date: '2022/04/24 06:00',
                    frequency: '日預測'
                },
                {
                    id: 2,
                    name: "出料站氣缸故障",
                    lightColor: 1,
                    value: 7,
                    label: '異常',
                    date: '2022/02/05 18:00',
                    frequency: '週預測'
                },
                {
                    id: 3,
                    name: "出料翻轉氣缸故障",
                    lightColor: 2,
                    value: 7,
                    label: '非異常',
                    date: '2022/04/24 06:00',
                    frequency: '日預測'
                },
                {
                    id: 4,
                    name: "轉盤下料站故障",
                    lightColor: 2,
                    value: 7,
                    label: '非異常',
                    date: '2022/02/05 18:00',
                    frequency: '週預測'
                },
                {
                    id: 5,
                    name: "軸4-House旋轉馬達故障",
                    lightColor: 2,
                    value: 1,
                    label: '非異常',
                    date: '2022/02/05 18:00',
                    frequency: '週預測'
                },
                {
                    id: 6,
                    name: "軸5-House供料PP馬達故障",
                    lightColor: 1,
                    value: 2,
                    label: '異常',
                    date: '2022/02/05 18:00',
                    frequency: '週預測'
                },
                {
                    id: 7,
                    name: "軸8-DD取料PP夾爪氣缸故障",
                    lightColor: 1,
                    value: 7,
                    label: '異常',
                    date: '2022/02/05 18:00',
                    frequency: '週預測'
                },
                {
                    id: 8,
                    name: "軸10-出料搬送上下故障",
                    lightColor: 2,
                    value: 7,
                    label: '非異常',
                    date: '2022/02/05 18:00',
                    frequency: '週預測'
                },
                {
                    id: 9,
                    name: "DD取料PP夾爪氣缸故障",
                    lightColor: 2,
                    value: 7,
                    label: '非異常',
                    date: '2022/02/05 18:00',
                    frequency: '週預測'
                },
                {
                    id: 10,
                    name: "DD轉盤工位3壓入氣缸故障",
                    lightColor: 1,
                    value: 7,
                    label: '異常',
                    date: '2022/04/24 06:00',
                    frequency: '日預測'
                },
                {
                    id: 11,
                    name: "DD轉盤站故障",
                    lightColor: 1,
                    value: 2,
                    label: '異常',
                    date: '2022/02/05 18:00',
                    frequency: '週預測'
                },
                {
                    id: 12,
                    name: "house上料站故障",
                    lightColor: 1,
                    value: 7,
                    label: '異常',
                    date: '2022/12/12 12:00',
                    frequency: '週預測'
                },
                {
                    id: 13,
                    name: "House供料PP夾爪氣缸故障",
                    lightColor: 2,
                    value: 7,
                    label: '非異常',
                    date: '2022/10/10 10:00',
                    frequency: '週預測'
                },
                {
                    id: 14,
                    name: "Shell異常",
                    lightColor: 2,
                    value: 7,
                    label: '非異常',
                    date: '2022/04/24 06:00',
                    frequency: '日預測'
                },
                {
                    id: 15,
                    name: "Shell尾料裁切氣缸故障",
                    lightColor: 2,
                    value: 1,
                    label: '非異常',
                    date: '2022/02/15 12:15',
                    frequency: '週預測'
                }
            ],
            "Device15": [
                {
                    id: 1,
                    name: "1#插針定位氣缸故障",
                    lightColor: 2,
                    value: 7,
                    label: '非異常',
                    date: '2022/11/15 22:30',
                    frequency: '週預測'
                },
                {
                    id: 2,
                    name: "2#插針定位氣缸故障",
                    lightColor: 1,
                    value: 7,
                    label: '異常',
                    date: '2022/01/02 15:00',
                    frequency: '日預測'
                },
                {
                    id: 3,
                    name: "2#插針站故障",
                    lightColor: 1,
                    value: 2,
                    label: '異常',
                    date: '2022/11/15 22:30',
                    frequency: '週預測'
                },
                {
                    id: 4,
                    name: "主撥料站故障",
                    lightColor: 1,
                    value: 2,
                    label: '異常',
                    date: '2022/04/02 14:00',
                    frequency: '日預測'
                },
                {
                    id: 5,
                    name: "出料撥料氣缸氣缸故障",
                    lightColor: 1,
                    value: 7,
                    label: '異常',
                    date: '2022/05/23 15:00',
                    frequency: '日預測'
                },
                {
                    id: 6,
                    name: "出料翻轉氣缸氣缸故障",
                    lightColor: 2,
                    value: 7,
                    label: '非異常',
                    date: '2022/11/15 22:30',
                    frequency: '週預測'
                },
                {
                    id: 7,
                    name: "壓入檢測站故障",
                    lightColor: 1,
                    value: 7,
                    label: '異常',
                    date: '2022/02/05 18:00',
                    frequency: '週預測'
                },
                {
                    id: 8,
                    name: "撥料上下1氣缸故障",
                    lightColor: 2,
                    value: 7,
                    label: '非異常',
                    date: '2022/08/17 08:30',
                    frequency: '週預測'
                },
                {
                    id: 9,
                    name: "撥料上下2氣缸故障",
                    lightColor: 2,
                    value: 7,
                    label: '非異常',
                    date: '2022/02/05 18:00',
                    frequency: '週預測'
                },
                {
                    id: 10,
                    name: "撥料上下3氣缸故障",
                    lightColor: 1,
                    value: 7,
                    label: '異常',
                    date: '2022/02/05 18:00',
                    frequency: '週預測'
                },
                {
                    id: 11,
                    name: "撥料上下4氣缸故障",
                    lightColor: 2,
                    value: 7,
                    label: '非異常',
                    date: '2022/02/05 18:00',
                    frequency: '週預測'
                },
                {
                    id: 12,
                    name: "進料錯位氣缸故障",
                    lightColor: 1,
                    value: 7,
                    label: '異常',
                    date: '2022/02/05 18:00',
                    frequency: '週預測'
                },
                {
                    id: 13,
                    name: "整形氣缸故障",
                    lightColor: 2,
                    value: 1,
                    label: '非異常',
                    date: '2022/12/13 18:12',
                    frequency: '週預測'
                },
                {
                    id: 14,
                    name: "House擋料氣缸故障",
                    lightColor: 2,
                    value: 7,
                    label: '非異常',
                    date: '2022/02/05 18:00',
                    frequency: '週預測'
                },
                {
                    id: 15,
                    name: "NG排料氣缸故障",
                    lightColor: 1,
                    value: 7,
                    label: '異常',
                    date: '2022/02/05 18:00',
                    frequency: '週預測'
                },
                {
                    id: 16,
                    name: "軸7-2#送料馬達故障",
                    lightColor: 2,
                    value: 7,
                    label: '非異常',
                    date: '2022/02/05 18:00',
                    frequency: '週預測'
                },
                {
                    id: 17,
                    name: "Bush異常",
                    lightColor: 1,
                    value: 7,
                    label: '異常',
                    date: '2022/02/05 18:00',
                    frequency: '週預測'
                }
            ],
        },
    }

    const columns2 = {
        "d7x": {
            "Device5": [
                {
                    id: 1,
                    name: "料盤取材上下氣缸故障",
                    lightColor: 1,
                    value: 10,
                    label: '異常',
                    date: '2022/01/02 15:00',
                    frequency: '週預測'
                },
                {
                    id: 2,
                    name: "tray盤站故障",
                    lightColor: 1,
                    value: 10,
                    label: '異常',
                    date: '2022/09/26 10:30',
                    frequency: '週預測'
                },
                {
                    id: 3,
                    name: "UV檢測站故障",
                    lightColor: 2,
                    value: 10,
                    label: '非異常',
                    date: '2022/01/02 15:00',
                    frequency: '日預測'
                },
                {
                    id: 4,
                    name: "Glue異常",
                    lightColor: 2,
                    value: 10,
                    label: '非異常',
                    date: '2022/11/15 22:30',
                    frequency: '週預測'
                }
            ],
            "Device6": [
                {
                    id: 1,
                    name: "1#插針定位氣缸故障",
                    lightColor: 2,
                    value: 7,
                    label: '非異常',
                    date: '2022/11/15 22:30',
                    frequency: '週預測'
                },
                {
                    id: 2,
                    name: "2#插針定位氣缸故障",
                    lightColor: 1,
                    value: 7,
                    label: '異常',
                    date: '2022/01/02 15:00',
                    frequency: '日預測'
                },
                {
                    id: 3,
                    name: "2#插針站故障",
                    lightColor: 1,
                    value: 2,
                    label: '異常',
                    date: '2022/11/15 22:30',
                    frequency: '週預測'
                },
                {
                    id: 4,
                    name: "主撥料站故障",
                    lightColor: 1,
                    value: 2,
                    label: '異常',
                    date: '2022/04/02 14:00',
                    frequency: '日預測'
                },
                {
                    id: 5,
                    name: "出料撥料氣缸氣缸故障",
                    lightColor: 1,
                    value: 7,
                    label: '異常',
                    date: '2022/05/23 15:00',
                    frequency: '日預測'
                },
                {
                    id: 6,
                    name: "出料翻轉氣缸氣缸故障",
                    lightColor: 2,
                    value: 7,
                    label: '非異常',
                    date: '2022/11/15 22:30',
                    frequency: '週預測'
                },
                {
                    id: 7,
                    name: "壓入檢測站故障",
                    lightColor: 1,
                    value: 7,
                    label: '異常',
                    date: '2022/02/05 18:00',
                    frequency: '週預測'
                },
                {
                    id: 8,
                    name: "撥料上下1氣缸故障",
                    lightColor: 2,
                    value: 7,
                    label: '非異常',
                    date: '2022/08/17 08:30',
                    frequency: '週預測'
                },
                {
                    id: 9,
                    name: "撥料上下2氣缸故障",
                    lightColor: 2,
                    value: 7,
                    label: '非異常',
                    date: '2022/02/05 18:00',
                    frequency: '週預測'
                },
                {
                    id: 10,
                    name: "撥料上下3氣缸故障",
                    lightColor: 1,
                    value: 7,
                    label: '異常',
                    date: '2022/02/05 18:00',
                    frequency: '週預測'
                },
                {
                    id: 11,
                    name: "撥料上下4氣缸故障",
                    lightColor: 2,
                    value: 7,
                    label: '非異常',
                    date: '2022/02/05 18:00',
                    frequency: '週預測'
                },
                {
                    id: 12,
                    name: "進料錯位氣缸故障",
                    lightColor: 1,
                    value: 7,
                    label: '異常',
                    date: '2022/02/05 18:00',
                    frequency: '週預測'
                },
                {
                    id: 13,
                    name: "整形氣缸故障",
                    lightColor: 2,
                    value: 1,
                    label: '非異常',
                    date: '2022/12/13 18:12',
                    frequency: '週預測'
                },
                {
                    id: 14,
                    name: "House擋料氣缸故障",
                    lightColor: 2,
                    value: 7,
                    label: '非異常',
                    date: '2022/02/05 18:00',
                    frequency: '週預測'
                },
                {
                    id: 15,
                    name: "NG排料氣缸故障",
                    lightColor: 1,
                    value: 7,
                    label: '異常',
                    date: '2022/02/05 18:00',
                    frequency: '週預測'
                },
                {
                    id: 16,
                    name: "軸7-2#送料馬達故障",
                    lightColor: 2,
                    value: 7,
                    label: '非異常',
                    date: '2022/02/05 18:00',
                    frequency: '週預測'
                },
                {
                    id: 17,
                    name: "Bush異常",
                    lightColor: 1,
                    value: 7,
                    label: '異常',
                    date: '2022/02/05 18:00',
                    frequency: '週預測'
                }
            ],
            "Device8": [
                {
                    id: 1,
                    name: "出料撥爪橫移氣缸故障",
                    lightColor: 1,
                    value: 2,
                    label: '異常',
                    date: '2022/04/24 06:00',
                    frequency: '日預測'
                },
                {
                    id: 2,
                    name: "出料站氣缸故障",
                    lightColor: 1,
                    value: 7,
                    label: '異常',
                    date: '2022/02/05 18:00',
                    frequency: '週預測'
                },
                {
                    id: 3,
                    name: "出料翻轉氣缸故障",
                    lightColor: 2,
                    value: 7,
                    label: '非異常',
                    date: '2022/04/24 06:00',
                    frequency: '日預測'
                },
                {
                    id: 4,
                    name: "轉盤下料站故障",
                    lightColor: 2,
                    value: 7,
                    label: '非異常',
                    date: '2022/02/05 18:00',
                    frequency: '週預測'
                },
                {
                    id: 5,
                    name: "軸4-House旋轉馬達故障",
                    lightColor: 2,
                    value: 1,
                    label: '非異常',
                    date: '2022/02/05 18:00',
                    frequency: '週預測'
                },
                {
                    id: 6,
                    name: "軸5-House供料PP馬達故障",
                    lightColor: 1,
                    value: 2,
                    label: '異常',
                    date: '2022/02/05 18:00',
                    frequency: '週預測'
                },
                {
                    id: 7,
                    name: "軸8-DD取料PP夾爪氣缸故障",
                    lightColor: 1,
                    value: 7,
                    label: '異常',
                    date: '2022/02/05 18:00',
                    frequency: '週預測'
                },
                {
                    id: 8,
                    name: "軸10-出料搬送上下故障",
                    lightColor: 2,
                    value: 7,
                    label: '非異常',
                    date: '2022/02/05 18:00',
                    frequency: '週預測'
                },
                {
                    id: 9,
                    name: "DD取料PP夾爪氣缸故障",
                    lightColor: 2,
                    value: 7,
                    label: '非異常',
                    date: '2022/02/05 18:00',
                    frequency: '週預測'
                },
                {
                    id: 10,
                    name: "DD轉盤工位3壓入氣缸故障",
                    lightColor: 1,
                    value: 7,
                    label: '異常',
                    date: '2022/04/24 06:00',
                    frequency: '日預測'
                },
                {
                    id: 11,
                    name: "DD轉盤站故障",
                    lightColor: 1,
                    value: 2,
                    label: '異常',
                    date: '2022/02/05 18:00',
                    frequency: '週預測'
                },
                {
                    id: 12,
                    name: "house上料站故障",
                    lightColor: 1,
                    value: 7,
                    label: '異常',
                    date: '2022/12/12 12:00',
                    frequency: '週預測'
                },
                {
                    id: 13,
                    name: "House供料PP夾爪氣缸故障",
                    lightColor: 2,
                    value: 7,
                    label: '非異常',
                    date: '2022/10/10 10:00',
                    frequency: '週預測'
                },
                {
                    id: 14,
                    name: "Shell異常",
                    lightColor: 2,
                    value: 7,
                    label: '非異常',
                    date: '2022/04/24 06:00',
                    frequency: '日預測'
                },
                {
                    id: 15,
                    name: "Shell尾料裁切氣缸故障",
                    lightColor: 2,
                    value: 1,
                    label: '非異常',
                    date: '2022/02/15 12:15',
                    frequency: '週預測'
                }
            ]
        },
        "d1x": {
            "Device5": [
                {
                    id: 1,
                    name: "料盤取材上下氣缸故障",
                    lightColor: 1,
                    value: 10,
                    label: '異常',
                    date: '2022/01/02 15:00',
                    frequency: '週預測'
                },
                {
                    id: 2,
                    name: "tray盤站故障",
                    lightColor: 1,
                    value: 10,
                    label: '異常',
                    date: '2022/09/26 10:30',
                    frequency: '週預測'
                },
                {
                    id: 3,
                    name: "UV檢測站故障",
                    lightColor: 2,
                    value: 10,
                    label: '非異常',
                    date: '2022/01/02 15:00',
                    frequency: '日預測'
                },
                {
                    id: 4,
                    name: "Glue異常",
                    lightColor: 2,
                    value: 10,
                    label: '非異常',
                    date: '2022/11/15 22:30',
                    frequency: '週預測'
                }
            ],
            "Device6": [
                {
                    id: 1,
                    name: "1#插針定位氣缸故障",
                    lightColor: 2,
                    value: 7,
                    label: '非異常',
                    date: '2022/11/15 22:30',
                    frequency: '週預測'
                },
                {
                    id: 2,
                    name: "2#插針定位氣缸故障",
                    lightColor: 1,
                    value: 7,
                    label: '異常',
                    date: '2022/01/02 15:00',
                    frequency: '日預測'
                },
                {
                    id: 3,
                    name: "2#插針站故障",
                    lightColor: 1,
                    value: 2,
                    label: '異常',
                    date: '2022/11/15 22:30',
                    frequency: '週預測'
                },
                {
                    id: 4,
                    name: "主撥料站故障",
                    lightColor: 1,
                    value: 2,
                    label: '異常',
                    date: '2022/04/02 14:00',
                    frequency: '日預測'
                },
                {
                    id: 5,
                    name: "出料撥料氣缸氣缸故障",
                    lightColor: 1,
                    value: 7,
                    label: '異常',
                    date: '2022/05/23 15:00',
                    frequency: '日預測'
                },
                {
                    id: 6,
                    name: "出料翻轉氣缸氣缸故障",
                    lightColor: 2,
                    value: 7,
                    label: '非異常',
                    date: '2022/11/15 22:30',
                    frequency: '週預測'
                },
                {
                    id: 7,
                    name: "壓入檢測站故障",
                    lightColor: 1,
                    value: 7,
                    label: '異常',
                    date: '2022/02/05 18:00',
                    frequency: '週預測'
                },
                {
                    id: 8,
                    name: "撥料上下1氣缸故障",
                    lightColor: 2,
                    value: 7,
                    label: '非異常',
                    date: '2022/08/17 08:30',
                    frequency: '週預測'
                },
                {
                    id: 9,
                    name: "撥料上下2氣缸故障",
                    lightColor: 2,
                    value: 7,
                    label: '非異常',
                    date: '2022/02/05 18:00',
                    frequency: '週預測'
                },
                {
                    id: 10,
                    name: "撥料上下3氣缸故障",
                    lightColor: 1,
                    value: 7,
                    label: '異常',
                    date: '2022/02/05 18:00',
                    frequency: '週預測'
                },
                {
                    id: 11,
                    name: "撥料上下4氣缸故障",
                    lightColor: 2,
                    value: 7,
                    label: '非異常',
                    date: '2022/02/05 18:00',
                    frequency: '週預測'
                },
                {
                    id: 12,
                    name: "進料錯位氣缸故障",
                    lightColor: 1,
                    value: 7,
                    label: '異常',
                    date: '2022/02/05 18:00',
                    frequency: '週預測'
                },
                {
                    id: 13,
                    name: "整形氣缸故障",
                    lightColor: 2,
                    value: 1,
                    label: '非異常',
                    date: '2022/12/13 18:12',
                    frequency: '週預測'
                },
                {
                    id: 14,
                    name: "House擋料氣缸故障",
                    lightColor: 2,
                    value: 7,
                    label: '非異常',
                    date: '2022/02/05 18:00',
                    frequency: '週預測'
                },
                {
                    id: 15,
                    name: "NG排料氣缸故障",
                    lightColor: 1,
                    value: 7,
                    label: '異常',
                    date: '2022/02/05 18:00',
                    frequency: '週預測'
                },
                {
                    id: 16,
                    name: "軸7-2#送料馬達故障",
                    lightColor: 2,
                    value: 7,
                    label: '非異常',
                    date: '2022/02/05 18:00',
                    frequency: '週預測'
                },
                {
                    id: 17,
                    name: "Bush異常",
                    lightColor: 1,
                    value: 7,
                    label: '異常',
                    date: '2022/02/05 18:00',
                    frequency: '週預測'
                }
            ],
            "Device8": [
                {
                    id: 1,
                    name: "出料撥爪橫移氣缸故障",
                    lightColor: 1,
                    value: 2,
                    label: '異常',
                    date: '2022/04/24 06:00',
                    frequency: '日預測'
                },
                {
                    id: 2,
                    name: "出料站氣缸故障",
                    lightColor: 1,
                    value: 7,
                    label: '異常',
                    date: '2022/02/05 18:00',
                    frequency: '週預測'
                },
                {
                    id: 3,
                    name: "出料翻轉氣缸故障",
                    lightColor: 2,
                    value: 7,
                    label: '非異常',
                    date: '2022/04/24 06:00',
                    frequency: '日預測'
                },
                {
                    id: 4,
                    name: "轉盤下料站故障",
                    lightColor: 2,
                    value: 7,
                    label: '非異常',
                    date: '2022/02/05 18:00',
                    frequency: '週預測'
                },
                {
                    id: 5,
                    name: "軸4-House旋轉馬達故障",
                    lightColor: 2,
                    value: 1,
                    label: '非異常',
                    date: '2022/02/05 18:00',
                    frequency: '週預測'
                },
                {
                    id: 6,
                    name: "軸5-House供料PP馬達故障",
                    lightColor: 1,
                    value: 2,
                    label: '異常',
                    date: '2022/02/05 18:00',
                    frequency: '週預測'
                },
                {
                    id: 7,
                    name: "軸8-DD取料PP夾爪氣缸故障",
                    lightColor: 1,
                    value: 7,
                    label: '異常',
                    date: '2022/02/05 18:00',
                    frequency: '週預測'
                },
                {
                    id: 8,
                    name: "軸10-出料搬送上下故障",
                    lightColor: 2,
                    value: 7,
                    label: '非異常',
                    date: '2022/02/05 18:00',
                    frequency: '週預測'
                },
                {
                    id: 9,
                    name: "DD取料PP夾爪氣缸故障",
                    lightColor: 2,
                    value: 7,
                    label: '非異常',
                    date: '2022/02/05 18:00',
                    frequency: '週預測'
                },
                {
                    id: 10,
                    name: "DD轉盤工位3壓入氣缸故障",
                    lightColor: 1,
                    value: 7,
                    label: '異常',
                    date: '2022/04/24 06:00',
                    frequency: '日預測'
                },
                {
                    id: 11,
                    name: "DD轉盤站故障",
                    lightColor: 1,
                    value: 2,
                    label: '異常',
                    date: '2022/02/05 18:00',
                    frequency: '週預測'
                },
                {
                    id: 12,
                    name: "house上料站故障",
                    lightColor: 1,
                    value: 7,
                    label: '異常',
                    date: '2022/12/12 12:00',
                    frequency: '週預測'
                },
                {
                    id: 13,
                    name: "House供料PP夾爪氣缸故障",
                    lightColor: 2,
                    value: 7,
                    label: '非異常',
                    date: '2022/10/10 10:00',
                    frequency: '週預測'
                },
                {
                    id: 14,
                    name: "Shell異常",
                    lightColor: 2,
                    value: 7,
                    label: '非異常',
                    date: '2022/04/24 06:00',
                    frequency: '日預測'
                },
                {
                    id: 15,
                    name: "Shell尾料裁切氣缸故障",
                    lightColor: 2,
                    value: 1,
                    label: '非異常',
                    date: '2022/02/15 12:15',
                    frequency: '週預測'
                }
            ],
            "Device15": [
                {
                    id: 1,
                    name: "1#插針定位氣缸故障",
                    lightColor: 2,
                    value: 7,
                    label: '非異常',
                    date: '2022/11/15 22:30',
                    frequency: '週預測'
                },
                {
                    id: 2,
                    name: "2#插針定位氣缸故障",
                    lightColor: 1,
                    value: 7,
                    label: '異常',
                    date: '2022/01/02 15:00',
                    frequency: '日預測'
                },
                {
                    id: 3,
                    name: "2#插針站故障",
                    lightColor: 1,
                    value: 2,
                    label: '異常',
                    date: '2022/11/15 22:30',
                    frequency: '週預測'
                },
                {
                    id: 4,
                    name: "主撥料站故障",
                    lightColor: 1,
                    value: 2,
                    label: '異常',
                    date: '2022/04/02 14:00',
                    frequency: '日預測'
                },
                {
                    id: 5,
                    name: "出料撥料氣缸氣缸故障",
                    lightColor: 1,
                    value: 7,
                    label: '異常',
                    date: '2022/05/23 15:00',
                    frequency: '日預測'
                },
                {
                    id: 6,
                    name: "出料翻轉氣缸氣缸故障",
                    lightColor: 2,
                    value: 7,
                    label: '非異常',
                    date: '2022/11/15 22:30',
                    frequency: '週預測'
                },
                {
                    id: 7,
                    name: "壓入檢測站故障",
                    lightColor: 1,
                    value: 7,
                    label: '異常',
                    date: '2022/02/05 18:00',
                    frequency: '週預測'
                },
                {
                    id: 8,
                    name: "撥料上下1氣缸故障",
                    lightColor: 2,
                    value: 7,
                    label: '非異常',
                    date: '2022/08/17 08:30',
                    frequency: '週預測'
                },
                {
                    id: 9,
                    name: "撥料上下2氣缸故障",
                    lightColor: 2,
                    value: 7,
                    label: '非異常',
                    date: '2022/02/05 18:00',
                    frequency: '週預測'
                },
                {
                    id: 10,
                    name: "撥料上下3氣缸故障",
                    lightColor: 1,
                    value: 7,
                    label: '異常',
                    date: '2022/02/05 18:00',
                    frequency: '週預測'
                },
                {
                    id: 11,
                    name: "撥料上下4氣缸故障",
                    lightColor: 2,
                    value: 7,
                    label: '非異常',
                    date: '2022/02/05 18:00',
                    frequency: '週預測'
                },
                {
                    id: 12,
                    name: "進料錯位氣缸故障",
                    lightColor: 1,
                    value: 7,
                    label: '異常',
                    date: '2022/02/05 18:00',
                    frequency: '週預測'
                },
                {
                    id: 13,
                    name: "整形氣缸故障",
                    lightColor: 2,
                    value: 1,
                    label: '非異常',
                    date: '2022/12/13 18:12',
                    frequency: '週預測'
                },
                {
                    id: 14,
                    name: "House擋料氣缸故障",
                    lightColor: 2,
                    value: 7,
                    label: '非異常',
                    date: '2022/02/05 18:00',
                    frequency: '週預測'
                },
                {
                    id: 15,
                    name: "NG排料氣缸故障",
                    lightColor: 1,
                    value: 7,
                    label: '異常',
                    date: '2022/02/05 18:00',
                    frequency: '週預測'
                },
                {
                    id: 16,
                    name: "軸7-2#送料馬達故障",
                    lightColor: 2,
                    value: 7,
                    label: '非異常',
                    date: '2022/02/05 18:00',
                    frequency: '週預測'
                },
                {
                    id: 17,
                    name: "Bush異常",
                    lightColor: 1,
                    value: 7,
                    label: '異常',
                    date: '2022/02/05 18:00',
                    frequency: '週預測'
                }
            ],
        },
    }

    const pieData = [
        { value: 2, label: '異常' },
        { value: 2, label: '非異常' },
    ];
    const pieData2 = [
        { value: 11, label: '異常' },
        { value: 8, label: '非異常' },
    ];
    const pieData3 = [
        { value: 6, label: '異常' },
        { value: 10, label: '非異常' },
    ];
    const size = {
        width: 400,
        height: 200,
    };

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
            maxHeight: '300px', // 設置表格容器的最大高度
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

    const createDeviceCard = (data, data2) => {
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
                                // Initialize counters for '異常' and '非異常'
                                let abnormalCount = 0;
                                let nonAbnormalCount = 0;

                                // Loop through the data for the current device to count '異常' and '非異常'
                                data[project][device].forEach((item) => {
                                    if (item.label === '異常') {
                                        abnormalCount++;
                                    } else if (item.label === '非異常') {
                                        nonAbnormalCount++;
                                    }
                                });
                                let pieData = [
                                    { value: abnormalCount, label: '異常' },
                                    { value: nonAbnormalCount, label: '非異常' },
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
                                                        <Box sx={{ bgcolor: '#C5291C', width: 'auto', height: 'auto' }}>
                                                            <Typography align="center" fontSize={20}>{abnormalCount}</Typography>
                                                        </Box>
                                                    </Box>
                                                    <Box sx={{ mt: 6 }}>
                                                        <PieChart
                                                            colors={['#C5291C', '#4CA85A']}
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
                                                        <Typography align="center" fontSize={25}>非異常</Typography>
                                                        <Box sx={{ bgcolor: '#4CA85A', width: 'auto', height: 'auto' }}>
                                                            <Typography align="center" fontSize={20}>{nonAbnormalCount}</Typography>
                                                        </Box>
                                                    </Box>
                                                </Grid>
                                                <Grid item xs={6} md={6} lg={6}>
                                                    <TableContainer component={Paper} style={tableContainerStyle.tableContainer}>
                                                        <Table>
                                                            <TableHead style={{ backgroundColor: '#696969' }}>
                                                                <TableRow>
                                                                    <TableCell align="center" sx={{ height: 'auto', border: "1px solid black" }} colSpan={3}>
                                                                        <Typography fontSize={20}>週預測(10/30-11/03)</Typography>
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
                                                                        <Typography fontSize={20}>前次發生時間</Typography>
                                                                    </TableCell>
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>
                                                                {data[project][device].sort(getComparator(orderWeek)).map((columns) => (
                                                                    <TableRow key={columns.name}>
                                                                        <TableCell style={tableCellStyle.extendedCell} key={columns.id} align="center" sx={{ bgcolor: getColor(columns.lightColor) }}>
                                                                            <Typography fontSize={20}>{columns.label}</Typography>
                                                                        </TableCell>
                                                                        <TableCell align="center" sx={{ height: 'auto' }}>
                                                                            <Typography fontSize={20}>{columns.name}</Typography>
                                                                        </TableCell>
                                                                        <TableCell align="center" sx={{ height: 'auto' }}>
                                                                            <Typography fontSize={20}>{columns.date}</Typography>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                ))}
                                                            </TableBody>
                                                        </Table>
                                                    </TableContainer>
                                                    <TableContainer component={Paper} style={tableContainerStyle.tableContainer}>
                                                        <Table>
                                                            <TableHead style={{ backgroundColor: '#696969' }}>
                                                                <TableRow>
                                                                    <TableCell align="center" sx={{ height: 'auto', border: "1px solid black" }} colSpan={3}>
                                                                        <Typography fontSize={20}>日預測(10/26)</Typography>
                                                                    </TableCell>
                                                                </TableRow>
                                                                <TableRow>
                                                                    <TableCell align="center" sx={{ height: 'auto', border: "1px solid black" }}>
                                                                        <TableSortLabel
                                                                            active={dateOrderBy === 'label'}
                                                                            direction={dateOrderBy === 'label' ? orderDate : 'asc'}
                                                                            onClick={() => handleSortRequestDate('label')}
                                                                        >
                                                                            <Typography fontSize={20}>類型</Typography>
                                                                        </TableSortLabel>
                                                                    </TableCell>
                                                                    <TableCell align="center" sx={{ height: 'auto', border: "1px solid black" }}>
                                                                        <Typography fontSize={20}>異常事件</Typography>
                                                                    </TableCell>
                                                                    <TableCell align="center" sx={{ height: 'auto', border: "1px solid black" }}>
                                                                        <Typography fontSize={20}>前次發生時間</Typography>
                                                                    </TableCell>
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>
                                                                {data2[project][device].sort(getComparatorDate(orderDate)).map((columns) => (
                                                                    <TableRow key={columns.name}>
                                                                        <TableCell style={tableCellStyle.extendedCell} key={columns.id} align="center" sx={{ bgcolor: getColor(columns.lightColor) }}>
                                                                            <Typography fontSize={20}>{columns.label}</Typography>
                                                                        </TableCell>
                                                                        <TableCell align="center" sx={{ height: 'auto' }}>
                                                                            <Typography fontSize={20}>{columns.name}</Typography>
                                                                        </TableCell>
                                                                        <TableCell align="center" sx={{ height: 'auto' }}>
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

    const [nav1, setNav1] = useState();
    const [nav2, setNav2] = useState();
    const slider1 = useRef();
    const slider2 = useRef();

    return (
        <ThemeProvider theme={darkTheme}>

            {createDeviceCard(columns, columns2)}
        </ThemeProvider>
    );
}