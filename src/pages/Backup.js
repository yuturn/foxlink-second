import React, { useState, useEffect, useContext } from "react";
import { apiPostFullBackUp, apiGetSystemEnvSetting, apiPostSchedulerDate, apiPostSchedulerCron, apiPostUpdateSetting, apiPostRestoreBackUp, apiGetBackUpStatistics } from "../api.js";
import { GlobalContext } from '../components/GlobalContext';
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

    const { globalVariable, updateGlobalVariable } = useContext(GlobalContext);

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
                console.error((globalVariable === "zh-tw" ? ("API 请求失败", error) : globalVariable === "zh-cn" ? ("API 请求失败", error) : "API request failed: No data"));
                handleErrorOpen((globalVariable === "zh-tw" ? "查詢失敗:API請求失敗" : globalVariable === "zh-cn" ? "查询失败:API请求失败" : "Query failed: API request failed"));
            });

        const diffBackUpData = {
            token: token,
            key: "diffbackup_path"
        }
        console.log(diffBackUpData)
        apiGetSystemEnvSetting(diffBackUpData)
            .then((res) => {
                console.log(res)
                handleOpen((globalVariable === "zh-tw" ? "查詢成功" : globalVariable === "zh-cn" ? "查询成功" : "Search successful"))
                setDiffBackUpPath(res.data.value)
                manualHandleClose()
            }).catch((error) => {
                console.error((globalVariable === "zh-tw" ? ("API 请求失败", error) : globalVariable === "zh-cn" ? ("API 请求失败", error) : "API request failed: No data"));
                handleErrorOpen((globalVariable === "zh-tw" ? "查詢失敗:API請求失敗" : globalVariable === "zh-cn" ? "查询失败:API请求失败" : "Query failed: API request failed"));
                manualHandleClose()
            });
        const data = {
            token: token
        }
        apiGetBackUpStatistics(data)
            .then((res) => {
                console.log(res.data)
                for (var i = 0; i < res.data.length; i++) {
                    if (res.data[i].name === "完整備份") {
                        console.log(res.data[i].name)
                        setCompletedBackupTime(res.data[i].date)
                    } else if (res.data[i].name === "差異備份") {
                        console.log(res.data[i].name)
                        setDifferentBackupTime(res.data[i].date)
                    } else {
                        console.log(res.data[i].name)
                        setManualBackupTime(res.data[i].date)
                    }
                }
                // setCompletedBackupTime(res.data[0].date)
                // setDifferentBackupTime(res.data[1].date)
                // setManualBackupTime(res.data[2].date)
            }).catch((error) => {
                console.error((globalVariable === "zh-tw" ? ("API 请求失败", error) : globalVariable === "zh-cn" ? ("API 请求失败", error) : "API request failed: No data"));
                handleErrorOpen((globalVariable === "zh-tw" ? "查詢失敗:API請求失敗" : globalVariable === "zh-cn" ? "查询失败:API请求失败" : "Query failed: API request failed"));
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
                handleOpen((globalVariable === "zh-tw" ? ("更新成功,下次更新時間" + res.data.next_run_time) : globalVariable === "zh-cn" ? ("更新成功,下次更新时间" + res.data.next_run_time) : ("Update successful, next update time" + res.data.next_run_time)));
            }).catch((error) => {
                console.error((globalVariable === "zh-tw" ? ("API 请求失败", error) : globalVariable === "zh-cn" ? ("API 请求失败", error) : "API request failed: No data"));
                handleErrorOpen((globalVariable === "zh-tw" ? "查詢失敗:API請求失敗" : globalVariable === "zh-cn" ? "查询失败:API请求失败" : "Query failed: API request failed"));
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
                handleOpen((globalVariable === "zh-tw" ? ("更新成功,下次更新時間" + res.data.next_run_time) : globalVariable === "zh-cn" ? ("更新成功,下次更新时间" + res.data.next_run_time) : ("Update successful, next update time" + res.data.next_run_time)));
            }).catch((error) => {
                console.error((globalVariable === "zh-tw" ? ("API 请求失败", error) : globalVariable === "zh-cn" ? ("API 请求失败", error) : "API request failed: No data"));
                handleErrorOpen((globalVariable === "zh-tw" ? "查詢失敗:API請求失敗" : globalVariable === "zh-cn" ? "查询失败:API请求失败" : "Query failed: API request failed"));
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
                    handleOpen((globalVariable === "zh-tw" ? ("備份成功 " + res.data.message) : globalVariable === "zh-cn" ? ("备份成功 " + res.data.message) : ("Backup successful" + res.data.message)))
                    manualHandleClose()
                } else {
                    handleErrorOpen((globalVariable === "zh-tw" ? "查詢失敗:沒有資料" : globalVariable === "zh-cn" ? "查询失败:没有资料" : "Query failed: No data"))
                    manualHandleClose()
                }
            }).catch((error) => {
                console.error((globalVariable === "zh-tw" ? ("API 请求失败", error) : globalVariable === "zh-cn" ? ("API 请求失败", error) : "API request failed: No data"));
                handleErrorOpen((globalVariable === "zh-tw" ? "查詢失敗:API請求失敗" : globalVariable === "zh-cn" ? "查询失败:API请求失败" : "Query failed: API request failed"));
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
                handleOpen((globalVariable === "zh-tw" ? "更改差異備份路徑成功" : globalVariable === "zh-cn" ? "更改差异备份路径成功" : "Change differential backup path successful"))
            }).catch((error) => {
                console.error((globalVariable === "zh-tw" ? ("API 请求失败", error) : globalVariable === "zh-cn" ? ("API 请求失败", error) : "API request failed: No data"));
                handleErrorOpen((globalVariable === "zh-tw" ? "查詢失敗:API請求失敗" : globalVariable === "zh-cn" ? "查询失败:API请求失败" : "Query failed: API request failed"));
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
                handleOpen((globalVariable === "zh-tw" ? "還原成功" : globalVariable === "zh-cn" ? "还原成功" : "Restore successful"))
                backUpRestroeHandleClickClose()
            }).catch((error) => {
                console.error((globalVariable === "zh-tw" ? ("API 请求失败", error) : globalVariable === "zh-cn" ? ("API 请求失败", error) : "API request failed: No data"));
                handleErrorOpen((globalVariable === "zh-tw" ? "查詢失敗:API請求失敗" : globalVariable === "zh-cn" ? "查询失败:API请求失败" : "Query failed: API request failed"));
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
            {globalVariable === "zh-tw" ? (
                <>
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
                                        <Box display="flex" alignItems="center" pt={3} px={2}>
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
                                        </Box>
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
                                        <TextField type="text" id="fullBackUpPath" label="請輸入IP位址" />
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
                                    <TextField type="text" id="diffBackUpPath" label="請輸入IP位址" />
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
                                    <TextField type="text" id="backUpRestroe" label="請輸入IP位址" />
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
                </>
            ) : globalVariable === "zh-cn" ? (
                <>
                    <Card>
                        <Box sx={{ bgcolor: '#696969' }}>
                            <CardHeader title="备份页面" color="#62aaf4" />
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
                                                            前次备份时间
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell align="center" sx={{ border: "1px solid black" }}>完整备份时间</TableCell>
                                                    <TableCell align="center" sx={{ border: "1px solid black" }}>{completedBackupTime}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell align="center" sx={{ border: "1px solid black" }}>差异备份时间</TableCell>
                                                    <TableCell align="center" sx={{ border: "1px solid black" }}>{differentBackupTime}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell align="center" sx={{ border: "1px solid black" }}>手动备份时间</TableCell>
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
                                                            前次备份路径
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell align="center" sx={{ border: "1px solid black" }}>完整备份路径</TableCell>
                                                    <TableCell align="center" sx={{ border: "1px solid black" }}>{backUpPath}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell align="center" sx={{ border: "1px solid black" }}>差异备份路径</TableCell>
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
                                            更新资料
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
                                    <CardHeader title="设置" color="#62aaf4" />
                                </Box>
                                <Box pt={4} pb={3} px={3}>
                                    <Box>
                                        <Box display="flex" alignItems="center" pt={3} px={2}>
                                            <Typography variant="h5" fontWeight="medium" mr={2}>
                                                完整备份时间:
                                            </Typography>
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <DateTimePicker
                                                    label="请输入完整备份时间"
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
                                                差异备份时间:
                                            </Typography>
                                            <Box mr={2}>
                                                <FormControl>
                                                    <InputLabel id="demo-simple-select-label">差异备份周期</InputLabel>
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
                                                    label="请输入差异备份时间"
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
                                        <Box display="flex" alignItems="center" pt={3} px={2}>
                                            <Typography variant="h5" fontWeight="medium" mr={2}>
                                                备份目的地1:
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
                                                备份目的地2:
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
                                    </Box>
                                </Box>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Card>
                                <Box sx={{ bgcolor: '#696969' }}>
                                    <CardHeader title="手动备份" color="#62aaf4" />
                                </Box>
                                <Box>
                                    <Typography variant="h6" color="gray" fontWeight="medium" ml={2} mt={2}>
                                        IP位置范例:/app/backup-2023-12-02.sql
                                    </Typography>
                                </Box>
                                <Box>
                                    <Box display="flex" alignItems="center" pt={3} px={2}>
                                        <Typography variant="h5" fontWeight="medium" mr={3}>
                                            完整备份路径:
                                        </Typography>
                                        <TextField type="text" id="fullBackUpPath" label="请输入IP位址" />
                                        <Box ml={2}>
                                            <LoadingButton variant="contained"
                                                size="large"
                                                color="info"
                                                onClick={manualHandleClickOpen}
                                            >
                                                手动完整备份
                                            </LoadingButton>
                                            <Dialog
                                                open={manualOpen}
                                                onClose={manualHandleClose}
                                                aria-labelledby="alert-dialog-manual"
                                                aria-describedby="alert-dialog-manual"
                                            >
                                                <DialogTitle id="alert-dialog-title">是否手动备份?</DialogTitle>
                                                <DialogContent>
                                                    <DialogContentText id="alert-dialog-manual">
                                                        按下确认按钮后将会进行手动备份
                                                    </DialogContentText>
                                                </DialogContent>
                                                <DialogActions>
                                                    <LoadingButton color="info" onClick={handleClickFullBackUp} autoFocus variant="contained">
                                                        确认
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
                                        差异备份路径:
                                    </Typography>
                                    <TextField type="text" id="diffBackUpPath" label="请输入IP位址" />
                                    <Box ml={2}>
                                        <LoadingButton size="large" variant="contained" color="info" onClick={handleClickUpdatediffBackUpPath}>
                                            修改
                                        </LoadingButton>
                                    </Box>
                                </Box>
                                <Box display="flex" alignItems="center" pt={3} px={2} mb={2}>
                                    <Typography variant="h5" fontWeight="medium" mr={3}>
                                        还原路径:
                                    </Typography>
                                    <TextField type="text" id="backUpRestroe" label="请输入IP位址" />
                                    <Box ml={2}>
                                        <LoadingButton size="large" variant="contained" color="info" onClick={backUpRestroeHandleClickOpen}>
                                            还原
                                        </LoadingButton>
                                        <Dialog
                                            open={backUpRestroeOpen}
                                            onClose={backUpRestroeHandleClickClose}
                                            aria-labelledby="alert-dialog-title"
                                            aria-describedby="alert-dialog-description"
                                        >
                                            <DialogTitle id="alert-dialog-title">是否进行还原?</DialogTitle>
                                            <DialogContent>
                                                <DialogContentText id="alert-dialog-description">
                                                    按下确认按钮后将会进行还原
                                                </DialogContentText>
                                            </DialogContent>
                                            <DialogActions>
                                                <LoadingButton onClick={handleClickUBackUpRestore} color="info" variant="contained">
                                                    确认
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
                </>
            ) : (
                <>
                    <Card>
                        <Box sx={{ bgcolor: '#696969' }}>
                            <CardHeader title="Backup page" color="#62aaf4" />
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
                                                            Last backup time
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell align="center" sx={{ border: "1px solid black" }}>Full backup time</TableCell>
                                                    <TableCell align="center" sx={{ border: "1px solid black" }}>{completedBackupTime}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell align="center" sx={{ border: "1px solid black" }}>Differential backup time</TableCell>
                                                    <TableCell align="center" sx={{ border: "1px solid black" }}>{differentBackupTime}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell align="center" sx={{ border: "1px solid black" }}>Manual backup time</TableCell>
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
                                                            Last backup path
                                                        </Typography>
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell align="center" sx={{ border: "1px solid black" }}>Full backup path</TableCell>
                                                    <TableCell align="center" sx={{ border: "1px solid black" }}>{backUpPath}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell align="center" sx={{ border: "1px solid black" }}>Differential backup path</TableCell>
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
                                            Update data
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
                                    <CardHeader title="Settings" color="#62aaf4" />
                                </Box>
                                <Box pt={4} pb={3} px={3}>
                                    <Box>
                                        <Box display="flex" alignItems="center" pt={3} px={2}>
                                            <Typography variant="h5" fontWeight="medium" mr={2}>
                                                Full backup time:
                                            </Typography>
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <DateTimePicker
                                                    label="Please enter the full backup time"
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
                                                    Change
                                                </LoadingButton>
                                            </Box>
                                        </Box>
                                        <Box display="flex" alignItems="center" pt={3} px={2}>
                                            <Typography variant="h5" fontWeight="medium" mr={2}>
                                                Differential backup time:
                                            </Typography>
                                            <Box mr={2}>
                                                <FormControl>
                                                    <InputLabel id="demo-simple-select-label">Differential backup cycle</InputLabel>
                                                    <Select
                                                        labelId="permission-select-label"
                                                        id="permission-select"
                                                        value={differentBackUp}
                                                        label="Differential backup cycle"
                                                        onChange={handleChangeDifferentBackUp}
                                                        style={{ minWidth: "150px", height: "45px" }}
                                                    >
                                                        <MenuItem value="Monthly">Monthly</MenuItem>
                                                        <MenuItem value="Weekly">Weekly</MenuItem>
                                                        <MenuItem value="Daily">Daily</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </Box>
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <DateTimePicker
                                                    label="Please enter the differential backup time"
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
                                                    Change
                                                </LoadingButton>
                                            </Box>
                                        </Box>
                                        <Box display="flex" alignItems="center" pt={3} px={2}>
                                            <Typography variant="h5" fontWeight="medium" mr={2}>
                                                Backup destination 1:
                                            </Typography>
                                            <TextField type="text" label="Please enter IP address" />
                                            <Box ml={2}>
                                                <LoadingButton variant="contained"
                                                    size="large"
                                                    component="span"
                                                    color="info"
                                                >
                                                    Change
                                                </LoadingButton>
                                            </Box>
                                        </Box>
                                        <Box display="flex" alignItems="center" pt={3} px={2}>
                                            <Typography variant="h5" fontWeight="medium" mr={2}>
                                                Backup destination 2:
                                            </Typography>
                                            <TextField type="text" label="Please enter IP address" />
                                            <Box ml={2}>
                                                <LoadingButton variant="contained"
                                                    size="large"
                                                    component="span"
                                                    color="info"
                                                >
                                                    Change
                                                </LoadingButton>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Box>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Card>
                                <Box sx={{ bgcolor: '#696969' }}>
                                    <CardHeader title="Manual backup" color="#62aaf4" />
                                </Box>
                                <Box>
                                    <Typography variant="h6" color="gray" fontWeight="medium" ml={2} mt={2}>
                                        IP location example:/app/backup-2023-12-02.sql
                                    </Typography>
                                </Box>
                                <Box>
                                    <Box display="flex" alignItems="center" pt={3} px={2}>
                                        <Typography variant="h5" fontWeight="medium" mr={3}>
                                            Full backup path:
                                        </Typography>
                                        <TextField type="text" id="fullBackUpPath" label="Please enter IP address" />
                                        <Box ml={2}>
                                            <LoadingButton variant="contained"
                                                size="large"
                                                color="info"
                                                onClick={manualHandleClickOpen}
                                            >
                                                Manual full backup
                                            </LoadingButton>
                                            <Dialog
                                                open={manualOpen}
                                                onClose={manualHandleClose}
                                                aria-labelledby="alert-dialog-manual"
                                                aria-describedby="alert-dialog-manual"
                                            >
                                                <DialogTitle id="alert-dialog-title">Whether to back up manually?</DialogTitle>
                                                <DialogContent>
                                                    <DialogContentText id="alert-dialog-manual">
                                                        After pressing the confirm button, a manual backup will be performed
                                                    </DialogContentText>
                                                </DialogContent>
                                                <DialogActions>
                                                    <LoadingButton color="info" onClick={handleClickFullBackUp} autoFocus variant="contained">
                                                        Confirm
                                                    </LoadingButton>
                                                    <LoadingButton color="info" onClick={manualHandleClose} autoFocus variant="contained">
                                                        Close
                                                    </LoadingButton>
                                                </DialogActions>
                                            </Dialog>
                                        </Box>
                                    </Box>
                                </Box>
                                <Box display="flex" alignItems="center" pt={3} px={2}>
                                    <Typography variant="h5" fontWeight="medium" mr={3}>
                                        Differential backup path:
                                    </Typography>
                                    <TextField type="text" id="diffBackUpPath" label="Please enter IP address" />
                                    <Box ml={2}>
                                        <LoadingButton size="large" variant="contained" color="info" onClick={handleClickUpdatediffBackUpPath}>
                                            Revise
                                        </LoadingButton>
                                    </Box>
                                </Box>
                                <Box display="flex" alignItems="center" pt={3} px={2} mb={2}>
                                    <Typography variant="h5" fontWeight="medium" mr={3}>
                                        Restore path:
                                    </Typography>
                                    <TextField type="text" id="backUpRestroe" label="Please enter IP address" />
                                    <Box ml={2}>
                                        <LoadingButton size="large" variant="contained" color="info" onClick={backUpRestroeHandleClickOpen}>
                                            Reduction
                                        </LoadingButton>
                                        <Dialog
                                            open={backUpRestroeOpen}
                                            onClose={backUpRestroeHandleClickClose}
                                            aria-labelledby="alert-dialog-title"
                                            aria-describedby="alert-dialog-description"
                                        >
                                            <DialogTitle id="alert-dialog-title">Whether to restore?</DialogTitle>
                                            <DialogContent>
                                                <DialogContentText id="alert-dialog-description">
                                                    Restore will take place after pressing the confirm button
                                                </DialogContentText>
                                            </DialogContent>
                                            <DialogActions>
                                                <LoadingButton onClick={handleClickUBackUpRestore} color="info" variant="contained">
                                                    Confirm
                                                </LoadingButton>
                                                <LoadingButton onClick={backUpRestroeHandleClickClose} color="info" variant="contained">
                                                    Close
                                                </LoadingButton>
                                            </DialogActions>
                                        </Dialog>
                                    </Box>
                                </Box>
                            </Card>
                        </Grid>
                    </Grid>
                </>
            )}
        </ThemeProvider>
    );
}