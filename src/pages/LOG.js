import React, { useState, useEffect, useContext } from "react";

import { GlobalContext } from '../components/GlobalContext';
import { apiGetLOG } from '../api'

import { Box, Card, CardContent, CardHeader, Divider, Typography, createTheme, ThemeProvider, TextField, Grid, Select, FormControl, InputLabel, MenuItem, } from '@mui/material';

// import 選擇日期套件
import LoadingButton from '@mui/lab/LoadingButton';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';


// import table 的相關套件
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

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

function createData(date, behavior, project, id, name) {
    return { date, behavior, project, id, name };
}

const rows = [
    createData(20220711, "差異備份時間更改", 'D7X', 'c001', '林小家'),
    createData(20220713, "還原", 'D7X', 'c002', '林小遠'),
    createData(20220715, "模型預測", 'D7X', 'c003', '羅小敏'),
    createData(20220722, "差異備份路徑更改", 'D7X', 'c004', '羅小聖'),
    createData(20220802, "完整備份執行", 'D7X', 'c005', '李小騰'),
];


export default function LOG({ token, ...rest }) {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
    const [startDate, setStartDate] = useState(startOfDay);
    const [endDate, setEndDate] = useState(endOfDay);
    const [operationType, setOperationType] = useState();
    const [logData, setLogData] = useState([]);
    const [currentPage, setCurrentPage] = useState();
    const [totalPage, setTotalPage] = useState();
    const [totalData, setTotalData] = useState();
    const { globalVariable, updateGlobalVariable } = useContext(GlobalContext);

    //操作類型改變時
    const operationTypeChange = (event) => {
        setOperationType(event.target.value);
    };


    //這邊是查詢LOG的按鈕
    const handleClickChartSearch = () => {
        let badge = document.getElementById('employeeID').value;
        let pageDataCount = document.getElementById('pageDataCount').value;
        const data = {
            startDate: new Date(startDate).toISOString().split('T')[0] + ' 00%3A00%3A00',
            endDate: new Date(endDate).toISOString().split('T')[0] + ' 00%3A00%3A00',
            action: operationType,
            badge: badge,
            page: 1,
            limit: pageDataCount,
            token: token
        }
        console.log(data)
        apiGetLOG(data)
            .then((res) => {
                console.log(res.data.logs)
                if (res.data.logs && res.data.logs.length > 0) {
                    setLogData(res.data.logs)
                    setCurrentPage(res.data.page)
                    setTotalData(res.data.total)
                    if (res.data.total % res.data.limit == 0) {
                        setTotalPage(res.data.total / res.data.limit)
                    } else {
                        setTotalPage(Math.floor(res.data.total / res.data.limit) + 1)
                    }
                    handleOpen((globalVariable == "zh-tw" ? "查詢成功" : globalVariable == "zh-cn" ? "查询成功" : "Search successful"))
                } else {
                    setLogData([])
                    setCurrentPage()
                    setTotalData()
                    setTotalPage()
                    handleErrorOpen((globalVariable == "zh-tw" ? "查詢失敗:沒有資料" : globalVariable == "zh-cn" ? "查询失败:没有资料" : "Query failed: No data"))
                }
            }).catch((error) => {
                console.error((globalVariable == "zh-tw" ? ("API 请求失败", error) : globalVariable == "zh-cn" ? ("API 请求失败", error) : ("API request failed", error)));
                setLogData([])
                setCurrentPage()
                setTotalData()
                setTotalPage()
                handleErrorOpen((globalVariable == "zh-tw" ? "查詢失敗:API請求失敗" : globalVariable == "zh-cn" ? "查询失败:API请求失败" : "Query failed: API request failed"));
            });
    };
    //這邊是上一頁的按鈕
    const handleClickLastPage = () => {
        let badge = document.getElementById('employeeID').value;
        let pageDataCount = document.getElementById('pageDataCount').value;
        if (currentPage > 1) {
            const data = {
                startDate: new Date(startDate).toISOString().split('T')[0] + ' 00%3A00%3A00',
                endDate: new Date(endDate).toISOString().split('T')[0] + ' 00%3A00%3A00',
                action: operationType,
                badge: badge,
                page: currentPage - 1,
                limit: pageDataCount,
                token: token
            }
            console.log(data)
            apiGetLOG(data)
                .then((res) => {
                    console.log(res.data.logs)
                    if (res.data.logs && res.data.logs.length > 0) {
                        setLogData(res.data.logs)
                        setCurrentPage(res.data.page)
                        setTotalData(res.data.total)
                        if (res.data.total % res.data.limit == 0) {
                            setTotalPage(res.data.total / res.data.limit)
                        } else {
                            setTotalPage(Math.floor(res.data.total / res.data.limit) + 1)
                        }
                        handleOpen((globalVariable == "zh-tw" ? "查詢成功" : globalVariable == "zh-cn" ? "查询成功" : "Search successful"))
                    } else {
                        setLogData([])
                        setCurrentPage()
                        setTotalData()
                        setTotalPage()
                        handleErrorOpen((globalVariable == "zh-tw" ? "查詢失敗:沒有資料" : globalVariable == "zh-cn" ? "查询失败:没有资料" : "Query failed: No data"))
                    }
                }).catch((error) => {
                    console.error((globalVariable == "zh-tw" ? ("API 请求失败", error) : globalVariable == "zh-cn" ? ("API 请求失败", error) : ("API request failed", error)));
                    setLogData([])
                    setCurrentPage()
                    setTotalData()
                    setTotalPage()
                    handleErrorOpen((globalVariable == "zh-tw" ? "查詢失敗:API請求失敗" : globalVariable == "zh-cn" ? "查询失败:API请求失败" : "Query failed: API request failed"));
                });
        } else {
            handleErrorOpen("沒有上一頁")
        }
    };

    //這邊是下一頁的按鈕
    const handleClickNextPage = () => {
        let badge = document.getElementById('employeeID').value;
        let pageDataCount = document.getElementById('pageDataCount').value;
        if (currentPage < totalPage) {
            const data = {
                startDate: new Date(startDate).toISOString().split('T')[0] + ' 00%3A00%3A00',
                endDate: new Date(endDate).toISOString().split('T')[0] + ' 00%3A00%3A00',
                action: operationType,
                badge: badge,
                page: currentPage + 1,
                limit: pageDataCount,
                token: token
            }
            console.log(data)
            apiGetLOG(data)
                .then((res) => {
                    console.log(res.data.logs)
                    if (res.data.logs && res.data.logs.length > 0) {
                        setLogData(res.data.logs)
                        setCurrentPage(res.data.page)
                        setTotalData(res.data.total)
                        if (res.data.total % res.data.limit == 0) {
                            setTotalPage(res.data.total / res.data.limit)
                        } else {
                            setTotalPage(Math.floor(res.data.total / res.data.limit) + 1)
                        }
                        handleOpen((globalVariable == "zh-tw" ? "查詢成功" : globalVariable == "zh-cn" ? "查询成功" : "Search successful"))
                    } else {
                        setLogData([])
                        setCurrentPage()
                        setTotalData()
                        setTotalPage()
                        handleErrorOpen((globalVariable == "zh-tw" ? "查詢失敗:沒有資料" : globalVariable == "zh-cn" ? "查询失败:没有资料" : "Query failed: No data"))
                    }
                }).catch((error) => {
                    console.error((globalVariable == "zh-tw" ? ("API 请求失败", error) : globalVariable == "zh-cn" ? ("API 请求失败", error) : ("API request failed", error)));
                    setLogData([])
                    setCurrentPage()
                    setTotalData()
                    setTotalPage()
                    handleErrorOpen((globalVariable == "zh-tw" ? "查詢失敗:API請求失敗" : globalVariable == "zh-cn" ? "查询失败:API请求失败" : "Query failed: API request failed"));
                });
        } else {
            handleErrorOpen("沒有下一頁")
        }
    };

    const [pageDataCount, setPageDataCount] = useState(10);
    const [pageNumber, setPageNumber] = useState(1);

    // 定义处理函数来更新状态
    const handlePageDataCountChange = (event) => {
        setPageDataCount(event.target.value);
    };

    const handlePageNumberChange = (event) => {
        setPageNumber(event.target.value);
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
            {globalVariable == "zh-tw" ? (
                <Card >
                    <Box sx={{ bgcolor: '#696969' }}>
                        <CardHeader title="LOG頁面:" color="#62aaf4" />
                    </Box>
                    <Divider sx={{ borderBottomWidth: 3 }} />
                    <CardContent>
                        <Grid container spacing={1} mt={1}>
                            <Grid container alignItems="center" justifyContent="left" item xs={2}>
                                <Typography variant="h4" fontWeight="medium">
                                    條件篩選
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid container spacing={1} mt={2}>
                            <Grid container alignItems="center" justifyContent="left" item xs={3}>
                                <Box component="form" role="form">
                                    <Box display="flex" alignItems="center" pt={2} >
                                        <Typography variant="h6" fontWeight="medium" alignItems="center" justifyContent="center" mr={2}>
                                            開始時間:
                                        </Typography>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DatePicker
                                                label="選擇日期"
                                                value={startDate}
                                                onChange={(newValue) => {
                                                    setStartDate(newValue);
                                                }}
                                                renderInput={(params) => <TextField size="medium" {...params} />}
                                            />
                                        </LocalizationProvider>
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid container alignItems="center" justifyContent="left" item xs={3}>
                                <Box component="form" role="form">
                                    <Box display="flex" alignItems="center" pt={2} >
                                        <Typography variant="h6" fontWeight="medium" alignItems="center" justifyContent="center" mr={2}>
                                            結束時間:
                                        </Typography>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DatePicker
                                                label="選擇日期"
                                                value={endDate}
                                                onChange={(newValue) => {
                                                    console.log('Selected Start Date:', newValue);
                                                    setEndDate(newValue);
                                                }}
                                                renderInput={(params) => <TextField size="medium" {...params} />}
                                            />
                                        </LocalizationProvider>
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid container alignItems="center" justifyContent="left" item xs={3}>
                                <Typography variant="h6" fontWeight="medium" alignItems="center" justifyContent="center" mr={2}>
                                    顯示筆數:
                                </Typography>
                                <Box component="form" role="form">
                                    <TextField
                                        fullWidth
                                        label="顯示筆數"
                                        margin="none"
                                        name="pageDataCount"
                                        id="pageDataCount"
                                        variant="outlined"
                                        value={pageDataCount}
                                        onChange={handlePageDataCountChange}
                                    />
                                </Box>
                            </Grid>
                        </Grid>
                        <Grid container spacing={1} sx={{ mt: 1 }}>
                            <Grid container alignItems="center" justifyContent="left" item xs={3}>
                                <Typography variant="h6" fontWeight="medium" alignItems="center" justifyContent="center" mr={2}>
                                    操作類型:
                                </Typography>
                                <Box component="form" role="form">
                                    <FormControl>
                                        <InputLabel id="operation-type-select-label">操作類型</InputLabel>
                                        <Select
                                            labelId="permission-select-label"
                                            id="permission-select"
                                            value={operationType}
                                            label="操作類型"
                                            onChange={operationTypeChange}
                                            style={{ minWidth: "271px", height: "56px" }}
                                        >
                                            <MenuItem value="">清空欄位</MenuItem>
                                            <MenuItem value="USER_LOGIN">USER_LOGIN</MenuItem>
                                            <MenuItem value="USER_LOGOUT">USER_LOGOUT</MenuItem>
                                            <MenuItem value="DATA_PREPROCESSING_STARTED">DATA_PREPROCESSING_STARTED</MenuItem>
                                            <MenuItem value="DATA_PREPROCESSING_SUCCESS">DATA_PREPROCESSING_SUCCESS</MenuItem>
                                            <MenuItem value="DATA_PREPROCESSING_FAILED">DATA_PREPROCESSING_FAILED</MenuItem>
                                            <MenuItem value="DAILY_PREPROCESSING_STARTED">DAILY_PREPROCESSING_STARTED</MenuItem>
                                            <MenuItem value="DAILY_PREPROCESSING_SUCCESS">DAILY_PREPROCESSING_SUCCESS</MenuItem>
                                            <MenuItem value="DAILY_PREPROCESSING_FAILED">DAILY_PREPROCESSING_FAILED</MenuItem>
                                            <MenuItem value="FULL_BACKUP">FULL_BACKUP</MenuItem>
                                            <MenuItem value="BACKUP_RESTORE">BACKUP_RESTORE</MenuItem>
                                            <MenuItem value="ADD_NEW_PROJECT">ADD_NEW_PROJECT</MenuItem>
                                            <MenuItem value="ADD_PROJECT_WORKER">ADD_PROJECT_WORKER</MenuItem>
                                            <MenuItem value="ADD_PROJECT_WORKER">ADD_PROJECT_WORKER</MenuItem>
                                            <MenuItem value="DELETE_PROJECT">DELETE_PROJECT</MenuItem>
                                            <MenuItem value="DELETE_PROJECT_WORKER">DELETE_PROJECT_WORKER</MenuItem>
                                            <MenuItem value="TRAINING_SUCCEEDED">TRAINING_SUCCEEDED</MenuItem>
                                            <MenuItem value="TRAINING_FAILED">TRAINING_FAILED</MenuItem>
                                            <MenuItem value="PREDICT_SUCCEEDED">PREDICT_SUCCEEDED</MenuItem>
                                            <MenuItem value="PREDICT_FAILED">PREDICT_FAILED</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Box>
                            </Grid>
                            <Grid container alignItems="center" justifyContent="left" item xs={3}>
                                <Typography variant="h6" fontWeight="medium" alignItems="center" justifyContent="center" mr={2}>
                                    專案名稱:
                                </Typography>
                                <Box component="form" role="form" >
                                    <TextField
                                        fullWidth
                                        label="專案名稱"
                                        margin="none"
                                        name="projectName"
                                        id="projectName"
                                        variant="outlined"
                                    />
                                </Box>
                            </Grid>
                            <Grid container alignItems="center" justifyContent="left" item xs={3}>
                                <Typography variant="h6" fontWeight="medium" alignItems="center" justifyContent="center" mr={2}>
                                    員工姓名:
                                </Typography>
                                <Box component="form" role="form" sx={{ ml: 2 }}>
                                    <TextField
                                        fullWidth
                                        label="員工姓名"
                                        margin="none"
                                        name="employeeName"
                                        id="employeeName"
                                        variant="outlined"
                                    />
                                </Box>
                            </Grid>
                            <Grid container alignItems="center" justifyContent="left" item xs={3}>
                                <Typography variant="h6" fontWeight="medium" alignItems="center" justifyContent="center" mr={2}>
                                    員工ID:
                                </Typography>
                                <Box component="form" role="form" sx={{ ml: 2 }}>
                                    <TextField
                                        fullWidth
                                        label="員工ID"
                                        margin="none"
                                        name="employeeID"
                                        id="employeeID"
                                        variant="outlined"
                                    />
                                </Box>
                            </Grid>
                        </Grid>
                        <Grid container spacing={1}>
                            <Grid item xs={12}>
                                <Box display="flex" alignItems="center" justifyContent="center" pt={3} >
                                    <LoadingButton variant="contained" color="info" align="center" onClick={handleClickChartSearch} style={{ width: '150px' }}>
                                        查詢
                                    </LoadingButton>
                                </Box>
                            </Grid>
                        </Grid>
                        <Grid container spacing={1} mt={1}>
                            <TableContainer component={Paper}>
                                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="center" sx={{ backgroundColor: "#bfbfbf" }}>操作時間</TableCell>
                                            <TableCell align="center" sx={{ backgroundColor: "#bfbfbf" }}>操作類型</TableCell>
                                            <TableCell align="center" sx={{ backgroundColor: "#bfbfbf" }}>員工ID</TableCell>
                                            <TableCell align="center" sx={{ backgroundColor: "#bfbfbf" }}>員工姓名</TableCell>
                                            <TableCell align="center" sx={{ backgroundColor: "#bfbfbf" }}>說明</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {logData.map((row) => (
                                            <TableRow
                                                key={row.name}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell align="center">{row.created_date}</TableCell>
                                                <TableCell align="center">{row.action}</TableCell>
                                                <TableCell component="th" scope="row" align="center">{row.badge}</TableCell>
                                                <TableCell align="center">{row.username}</TableCell>
                                                <TableCell align="center">{row.description}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                        <Grid container spacing={1}>
                            <Grid container alignItems="center" justifyContent="left" item xs={4}>
                            </Grid>
                            <Grid container alignItems="center" justifyContent="center" item xs={4}>
                                <Box component="form" role="form">
                                    <Box display="flex" alignItems="center" pt={2} >
                                        <LoadingButton variant="contained" color="info" align="center" onClick={handleClickLastPage} style={{ width: '100px' }}>
                                            上一頁
                                        </LoadingButton>
                                        <Typography variant="h6" fontWeight="medium" alignItems="center" justifyContent="center" ml={2} mr={2}>
                                            當前頁數 {currentPage}/{totalPage} 總共頁數
                                        </Typography>
                                        <LoadingButton variant="contained" color="info" align="center" onClick={handleClickNextPage} style={{ width: '100px' }}>
                                            下一頁
                                        </LoadingButton>
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid container alignItems="center" justifyContent="right" item xs={4}>
                                <Box component="form" role="form">
                                    <Box display="flex" alignItems="center" pt={2} >
                                        <Typography variant="h6" fontWeight="medium" alignItems="center" justifyContent="center" mr={2}>
                                            總資料筆數:{totalData}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            ) : globalVariable == "zh-cn" ? (
                <Card >
                    <Box sx={{ bgcolor: '#696969' }}>
                        <CardHeader title="LOG页面:" color="#62aaf4" />
                    </Box>
                    <Divider sx={{ borderBottomWidth: 3 }} />
                    <CardContent>
                        <Grid container spacing={1} mt={1}>
                            <Grid container alignItems="center" justifyContent="left" item xs={2}>
                                <Typography variant="h4" fontWeight="medium">
                                    条件筛选
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid container spacing={1} mt={2}>
                            <Grid container alignItems="center" justifyContent="left" item xs={3}>
                                <Box component="form" role="form">
                                    <Box display="flex" alignItems="center" pt={2} >
                                        <Typography variant="h6" fontWeight="medium" alignItems="center" justifyContent="center" mr={2}>
                                            开始时间:
                                        </Typography>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DatePicker
                                                label="选择日期"
                                                value={startDate}
                                                onChange={(newValue) => {
                                                    setStartDate(newValue);
                                                }}
                                                renderInput={(params) => <TextField size="medium" {...params} />}
                                            />
                                        </LocalizationProvider>
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid container alignItems="center" justifyContent="left" item xs={3}>
                                <Box component="form" role="form">
                                    <Box display="flex" alignItems="center" pt={2} >
                                        <Typography variant="h6" fontWeight="medium" alignItems="center" justifyContent="center" mr={2}>
                                            结束时间:
                                        </Typography>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DatePicker
                                                label="选择日期"
                                                value={endDate}
                                                onChange={(newValue) => {
                                                    console.log('Selected Start Date:', newValue);
                                                    setEndDate(newValue);
                                                }}
                                                renderInput={(params) => <TextField size="medium" {...params} />}
                                            />
                                        </LocalizationProvider>
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid container alignItems="center" justifyContent="left" item xs={3}>
                                <Typography variant="h6" fontWeight="medium" alignItems="center" justifyContent="center" mr={2}>
                                    显示笔数:
                                </Typography>
                                <Box component="form" role="form">
                                    <TextField
                                        fullWidth
                                        label="显示笔数"
                                        margin="none"
                                        name="pageDataCount"
                                        id="pageDataCount"
                                        variant="outlined"
                                        value={pageDataCount}
                                        onChange={handlePageDataCountChange}
                                    />
                                </Box>
                            </Grid>
                        </Grid>
                        <Grid container spacing={1} sx={{ mt: 1 }}>
                            <Grid container alignItems="center" justifyContent="left" item xs={3}>
                                <Typography variant="h6" fontWeight="medium" alignItems="center" justifyContent="center" mr={2}>
                                    操作类型:
                                </Typography>
                                <Box component="form" role="form">
                                    <FormControl>
                                        <InputLabel id="operation-type-select-label">操作类型</InputLabel>
                                        <Select
                                            labelId="permission-select-label"
                                            id="permission-select"
                                            value={operationType}
                                            label="操作类型"
                                            onChange={operationTypeChange}
                                            style={{ minWidth: "271px", height: "56px" }}
                                        >
                                            <MenuItem value="">清空栏位</MenuItem>
                                            <MenuItem value="USER_LOGIN">USER_LOGIN</MenuItem>
                                            <MenuItem value="USER_LOGOUT">USER_LOGOUT</MenuItem>
                                            <MenuItem value="DATA_PREPROCESSING_STARTED">DATA_PREPROCESSING_STARTED</MenuItem>
                                            <MenuItem value="DATA_PREPROCESSING_SUCCESS">DATA_PREPROCESSING_SUCCESS</MenuItem>
                                            <MenuItem value="DATA_PREPROCESSING_FAILED">DATA_PREPROCESSING_FAILED</MenuItem>
                                            <MenuItem value="DAILY_PREPROCESSING_STARTED">DAILY_PREPROCESSING_STARTED</MenuItem>
                                            <MenuItem value="DAILY_PREPROCESSING_SUCCESS">DAILY_PREPROCESSING_SUCCESS</MenuItem>
                                            <MenuItem value="DAILY_PREPROCESSING_FAILED">DAILY_PREPROCESSING_FAILED</MenuItem>
                                            <MenuItem value="FULL_BACKUP">FULL_BACKUP</MenuItem>
                                            <MenuItem value="BACKUP_RESTORE">BACKUP_RESTORE</MenuItem>
                                            <MenuItem value="ADD_NEW_PROJECT">ADD_NEW_PROJECT</MenuItem>
                                            <MenuItem value="ADD_PROJECT_WORKER">ADD_PROJECT_WORKER</MenuItem>
                                            <MenuItem value="ADD_PROJECT_WORKER">ADD_PROJECT_WORKER</MenuItem>
                                            <MenuItem value="DELETE_PROJECT">DELETE_PROJECT</MenuItem>
                                            <MenuItem value="DELETE_PROJECT_WORKER">DELETE_PROJECT_WORKER</MenuItem>
                                            <MenuItem value="TRAINING_SUCCEEDED">TRAINING_SUCCEEDED</MenuItem>
                                            <MenuItem value="TRAINING_FAILED">TRAINING_FAILED</MenuItem>
                                            <MenuItem value="PREDICT_SUCCEEDED">PREDICT_SUCCEEDED</MenuItem>
                                            <MenuItem value="PREDICT_FAILED">PREDICT_FAILED</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Box>
                            </Grid>
                            <Grid container alignItems="center" justifyContent="left" item xs={3}>
                                <Typography variant="h6" fontWeight="medium" alignItems="center" justifyContent="center" mr={2}>
                                    专案名称:
                                </Typography>
                                <Box component="form" role="form" >
                                    <TextField
                                        fullWidth
                                        label="专案名称"
                                        margin="none"
                                        name="projectName"
                                        id="projectName"
                                        variant="outlined"
                                    />
                                </Box>
                            </Grid>
                            <Grid container alignItems="center" justifyContent="left" item xs={3}>
                                <Typography variant="h6" fontWeight="medium" alignItems="center" justifyContent="center" mr={2}>
                                    员工姓名:
                                </Typography>
                                <Box component="form" role="form" sx={{ ml: 2 }}>
                                    <TextField
                                        fullWidth
                                        label="员工姓名"
                                        margin="none"
                                        name="employeeName"
                                        id="employeeName"
                                        variant="outlined"
                                    />
                                </Box>
                            </Grid>
                            <Grid container alignItems="center" justifyContent="left" item xs={3}>
                                <Typography variant="h6" fontWeight="medium" alignItems="center" justifyContent="center" mr={2}>
                                    员工ID:
                                </Typography>
                                <Box component="form" role="form" sx={{ ml: 2 }}>
                                    <TextField
                                        fullWidth
                                        label="员工ID"
                                        margin="none"
                                        name="employeeID"
                                        id="employeeID"
                                        variant="outlined"
                                    />
                                </Box>
                            </Grid>
                        </Grid>
                        <Grid container spacing={1}>
                            <Grid item xs={12}>
                                <Box display="flex" alignItems="center" justifyContent="center" pt={3} >
                                    <LoadingButton variant="contained" color="info" align="center" onClick={handleClickChartSearch} style={{ width: '150px' }}>
                                        查询
                                    </LoadingButton>
                                </Box>
                            </Grid>
                        </Grid>
                        <Grid container spacing={1} mt={1}>
                            <TableContainer component={Paper}>
                                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="center" sx={{ backgroundColor: "#bfbfbf" }}>操作时间</TableCell>
                                            <TableCell align="center" sx={{ backgroundColor: "#bfbfbf" }}>操作类型</TableCell>
                                            <TableCell align="center" sx={{ backgroundColor: "#bfbfbf" }}>员工ID</TableCell>
                                            <TableCell align="center" sx={{ backgroundColor: "#bfbfbf" }}>员工姓名</TableCell>
                                            <TableCell align="center" sx={{ backgroundColor: "#bfbfbf" }}>说明</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {logData.map((row) => (
                                            <TableRow
                                                key={row.name}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell align="center">{row.created_date}</TableCell>
                                                <TableCell align="center">{row.action}</TableCell>
                                                <TableCell component="th" scope="row" align="center">{row.badge}</TableCell>
                                                <TableCell align="center">{row.username}</TableCell>
                                                <TableCell align="center">{row.description}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                        <Grid container spacing={1}>
                            <Grid container alignItems="center" justifyContent="left" item xs={4}>
                            </Grid>
                            <Grid container alignItems="center" justifyContent="center" item xs={4}>
                                <Box component="form" role="form">
                                    <Box display="flex" alignItems="center" pt={2} >
                                        <LoadingButton variant="contained" color="info" align="center" onClick={handleClickLastPage} style={{ width: '100px' }}>
                                            上一页
                                        </LoadingButton>
                                        <Typography variant="h6" fontWeight="medium" alignItems="center" justifyContent="center" ml={2} mr={2}>
                                            当前页数 {currentPage}/{totalPage} 总共页数
                                        </Typography>
                                        <LoadingButton variant="contained" color="info" align="center" onClick={handleClickNextPage} style={{ width: '100px' }}>
                                            下一页
                                        </LoadingButton>
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid container alignItems="center" justifyContent="right" item xs={4}>
                                <Box component="form" role="form">
                                    <Box display="flex" alignItems="center" pt={2} >
                                        <Typography variant="h6" fontWeight="medium" alignItems="center" justifyContent="center" mr={2}>
                                            总资料笔数:{totalData}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            ) : (
                <Card >
                    <Box sx={{ bgcolor: '#696969' }}>
                        <CardHeader title="LOG頁面:" color="#62aaf4" />
                    </Box>
                    <Divider sx={{ borderBottomWidth: 3 }} />
                    <CardContent>
                        <Grid container spacing={1} mt={1}>
                            <Grid container alignItems="center" justifyContent="left" item xs={2}>
                                <Typography variant="h4" fontWeight="medium">
                                    Conditional filtering
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid container spacing={1} mt={2}>
                            <Grid container alignItems="center" justifyContent="left" item xs={3}>
                                <Box component="form" role="form">
                                    <Box display="flex" alignItems="center" pt={2} >
                                        <Typography variant="h6" fontWeight="medium" alignItems="center" justifyContent="center" mr={2}>
                                            Starting time:
                                        </Typography>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DatePicker
                                                label="Select date"
                                                value={startDate}
                                                onChange={(newValue) => {
                                                    setStartDate(newValue);
                                                }}
                                                renderInput={(params) => <TextField size="medium" {...params} />}
                                            />
                                        </LocalizationProvider>
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid container alignItems="center" justifyContent="left" item xs={3}>
                                <Box component="form" role="form">
                                    <Box display="flex" alignItems="center" pt={2} >
                                        <Typography variant="h6" fontWeight="medium" alignItems="center" justifyContent="center" mr={2}>
                                            End Time:
                                        </Typography>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DatePicker
                                                label="Select date"
                                                value={endDate}
                                                onChange={(newValue) => {
                                                    console.log('Selected Start Date:', newValue);
                                                    setEndDate(newValue);
                                                }}
                                                renderInput={(params) => <TextField size="medium" {...params} />}
                                            />
                                        </LocalizationProvider>
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid container alignItems="center" justifyContent="left" item xs={3}>
                                <Typography variant="h6" fontWeight="medium" alignItems="center" justifyContent="center" mr={2}>
                                    Display:
                                </Typography>
                                <Box component="form" role="form">
                                    <TextField
                                        fullWidth
                                        label="Display"
                                        margin="none"
                                        name="pageDataCount"
                                        id="pageDataCount"
                                        variant="outlined"
                                        value={pageDataCount}
                                        onChange={handlePageDataCountChange}
                                    />
                                </Box>
                            </Grid>
                        </Grid>
                        <Grid container spacing={1} sx={{ mt: 1 }}>
                            <Grid container alignItems="center" justifyContent="left" item xs={3}>
                                <Typography variant="h6" fontWeight="medium" alignItems="center" justifyContent="center" mr={2}>
                                    Operation type:
                                </Typography>
                                <Box component="form" role="form">
                                    <FormControl>
                                        <InputLabel id="operation-type-select-label">Operation type</InputLabel>
                                        <Select
                                            labelId="permission-select-label"
                                            id="permission-select"
                                            value={operationType}
                                            label="Operation type"
                                            onChange={operationTypeChange}
                                            style={{ minWidth: "271px", height: "56px" }}
                                        >
                                            <MenuItem value="">Clear field</MenuItem>
                                            <MenuItem value="USER_LOGIN">USER_LOGIN</MenuItem>
                                            <MenuItem value="USER_LOGOUT">USER_LOGOUT</MenuItem>
                                            <MenuItem value="DATA_PREPROCESSING_STARTED">DATA_PREPROCESSING_STARTED</MenuItem>
                                            <MenuItem value="DATA_PREPROCESSING_SUCCESS">DATA_PREPROCESSING_SUCCESS</MenuItem>
                                            <MenuItem value="DATA_PREPROCESSING_FAILED">DATA_PREPROCESSING_FAILED</MenuItem>
                                            <MenuItem value="DAILY_PREPROCESSING_STARTED">DAILY_PREPROCESSING_STARTED</MenuItem>
                                            <MenuItem value="DAILY_PREPROCESSING_SUCCESS">DAILY_PREPROCESSING_SUCCESS</MenuItem>
                                            <MenuItem value="DAILY_PREPROCESSING_FAILED">DAILY_PREPROCESSING_FAILED</MenuItem>
                                            <MenuItem value="FULL_BACKUP">FULL_BACKUP</MenuItem>
                                            <MenuItem value="BACKUP_RESTORE">BACKUP_RESTORE</MenuItem>
                                            <MenuItem value="ADD_NEW_PROJECT">ADD_NEW_PROJECT</MenuItem>
                                            <MenuItem value="ADD_PROJECT_WORKER">ADD_PROJECT_WORKER</MenuItem>
                                            <MenuItem value="ADD_PROJECT_WORKER">ADD_PROJECT_WORKER</MenuItem>
                                            <MenuItem value="DELETE_PROJECT">DELETE_PROJECT</MenuItem>
                                            <MenuItem value="DELETE_PROJECT_WORKER">DELETE_PROJECT_WORKER</MenuItem>
                                            <MenuItem value="TRAINING_SUCCEEDED">TRAINING_SUCCEEDED</MenuItem>
                                            <MenuItem value="TRAINING_FAILED">TRAINING_FAILED</MenuItem>
                                            <MenuItem value="PREDICT_SUCCEEDED">PREDICT_SUCCEEDED</MenuItem>
                                            <MenuItem value="PREDICT_FAILED">PREDICT_FAILED</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Box>
                            </Grid>
                            <Grid container alignItems="center" justifyContent="left" item xs={3}>
                                <Typography variant="h6" fontWeight="medium" alignItems="center" justifyContent="center" mr={2}>
                                    Project name:
                                </Typography>
                                <Box component="form" role="form" >
                                    <TextField
                                        fullWidth
                                        label="Project name"
                                        margin="none"
                                        name="projectName"
                                        id="projectName"
                                        variant="outlined"
                                    />
                                </Box>
                            </Grid>
                            <Grid container alignItems="center" justifyContent="left" item xs={3}>
                                <Typography variant="h6" fontWeight="medium" alignItems="center" justifyContent="center" mr={2}>
                                    Employee name:
                                </Typography>
                                <Box component="form" role="form" sx={{ ml: 2 }}>
                                    <TextField
                                        fullWidth
                                        label="Employee name"
                                        margin="none"
                                        name="employeeName"
                                        id="employeeName"
                                        variant="outlined"
                                    />
                                </Box>
                            </Grid>
                            <Grid container alignItems="center" justifyContent="left" item xs={3}>
                                <Typography variant="h6" fontWeight="medium" alignItems="center" justifyContent="center" mr={2}>
                                    Employee ID:
                                </Typography>
                                <Box component="form" role="form" sx={{ ml: 2 }}>
                                    <TextField
                                        fullWidth
                                        label="Employee ID"
                                        margin="none"
                                        name="employeeID"
                                        id="employeeID"
                                        variant="outlined"
                                    />
                                </Box>
                            </Grid>
                        </Grid>
                        <Grid container spacing={1}>
                            <Grid item xs={12}>
                                <Box display="flex" alignItems="center" justifyContent="center" pt={3} >
                                    <LoadingButton variant="contained" color="info" align="center" onClick={handleClickChartSearch} style={{ width: '150px' }}>
                                        Search
                                    </LoadingButton>
                                </Box>
                            </Grid>
                        </Grid>
                        <Grid container spacing={1} mt={1}>
                            <TableContainer component={Paper}>
                                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="center" sx={{ backgroundColor: "#bfbfbf" }}>Operating time</TableCell>
                                            <TableCell align="center" sx={{ backgroundColor: "#bfbfbf" }}>Operating type</TableCell>
                                            <TableCell align="center" sx={{ backgroundColor: "#bfbfbf" }}>Employee ID</TableCell>
                                            <TableCell align="center" sx={{ backgroundColor: "#bfbfbf" }}>Employee name</TableCell>
                                            <TableCell align="center" sx={{ backgroundColor: "#bfbfbf" }}>Description</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {logData.map((row) => (
                                            <TableRow
                                                key={row.name}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell align="center">{row.created_date}</TableCell>
                                                <TableCell align="center">{row.action}</TableCell>
                                                <TableCell component="th" scope="row" align="center">{row.badge}</TableCell>
                                                <TableCell align="center">{row.username}</TableCell>
                                                <TableCell align="center">{row.description}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                        <Grid container spacing={1}>
                            <Grid container alignItems="center" justifyContent="left" item xs={4}>
                            </Grid>
                            <Grid container alignItems="center" justifyContent="center" item xs={4}>
                                <Box component="form" role="form">
                                    <Box display="flex" alignItems="center" pt={2} >
                                        <LoadingButton variant="contained" color="info" align="center" onClick={handleClickLastPage} style={{ width: '100px' }}>
                                            Previous page
                                        </LoadingButton>
                                        <Typography variant="h6" fontWeight="medium" alignItems="center" justifyContent="center" ml={2} mr={2}>
                                            Current page {currentPage}/{totalPage} Total page
                                        </Typography>
                                        <LoadingButton variant="contained" color="info" align="center" onClick={handleClickNextPage} style={{ width: '100px' }}>
                                            Next page
                                        </LoadingButton>
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid container alignItems="center" justifyContent="right" item xs={4}>
                                <Box component="form" role="form">
                                    <Box display="flex" alignItems="center" pt={2} >
                                        <Typography variant="h6" fontWeight="medium" alignItems="center" justifyContent="center" mr={2}>
                                            Total record:{totalData}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            )}

        </ThemeProvider>
    );
}
