import React, { useState, useEffect } from "react";
import { apiPostFullBackUp } from "../api.js";

// import DashboardNavbar from "../examples/Navbars/DashboardNavbar";

import { Box, Card, Grid, Typography, Divider, CardContent, CardHeader, ThemeProvider, createTheme } from '@mui/material';
// import { ThemeProvider, createTheme } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';

import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';

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
    const completedBackupTime = "2023/06/11 12:30:00";
    const differentBackupTime = "2023/06/12 12:30:00";
    const manualBackupTime = "2023/06/12 12:30:00";

    const [manualOpen, setManualOpen] = useState(false);
    const [backupOpen, setBackupOpen] = useState(false);
    const [fullDate, setFullDateDate] = useState(new Date());
    const [diffDate, setDiffDateDate] = useState(new Date());

    const backupHandleClickOpen = () => {
        setBackupOpen(true);
    };
    const backupHandleClose = () => {
        setBackupOpen(false);
    };
    const manualHandleClickOpen = () => {
        setManualOpen(true);
    };
    const manualHandleClose = () => {
        setManualOpen(false);
    };
    useEffect(() => {
        const data = {
            token: token,
            fullDate: new Date(fullDate).toISOString(),
            diffDate: new Date(diffDate).toISOString()
        }
    })

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
                if (res.status == 200) {
                    handleOpen("備份成功" + res.data.message)
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
                    <Box component="form" role="form">
                        <Typography variant="h5" fontWeight="medium">
                            前次備份時間
                        </Typography>
                        <Box display="flex" alignItems="center" pt={3} px={2}>
                            <Typography variant="h6" fontWeight="medium" mr={2}>
                                完整備份時間:{completedBackupTime}
                            </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" pt={3} px={2}>
                            <Typography variant="h6" fontWeight="medium" mr={2}>
                                差異備份時間:{differentBackupTime}
                            </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" pt={3} px={2}>
                            <Typography variant="h6" fontWeight="medium" mr={2}>
                                手動備份時間:{manualBackupTime}
                            </Typography>
                        </Box>
                    </Box>
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
                                            sx={{
                                                borderRadius: 4,
                                                justifyContent: 'center',
                                                letterSpacing: 3,
                                                mt: 2
                                            }}
                                        >
                                            更改
                                        </LoadingButton>
                                    </Box>
                                </Box>
                                <Box display="flex" alignItems="center" pt={3} px={2}>
                                    <Typography variant="h5" fontWeight="medium" mr={2}>
                                        差異備份時間:
                                    </Typography>
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
                                            sx={{
                                                borderRadius: 4,
                                                justifyContent: 'center',
                                                letterSpacing: 3,
                                                mt: 2
                                            }}
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
                                            sx={{
                                                borderRadius: 4,
                                                justifyContent: 'center',
                                                letterSpacing: 3,
                                                mt: 2
                                            }}
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
                                            sx={{
                                                borderRadius: 4,
                                                justifyContent: 'center',
                                                letterSpacing: 3,
                                                mt: 2
                                            }}
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
                            <Box display="flex" alignItems="center" pt={3} px={2}>
                                <Typography variant="h5" fontWeight="medium" mr={3}>
                                    完整備份路徑:
                                </Typography>
                                <TextField type="text" id="fullBackUpPath" label="請輸入IP位址" />
                                <Box ml={2}>
                                    <LoadingButton variant="contained"
                                        size="large"
                                        color="info"
                                        sx={{
                                            borderRadius: 4,
                                            justifyContent: 'center',
                                            letterSpacing: 3,
                                        }}
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
                                            <LoadingButton onClick={handleClickFullBackUp} autoFocus variant="contained">
                                                確認
                                            </LoadingButton>
                                            <LoadingButton onClick={manualHandleClose} autoFocus variant="contained">
                                                关闭
                                            </LoadingButton>
                                        </DialogActions>
                                    </Dialog>
                                </Box>
                            </Box>
                        </Box>
                        <Box display="flex" alignItems="center" pt={3} px={2} mb={2}>
                            <Typography variant="h5" fontWeight="medium" mr={3}>
                                差異備份路徑:
                            </Typography>
                            <TextField type="text" label="請輸入IP位址" />
                            <Box ml={2}>
                                <LoadingButton variant="contained" color="info" onClick={backupHandleClickOpen}>
                                    還原
                                </LoadingButton>
                                <Dialog
                                    open={backupOpen}
                                    onClose={backupHandleClose}
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
                                        <LoadingButton onClick={backupHandleClose} autoFocus variant="contained">
                                            確認
                                        </LoadingButton>
                                        <LoadingButton onClick={backupHandleClose} autoFocus variant="contained">
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