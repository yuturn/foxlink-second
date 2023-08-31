import React, { useState, useEffect, useReducer } from "react";
import { useNavigate } from 'react-router-dom';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
    Box,
    Button,
    Card,
    CardHeader,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    createTheme,
    ThemeProvider,
    Divider,
    FormControl,
    InputLabel
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { SeverityPill } from '../components/severity-pill';
import { WorkshopPicker } from "../components/workshop-picker.js";
import { apiWorkStatus } from "../api.js";

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        background: {
            default: '#1a1e2b',
            paper: '#1a1e2b',
        },
        text: {
            primary: '#EDF2F7',
        },
        secondary: {
            main: '#1976d2',
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
        }, leave: {
            main: '#292b2c',
            contrastText: '#fff'
        },
        working: {
            main: '#d9534f',
            contrastText: '#fff'
        },
        notice: {
            main: '#f0ad4e',
            contrastText: '#fff'
        },
        moving: {
            main: '#0275d8',
            contrastText: '#fff'
        },
        idle: {
            main: '#5cb85c',
            contrastText: '#fff'
        }
    }
});

const CONTENT = {
    title: "员工状态总览",
    worker_id: "员工 ID",
    name: "姓名",
    last_event_end_date: "上次任务结束时间",
    at_device_cname: "员工位置",
    worker_status: "员工状态",
    total_dispatches: "派工总数",
    mission_duration: "任务时长",
    repair_duration: "维修时长",
    update: "更新资料",
    Idle: "閒置中",
    Working: "维修中",
    Moving: "移动中",
    Notice: "指派中",
    Leave: "离线",

}
export default function AllStatus({ token, setAlert, ...rest }) {
    const [statusData, setStatusData] = useState();
    const [workshop, setWorkshop] = useState("");
    const [loading, setLoading] = useState(false);
    const [_, forceUpdate] = useReducer(x => x + 1, 0);
    const navigate = useNavigate();

    const updataData = (sort = false) => {
        setLoading(true);
        apiWorkStatus(workshop).then(res => {
            let rawData = res.data;
            rawData.map(worker => {
                worker.finish_event_date = parseTimeZone(worker.finish_event_date);
                if (worker.mission_duration == null) worker.mission_duration = "无";
                else worker.mission_duration = parseSeconds(worker.mission_duration);
                if (worker.repair_duration == null) worker.repair_duration = "无";
                else worker.repair_duration = parseSeconds(worker.repair_duration);
                worker.sort = parseSortIndex(worker.status);
            });
            if (sort) {
                rawData.sort(function (a, b) {
                    return b.sort - a.sort;
                })
            }
            setStatusData(rawData);
            setAlert({
                'open': true,
                'msg': "更新成功",
                'type': 'success'
            });
        }).catch(err => {
            if (err.response) {
                setAlert({
                    'open': true,
                    'msg': err.response.statusText,
                    'type': 'error'
                })
            }
            else {
                alert('网路异常，请联系相关人员 (断线 或 Timeout)');
                navigate('/login');
            }
        }).finally(() => {
            setLoading(false);
        });
    }

    /*
    const handleSort = () => {
        
        let sortedData = statusData;
        sortedData.sort(function(a, b){
            return b.sort - a.sort;
        })
        setStatusData(sortedData);
        forceUpdate();
    }
    */
    const parseTimeZone = (time_string) => {
        let dt = new Date(time_string);
        dt.setTime(dt.getTime() - dt.getTimezoneOffset() * 60 * 1000);
        let formated_str = dt.toLocaleDateString() + "  " + dt.toLocaleTimeString('zh-CN', { hour12: false });
        return formated_str;
    }
    const parseSeconds = (sencond_str) => {
        let sec_num = parseInt(sencond_str);
        let hours = Math.floor(sec_num / 3600);
        let minutes = Math.floor((sec_num - (hours * 3600)) / 60);
        let seconds = sec_num - (hours * 3600) - (minutes * 60);

        if (hours < 10) { hours = "0" + hours; }
        if (minutes < 10) { minutes = "0" + minutes; }
        if (seconds < 10) { seconds = "0" + seconds; }

        return hours + ':' + minutes + ':' + seconds;
    }
    const parseSortIndex = (status_str) => {
        if (status_str === "Working") { return 5; }
        else if (status_str === "Notice") { return 4; }
        else if (status_str === "Moving") { return 3; }
        else if (status_str === "Idle") { return 2; }
        else { return 1; }
    }
    return (
        <ThemeProvider theme={darkTheme}>
            {/* <Card >
                <CardHeader title={CONTENT.title}
                    action={(
                    <FormControl >
                        <InputLabel id="demo-simple-select-label">WorkShop</InputLabel>
                        <WorkshopPicker token={token} workshop={workshop} setWorkshop={setWorkshop} />
                        <LoadingButton
                        variant="contained"
                        size="large"
                        component="span"
                        sx={{
                            borderRadius: 4,
                            minWidth: 200,
                            justifyContent: 'center',
                            letterSpacing: 3,
                            mt:1
                        }}
                        loading={loading}
                        onClick={() => updataData(false)}
                        >
                            {CONTENT.update}
                        </LoadingButton>
                    </FormControl>)} 
                />
                <Divider sx={{ borderBottomWidth: 3 }} />
                <PerfectScrollbar>
                    {
                        statusData && 
                        <Box sx={{ minWidth: 800 }}>
                        <Table>
                            <TableHead sx={{ background: "#272d3a" }}>
                                <TableRow>
                                    <TableCell>
                                        {CONTENT.worker_id}
                                    </TableCell>
                                    <TableCell>
                                        {CONTENT.name}
                                    </TableCell>
                                    <TableCell >
                                        {CONTENT.last_event_end_date}
                                    </TableCell>
                                    <TableCell >
                                        {CONTENT.at_device_cname}
                                    </TableCell>
                                    <TableCell>
                                        <Button id="status" onClick={() => updataData(true)}>{CONTENT.worker_status}</Button>
                                    </TableCell>
                                    <TableCell>
                                        {CONTENT.total_dispatches}
                                    </TableCell>
                                    <TableCell>
                                        {CONTENT.mission_duration}
                                    </TableCell>
                                    <TableCell>
                                        {CONTENT.repair_duration}
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {statusData.map(worker => (
                                    <TableRow
                                        hover
                                        key={worker.worker_id}
                                    >
                                        <TableCell>
                                            {worker.worker_id}
                                        </TableCell>
                                        <TableCell>
                                            {worker.worker_name}
                                        </TableCell>
                                        <TableCell>
                                            {worker.finish_event_date}
                                        </TableCell>
                                        <TableCell>
                                            {
                                              worker.at_device_cname == null ? worker.at_device : worker.at_device_cname
                                            }
                                        </TableCell>
                                        <TableCell>
                                            <SeverityPill
                                                color={(worker.status === 'Working' && 'working')
                                                    || (worker.status === 'Leave' && 'leave')
                                                    || (worker.status === 'Notice' && 'notice')
                                                    || (worker.status === 'Moving' && 'moving')
                                                    || (worker.status === 'Idle' && 'idle')
                                                    || 'warning'}
                                            >
                                                {CONTENT[worker.status]}
                                            </SeverityPill>
                                        </TableCell>
                                        <TableCell>
                                            {worker.total_dispatches}
                                        </TableCell>
                                        <TableCell>
                                            {worker.mission_duration}
                                        </TableCell>
                                        <TableCell>
                                            {worker.repair_duration}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Box>
                    }
                </PerfectScrollbar>
            </Card> */}
        </ThemeProvider>
    );
}