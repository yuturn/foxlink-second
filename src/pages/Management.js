import React, { useState, useEffect } from "react";
import PerfectScrollbar from 'react-perfect-scrollbar';
import { apiGetPeddingList, apiConfirmedUser } from '../api'
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

const columns = [
    { field: 'id', headerName: 'ID', width: 120 },
    { field: 'badge', headerName: '員工編號', width: 180 },
    { field: 'username', headerName: '員工姓名', width: 180 },
    {
        field: 'created_date',
        headerName: '操作時間',
        type: 'string',
        width: 250,
    },
];



export default function Management({ token, ...rest }) {
    const [permissionOpen, setPermissionOpen] = useState(false);
    const [permissionDeleteOpen, setPermissionDeleteOpen] = useState(false);
    const [registerData, setRegisterData] = useState();
    const [selectedRowsData, setSelectedRowsData] = useState();

    const [alert, setAlert] = useState(false);
    const [open, setOpen] = useState(false);
    const [successMsg, setSuccessMsg] = useState();
    const [errmsg, setErrMsg] = useState();
    const [conData, setConData] = useState([]);

    useEffect(() => {
        if (successMsg) {
            setAlert(true);
        }
    }, [successMsg])

    const onRowsSelectionHandler = (ids) => {
        const selectedRowsData = ids.map((id) => registerData.find((row) => row.id === id));
        setSelectedRowsData(selectedRowsData);
        console.log(selectedRowsData);
    };

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
    const handleClickOpen = () => {
        setOpen(true);

    };
    const handleClose = () => {
        setAlert(false);
        setOpen(false);
    };

    function handleOnClick() {
        apiGetPeddingList(token)
            .then(data => {
                setRegisterData(data.data)
                const display = data.data.map(
                    register => {
                    }
                )
                setData(display);
                // console.log(display);
            }).catch(err => { console.log(err) })
    };

    function handleOnClickConfirmed() {
        const confirmedData = selectedRowsData.map(
            data => {
                console.log(data)
                const condata = [{
                    'badge': data.badge,
                    'username': data.username,
                    'confirmed': true
                }]
                console.log(condata)
                apiConfirmedUser(condata)
                    .then(data => {
                        console.log(data)
                        console.log(data.data.badge)
                        setErrMsg(data.data.badge)
                    }).catch(err => { console.log(err) })
            }
        )
        setAlert(true);
        setTimeout(handleClose, 3000);
    };

    function handleOnClickReject() {
        const rejectData = {
            badge: selectedRowsData.badge,
            username: selectedRowsData.username,
            confirmed: false
        }
        console.log(selectedRowsData);
        console.log(rejectData)
        apiConfirmedUser(rejectData)
            .then(data => {
                console.log(data)
                console.log(data.data.badge)
                setSuccessMsg(data.data.badge)
            }).catch(err => { console.log(err) })
        setOpen(true);
        setTimeout(handleClose, 3000);
    };

    return (
        <ThemeProvider theme={darkTheme}>
            <AlertComponent open={alert} setOpen={setAlert} message={`${successMsg}已核准`} severity={"success"} />
            <AlertComponent open={open} setOpen={setOpen} message={`${successMsg}已拒絕`} severity={"info"} />
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
                                        <div style={{ height: 650, width: '100%' }}>
                                            {/* <DataGrid
                                                rows={registerData}
                                                columns={columns}
                                                initialState={{
                                                    pagination: {
                                                        paginationModel: { page: 0, pageSize: 5 },
                                                    },
                                                }}
                                                pageSizeOptions={[5, 10]}
                                                checkboxSelection
                                                onSelectionModelChange={(ids) => onRowsSelectionHandler(ids)}
                                            /> */}
                                        </div>
                                    </Box>
                                    <Box display="flex" pt={3} px={2}>
                                        <Box>
                                            <LoadingButton variant="contained" color="info" onClick={handleOnClick} ml={2}>
                                                更新
                                            </LoadingButton>
                                        </Box>
                                        <Box sx={{ ml: 2 }}>
                                            <LoadingButton variant="contained" color="info" onClick={handleOnClickConfirmed} sx={{ ml: 2 }}>
                                                確認
                                            </LoadingButton>
                                        </Box>
                                        <Box sx={{ ml: 2 }}>
                                            <LoadingButton variant="contained" color="error" onClick={handleOnClickReject} sx={{ ml: 2 }}>
                                                拒絕
                                            </LoadingButton>
                                        </Box>
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