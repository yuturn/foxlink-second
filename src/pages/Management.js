import React, { useState, useEffect } from "react";
import PerfectScrollbar from 'react-perfect-scrollbar';
import { apiGetPeddingList, apiConfirmedUser } from '../api'
import { SpanningTable } from '../components/Consumables'
import {
    Box,
    Card,
    TextField,
    Typography,
    Grid,
    CardHeader,
    createTheme,
    ThemeProvider,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import LoadingButton from '@mui/lab/LoadingButton';
import { AlertComponent } from "../components/alert-component";

// import { apiGetWhiteList, apiGetDeviceNameById, apiWorkShopList, apiGetDeviceRecommend, apiGetWorkersByDevice, apiPostAddWorkersWhitelist, apiDeleteWorkersWhitelist } from "../api.js";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

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
        secondary: {
            main: '#10B981',
            light: '#3FC79A',
            dark: '#0B815A',
            contrastText: '#FFFFFF'
        },
        success: {
            main: '#14B8A6',
            light: '#43C6B7',
            dark: '#0E8074',
            contrastText: '#FFFFFF'
        },
        info: {
            main: '#2196F3',
            light: '#64B6F7',
            dark: '#0B79D0',
            contrastText: '#FFFFFF'
        },
        warning: {
            main: '#FFB020',
            light: '#FFBF4C',
            dark: '#B27B16',
            contrastText: '#FFFFFF'
        },
        error: {
            main: '#D14343',
            light: '#DA6868',
            dark: '#922E2E',
            contrastText: '#FFFFFF'
        },
    },
});

const rows1 = {
    "Latch裁切定刀": [
        {
            require: "Device_1(尺寸,外觀)",
            prechangtime: "2023-08-13 12:51:18",
            lifechangetime: "2023-06-09 13:18:10",
            lifechangetime: 70000,
            lifechangecount: 10,
            lifechangeaveragecount: 65000,
            brokenchangetime: "2023-05-23 11:42:19",
            brokenusedcount: 70000,
            brokenchangecount: 10,
            brokenchangeaveragecount: 65000,
            total: 15
        },
        {
            require: "Device_4(尺寸,外觀)",
            prechangtime: "2023-08-13 12:51:18",
            lifechangetime: "2023-06-09 13:18:10",
            lifechangetime: 70000,
            lifechangecount: 10,
            lifechangeaveragecount: 65000,
            brokenchangetime: "2023-05-23 11:42:19",
            brokenusedcount: 70000,
            brokenchangecount: 10,
            brokenchangeaveragecount: 65000,
            total: 15
        },
        {
            require: "Device_6(尺寸,外觀)",
            prechangtime: "2023-08-13 12:51:18",
            lifechangetime: "2023-06-09 13:18:10",
            lifechangetime: 70000,
            lifechangecount: 10,
            lifechangeaveragecount: 65000,
            brokenchangetime: "2023-05-23 11:42:19",
            brokenusedcount: 70000,
            brokenchangecount: 10,
            brokenchangeaveragecount: 65000,
            total: 15
        }
    ],
    "刮刀": [
        {
            require: "Device_1(尺寸,外觀)",
            prechangtime: "2023-08-13 12:51:18",
            lifechangetime: "2023-06-09 13:18:10",
            lifechangetime: 70000,
            lifechangecount: 10,
            lifechangeaveragecount: 65000,
            brokenchangetime: "2023-05-23 11:42:19",
            brokenusedcount: 70000,
            brokenchangecount: 10,
            brokenchangeaveragecount: 65000,
            total: 15
        },
        {
            require: "Device_4(尺寸,外觀)",
            prechangtime: "2023-08-13 12:51:18",
            lifechangetime: "2023-06-09 13:18:10",
            lifechangetime: 70000,
            lifechangecount: 10,
            lifechangeaveragecount: 65000,
            brokenchangetime: "2023-05-23 11:42:19",
            brokenusedcount: 70000,
            brokenchangecount: 10,
            brokenchangeaveragecount: 65000,
            total: 15
        },
        {
            require: "Device_6(尺寸,外觀)",
            prechangtime: "2023-08-13 12:51:18",
            lifechangetime: "2023-06-09 13:18:10",
            lifechangetime: 70000,
            lifechangecount: 10,
            lifechangeaveragecount: 65000,
            brokenchangetime: "2023-05-23 11:42:19",
            brokenusedcount: 70000,
            brokenchangecount: 10,
            brokenchangeaveragecount: 65000,
            total: 15
        },
        {
            require: "Device_10(尺寸,外觀)",
            prechangtime: "2023-08-13 12:51:18",
            lifechangetime: "2023-06-09 13:18:10",
            lifechangetime: 70000,
            lifechangecount: 10,
            lifechangeaveragecount: 65000,
            brokenchangetime: "2023-05-23 11:42:19",
            brokenusedcount: 70000,
            brokenchangecount: 10,
            brokenchangeaveragecount: 65000,
            total: 15
        },
        {
            require: "Device_11(尺寸,外觀)",
            prechangtime: "2023-08-13 12:51:18",
            lifechangetime: "2023-06-09 13:18:10",
            lifechangetime: 70000,
            lifechangecount: 10,
            lifechangeaveragecount: 65000,
            brokenchangetime: "2023-05-23 11:42:19",
            brokenusedcount: 70000,
            brokenchangecount: 10,
            brokenchangeaveragecount: 65000,
            total: 15
        }
    ]
};



export default function Management({ token, ...rest }) {

    return (
        <ThemeProvider theme={darkTheme}>
            <Grid container spacing={10}>
                <SpanningTable data={rows1} />
            </Grid>
        </ThemeProvider>
    );
}