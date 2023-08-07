import React, { useState, useEffect } from "react";
import PerfectScrollbar from 'react-perfect-scrollbar';
import { apiGetPeddingList } from '../api'
import {
    Box,
    Button,
    Card,
    TextField,
    Grid,
    CardContent,
    CardHeader,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    createTheme,
    ThemeProvider,
    Divider,
} from '@mui/material';
import { Typography, Container, InputLabel, MenuItem, Select, FormControl } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { apiGetWhiteList, apiGetDeviceNameById, apiWorkShopList, apiGetDeviceRecommend, apiGetWorkersByDevice, apiPostAddWorkersWhitelist, apiDeleteWorkersWhitelist } from "../api.js";
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
            paper: '#e7f2fd',
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

function createData(id, badge, username, createtime) {
    return { id, badge, username, createtime };
}

const rows = [
    createData('c001', 20220711, "設定完整備份時間"),
    createData('c002', 20220713, "設定差異備份時間"),
    createData('c003', 20220715, "核准員工帳號申請"),
    createData('c004', 20220722, "刪除人員"),
    createData('c005', 20220802, "編輯人員等級"),
];


export default function Management({ token, ...rest }) {
    const [permissionOpen, setPermissionOpen] = useState(false);
    const [permissionDeleteOpen, setPermissionDeleteOpen] = useState(false);
    // const loading = false;

    const CONTENT = {
        title: "註冊人員名單",
    }
    const permissionHandleClose = () => {
        setPermissionOpen(false);
    };
    const permissionDeleteHandleClickOpen = () => {
        setPermissionDeleteOpen(true);
    };
    const permissionDeleteHandleClose = () => {
        setPermissionDeleteOpen(false);
    };

    useEffect(() => {
        handleOnClick();
    }, [])
    const [data, setData] = useState();
    const [open, setOpen] = useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    function handleOnClick() {
        apiGetPeddingList(token)
            .then(data => {
                console.log(data)
                console.log(typeof (data))
                const display = data.data.map(
                    register => {
                        return (
                            <Card sx={{ m: 1, minWidth: "500px" }}
                                key={register.id}>
                                <CardContent>
                                    <Typography
                                        color="textSecondary"
                                        gutterBottom
                                        variant="overline"
                                        fontSize="large"
                                    >
                                        员工编号 : {register.badge}
                                    </Typography>
                                    <Typography>
                                        员工姓名 : {register.username}
                                    </Typography>
                                    <Typography>
                                        申請日期 : {register.created_date}
                                    </Typography>
                                </CardContent>
                            </Card>
                        )
                    }
                )
                setData(display);
                console.log(display);
            }).catch(err => { console.log(err) })
    };

    return (
        <ThemeProvider theme={darkTheme}>
            <Box>
                <Box mb={3}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={12}>
                            <Card>
                                <Box sx={{ bgcolor: 'info.main' }}>
                                    <CardHeader title="註冊人員名單:" color="#62aaf4" />
                                </Box>
                                <Box pt={4} pb={3} px={3}>
                                    <Box component="form" role="form">
                                        <Box mt={3} mb={1} textAlign="center">
                                            <Typography variant="button" color="text">
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Box display="flex" alignItems="center" pt={3} px={2}>
                                        <LoadingButton variant="contained" color="info" onClick={handleClickOpen} ml={2}>
                                            查詢
                                        </LoadingButton>
                                        <Dialog
                                            open={open}
                                            onClose={handleClose}
                                            aria-labelledby="alert-dialog-title"
                                            aria-describedby="alert-dialog-description"
                                            sx={{ width: '100%' }}
                                        >
                                            <DialogTitle id="alert-dialog-title">
                                                {CONTENT.title}
                                            </DialogTitle>
                                            <DialogContent>
                                                {
                                                    data
                                                }
                                            </DialogContent>
                                            <DialogActions >
                                                <Button onClick={handleClose} autoFocus variant="contained">
                                                    关闭
                                                </Button>
                                            </DialogActions>
                                        </Dialog>
                                    </Box>
                                </Box>
                            </Card>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} mt={1}>
                        <Grid item xs={12} md={6}>
                            <Card>
                                <Box sx={{ bgcolor: 'info.main' }}>
                                    <CardHeader title="編輯人員:" color="#62aaf4" />
                                </Box>
                                <Box pt={4} pb={3} px={3}>
                                    <Box component="form" role="form">
                                        <Box display="flex" alignItems="center" pt={3} px={2}>
                                            <Typography variant="h5" fontWeight="medium" mr={2}>
                                                帳號:
                                            </Typography>
                                            <Box mr={2}>
                                                <TextField type="account" label="Account" />
                                            </Box>
                                            <LoadingButton variant="contained" color="info" ml={2}>
                                                查詢
                                            </LoadingButton>
                                        </Box>
                                        <Box display="flex" alignItems="center" pt={3} px={2}>
                                            <Typography variant="h5" fontWeight="medium" mr={2}>
                                                名稱: 王得發
                                            </Typography>
                                        </Box>
                                        <Box mt={4} mb={1}>
                                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                                <LoadingButton
                                                    variant="contained"
                                                    color="error"
                                                    onClick={permissionDeleteHandleClickOpen}
                                                >
                                                    刪除人員
                                                </LoadingButton>
                                            </Box>
                                            <Dialog
                                                open={permissionOpen}
                                                onClose={permissionHandleClose}
                                                aria-labelledby="alert-dialog-permission"
                                                aria-describedby="alert-dialog-permission"
                                            >
                                                <DialogTitle id="alert-dialog-title">是否更改權限?</DialogTitle>
                                                <DialogContent>
                                                    <DialogContentText id="alert-dialog-permission">
                                                        按下確認按鈕後將會進行權限更改
                                                    </DialogContentText>
                                                </DialogContent>
                                                <DialogActions>
                                                    <LoadingButton
                                                        onClick={permissionHandleClose}
                                                        color="info"
                                                        autoFocus
                                                        variant="gradient"
                                                    >
                                                        確認
                                                    </LoadingButton>
                                                    <LoadingButton
                                                        onClick={permissionHandleClose}
                                                        color="info"
                                                        autoFocus
                                                        variant="gradient"
                                                    >
                                                        关闭
                                                    </LoadingButton>
                                                </DialogActions>
                                            </Dialog>
                                            <Dialog
                                                open={permissionDeleteOpen}
                                                onClose={permissionDeleteHandleClose}
                                                aria-labelledby="alert-dialog-permission"
                                                aria-describedby="alert-dialog-permission"
                                            >
                                                <DialogTitle id="alert-dialog-title">是否刪除人員?</DialogTitle>
                                                <DialogContent>
                                                    <DialogContentText id="alert-dialog-permission">
                                                        按下刪除按鈕後將會刪除人員
                                                    </DialogContentText>
                                                </DialogContent>
                                                <DialogActions>
                                                    <LoadingButton
                                                        onClick={permissionDeleteHandleClose}
                                                        color="error"
                                                        autoFocus
                                                        variant="gradient"
                                                    >
                                                        刪除
                                                    </LoadingButton>
                                                    <LoadingButton
                                                        onClick={permissionDeleteHandleClose}
                                                        color="info"
                                                        autoFocus
                                                        variant="gradient"
                                                    >
                                                        关闭
                                                    </LoadingButton>
                                                </DialogActions>
                                            </Dialog>
                                        </Box>
                                    </Box>
                                </Box>
                            </Card>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </ThemeProvider>
    );
}
