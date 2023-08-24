import React, { useState, useEffect } from "react";

import { saveAs } from 'file-saver';

import { Box, Card, CardContent, CardHeader, Divider, FormControl, createTheme, ThemeProvider, TextField, Grid, Select, MenuItem, InputLabel } from '@mui/material';

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
            paper: '#e7f2fd',
        },
        text: {
            primary: '#000000',
        },
        primary: {
            // Purple and green play nicely together.
            main: '#2196f3',
        },
    },
});

function createData(id, date, behavior) {
    return { id, date, behavior };
}

const rows = [
    createData('c001', 20220711, "完整備份執行"),
    createData('c002', 20220713, "差異備份執行"),
    createData('c003', 20220715, "備份時間更改"),
    createData('c004', 20220722, "備份路徑更改"),
    createData('c005', 20220802, "模型執行"),
];


export default function LOG({ token, ...rest }) {
    const [sDate, setSDate] = useState(new Date());
    const [eDate, setEDate] = useState(new Date());
    const [age, setAge] = useState("");

    const handleChange = (event) => {
        setAge(event.target.value);
    };

    useEffect(() => {
        const data = {
            token: token,
            start: new Date(sDate).toISOString(),
            end: new Date(eDate).toISOString()
        }
    })

    return (
        <ThemeProvider theme={darkTheme}>
            <Card >
                <Box sx={{ bgcolor: 'info.main' }}>
                    <CardHeader title="LOG頁面:" color="#62aaf4" />
                </Box>
                <Divider sx={{ borderBottomWidth: 3 }} />
                <CardContent>
                    <Grid container spacing={2} mt={1}>
                        <Grid item xs={{ md: 2 }} >
                            <TextField
                                fullWidth
                                label="員工ID"
                                margin="normal"
                                name="ID"
                                id="ID"
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={{ md: 3 }}>
                            <Box sx={{ mt: 2 }}>
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
                        </Grid>
                        <Grid item xs={{ md: 3 }}>
                            <Box sx={{ mt: 2 }}>
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
                        </Grid>
                        <Grid item xs={{ md: 3 }}>
                            <Box sx={{ mt: 2 }}>
                                <FormControl>
                                    <InputLabel id="demo-simple-select-label">操作紀錄</InputLabel>
                                    <Select
                                        labelId="permission-select-label"
                                        id="permission-select"
                                        value={age}
                                        label="操作紀錄"
                                        onChange={handleChange}
                                        style={{ minWidth: "200px", height: "56px" }}
                                    >
                                        <MenuItem value={10}>完整備份執行</MenuItem>
                                        <MenuItem value={20}>差異備份執行</MenuItem>
                                        <MenuItem value={30}>備份時間更改</MenuItem>
                                        <MenuItem value={40}>備份路徑更改</MenuItem>
                                        <MenuItem value={50}>模型執行</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                        </Grid>
                        <Grid item xs={{ md: 1 }}>
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
                        </Grid>
                    </Grid>
                    <Grid container spacing={1} mt={1}>
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>員工ID</TableCell>
                                        <TableCell align="right">操作時間</TableCell>
                                        <TableCell align="right">操作類型</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {rows.map((row) => (
                                        <TableRow
                                            key={row.name}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell component="th" scope="row">
                                                {row.id}
                                            </TableCell>
                                            <TableCell align="right">{row.date}</TableCell>
                                            <TableCell align="right">{row.behavior}</TableCell>
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
