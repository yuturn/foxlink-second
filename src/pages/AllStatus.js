import React, { useState, useEffect, useContext } from 'react';
import { apiGetHomePage } from '../api';
import { GlobalContext } from '../components/GlobalContext';
import Marquee from './Marquee';
import { Box, Card, Typography, Snackbar, CardContent, CardHeader } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import LoadingButton from '@mui/lab/LoadingButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Alert from '@mui/material/Alert';
import DialogContent from '@mui/material/DialogContent';
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
            main: '#696969',
        },
    },
});
function ColorBox(props) {
    return (
        <ThemeProvider
            theme={{
                ...darkTheme,
                components: {
                    MuiBox: {
                        styleOverrides: { root: { width: '30px', height: '30px' } },
                    },
                },
            }}
        >
            <DialogContent>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Box
                        sx={{
                            width: '30px',
                            height: '30px',
                            backgroundColor: '#ffc107',
                            marginRight: '10px',
                        }}
                    />
                    <Typography sx={{ fontSize: 30 }}>{props.msg}</Typography>
                </div>
            </DialogContent>
        </ThemeProvider>
    );
}
export default function Statistics({ token, ...rest }) {
    const { globalVariable } = useContext(GlobalContext);
    const [isPaused, setIsPaused] = useState(false);
    const [alertOpen, setAlertOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [errorAlertOpen, setErrorAlertOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [refreshKey, setRefreshKey] = useState(0);
    const [selectedSlide, setSelectedSlide] = useState(0);
    const [dateData, setDateData] = useState({ data: {}, timestamp: '' });

    const handleOpen = (message) => {
        setMessage(message);
        setAlertOpen(true);
    };

    const handleClose = () => {
        setAlertOpen(false);
    };

    const handleErrorOpen = (message) => {
        setErrorMessage(message);
        setErrorAlertOpen(true);
    };

    const handleErrorClose = () => {
        setErrorAlertOpen(false);
    };

    const handleRefresh = () => {
        setRefreshKey((prevKey) => prevKey + 1);
    };

    function sortDeviceKeys(deviceKeys) {
        return deviceKeys.sort((a, b) => {
            const numA = parseInt(a.split('@')[0].replace('Device_', ''), 10);
            const numB = parseInt(b.split('@')[0].replace('Device_', ''), 10);
            return numA - numB;
        });
    }

    const apiGetHomePageData = (token) => {
        if (!token) {
            return;
        }
        apiGetHomePage(token)
            .then((res) => {
                console.log(res.data)
                setDateData(res.data);
                handleOpen(
                    globalVariable === 'zh-tw'
                        ? '查詢成功'
                        : globalVariable === 'zh-cn'
                            ? '查询成功'
                            : 'Search successful'
                );
            })
            .catch((err) =>
                handleErrorOpen(
                    globalVariable === 'zh-tw'
                        ? '查詢失敗:API請求失敗'
                        : globalVariable === 'zh-cn'
                            ? '查询失败:API请求失败'
                            : 'Query failed: API request failed'
                )
            );
    };

    useEffect(() => {
        if (token) {
            apiGetHomePageData(token)
        }
    }, [token, refreshKey]);

    const DataDisplay = ({ data, timestamp, devicesPerCard = 3, language }) => {

        const headers = {
            "zh-tw": ["機台", "名稱", "時間", "穩定", "異常", "總穩定", "總異常"],
            "zh-cn": ["设备", "名称", "时间", "稳定", "异常", "总稳定", "总异常"],
            "en": ["Device", "Name", "Time", "Stable", "Unstable", "Total Stable", "Total Unstable"],
        };

        // 日期和週標題
        const timeHeaders = {
            "zh-tw": ["日", "週"],
            "zh-cn": ["日", "周"],
            "en": ["Day", "Week"]
        };

        const rowColors = ['#DEEBF7', '#DEEBF7', '#FFFFFF', '#E2F0D9', '#FFFCEB', '#E2F0D9', '#FFFCEB'];

        return (
            <div>
                {Object.keys(data).map((project) =>
                    Object.keys(data[project]).map((line) => {
                        const deviceKeys = sortDeviceKeys(Object.keys(data[project][line]));
                        const deviceCount = deviceKeys.length;

                        return (
                            <Card key={`${project}-${line}`} sx={{ backgroundColor: 'transparent', boxShadow: 'none', color: 'black', marginBottom: 4, width: '100%' }}>
                                <Box>
                                    <CardHeader
                                        title={
                                            <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                                                {`${project} @ Line: ${line}`}
                                            </Typography>
                                        }
                                        align="left"
                                    />
                                </Box>
                                <CardContent sx={{ padding: 0 }}>
                                    <TableContainer
                                        sx={{
                                            maxHeight: 800,
                                            width: '100%',
                                            overflowX: 'auto',
                                            overflowY: 'hidden',
                                            marginTop: 2,
                                            backgroundColor: 'transparent',
                                        }}
                                    >
                                        <Table sx={{
                                            tableLayout: 'fixed',
                                            width: deviceCount < devicesPerCard ? '100%' : `${(deviceCount / devicesPerCard) * 100}%` // 動態設置表格寬度
                                        }}>
                                            <TableBody>
                                                {headers[language].map((header, index) => ( // 使用指定語言的表頭
                                                    <TableRow key={index} sx={{ backgroundColor: rowColors[index % rowColors.length] }}>
                                                        <TableCell
                                                            sx={{
                                                                whiteSpace: 'nowrap',
                                                                position: 'sticky',
                                                                left: 0,
                                                                zIndex: 2,
                                                                textAlign: 'center',
                                                                padding: '5px',
                                                                width: '85px',
                                                                color: 'white',
                                                                background: '#696969',
                                                                height: '60px',
                                                                verticalAlign: 'middle',
                                                            }}
                                                        >
                                                            <Typography fontSize={25} color="white">
                                                                {header}
                                                            </Typography>
                                                        </TableCell>
                                                        {deviceKeys.map((deviceKey) => {
                                                            const [deviceName, deviceDescription] = deviceKey.split('@');
                                                            const totals = data[project][line][deviceKey];
                                                            return (
                                                                <TableCell
                                                                    key={deviceKey}
                                                                    align="center"
                                                                    sx={{
                                                                        fontSize: '25px',
                                                                        color: 'black',
                                                                        padding: '16px',
                                                                        whiteSpace: 'nowrap',
                                                                        width: deviceCount < devicesPerCard ? `${100 / deviceCount}%` : `${100 / devicesPerCard}%`  // 根據設備數量設置寬度
                                                                    }}
                                                                >
                                                                    {header === headers[language][0] && deviceName}
                                                                    {header === headers[language][1] && deviceDescription}
                                                                    {header === headers[language][2] && (
                                                                        <Box sx={{ display: 'flex', justifyContent: 'center', margin: '8px 0' }}>
                                                                            <Typography sx={{ flex: 1, textAlign: 'center', borderRight: '1px solid #ccc', padding: '8px', fontSize: '25px' }}>
                                                                                {timeHeaders[language][0]}
                                                                            </Typography>
                                                                            <Typography sx={{ flex: 1, textAlign: 'center', padding: '8px', fontSize: '25px' }}>
                                                                                {timeHeaders[language][1]}
                                                                            </Typography>
                                                                        </Box>
                                                                    )}
                                                                    {header === headers[language][3] && (
                                                                        <Box sx={{ display: 'flex', justifyContent: 'center', margin: '8px 0' }}>
                                                                            <Typography sx={{ flex: 1, textAlign: 'center', borderRight: '1px solid #ccc', padding: '8px', fontSize: '25px' }}>
                                                                                {totals.day_stable} (
                                                                                <Typography component="span" sx={{ color: '#FB5607', fontSize: 'inherit' }}>
                                                                                    {totals.day_stable_happened}
                                                                                </Typography>)
                                                                            </Typography>
                                                                            <Typography sx={{ flex: 1, textAlign: 'center', padding: '8px', fontSize: '25px' }}>
                                                                                {totals.week_stable} (
                                                                                <Typography component="span" sx={{ color: '#FB5607', fontSize: 'inherit' }}>
                                                                                    {totals.week_stable_happened}
                                                                                </Typography>)
                                                                            </Typography>
                                                                        </Box>
                                                                    )}
                                                                    {header === headers[language][4] && (
                                                                        <Box sx={{ display: 'flex', justifyContent: 'center', margin: '8px 0' }}>
                                                                            <Typography sx={{ flex: 1, textAlign: 'center', borderRight: '1px solid #ccc', padding: '8px', fontSize: '25px' }}>
                                                                                {totals.day_unstable} (
                                                                                <Typography component="span" sx={{ color: '#FB5607', fontSize: 'inherit' }}>
                                                                                    {totals.day_unstable_happened}
                                                                                </Typography>)
                                                                            </Typography>
                                                                            <Typography sx={{ flex: 1, textAlign: 'center', padding: '8px', fontSize: '25px' }}>
                                                                                {totals.week_unstable} (
                                                                                <Typography component="span" sx={{ color: '#FB5607', fontSize: 'inherit' }}>
                                                                                    {totals.week_unstable_happened}
                                                                                </Typography>)
                                                                            </Typography>
                                                                        </Box>
                                                                    )}
                                                                    {header === headers[language][5] && (
                                                                        <Box sx={{ display: 'flex', justifyContent: 'center', margin: '8px 0' }}>
                                                                            <Typography sx={{ flex: 1, textAlign: 'center', padding: '8px', fontSize: '25px' }}>
                                                                                {totals.day_stable + totals.week_stable} (
                                                                                <Typography component="span" sx={{ color: '#FB5607', fontSize: 'inherit' }}>
                                                                                    {totals.day_stable_happened + totals.week_stable_happened}
                                                                                </Typography>)
                                                                            </Typography>
                                                                        </Box>
                                                                    )}
                                                                    {header === headers[language][6] && (
                                                                        <Box sx={{ display: 'flex', justifyContent: 'center', margin: '8px 0' }}>
                                                                            <Typography sx={{ flex: 1, textAlign: 'center', padding: '8px', fontSize: '25px' }}>
                                                                                {totals.day_unstable + totals.week_unstable} (
                                                                                <Typography component="span" sx={{ color: '#FB5607', fontSize: 'inherit' }}>
                                                                                    {totals.day_unstable_happened + totals.week_unstable_happened}
                                                                                </Typography>)
                                                                            </Typography>
                                                                        </Box>
                                                                    )}
                                                                </TableCell>
                                                            );
                                                        })}
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </CardContent>
                            </Card>
                        );
                    })
                )}
            </div>
        );
    };
    // const { data, timestamp } = splitDataAndTimestamp(dateData);


    return (
        <>
            <Snackbar open={alertOpen} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                    {message}
                </Alert>
            </Snackbar>
            <Snackbar open={errorAlertOpen} autoHideDuration={6000} onClose={handleErrorClose}>
                <Alert onClose={handleErrorClose} severity="error" sx={{ width: '100%' }}>
                    {errorMessage}
                </Alert>
            </Snackbar>
            <div>
                <div style={{ display: 'flex', alignItems: 'center', marginRight: '100px' }}>

                    {/* <Typography variant="h4">
                        {globalVariable === 'zh-tw'
                            ? '前次查詢時間: '
                            : globalVariable === 'zh-cn'
                                ? '上次查询时间: '
                                : 'Last query time: '}
                    </Typography> */}
                    {globalVariable === 'zh-tw' ? <Marquee header={'前次查詢時間: '} msg={dateData.timestamp.slice(0, 19)} /> : globalVariable === 'zh-cn' ? <Marquee header={'上次查询时间: '} msg={dateData.timestamp.slice(0, 19)} /> : <Marquee header={'Last query time: '} msg={dateData.timestamp.slice(0, 19)} />}


                    <LoadingButton
                        variant="contained"
                        color="info"
                        onClick={handleRefresh}
                        style={{ display: 'flex', alignItems: 'center', marginLeft: '10px' }}
                    >
                        {globalVariable === 'zh-tw' ? '刷新' : globalVariable === 'zh-cn' ? '刷新' : 'Refresh'}
                    </LoadingButton>
                    <ColorBox msg={globalVariable === 'zh-tw' ? "已發生過之異常事件" : globalVariable === 'zh-cn' ? "已发生过之异常事件" : "Abnormal events that have occurred"}></ColorBox>
                </div>
                <DataDisplay data={dateData.data} language={globalVariable} />
            </div>
        </>
    );
}