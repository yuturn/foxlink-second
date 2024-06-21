import React, { useState, useEffect, useContext } from 'react';
import { apiGetStatisticsDetails, apiMarquee, apiGetStatisticsDetailsFilter } from '../api';
import { GlobalContext } from '../components/GlobalContext';
import Marquee from './Marquee';
import { Box, Card, Grid, CardHeader, Typography, Snackbar } from '@mui/material';
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
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';
import DialogContent from '@mui/material/DialogContent';
import Alert from '@mui/material/Alert';

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

export default function Statistics({ token, ...rest }) {
    const { globalVariable } = useContext(GlobalContext);
    const [orderWeek, setOrderWeek] = useState('asc');
    const [weekOrderBy, setWeekOrderBy] = useState('label');

    const [orderDate, setOrder] = useState('asc');
    const [dateOrderBy, setDateOrderBy] = useState('label');

    const [isPaused, setIsPaused] = useState(false);
    const [projectName, setProjectName] = useState();
    const [deviceName, setDeviceName] = useState();
    const [lineName, setLineName] = useState();
    const [projectNameList, setProjectNameList] = useState([]);
    const [deviceNameList, setDeviceNameList] = useState([]);
    const [projectLineNameList, setProjectLineNameList] = useState([]);
    const [projectToLineDeviceMap, setProjectToLineDeviceMap] = useState({});
    const [alertOpen, setAlertOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [errorAlertOpen, setErrorAlertOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [refreshKey, setRefreshKey] = useState(0);
    const [selectedSlide, setSelectedSlide] = useState(0);
    const [dateData, setDateData] = useState({});
    const [timeStampData, setTimestampData] = useState('');

    const togglePause = () => {
        setIsPaused(!isPaused);
    };

    const handleOpen = (message) => {
        setMessage(message);
        setAlertOpen(true);
    };

    const handleClose = (event, reason) => {
        setAlertOpen(false);
    };

    const handleErrorOpen = (message) => {
        setErrorMessage(message);
        setErrorAlertOpen(true);
    };

    const handleErrorClose = (event, reason) => {
        setErrorAlertOpen(false);
    };

    const handleRefresh = () => {
        setRefreshKey((prevKey) => prevKey + 1);
    };

    const handleSelectSlide = (index) => {
        setSelectedSlide(index);
    };

    const customRenderIndicator = (clickHandler, isSelected, index) => {
        const indicatorStyles = {
            background: isSelected ? 'lightblue' : 'lightgray',
            width: 15,
            height: 15,
            borderRadius: '50%',
            display: 'inline-block',
            margin: '0 8px',
            cursor: 'pointer',
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

    useEffect(() => {
        if (token) {
            getProjectDetails();
            getProjectDetailsFilter();
            fetchTimestampData();
        }
    }, [token, refreshKey]);

    const getProjectDetails = () => {
        apiGetStatisticsDetails({ token })
            .then((res) => {
                setDateData(res.data);
            })
            .catch((err) => console.error(err));
    };

    const getProjectDetailsFilter = () => {
        apiGetStatisticsDetailsFilter({ token, projectName, lineName, deviceName })
            .then((res) => {
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

    const fetchTimestampData = () => {
        apiMarquee(token)
            .then((res) => {
                setTimestampData(res.data);
            })
            .catch((err) => console.error(err));
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

    function getColor(lightColor) {
        if (lightColor === 1) {
            return '#ff2600';
        } else if (lightColor === 0) {
            return '#008f00';
        } else {
            return null;
        }
    }

    function infoColor(happened_times) {
        if (happened_times !== 0) {
            return '#ffc107';
        } else {
            return null;
        }
    }

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

    const tableContainerStyle = {
        tableContainer: {
            maxHeight: '300px',
            overflowY: 'auto',
        },
    };

    const tableCellStyle = {
        extendedCell: {},
    };
    // 接下來會有TW、CN、EN版的CREATE DEVICE他會依照 Call api進來的json檔來創造Carousel，基本上看懂一個就行。
    const createDeviceCardTW = (data, data2) => {
        const groupByDeviceAndLine = (data) => {
            const groupedData = {};

            Object.keys(data).forEach((project) => {
                if (!groupedData[project]) {
                    groupedData[project] = {};
                }

                Object.keys(data[project]).forEach((device) => {
                    data[project][device].forEach((item) => {
                        const line = item.line;
                        if (!groupedData[project][device]) {
                            groupedData[project][device] = {};
                        }
                        if (!groupedData[project][device][line]) {
                            groupedData[project][device][line] = [];
                        }
                        groupedData[project][device][line].push(item);
                    });
                });
            });

            return groupedData;
        };

        const groupedData = groupByDeviceAndLine(data);
        const groupedData2 = groupByDeviceAndLine(data2);

        return (
            <div>
                {Object.keys(groupedData).map((project) => (
                    <div key={project}>
                        <Carousel
                            showArrows={false}
                            renderIndicator={customRenderIndicator}
                            infiniteLoop={true}
                            autoPlay={!isPaused}
                            stopOnHover={true}
                            interval={3000}
                        >
                            {Object.keys(groupedData[project]).map((device) =>
                                Object.keys(groupedData[project][device]).map((line) => {
                                    const deviceData = groupedData[project][device][line];
                                    const deviceData2 = groupedData2[project][device][line] || [];

                                    let abnormalCount = 0;
                                    let nonAbnormalCount = 0;
                                    deviceData.forEach((item) => {
                                        if (item.steady === 1) {
                                            abnormalCount++;
                                        } else if (item.steady === 0) {
                                            nonAbnormalCount++;
                                        }
                                    });

                                    let pieData = [
                                        { value: nonAbnormalCount, label: '穩定' },
                                        { value: abnormalCount, label: '異常' },
                                    ];

                                    return (
                                        <div key={device + line}>
                                            <Card>
                                                <Box sx={{ bgcolor: '#696969' }}>
                                                    <CardHeader
                                                        title={`${project}@ 線號 ${line}@ ${device}`}
                                                        color="#696969"
                                                        align="center"
                                                    />
                                                </Box>
                                                <Grid container spacing={1}>
                                                    <Grid xs={3} sx={{ mt: 4 }}>
                                                        <Box
                                                            border={1}
                                                            sx={{ mt: 4, ml: 6, width: 120, height: 'auto' }}
                                                        >
                                                            <Typography align="center" fontSize={25}>
                                                                異常
                                                            </Typography>
                                                            <Box
                                                                sx={{
                                                                    bgcolor: '#ff2600',
                                                                    width: 'auto',
                                                                    height: 'auto',
                                                                }}
                                                            >
                                                                <Typography align="center" fontSize={20}>
                                                                    {abnormalCount}
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                        <Box sx={{ mt: 6, ml: 2 }}>
                                                            <PieChart
                                                                colors={['#008f00', '#ff2600']}
                                                                series={[
                                                                    {
                                                                        arcLabel: (item) =>
                                                                            `${item.label} (${item.value})`,
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
                                                        <Box
                                                            border={1}
                                                            sx={{ mt: 4, ml: 6, width: 118, height: 'auto' }}
                                                        >
                                                            <Typography align="center" fontSize={25}>
                                                                穩定
                                                            </Typography>
                                                            <Box
                                                                sx={{
                                                                    bgcolor: '#008f00',
                                                                    width: 'auto',
                                                                    height: 'auto',
                                                                }}
                                                            >
                                                                <Typography align="center" fontSize={20}>
                                                                    {nonAbnormalCount}
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                    </Grid>
                                                    <Grid item xs={6} md={6} lg={6}>
                                                        <TableContainer
                                                            component={Paper}
                                                            style={tableContainerStyle.tableContainer}
                                                        >
                                                            <Table>
                                                                <TableHead
                                                                    style={{
                                                                        position: 'sticky',
                                                                        top: 0,
                                                                        zIndex: 2,
                                                                        backgroundColor: '#bfbfbf',
                                                                    }}
                                                                >
                                                                    <TableRow>
                                                                        <TableCell
                                                                            align="center"
                                                                            sx={{
                                                                                height: 'auto',
                                                                                border: '1px solid black',
                                                                            }}
                                                                            colSpan={5}
                                                                        >
                                                                            <Typography fontSize={20}>
                                                                                週預測
                                                                                {
                                                                                    deviceData
                                                                                        .filter(
                                                                                            (columns) =>
                                                                                                columns.frequency ===
                                                                                                '週預測'
                                                                                        )
                                                                                        .map(
                                                                                            (item) =>
                                                                                                `${item.ori_date}-${item.pred_date}`
                                                                                        )[0]
                                                                                }
                                                                            </Typography>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                    <TableRow>
                                                                        <TableCell
                                                                            align="center"
                                                                            sx={{
                                                                                height: 'auto',
                                                                                border: '1px solid black',
                                                                            }}
                                                                        >
                                                                            <TableSortLabel
                                                                                active={weekOrderBy === 'category'}
                                                                                direction={
                                                                                    weekOrderBy === 'category'
                                                                                        ? orderWeek
                                                                                        : 'asc'
                                                                                }
                                                                                onClick={() =>
                                                                                    handleSortRequest('category')
                                                                                }
                                                                            >
                                                                                <Typography fontSize={20}>
                                                                                    Category
                                                                                </Typography>
                                                                            </TableSortLabel>
                                                                        </TableCell>
                                                                        <TableCell
                                                                            align="center"
                                                                            sx={{
                                                                                height: 'auto',
                                                                                border: '1px solid black',
                                                                            }}
                                                                        >
                                                                            <TableSortLabel
                                                                                active={weekOrderBy === 'label'}
                                                                                direction={
                                                                                    weekOrderBy === 'label'
                                                                                        ? orderWeek
                                                                                        : 'asc'
                                                                                }
                                                                                onClick={() =>
                                                                                    handleSortRequest('label')
                                                                                }
                                                                            >
                                                                                <Typography fontSize={20}>
                                                                                    類型
                                                                                </Typography>
                                                                            </TableSortLabel>
                                                                        </TableCell>
                                                                        <TableCell
                                                                            align="center"
                                                                            sx={{
                                                                                height: 'auto',
                                                                                border: '1px solid black',
                                                                            }}
                                                                        >
                                                                            <Typography fontSize={20}>
                                                                                異常事件
                                                                            </Typography>
                                                                        </TableCell>
                                                                        <TableCell
                                                                            align="center"
                                                                            sx={{
                                                                                height: 'auto',
                                                                                border: '1px solid black',
                                                                            }}
                                                                        >
                                                                            <TableSortLabel
                                                                                active={weekOrderBy === 'date'}
                                                                                direction={
                                                                                    weekOrderBy === 'date'
                                                                                        ? orderWeek
                                                                                        : 'asc'
                                                                                }
                                                                                onClick={() =>
                                                                                    handleSortRequest('date')
                                                                                }
                                                                            >
                                                                                <Typography fontSize={20}>
                                                                                    前次發生時間
                                                                                </Typography>
                                                                            </TableSortLabel>
                                                                        </TableCell>
                                                                        <TableCell
                                                                            align="center"
                                                                            sx={{
                                                                                height: 'auto',
                                                                                border: '1px solid black',
                                                                            }}
                                                                        >
                                                                            <Typography fontSize={20}>
                                                                                發生次數
                                                                            </Typography>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                </TableHead>
                                                                <TableBody>
                                                                    {deviceData
                                                                        .filter(
                                                                            (columns) => columns.frequency === '週預測'
                                                                        )
                                                                        .sort(getComparator(orderWeek))
                                                                        .map((columns) => (
                                                                            <TableRow key={columns.name}>
                                                                                <TableCell
                                                                                    align="center"
                                                                                    sx={{
                                                                                        height: 'auto',
                                                                                        bgcolor: infoColor(
                                                                                            columns.happened_times
                                                                                        ),
                                                                                    }}
                                                                                >
                                                                                    <Typography fontSize={20}>
                                                                                        {columns.category}
                                                                                    </Typography>
                                                                                </TableCell>
                                                                                <TableCell
                                                                                    style={tableCellStyle.extendedCell}
                                                                                    key={columns.id}
                                                                                    align="center"
                                                                                    sx={{
                                                                                        bgcolor: getColor(
                                                                                            columns.steady
                                                                                        ),
                                                                                    }}
                                                                                >
                                                                                    <Typography fontSize={20}>
                                                                                        {columns.steady === 0
                                                                                            ? '穩定'
                                                                                            : '異常'}
                                                                                    </Typography>
                                                                                </TableCell>
                                                                                <TableCell
                                                                                    align="center"
                                                                                    sx={{
                                                                                        height: 'auto',
                                                                                        bgcolor: infoColor(
                                                                                            columns.happened_times
                                                                                        ),
                                                                                    }}
                                                                                >
                                                                                    <Typography fontSize={20}>
                                                                                        {columns.name}
                                                                                    </Typography>
                                                                                </TableCell>
                                                                                <TableCell
                                                                                    align="center"
                                                                                    sx={{
                                                                                        height: 'auto',
                                                                                        bgcolor: infoColor(
                                                                                            columns.happened_times
                                                                                        ),
                                                                                    }}
                                                                                >
                                                                                    <Typography fontSize={20}>
                                                                                        {columns.happenLastTime}
                                                                                    </Typography>
                                                                                </TableCell>
                                                                                <TableCell
                                                                                    align="center"
                                                                                    sx={{
                                                                                        height: 'auto',
                                                                                        bgcolor: infoColor(
                                                                                            columns.happened_times
                                                                                        ),
                                                                                    }}
                                                                                >
                                                                                    <Typography fontSize={20}>
                                                                                        {columns.happened_times}
                                                                                    </Typography>
                                                                                </TableCell>
                                                                            </TableRow>
                                                                        ))}
                                                                </TableBody>
                                                            </Table>
                                                        </TableContainer>
                                                        <TableContainer
                                                            component={Paper}
                                                            style={tableContainerStyle.tableContainer}
                                                        >
                                                            <Table>
                                                                <TableHead
                                                                    style={{
                                                                        position: 'sticky',
                                                                        top: 0,
                                                                        zIndex: 2,
                                                                        backgroundColor: '#bfbfbf',
                                                                    }}
                                                                >
                                                                    <TableRow>
                                                                        <TableCell
                                                                            align="center"
                                                                            sx={{
                                                                                height: 'auto',
                                                                                border: '1px solid black',
                                                                            }}
                                                                            colSpan={5}
                                                                        >
                                                                            <Typography fontSize={20}>
                                                                                日預測
                                                                                {
                                                                                    deviceData2
                                                                                        .filter(
                                                                                            (columns) =>
                                                                                                columns.frequency ===
                                                                                                '日預測'
                                                                                        )
                                                                                        .map(
                                                                                            (item) =>
                                                                                                `${item.pred_date}`
                                                                                        )[0]
                                                                                }
                                                                            </Typography>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                    <TableRow>
                                                                        <TableCell
                                                                            align="center"
                                                                            sx={{
                                                                                height: 'auto',
                                                                                border: '1px solid black',
                                                                            }}
                                                                        >
                                                                            <TableSortLabel
                                                                                active={dateOrderBy === 'category'}
                                                                                direction={
                                                                                    dateOrderBy === 'category'
                                                                                        ? orderDate
                                                                                        : 'asc'
                                                                                }
                                                                                onClick={() =>
                                                                                    handleSortRequestDate('category')
                                                                                }
                                                                            >
                                                                                <Typography fontSize={20}>
                                                                                    Category
                                                                                </Typography>
                                                                            </TableSortLabel>
                                                                        </TableCell>
                                                                        <TableCell
                                                                            align="center"
                                                                            sx={{
                                                                                height: 'auto',
                                                                                border: '1px solid黑',
                                                                            }}
                                                                        >
                                                                            <TableSortLabel
                                                                                active={dateOrderBy === 'label'}
                                                                                direction={
                                                                                    dateOrderBy === 'label'
                                                                                        ? orderDate
                                                                                        : 'asc'
                                                                                }
                                                                                onClick={() =>
                                                                                    handleSortRequestDate('label')
                                                                                }
                                                                            >
                                                                                <Typography fontSize={20}>
                                                                                    類型
                                                                                </Typography>
                                                                            </TableSortLabel>
                                                                        </TableCell>
                                                                        <TableCell
                                                                            align="center"
                                                                            sx={{
                                                                                height: 'auto',
                                                                                border: '1px solid黑',
                                                                            }}
                                                                        >
                                                                            <Typography fontSize={20}>
                                                                                異常事件
                                                                            </Typography>
                                                                        </TableCell>
                                                                        <TableCell
                                                                            align="center"
                                                                            sx={{
                                                                                height: 'auto',
                                                                                border: '1px solid黑',
                                                                            }}
                                                                        >
                                                                            <TableSortLabel
                                                                                active={dateOrderBy === 'date'}
                                                                                direction={
                                                                                    dateOrderBy === 'date'
                                                                                        ? orderDate
                                                                                        : 'asc'
                                                                                }
                                                                                onClick={() =>
                                                                                    handleSortRequestDate('date')
                                                                                }
                                                                            >
                                                                                <Typography fontSize={20}>
                                                                                    前次發生時間
                                                                                </Typography>
                                                                            </TableSortLabel>
                                                                        </TableCell>
                                                                        <TableCell
                                                                            align="center"
                                                                            sx={{
                                                                                height: 'auto',
                                                                                border: '1px solid黑',
                                                                            }}
                                                                        >
                                                                            <Typography fontSize={20}>
                                                                                發生次數
                                                                            </Typography>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                </TableHead>
                                                                <TableBody>
                                                                    {deviceData2
                                                                        .filter(
                                                                            (columns) => columns.frequency === '日預測'
                                                                        )
                                                                        .sort(getComparatorDate(orderDate))
                                                                        .map((columns) => (
                                                                            <TableRow key={columns.name}>
                                                                                <TableCell
                                                                                    align="center"
                                                                                    sx={{
                                                                                        height: 'auto',
                                                                                        bgcolor: infoColor(
                                                                                            columns.happened_times
                                                                                        ),
                                                                                    }}
                                                                                >
                                                                                    <Typography fontSize={20}>
                                                                                        {columns.category}
                                                                                    </Typography>
                                                                                </TableCell>
                                                                                <TableCell
                                                                                    style={tableCellStyle.extendedCell}
                                                                                    key={columns.id}
                                                                                    align="center"
                                                                                    sx={{
                                                                                        bgcolor: getColor(
                                                                                            columns.steady
                                                                                        ),
                                                                                    }}
                                                                                >
                                                                                    <Typography fontSize={20}>
                                                                                        {columns.steady === 0
                                                                                            ? '穩定'
                                                                                            : '異常'}
                                                                                    </Typography>
                                                                                </TableCell>
                                                                                <TableCell
                                                                                    align="center"
                                                                                    sx={{
                                                                                        height: 'auto',
                                                                                        bgcolor: infoColor(
                                                                                            columns.happened_times
                                                                                        ),
                                                                                    }}
                                                                                >
                                                                                    <Typography fontSize={20}>
                                                                                        {columns.name}
                                                                                    </Typography>
                                                                                </TableCell>
                                                                                <TableCell
                                                                                    align="center"
                                                                                    sx={{
                                                                                        height: 'auto',
                                                                                        bgcolor: infoColor(
                                                                                            columns.happened_times
                                                                                        ),
                                                                                    }}
                                                                                >
                                                                                    <Typography fontSize={20}>
                                                                                        {columns.happenLastTime}
                                                                                    </Typography>
                                                                                </TableCell>
                                                                                <TableCell
                                                                                    align="center"
                                                                                    sx={{
                                                                                        height: 'auto',
                                                                                        bgcolor: infoColor(
                                                                                            columns.happened_times
                                                                                        ),
                                                                                    }}
                                                                                >
                                                                                    <Typography fontSize={20}>
                                                                                        {columns.happened_times}
                                                                                    </Typography>
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
                                })
                            )}
                        </Carousel>
                    </div>
                ))}
            </div>
        );
    };
    const createDeviceCardCN = (data, data2) => {
        const groupByDeviceAndLine = (data) => {
            const groupedData = {};

            Object.keys(data).forEach((project) => {
                if (!groupedData[project]) {
                    groupedData[project] = {};
                }

                Object.keys(data[project]).forEach((device) => {
                    data[project][device].forEach((item) => {
                        const line = item.line;
                        if (!groupedData[project][device]) {
                            groupedData[project][device] = {};
                        }
                        if (!groupedData[project][device][line]) {
                            groupedData[project][device][line] = [];
                        }
                        groupedData[project][device][line].push(item);
                    });
                });
            });

            return groupedData;
        };

        const groupedData = groupByDeviceAndLine(data);
        const groupedData2 = groupByDeviceAndLine(data2);

        return (
            <div>
                {Object.keys(groupedData).map((project) => (
                    <div key={project}>
                        <Carousel
                            showArrows={false}
                            renderIndicator={customRenderIndicator}
                            infiniteLoop={true}
                            autoPlay={!isPaused}
                            stopOnHover={true}
                            interval={3000}
                        >
                            {Object.keys(groupedData[project]).map((device) =>
                                Object.keys(groupedData[project][device]).map((line) => {
                                    const deviceData = groupedData[project][device][line];
                                    const deviceData2 = groupedData2[project][device][line] || [];

                                    let abnormalCount = 0;
                                    let nonAbnormalCount = 0;
                                    deviceData.forEach((item) => {
                                        if (item.steady === 1) {
                                            abnormalCount++;
                                        } else if (item.steady === 0) {
                                            nonAbnormalCount++;
                                        }
                                    });

                                    let pieData = [
                                        { value: nonAbnormalCount, label: '稳定' },
                                        { value: abnormalCount, label: '异常' },
                                    ];

                                    return (
                                        <div key={device + line}>
                                            <Card>
                                                <Box sx={{ bgcolor: '#696969' }}>
                                                    <CardHeader
                                                        title={`${project}@ 线号 ${line}@ ${device}`}
                                                        color="#696969"
                                                        align="center"
                                                    />
                                                </Box>
                                                <Grid container spacing={1}>
                                                    <Grid xs={3} sx={{ mt: 4 }}>
                                                        <Box
                                                            border={1}
                                                            sx={{ mt: 4, ml: 6, width: 120, height: 'auto' }}
                                                        >
                                                            <Typography align="center" fontSize={25}>
                                                                异常
                                                            </Typography>
                                                            <Box
                                                                sx={{
                                                                    bgcolor: '#ff2600',
                                                                    width: 'auto',
                                                                    height: 'auto',
                                                                }}
                                                            >
                                                                <Typography align="center" fontSize={20}>
                                                                    {abnormalCount}
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                        <Box sx={{ mt: 6, ml: 2 }}>
                                                            <PieChart
                                                                colors={['#008f00', '#ff2600']}
                                                                series={[
                                                                    {
                                                                        arcLabel: (item) =>
                                                                            `${item.label} (${item.value})`,
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
                                                        <Box
                                                            border={1}
                                                            sx={{ mt: 4, ml: 6, width: 118, height: 'auto' }}
                                                        >
                                                            <Typography align="center" fontSize={25}>
                                                                稳定
                                                            </Typography>
                                                            <Box
                                                                sx={{
                                                                    bgcolor: '#008f00',
                                                                    width: 'auto',
                                                                    height: 'auto',
                                                                }}
                                                            >
                                                                <Typography align="center" fontSize={20}>
                                                                    {nonAbnormalCount}
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                    </Grid>
                                                    <Grid item xs={6} md={6} lg={6}>
                                                        <TableContainer
                                                            component={Paper}
                                                            style={tableContainerStyle.tableContainer}
                                                        >
                                                            <Table>
                                                                <TableHead
                                                                    style={{
                                                                        position: 'sticky',
                                                                        top: 0,
                                                                        zIndex: 2,
                                                                        backgroundColor: '#bfbfbf',
                                                                    }}
                                                                >
                                                                    <TableRow>
                                                                        <TableCell
                                                                            align="center"
                                                                            sx={{
                                                                                height: 'auto',
                                                                                border: '1px solid black',
                                                                            }}
                                                                            colSpan={5}
                                                                        >
                                                                            <Typography fontSize={20}>
                                                                                周预测
                                                                                {
                                                                                    deviceData
                                                                                        .filter(
                                                                                            (columns) =>
                                                                                                columns.frequency ===
                                                                                                '週預測'
                                                                                        )
                                                                                        .map(
                                                                                            (item) =>
                                                                                                `${item.ori_date}-${item.pred_date}`
                                                                                        )[0]
                                                                                }
                                                                            </Typography>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                    <TableRow>
                                                                        <TableCell
                                                                            align="center"
                                                                            sx={{
                                                                                height: 'auto',
                                                                                border: '1px solid black',
                                                                            }}
                                                                        >
                                                                            <TableSortLabel
                                                                                active={weekOrderBy === 'category'}
                                                                                direction={
                                                                                    weekOrderBy === 'category'
                                                                                        ? orderWeek
                                                                                        : 'asc'
                                                                                }
                                                                                onClick={() =>
                                                                                    handleSortRequest('category')
                                                                                }
                                                                            >
                                                                                <Typography fontSize={20}>
                                                                                    Category
                                                                                </Typography>
                                                                            </TableSortLabel>
                                                                        </TableCell>
                                                                        <TableCell
                                                                            align="center"
                                                                            sx={{
                                                                                height: 'auto',
                                                                                border: '1px solid black',
                                                                            }}
                                                                        >
                                                                            <TableSortLabel
                                                                                active={weekOrderBy === 'label'}
                                                                                direction={
                                                                                    weekOrderBy === 'label'
                                                                                        ? orderWeek
                                                                                        : 'asc'
                                                                                }
                                                                                onClick={() =>
                                                                                    handleSortRequest('label')
                                                                                }
                                                                            >
                                                                                <Typography fontSize={20}>
                                                                                    类型
                                                                                </Typography>
                                                                            </TableSortLabel>
                                                                        </TableCell>
                                                                        <TableCell
                                                                            align="center"
                                                                            sx={{
                                                                                height: 'auto',
                                                                                border: '1px solid black',
                                                                            }}
                                                                        >
                                                                            <Typography fontSize={20}>
                                                                                异常事件
                                                                            </Typography>
                                                                        </TableCell>
                                                                        <TableCell
                                                                            align="center"
                                                                            sx={{
                                                                                height: 'auto',
                                                                                border: '1px solid black',
                                                                            }}
                                                                        >
                                                                            <TableSortLabel
                                                                                active={weekOrderBy === 'date'}
                                                                                direction={
                                                                                    weekOrderBy === 'date'
                                                                                        ? orderWeek
                                                                                        : 'asc'
                                                                                }
                                                                                onClick={() =>
                                                                                    handleSortRequest('date')
                                                                                }
                                                                            >
                                                                                <Typography fontSize={20}>
                                                                                    前次发生时间
                                                                                </Typography>
                                                                            </TableSortLabel>
                                                                        </TableCell>
                                                                        <TableCell
                                                                            align="center"
                                                                            sx={{
                                                                                height: 'auto',
                                                                                border: '1px solid black',
                                                                            }}
                                                                        >
                                                                            <Typography fontSize={20}>
                                                                                发生次数
                                                                            </Typography>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                </TableHead>
                                                                <TableBody>
                                                                    {deviceData
                                                                        .filter(
                                                                            (columns) => columns.frequency === '週預測'
                                                                        )
                                                                        .sort(getComparator(orderWeek))
                                                                        .map((columns) => (
                                                                            <TableRow key={columns.name}>
                                                                                <TableCell
                                                                                    align="center"
                                                                                    sx={{
                                                                                        height: 'auto',
                                                                                        bgcolor: infoColor(
                                                                                            columns.happened_times
                                                                                        ),
                                                                                    }}
                                                                                >
                                                                                    <Typography fontSize={20}>
                                                                                        {columns.category}
                                                                                    </Typography>
                                                                                </TableCell>
                                                                                <TableCell
                                                                                    style={tableCellStyle.extendedCell}
                                                                                    key={columns.id}
                                                                                    align="center"
                                                                                    sx={{
                                                                                        bgcolor: getColor(
                                                                                            columns.steady
                                                                                        ),
                                                                                    }}
                                                                                >
                                                                                    <Typography fontSize={20}>
                                                                                        {columns.steady === 0
                                                                                            ? '稳定'
                                                                                            : '异常'}
                                                                                    </Typography>
                                                                                </TableCell>
                                                                                <TableCell
                                                                                    align="center"
                                                                                    sx={{
                                                                                        height: 'auto',
                                                                                        bgcolor: infoColor(
                                                                                            columns.happened_times
                                                                                        ),
                                                                                    }}
                                                                                >
                                                                                    <Typography fontSize={20}>
                                                                                        {columns.name}
                                                                                    </Typography>
                                                                                </TableCell>
                                                                                <TableCell
                                                                                    align="center"
                                                                                    sx={{
                                                                                        height: 'auto',
                                                                                        bgcolor: infoColor(
                                                                                            columns.happened_times
                                                                                        ),
                                                                                    }}
                                                                                >
                                                                                    <Typography fontSize={20}>
                                                                                        {columns.happenLastTime}
                                                                                    </Typography>
                                                                                </TableCell>
                                                                                <TableCell
                                                                                    align="center"
                                                                                    sx={{
                                                                                        height: 'auto',
                                                                                        bgcolor: infoColor(
                                                                                            columns.happened_times
                                                                                        ),
                                                                                    }}
                                                                                >
                                                                                    <Typography fontSize={20}>
                                                                                        {columns.happened_times}
                                                                                    </Typography>
                                                                                </TableCell>
                                                                            </TableRow>
                                                                        ))}
                                                                </TableBody>
                                                            </Table>
                                                        </TableContainer>
                                                        <TableContainer
                                                            component={Paper}
                                                            style={tableContainerStyle.tableContainer}
                                                        >
                                                            <Table>
                                                                <TableHead
                                                                    style={{
                                                                        position: 'sticky',
                                                                        top: 0,
                                                                        zIndex: 2,
                                                                        backgroundColor: '#bfbfbf',
                                                                    }}
                                                                >
                                                                    <TableRow>
                                                                        <TableCell
                                                                            align="center"
                                                                            sx={{
                                                                                height: 'auto',
                                                                                border: '1px solid black',
                                                                            }}
                                                                            colSpan={5}
                                                                        >
                                                                            <Typography fontSize={20}>
                                                                                日预测
                                                                                {
                                                                                    deviceData2
                                                                                        .filter(
                                                                                            (columns) =>
                                                                                                columns.frequency ===
                                                                                                '日預測'
                                                                                        )
                                                                                        .map(
                                                                                            (item) =>
                                                                                                `${item.pred_date}`
                                                                                        )[0]
                                                                                }
                                                                            </Typography>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                    <TableRow>
                                                                        <TableCell
                                                                            align="center"
                                                                            sx={{
                                                                                height: 'auto',
                                                                                border: '1px solid black',
                                                                            }}
                                                                        >
                                                                            <TableSortLabel
                                                                                active={dateOrderBy === 'category'}
                                                                                direction={
                                                                                    dateOrderBy === 'category'
                                                                                        ? orderDate
                                                                                        : 'asc'
                                                                                }
                                                                                onClick={() =>
                                                                                    handleSortRequestDate('category')
                                                                                }
                                                                            >
                                                                                <Typography fontSize={20}>
                                                                                    Category
                                                                                </Typography>
                                                                            </TableSortLabel>
                                                                        </TableCell>
                                                                        <TableCell
                                                                            align="center"
                                                                            sx={{
                                                                                height: 'auto',
                                                                                border: '1px solid黑',
                                                                            }}
                                                                        >
                                                                            <TableSortLabel
                                                                                active={dateOrderBy === 'label'}
                                                                                direction={
                                                                                    dateOrderBy === 'label'
                                                                                        ? orderDate
                                                                                        : 'asc'
                                                                                }
                                                                                onClick={() =>
                                                                                    handleSortRequestDate('label')
                                                                                }
                                                                            >
                                                                                <Typography fontSize={20}>
                                                                                    类型
                                                                                </Typography>
                                                                            </TableSortLabel>
                                                                        </TableCell>
                                                                        <TableCell
                                                                            align="center"
                                                                            sx={{
                                                                                height: 'auto',
                                                                                border: '1px solid黑',
                                                                            }}
                                                                        >
                                                                            <Typography fontSize={20}>
                                                                                异常事件
                                                                            </Typography>
                                                                        </TableCell>
                                                                        <TableCell
                                                                            align="center"
                                                                            sx={{
                                                                                height: 'auto',
                                                                                border: '1px solid黑',
                                                                            }}
                                                                        >
                                                                            <TableSortLabel
                                                                                active={dateOrderBy === 'date'}
                                                                                direction={
                                                                                    dateOrderBy === 'date'
                                                                                        ? orderDate
                                                                                        : 'asc'
                                                                                }
                                                                                onClick={() =>
                                                                                    handleSortRequestDate('date')
                                                                                }
                                                                            >
                                                                                <Typography fontSize={20}>
                                                                                    前次发生时间
                                                                                </Typography>
                                                                            </TableSortLabel>
                                                                        </TableCell>
                                                                        <TableCell
                                                                            align="center"
                                                                            sx={{
                                                                                height: 'auto',
                                                                                border: '1px solid黑',
                                                                            }}
                                                                        >
                                                                            <Typography fontSize={20}>
                                                                                发生次数
                                                                            </Typography>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                </TableHead>
                                                                <TableBody>
                                                                    {deviceData2
                                                                        .filter(
                                                                            (columns) => columns.frequency === '日預測'
                                                                        )
                                                                        .sort(getComparatorDate(orderDate))
                                                                        .map((columns) => (
                                                                            <TableRow key={columns.name}>
                                                                                <TableCell
                                                                                    align="center"
                                                                                    sx={{
                                                                                        height: 'auto',
                                                                                        bgcolor: infoColor(
                                                                                            columns.happened_times
                                                                                        ),
                                                                                    }}
                                                                                >
                                                                                    <Typography fontSize={20}>
                                                                                        {columns.category}
                                                                                    </Typography>
                                                                                </TableCell>
                                                                                <TableCell
                                                                                    style={tableCellStyle.extendedCell}
                                                                                    key={columns.id}
                                                                                    align="center"
                                                                                    sx={{
                                                                                        bgcolor: getColor(
                                                                                            columns.steady
                                                                                        ),
                                                                                    }}
                                                                                >
                                                                                    <Typography fontSize={20}>
                                                                                        {columns.steady === 0
                                                                                            ? '稳定'
                                                                                            : '异常'}
                                                                                    </Typography>
                                                                                </TableCell>
                                                                                <TableCell
                                                                                    align="center"
                                                                                    sx={{
                                                                                        height: 'auto',
                                                                                        bgcolor: infoColor(
                                                                                            columns.happened_times
                                                                                        ),
                                                                                    }}
                                                                                >
                                                                                    <Typography fontSize={20}>
                                                                                        {columns.name}
                                                                                    </Typography>
                                                                                </TableCell>
                                                                                <TableCell
                                                                                    align="center"
                                                                                    sx={{
                                                                                        height: 'auto',
                                                                                        bgcolor: infoColor(
                                                                                            columns.happened_times
                                                                                        ),
                                                                                    }}
                                                                                >
                                                                                    <Typography fontSize={20}>
                                                                                        {columns.happenLastTime}
                                                                                    </Typography>
                                                                                </TableCell>
                                                                                <TableCell
                                                                                    align="center"
                                                                                    sx={{
                                                                                        height: 'auto',
                                                                                        bgcolor: infoColor(
                                                                                            columns.happened_times
                                                                                        ),
                                                                                    }}
                                                                                >
                                                                                    <Typography fontSize={20}>
                                                                                        {columns.happened_times}
                                                                                    </Typography>
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
                                })
                            )}
                        </Carousel>
                    </div>
                ))}
            </div>
        );
    };

    const createDeviceCardEN = (data, data2) => {
        const groupByDeviceAndLine = (data) => {
            const groupedData = {};

            Object.keys(data).forEach((project) => {
                if (!groupedData[project]) {
                    groupedData[project] = {};
                }

                Object.keys(data[project]).forEach((device) => {
                    data[project][device].forEach((item) => {
                        const line = item.line;
                        if (!groupedData[project][device]) {
                            groupedData[project][device] = {};
                        }
                        if (!groupedData[project][device][line]) {
                            groupedData[project][device][line] = [];
                        }
                        groupedData[project][device][line].push(item);
                    });
                });
            });

            return groupedData;
        };

        const groupedData = groupByDeviceAndLine(data);
        const groupedData2 = groupByDeviceAndLine(data2);

        return (
            <div>
                {Object.keys(groupedData).map((project) => (
                    <div key={project}>
                        <Carousel
                            showArrows={false}
                            renderIndicator={customRenderIndicator}
                            infiniteLoop={true}
                            autoPlay={!isPaused}
                            stopOnHover={true}
                            interval={3000}
                        >
                            {Object.keys(groupedData[project]).map((device) =>
                                Object.keys(groupedData[project][device]).map((line) => {
                                    const deviceData = groupedData[project][device][line];
                                    const deviceData2 = groupedData2[project][device][line] || [];

                                    let abnormalCount = 0;
                                    let nonAbnormalCount = 0;
                                    deviceData.forEach((item) => {
                                        if (item.steady === 1) {
                                            abnormalCount++;
                                        } else if (item.steady === 0) {
                                            nonAbnormalCount++;
                                        }
                                    });

                                    let pieData = [
                                        { value: nonAbnormalCount, label: 'Stabilize' },
                                        { value: abnormalCount, label: 'Abnormal' },
                                    ];

                                    return (
                                        <div key={device + line}>
                                            <Card>
                                                <Box sx={{ bgcolor: '#696969' }}>
                                                    <CardHeader
                                                        title={`${project}@ line ${line}@ ${device}`}
                                                        color="#696969"
                                                        align="center"
                                                    />
                                                </Box>
                                                <Grid container spacing={1}>
                                                    <Grid xs={3} sx={{ mt: 4 }}>
                                                        <Box
                                                            border={1}
                                                            sx={{ mt: 4, ml: 6, width: 120, height: 'auto' }}
                                                        >
                                                            <Typography align="center" fontSize={25}>
                                                                Abnormal
                                                            </Typography>
                                                            <Box
                                                                sx={{
                                                                    bgcolor: '#ff2600',
                                                                    width: 'auto',
                                                                    height: 'auto',
                                                                }}
                                                            >
                                                                <Typography align="center" fontSize={20}>
                                                                    {abnormalCount}
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                        <Box sx={{ mt: 6, ml: 2 }}>
                                                            <PieChart
                                                                colors={['#008f00', '#ff2600']}
                                                                series={[
                                                                    {
                                                                        arcLabel: (item) =>
                                                                            `${item.label} (${item.value})`,
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
                                                        <Box
                                                            border={1}
                                                            sx={{ mt: 4, ml: 6, width: 118, height: 'auto' }}
                                                        >
                                                            <Typography align="center" fontSize={25}>
                                                                Stabilize
                                                            </Typography>
                                                            <Box
                                                                sx={{
                                                                    bgcolor: '#008f00',
                                                                    width: 'auto',
                                                                    height: 'auto',
                                                                }}
                                                            >
                                                                <Typography align="center" fontSize={20}>
                                                                    {nonAbnormalCount}
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                    </Grid>
                                                    <Grid item xs={6} md={6} lg={6}>
                                                        <TableContainer
                                                            component={Paper}
                                                            style={tableContainerStyle.tableContainer}
                                                        >
                                                            <Table>
                                                                <TableHead
                                                                    style={{
                                                                        position: 'sticky',
                                                                        top: 0,
                                                                        zIndex: 2,
                                                                        backgroundColor: '#bfbfbf',
                                                                    }}
                                                                >
                                                                    <TableRow>
                                                                        <TableCell
                                                                            align="center"
                                                                            sx={{
                                                                                height: 'auto',
                                                                                border: '1px solid black',
                                                                            }}
                                                                            colSpan={5}
                                                                        >
                                                                            <Typography fontSize={20}>
                                                                                Weekly predictions
                                                                                {
                                                                                    deviceData
                                                                                        .filter(
                                                                                            (columns) =>
                                                                                                columns.frequency ===
                                                                                                '週預測'
                                                                                        )
                                                                                        .map(
                                                                                            (item) =>
                                                                                                `${item.ori_date}-${item.pred_date}`
                                                                                        )[0]
                                                                                }
                                                                            </Typography>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                    <TableRow>
                                                                        <TableCell
                                                                            align="center"
                                                                            sx={{
                                                                                height: 'auto',
                                                                                border: '1px solid black',
                                                                            }}
                                                                        >
                                                                            <TableSortLabel
                                                                                active={weekOrderBy === 'category'}
                                                                                direction={
                                                                                    weekOrderBy === 'category'
                                                                                        ? orderWeek
                                                                                        : 'asc'
                                                                                }
                                                                                onClick={() =>
                                                                                    handleSortRequest('category')
                                                                                }
                                                                            >
                                                                                <Typography fontSize={20}>
                                                                                    Category
                                                                                </Typography>
                                                                            </TableSortLabel>
                                                                        </TableCell>
                                                                        <TableCell
                                                                            align="center"
                                                                            sx={{
                                                                                height: 'auto',
                                                                                border: '1px solid black',
                                                                            }}
                                                                        >
                                                                            <TableSortLabel
                                                                                active={weekOrderBy === 'label'}
                                                                                direction={
                                                                                    weekOrderBy === 'label'
                                                                                        ? orderWeek
                                                                                        : 'asc'
                                                                                }
                                                                                onClick={() =>
                                                                                    handleSortRequest('label')
                                                                                }
                                                                            >
                                                                                <Typography fontSize={20}>
                                                                                    Type
                                                                                </Typography>
                                                                            </TableSortLabel>
                                                                        </TableCell>
                                                                        <TableCell
                                                                            align="center"
                                                                            sx={{
                                                                                height: 'auto',
                                                                                border: '1px solid black',
                                                                            }}
                                                                        >
                                                                            <Typography fontSize={20}>
                                                                                Unusual events
                                                                            </Typography>
                                                                        </TableCell>
                                                                        <TableCell
                                                                            align="center"
                                                                            sx={{
                                                                                height: 'auto',
                                                                                border: '1px solid black',
                                                                            }}
                                                                        >
                                                                            <TableSortLabel
                                                                                active={weekOrderBy === 'date'}
                                                                                direction={
                                                                                    weekOrderBy === 'date'
                                                                                        ? orderWeek
                                                                                        : 'asc'
                                                                                }
                                                                                onClick={() =>
                                                                                    handleSortRequest('date')
                                                                                }
                                                                            >
                                                                                <Typography fontSize={20}>
                                                                                    Last occurrence time
                                                                                </Typography>
                                                                            </TableSortLabel>
                                                                        </TableCell>
                                                                        <TableCell
                                                                            align="center"
                                                                            sx={{
                                                                                height: 'auto',
                                                                                border: '1px solid black',
                                                                            }}
                                                                        >
                                                                            <Typography fontSize={20}>
                                                                                Number of occurrences
                                                                            </Typography>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                </TableHead>
                                                                <TableBody>
                                                                    {deviceData
                                                                        .filter(
                                                                            (columns) => columns.frequency === '週預測'
                                                                        )
                                                                        .sort(getComparator(orderWeek))
                                                                        .map((columns) => (
                                                                            <TableRow key={columns.name}>
                                                                                <TableCell
                                                                                    align="center"
                                                                                    sx={{
                                                                                        height: 'auto',
                                                                                        bgcolor: infoColor(
                                                                                            columns.happened_times
                                                                                        ),
                                                                                    }}
                                                                                >
                                                                                    <Typography fontSize={20}>
                                                                                        {columns.category}
                                                                                    </Typography>
                                                                                </TableCell>
                                                                                <TableCell
                                                                                    style={tableCellStyle.extendedCell}
                                                                                    key={columns.id}
                                                                                    align="center"
                                                                                    sx={{
                                                                                        bgcolor: getColor(
                                                                                            columns.steady
                                                                                        ),
                                                                                    }}
                                                                                >
                                                                                    <Typography fontSize={20}>
                                                                                        {columns.steady === 0
                                                                                            ? 'Stabilize'
                                                                                            : 'Abnormal'}
                                                                                    </Typography>
                                                                                </TableCell>
                                                                                <TableCell
                                                                                    align="center"
                                                                                    sx={{
                                                                                        height: 'auto',
                                                                                        bgcolor: infoColor(
                                                                                            columns.happened_times
                                                                                        ),
                                                                                    }}
                                                                                >
                                                                                    <Typography fontSize={20}>
                                                                                        {columns.name}
                                                                                    </Typography>
                                                                                </TableCell>
                                                                                <TableCell
                                                                                    align="center"
                                                                                    sx={{
                                                                                        height: 'auto',
                                                                                        bgcolor: infoColor(
                                                                                            columns.happened_times
                                                                                        ),
                                                                                    }}
                                                                                >
                                                                                    <Typography fontSize={20}>
                                                                                        {columns.happenLastTime}
                                                                                    </Typography>
                                                                                </TableCell>
                                                                                <TableCell
                                                                                    align="center"
                                                                                    sx={{
                                                                                        height: 'auto',
                                                                                        bgcolor: infoColor(
                                                                                            columns.happened_times
                                                                                        ),
                                                                                    }}
                                                                                >
                                                                                    <Typography fontSize={20}>
                                                                                        {columns.happened_times}
                                                                                    </Typography>
                                                                                </TableCell>
                                                                            </TableRow>
                                                                        ))}
                                                                </TableBody>
                                                            </Table>
                                                        </TableContainer>
                                                        <TableContainer
                                                            component={Paper}
                                                            style={tableContainerStyle.tableContainer}
                                                        >
                                                            <Table>
                                                                <TableHead
                                                                    style={{
                                                                        position: 'sticky',
                                                                        top: 0,
                                                                        zIndex: 2,
                                                                        backgroundColor: '#bfbfbf',
                                                                    }}
                                                                >
                                                                    <TableRow>
                                                                        <TableCell
                                                                            align="center"
                                                                            sx={{
                                                                                height: 'auto',
                                                                                border: '1px solid black',
                                                                            }}
                                                                            colSpan={5}
                                                                        >
                                                                            <Typography fontSize={20}>
                                                                                Daily predictions
                                                                                {
                                                                                    deviceData2
                                                                                        .filter(
                                                                                            (columns) =>
                                                                                                columns.frequency ===
                                                                                                '日預測'
                                                                                        )
                                                                                        .map(
                                                                                            (item) =>
                                                                                                `${item.pred_date}`
                                                                                        )[0]
                                                                                }
                                                                            </Typography>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                    <TableRow>
                                                                        <TableCell
                                                                            align="center"
                                                                            sx={{
                                                                                height: 'auto',
                                                                                border: '1px solid black',
                                                                            }}
                                                                        >
                                                                            <TableSortLabel
                                                                                active={dateOrderBy === 'category'}
                                                                                direction={
                                                                                    dateOrderBy === 'category'
                                                                                        ? orderDate
                                                                                        : 'asc'
                                                                                }
                                                                                onClick={() =>
                                                                                    handleSortRequestDate('category')
                                                                                }
                                                                            >
                                                                                <Typography fontSize={20}>
                                                                                    Category
                                                                                </Typography>
                                                                            </TableSortLabel>
                                                                        </TableCell>
                                                                        <TableCell
                                                                            align="center"
                                                                            sx={{
                                                                                height: 'auto',
                                                                                border: '1px solid black',
                                                                            }}
                                                                        >
                                                                            <TableSortLabel
                                                                                active={dateOrderBy === 'label'}
                                                                                direction={
                                                                                    dateOrderBy === 'label'
                                                                                        ? orderDate
                                                                                        : 'asc'
                                                                                }
                                                                                onClick={() =>
                                                                                    handleSortRequestDate('label')
                                                                                }
                                                                            >
                                                                                <Typography fontSize={20}>
                                                                                    Type
                                                                                </Typography>
                                                                            </TableSortLabel>
                                                                        </TableCell>
                                                                        <TableCell
                                                                            align="center"
                                                                            sx={{
                                                                                height: 'auto',
                                                                                border: '1px solid black',
                                                                            }}
                                                                        >
                                                                            <Typography fontSize={20}>
                                                                                Unusual events
                                                                            </Typography>
                                                                        </TableCell>
                                                                        <TableCell
                                                                            align="center"
                                                                            sx={{
                                                                                height: 'auto',
                                                                                border: '1px solid black',
                                                                            }}
                                                                        >
                                                                            <TableSortLabel
                                                                                active={dateOrderBy === 'date'}
                                                                                direction={
                                                                                    dateOrderBy === 'date'
                                                                                        ? orderDate
                                                                                        : 'asc'
                                                                                }
                                                                                onClick={() =>
                                                                                    handleSortRequestDate('date')
                                                                                }
                                                                            >
                                                                                <Typography fontSize={20}>
                                                                                    Last occurrence time
                                                                                </Typography>
                                                                            </TableSortLabel>
                                                                        </TableCell>
                                                                        <TableCell
                                                                            align="center"
                                                                            sx={{
                                                                                height: 'auto',
                                                                                border: '1px solid black',
                                                                            }}
                                                                        >
                                                                            <Typography fontSize={20}>
                                                                                Number of occurrences
                                                                            </Typography>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                </TableHead>
                                                                <TableBody>
                                                                    {deviceData2
                                                                        .filter(
                                                                            (columns) => columns.frequency === '日預測'
                                                                        )
                                                                        .sort(getComparatorDate(orderDate))
                                                                        .map((columns) => (
                                                                            <TableRow key={columns.name}>
                                                                                <TableCell
                                                                                    align="center"
                                                                                    sx={{
                                                                                        height: 'auto',
                                                                                        bgcolor: infoColor(
                                                                                            columns.happened_times
                                                                                        ),
                                                                                    }}
                                                                                >
                                                                                    <Typography fontSize={20}>
                                                                                        {columns.category}
                                                                                    </Typography>
                                                                                </TableCell>
                                                                                <TableCell
                                                                                    style={tableCellStyle.extendedCell}
                                                                                    key={columns.id}
                                                                                    align="center"
                                                                                    sx={{
                                                                                        bgcolor: getColor(
                                                                                            columns.steady
                                                                                        ),
                                                                                    }}
                                                                                >
                                                                                    <Typography fontSize={20}>
                                                                                        {columns.steady === 0
                                                                                            ? 'Stabilize'
                                                                                            : 'Abnormal'}
                                                                                    </Typography>
                                                                                </TableCell>
                                                                                <TableCell
                                                                                    align="center"
                                                                                    sx={{
                                                                                        height: 'auto',
                                                                                        bgcolor: infoColor(
                                                                                            columns.happened_times
                                                                                        ),
                                                                                    }}
                                                                                >
                                                                                    <Typography fontSize={20}>
                                                                                        {columns.name}
                                                                                    </Typography>
                                                                                </TableCell>
                                                                                <TableCell
                                                                                    align="center"
                                                                                    sx={{
                                                                                        height: 'auto',
                                                                                        bgcolor: infoColor(
                                                                                            columns.happened_times
                                                                                        ),
                                                                                    }}
                                                                                >
                                                                                    <Typography fontSize={20}>
                                                                                        {columns.happenLastTime}
                                                                                    </Typography>
                                                                                </TableCell>
                                                                                <TableCell
                                                                                    align="center"
                                                                                    sx={{
                                                                                        height: 'auto',
                                                                                        bgcolor: infoColor(
                                                                                            columns.happened_times
                                                                                        ),
                                                                                    }}
                                                                                >
                                                                                    <Typography fontSize={20}>
                                                                                        {columns.happened_times}
                                                                                    </Typography>
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
                                })
                            )}
                        </Carousel>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <ThemeProvider theme={darkTheme}>
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
            {globalVariable === 'zh-tw' ? (
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', mr: '100px' }}>
                        <LoadingButton variant="contained" color="info" onClick={togglePause}>
                            {isPaused ? '恢復輪播' : '暫停輪播'}
                        </LoadingButton>
                        <Marquee msg={timeStampData} />{' '}
                        {/* 這是跑馬燈的function如果要改，他自己有獨立的檔案可以進去裡面改 */}
                        <LoadingButton
                            variant="contained"
                            color="info"
                            onClick={handleRefresh}
                            style={{ display: 'flex', alignItems: 'center', marginLeft: '10px' }}
                        >
                            刷新
                        </LoadingButton>
                        <ColorBox msg="已發生過之異常事件"></ColorBox>
                    </div>
                    {createDeviceCardTW(dateData, dateData)}
                </div>
            ) : globalVariable === 'zh-cn' ? (
                <div>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <div style={{ display: 'flex', alignItems: 'center', mr: '100px' }}>
                            <LoadingButton variant="contained" color="info" onClick={togglePause}>
                                {isPaused ? '恢复轮播' : '暂停轮播'}
                            </LoadingButton>
                            <Marquee msg={timeStampData} />
                            <LoadingButton
                                variant="contained"
                                color="info"
                                onClick={handleRefresh}
                                style={{ display: 'flex', alignItems: 'center', marginLeft: '10px' }}
                            >
                                刷新
                            </LoadingButton>
                            <ColorBox msg="已发生过之异常事件"></ColorBox>
                        </div>
                    </Box>
                    {createDeviceCardCN(dateData, dateData)}
                </div>
            ) : (
                <div>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <div style={{ display: 'flex', alignItems: 'center', mr: '100px' }}>
                            <LoadingButton variant="contained" color="info" onClick={togglePause}>
                                {isPaused ? 'Resume carousel' : 'Pause carousel'}
                            </LoadingButton>
                            <Marquee msg={timeStampData} />
                            <LoadingButton
                                variant="contained"
                                color="info"
                                onClick={handleRefresh}
                                style={{ display: 'flex', alignItems: 'center', marginLeft: '10px' }}
                            >
                                refresh
                            </LoadingButton>
                            <ColorBox msg="Abnormal events that have occurred"></ColorBox>
                        </div>
                    </Box>
                    {createDeviceCardEN(dateData, dateData)}
                </div>
            )}
        </ThemeProvider>
    );
}
