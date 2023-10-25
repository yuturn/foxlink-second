import React, { useState, useEffect } from "react";

import { saveAs } from 'file-saver';

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
    const [sDate, setSDate] = useState(new Date());
    const [eDate, setEDate] = useState(new Date());
    const [operationType, setOperationType] = useState("");
    useEffect(() => {
        const data = {
            token: token,
            start: new Date(sDate).toISOString(),
            end: new Date(eDate).toISOString()
        }
    })
    const operationTypeChange = (event) => {
        setOperationType(event.target.value);
    };
    return (
        <ThemeProvider theme={darkTheme}>
            <Card >
                <Box sx={{ bgcolor: '#696969' }}>
                    <CardHeader title="LOG頁面:" color="#62aaf4" />
                </Box>
                <Divider sx={{ borderBottomWidth: 3 }} />
                <CardContent>
                    <Grid container spacing={1}>
                        <Grid item xs={12} md={12}>
                            <Typography variant="h4" fontWeight="medium" mr={2}>
                                條件篩選:
                            </Typography>
                            <Box>
                                <Box sx={{ mt: 2, ml: 4 }} display="flex" component="form" role="form" >
                                    <Box align="center" display="flex">
                                        <Typography variant="h5" fontWeight="medium" mr={2}>
                                            操作時間:
                                        </Typography>
                                    </Box>
                                    <Box align="center" display="flex" sx={{ mr: 2 }}>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DatePicker
                                                label="开始日期"
                                                value={sDate}
                                                onChange={(newValue) => {
                                                    setSDate(newValue);
                                                    //console.log(newValue);
                                                }}
                                                renderInput={(params) => <TextField {...params} />}
                                            />
                                        </LocalizationProvider>
                                    </Box>
                                    <Box align="center" display="flex">
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DatePicker
                                                label="结束日期"
                                                value={eDate}
                                                onChange={(newValue) => {
                                                    setEDate(newValue);
                                                    //console.log(newValue);
                                                }}
                                                renderInput={(params) => <TextField {...params} />}
                                            />
                                        </LocalizationProvider>
                                    </Box>
                                </Box>
                                <Box sx={{ mt: 1, ml: 4 }} display="flex" component="form" role="form">
                                    <Box align="center" display="flex">
                                        <Typography variant="h5" fontWeight="medium" mr={2}>
                                            操作類型:
                                        </Typography>
                                    </Box>
                                    <Box>
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
                                                <MenuItem value={1}>模型訓練</MenuItem>
                                                <MenuItem value={2}>模型預測</MenuItem>
                                                <MenuItem value={3}>差異備份路徑更改</MenuItem>
                                                <MenuItem value={4}>完整備份路徑更改</MenuItem>
                                                <MenuItem value={5}>差異備份時間更改</MenuItem>
                                                <MenuItem value={6}>完整備份時間更改</MenuItem>
                                                <MenuItem value={7}>差異備份執行</MenuItem>
                                                <MenuItem value={8}>完整備份執行</MenuItem>
                                                <MenuItem value={9}>還原</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Box>
                                </Box>
                                <Box sx={{ mt: 1, ml: 4 }} display="flex" component="form" role="form">
                                    <Box align="center" display="flex">
                                        <Typography align="center" variant="h5" mr={2}>
                                            專案名稱:
                                        </Typography>
                                    </Box>
                                    <Box>
                                        <TextField
                                            fullWidth
                                            label="專案名稱"
                                            margin="none"
                                            name="projectName"
                                            id="projectName"
                                            variant="outlined"
                                        />
                                    </Box>
                                </Box>
                                <Box sx={{ mt: 1, ml: 4 }} display="flex" component="form" role="form">
                                    <Box>
                                        <Typography variant="h5" fontWeight="medium" mr={2}>
                                            員工姓名:
                                        </Typography>
                                    </Box>
                                    <Box>
                                        <TextField
                                            fullWidth
                                            label="員工姓名"
                                            margin="none"
                                            name="employeeID"
                                            id="employeeID"
                                            variant="outlined"
                                        />
                                    </Box>
                                </Box>
                                <Box sx={{ mt: 1, ml: 4 }} display="flex" component="form" role="form">
                                    <Box>
                                        <Typography variant="h5" fontWeight="medium" mr={2}>
                                            員工ID :
                                        </Typography>
                                    </Box>
                                    <Box>
                                        <TextField
                                            fullWidth
                                            label="員工ID"
                                            margin="none"
                                            name="employeeID"
                                            id="employeeID"
                                            variant="outlined"
                                        />
                                    </Box>
                                </Box>
                                <Box sx={{ ml: 4 }} display="flex">
                                    <LoadingButton variant="contained"
                                        size="large"
                                        component="span"
                                        color="info"
                                        sx={{
                                            borderRadius: 4,
                                            justifyContent: 'center',
                                            letterSpacing: 3,
                                            mt: 3
                                        }}
                                    >
                                        查詢
                                    </LoadingButton>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                    <Grid container spacing={1} mt={1}>
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center">操作時間</TableCell>
                                        <TableCell align="center">操作類型</TableCell>
                                        <TableCell align="center">專案名稱</TableCell>
                                        <TableCell align="center">員工ID</TableCell>
                                        <TableCell align="center">員工姓名</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {rows.map((row) => (
                                        <TableRow
                                            key={row.name}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell align="center">{row.date}</TableCell>
                                            <TableCell align="center">{row.behavior}</TableCell>
                                            <TableCell align="center">{row.project}</TableCell>
                                            <TableCell component="th" scope="row" align="center">
                                                {row.id}
                                            </TableCell>
                                            <TableCell align="center">{row.name}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                </CardContent>
            </Card>
        </ThemeProvider>
    );
}
