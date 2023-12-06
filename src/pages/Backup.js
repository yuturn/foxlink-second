import React, { useState, useEffect } from "react";
import { apiPostFullBackUp, apiGetSystemEnvSetting, apiPostSchedulerDate, apiPostSchedulerCron, apiPostUpdateSetting, apiPostRestoreBackUp, apiGetBackUpStatistics } from "../api.js";

// import DashboardNavbar from "../examples/Navbars/DashboardNavbar";

import { Box, Card, Grid, Typography, Divider, CardContent, CardHeader, ThemeProvider, createTheme, FormControl, InputLabel } from '@mui/material';
// import { ThemeProvider, createTheme } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';

import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

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

export default function Backup({ token, setAlert, ...rest }) {
    const [completedBackupTime, setCompletedBackupTime] = useState();
    const [differentBackupTime, setDifferentBackupTime] = useState();
    const [manualBackupTime, setManualBackupTime] = useState();

    const [manualOpen, setManualOpen] = useState(false);
    const [backUpRestroeOpen, setBackUpRestroeOpen] = useState(false);
    const [fullDate, setFullDateDate] = useState(new Date());
    const [diffDate, setDiffDateDate] = useState(new Date());
    const [differentBackUp, setDifferentBackUp] = useState("month");

    //手動完整備份Dialog
    const manualHandleClickOpen = () => {
        setManualOpen(true);
    };
    const manualHandleClose = () => {
        setManualOpen(false);
    };
    //還原Dialog
    const backUpRestroeHandleClickOpen = () => {
        setBackUpRestroeOpen(true);
    };
    const backUpRestroeHandleClickClose = () => {
        setBackUpRestroeOpen(false);
    };
    useEffect(() => {
        handleClickUpdateEnvSetting()
    }, [])

    const [backUpPath, setBackUpPath] = useState();
    const [diffBackUpPath, setDiffBackUpPath] = useState();

    //這邊是更新資料按鈕
    const handleClickUpdateEnvSetting = () => {
        if (!token) {
            // 没有token，不执行操作
            return;
        }
        const backUpData = {
            token: token,
            key: "backup_path"
        }
        console.log(backUpData)
        apiGetSystemEnvSetting(backUpData)
            .then((res) => {
                setBackUpPath(res.data.value)
            }).catch((error) => {
                console.error("API 请求失败", error);
                handleErrorOpen("查詢失敗:API請求失敗");
            });

        const diffBackUpData = {
            token: token,
            key: "diffbackup_path"
        }
        console.log(diffBackUpData)
        apiGetSystemEnvSetting(diffBackUpData)
            .then((res) => {
                console.log(res)
                handleOpen("查詢成功")
                setDiffBackUpPath(res.data.value)
                manualHandleClose()
            }).catch((error) => {
                console.error("API 请求失败", error);
                handleErrorOpen("查詢失敗:API請求失敗");
                manualHandleClose()
            });
        const data = {
            token: token
        }
        apiGetBackUpStatistics(data)
            .then((res) => {
                setCompletedBackupTime(res.data[0].date)
                setDifferentBackupTime(res.data[1].date)
                setManualBackupTime(res.data[2].date)
            }).catch((error) => {
                console.error("API 请求失败", error);
                handleErrorOpen("查詢失敗:API請求失敗");
            });
    };

    //這邊是更新完整備份時間按鈕
    const handleClickUpdateBackUpTime = () => {
        const data = {
            token: token,
            time: new Date(fullDate).toISOString()
        }
        console.log(data)
        apiPostSchedulerDate(data)
            .then((res) => {
                handleOpen("更新成功,下次更新時間" + res.data.next_run_time);
            }).catch((error) => {
                console.error("API 请求失败", error);
                handleErrorOpen("查詢失敗:API請求失敗");
            });
    };

    //這邊是更新差異備份時間按鈕
    const handleClickUpdateDiffBackUpTime = () => {
        const data = {
            token: token,
            time: new Date(diffDate).toISOString(),
            select_type: differentBackUp,
            description: "差異備份"
        }
        console.log(data)
        apiPostSchedulerCron(data)
            .then((res) => {
                handleOpen("更新成功,下次更新時間" + res.data.next_run_time);
            }).catch((error) => {
                console.error("API 请求失败", error);
                handleErrorOpen("查詢失敗:API請求失敗");
            });
    };

    //這邊是完整備份按鈕(dialog裡面的)
    const handleClickFullBackUp = () => {
        let path = document.getElementById('fullBackUpPath').value;
        const data = {
            path: path,
            token: token
        }
        console.log(data)
        apiPostFullBackUp(data)
            .then((res) => {
                console.log(res)
                if (res.data.message) {
                    handleOpen("備份成功 " + res.data.message)
                    manualHandleClose()
                } else {
                    handleErrorOpen("查詢失敗:沒有資料")
                    manualHandleClose()
                }
            }).catch((error) => {
                console.error("API 请求失败", error);
                handleErrorOpen("查詢失敗:API請求失敗");
                manualHandleClose()
            });
    };

    //這邊是更改差異備份路徑按鈕
    const handleClickUpdatediffBackUpPath = () => {
        let path = document.getElementById('diffBackUpPath').value;
        const data = {
            path: path,
            key: "diffbackup_path",
            token: token
        }
        console.log(data)
        apiPostUpdateSetting(data)
            .then((res) => {
                console.log(res)
                handleOpen("更改差異備份路徑成功")
            }).catch((error) => {
                console.error("API 请求失败", error);
                handleErrorOpen("查詢失敗:API請求失敗");
                manualHandleClose()
            });
    };

    //這邊是還原按鈕
    const handleClickUBackUpRestore = () => {
        let path = document.getElementById('backUpRestroe').value;
        const data = {
            path: path,
            token: token
        }
        console.log(data)
        apiPostRestoreBackUp(data)
            .then((res) => {
                console.log(res)
                handleOpen("還原成功")
                backUpRestroeHandleClickClose()
            }).catch((error) => {
                console.error("API 请求失败", error);
                handleErrorOpen("查詢失敗:API請求失敗");
                backUpRestroeHandleClickClose()
            });
    };

    //這邊是當projectName改變後做事情
    const handleChangeDifferentBackUp = (event) => {
        setDifferentBackUp(event.target.value)
    };

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
            <Card>
                <Box sx={{ bgcolor: '#696969' }}>
                    <CardHeader title="備份頁面" color="#62aaf4" />
                </Box>
                <Divider sx={{ borderBottomWidth: 3 }} />
                <CardContent>
                    <Grid container spacing={1} mt={1}>
                        <Grid xs={6}>
                            <TableContainer component={Paper}>
                                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell
                                                align="center"
                                                colSpan={2}
                                                sx={{
                                                    backgroundColor: "#bfbfbf",
                                                    border: "1px solid black"
                                                }}
                                            >
                                                <Typography variant="h5" fontWeight="medium">
                                                    前次備份時間
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell align="center" sx={{ border: "1px solid black" }}>完整備份時間</TableCell>
                                            <TableCell align="center" sx={{ border: "1px solid black" }}>{completedBackupTime}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell align="center" sx={{ border: "1px solid black" }}>差異備份時間</TableCell>
                                            <TableCell align="center" sx={{ border: "1px solid black" }}>{differentBackupTime}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell align="center" sx={{ border: "1px solid black" }}>手動備份時間</TableCell>
                                            <TableCell align="center" sx={{ border: "1px solid black" }}>{manualBackupTime}</TableCell>
                                        </TableRow>
                                    </TableHead>
                                </Table>
                            </TableContainer>
                        </Grid>
                        <Grid xs={6}>
                            <TableContainer component={Paper}>
                                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell
                                                align="center"
                                                colSpan={2}
                                                sx={{
                                                    backgroundColor: "#bfbfbf",
                                                    border: "1px solid black"
                                                }}
                                            >
                                                <Typography variant="h5" fontWeight="medium">
                                                    前次備份路徑
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell align="center" sx={{ border: "1px solid black" }}>完整備份路徑</TableCell>
                                            <TableCell align="center" sx={{ border: "1px solid black" }}>{backUpPath}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell align="center" sx={{ border: "1px solid black" }}>差異備份路徑</TableCell>
                                            <TableCell align="center" sx={{ border: "1px solid black" }}>{diffBackUpPath}</TableCell>
                                        </TableRow>
                                    </TableHead>
                                </Table>
                            </TableContainer>
                        </Grid>
                    </Grid>
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <Box display="flex" alignItems="center" justifyContent="center" pt={3} >
                                <LoadingButton variant="contained" color="info" align="center" onClick={handleClickUpdateEnvSetting} style={{ width: '150px' }}>
                                    更新資料
                                </LoadingButton>
                            </Box>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
            <Grid container spacing={2} mt={1}>
                <Grid item xs={12} md={6}>
                    <Card>
                        <Box sx={{ bgcolor: '#696969' }}>
                            <CardHeader title="設定" color="#62aaf4" />
                        </Box>
                        <Box pt={4} pb={3} px={3}>
                            <Box>
                                <Box display="flex" alignItems="center" pt={3} px={2}>
                                    <Typography variant="h5" fontWeight="medium" mr={2}>
                                        完整備份時間:
                                    </Typography>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DateTimePicker
                                            label="請輸入完整備份時間"
                                            value={fullDate}
                                            onChange={(newValue) => {
                                                setFullDateDate(newValue);
                                            }}
                                            renderInput={(params) => <TextField {...params} />}
                                        />
                                    </LocalizationProvider>
                                    <Box ml={2}>
                                        <LoadingButton variant="contained"
                                            size="large"
                                            component="span"
                                            color="info"
                                            onClick={handleClickUpdateBackUpTime}
                                        >
                                            更改
                                        </LoadingButton>
                                    </Box>
                                </Box>
                                <Box display="flex" alignItems="center" pt={3} px={2}>
                                    <Typography variant="h5" fontWeight="medium" mr={2}>
                                        差異備份時間:
                                    </Typography>
                                    <Box mr={2}>
                                        <FormControl>
                                            <InputLabel id="demo-simple-select-label">差異備份週期</InputLabel>
                                            <Select
                                                labelId="permission-select-label"
                                                id="permission-select"
                                                value={differentBackUp}
                                                label="差異備份週期"
                                                onChange={handleChangeDifferentBackUp}
                                                style={{ minWidth: "150px", height: "45px" }}
                                            >
                                                <MenuItem value="Monthly">月</MenuItem>
                                                <MenuItem value="Weekly">週</MenuItem>
                                                <MenuItem value="Daily">日</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Box>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DateTimePicker
                                            label="請輸入差異備份時間"
                                            value={diffDate}
                                            onChange={(newValue) => {
                                                setDiffDateDate(newValue);
                                            }}
                                            renderInput={(params) => <TextField {...params} />}
                                        />
                                    </LocalizationProvider>
                                    <Box ml={2}>
                                        <LoadingButton variant="contained"
                                            size="large"
                                            component="span"
                                            color="info"
                                            onClick={handleClickUpdateDiffBackUpTime}
                                        >
                                            更改
                                        </LoadingButton>
                                    </Box>
                                </Box>
                                {/* <Box display="flex" alignItems="center" pt={3} px={2}>
                                    <Typography variant="h5" fontWeight="medium" mr={2}>
                                        備份目的地1:
                                    </Typography>
                                    <TextField type="text" label="請輸入IP位址" />
                                    <Box ml={2}>
                                        <LoadingButton variant="contained"
                                            size="large"
                                            component="span"
                                            color="info"
                                        >
                                            更改
                                        </LoadingButton>
                                    </Box>
                                </Box>
                                <Box display="flex" alignItems="center" pt={3} px={2}>
                                    <Typography variant="h5" fontWeight="medium" mr={2}>
                                        備份目的地2:
                                    </Typography>
                                    <TextField type="text" label="請輸入IP位址" />
                                    <Box ml={2}>
                                        <LoadingButton variant="contained"
                                            size="large"
                                            component="span"
                                            color="info"
                                        >
                                            更改
                                        </LoadingButton>
                                    </Box>
                                </Box> */}
                            </Box>
                        </Box>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card>
                        <Box sx={{ bgcolor: '#696969' }}>
                            <CardHeader title="手動備份" color="#62aaf4" />
                        </Box>
                        <Box>
                            <Typography variant="h6" color="gray" fontWeight="medium" ml={2} mt={2}>
                                IP位置範例:/app/backup-2023-12-02.sql
                            </Typography>
                        </Box>
                        <Box>
                            <Box display="flex" alignItems="center" pt={3} px={2}>
                                <Typography variant="h5" fontWeight="medium" mr={3}>
                                    完整備份路徑:
                                </Typography>
                                <TextField type="text" id="fullBackUpPath" label="請輸入本地路徑位址" />
                                <Box ml={2}>
                                    <LoadingButton variant="contained"
                                        size="large"
                                        color="info"
                                        onClick={manualHandleClickOpen}
                                    >
                                        手動完整備份
                                    </LoadingButton>
                                    <Dialog
                                        open={manualOpen}
                                        onClose={manualHandleClose}
                                        aria-labelledby="alert-dialog-manual"
                                        aria-describedby="alert-dialog-manual"
                                    >
                                        <DialogTitle id="alert-dialog-title">是否手動備份?</DialogTitle>
                                        <DialogContent>
                                            <DialogContentText id="alert-dialog-manual">
                                                按下確認按鈕後將會進行手動備份
                                            </DialogContentText>
                                        </DialogContent>
                                        <DialogActions>
                                            <LoadingButton color="info" onClick={handleClickFullBackUp} autoFocus variant="contained">
                                                確認
                                            </LoadingButton>
                                            <LoadingButton color="info" onClick={manualHandleClose} autoFocus variant="contained">
                                                关闭
                                            </LoadingButton>
                                        </DialogActions>
                                    </Dialog>
                                </Box>
                            </Box>
                        </Box>
                        <Box display="flex" alignItems="center" pt={3} px={2}>
                            <Typography variant="h5" fontWeight="medium" mr={3}>
                                差異備份路徑:
                            </Typography>
                            <TextField type="text" id="diffBackUpPath" label="請輸入本地路徑位址" />
                            <Box ml={2}>
                                <LoadingButton size="large" variant="contained" color="info" onClick={handleClickUpdatediffBackUpPath}>
                                    修改
                                </LoadingButton>
                            </Box>
                        </Box>
                        <Box display="flex" alignItems="center" pt={3} px={2} mb={2}>
                            <Typography variant="h5" fontWeight="medium" mr={3}>
                                還原路徑:
                            </Typography>
                            <TextField type="text" id="backUpRestroe" label="請輸入本地路徑位址" />
                            <Box ml={2}>
                                <LoadingButton size="large" variant="contained" color="info" onClick={backUpRestroeHandleClickOpen}>
                                    還原
                                </LoadingButton>
                                <Dialog
                                    open={backUpRestroeOpen}
                                    onClose={backUpRestroeHandleClickClose}
                                    aria-labelledby="alert-dialog-title"
                                    aria-describedby="alert-dialog-description"
                                >
                                    <DialogTitle id="alert-dialog-title">是否進行還原?</DialogTitle>
                                    <DialogContent>
                                        <DialogContentText id="alert-dialog-description">
                                            按下確認按鈕後將會進行還原
                                        </DialogContentText>
                                    </DialogContent>
                                    <DialogActions>
                                        <LoadingButton onClick={handleClickUBackUpRestore} color="info" variant="contained">
                                            確認
                                        </LoadingButton>
                                        <LoadingButton onClick={backUpRestroeHandleClickClose} color="info" variant="contained">
                                            关闭
                                        </LoadingButton>
                                    </DialogActions>
                                </Dialog>
                            </Box>
                        </Box>
                    </Card>
                </Grid>
            </Grid>
        </ThemeProvider>
    );
}