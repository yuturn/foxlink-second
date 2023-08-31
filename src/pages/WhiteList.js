import React, { useState, useEffect } from "react";
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
} from '@mui/material';
import { Typography, Container, InputLabel, MenuItem, Select, FormControl } from '@mui/material';

import { apiGetWhiteList, apiGetDeviceNameById, apiWorkShopList, apiGetDeviceRecommend, apiGetWorkersByDevice, apiPostAddWorkersWhitelist, apiDeleteWorkersWhitelist } from "../api.js";

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

const CONTENT = {
    title: "白名單",
    editTitle: "编辑白名單",
    device_cname: "装置名称",
    device_id: "装置 ID",
    name: "員工姓名",
    id: "員工 ID",
    project: "专案",
    update: "更新资料",
    shift: "班別",
    recommand: "推荐员工",
    action: "新增",
    remove: "移除"
}

export default function WhiteList({ token, ...rest }) {
    const [deviceMap, setDeviceMap] = useState();
    const [deviceRecommend, setDeviceRecommend] = useState();

    const [workshop, setWorkshop] = useState();

    const [selectItem, setSelectItem] = useState();
    const [deviceSelect, setDeviceSelect] = useState();
    const [workSelect, setWorkSelect] = useState();

    const [shift, setShift] = useState();
    const [device, setDevice] = useState();
    const [worker, setWorker] = useState();

    useEffect(() => {
        handleUpdate();
        return () => {
        }
    }, [])

    const handleChange = (event) => {
        setWorkshop(event.target.value);
        apiGetWhiteList(event.target.value).then(res => {
            let promises = []
            let ids = Object.keys(res.data);

            ids.map(id => {
                promises.push(GetDeviceName(id, res.data[String(id)]));
            })
            Promise.all(promises).then(response => {
                setDeviceMap(response);
            })
        }).catch(err => {
            console.log(err);
        })

        apiGetDeviceRecommend(event.target.value).then(res => {
            setDeviceRecommend(res.data);
            // 看 apiGetDeviceRecommend 的資料型態
            // console.log('apiGetDeviceRecommend : ')
            // console.log(res.data)
        }).catch(err => {
            console.log(err);
        })
    }

    const GetDeviceName = (id, employee) => {
        return new Promise((resolve, reject) => {
            let data = {
                "token": token,
                "device_id": id
            }
            apiGetDeviceNameById(data).then(res => {
                // 看 apiGetDeviceNameById 的資料型態
                // console.log('apiGetDeviceNameById : ')
                // console.log(res.data)
                resolve({ 'id': id, 'project': res.data['project'], 'name': res.data['device_cname'], 'employee': employee });
            }).catch(err => {
                reject();
            })
        })
    }

    const handleUpdate = () => {
        setShift(null);

        setWorkshop(null);
        setSelectItem(null);
        setDeviceSelect(null);
        setDeviceRecommend(null);
        setWorker(null);
        setWorkSelect(null);
        setDeviceMap(null);
        apiWorkShopList(token).then(res => {
            setSelectItem(res.data.map(name => {
                return (<MenuItem key={name} value={name}>{name}</MenuItem>)
            }))
        }).catch(err => {

        });


    }

    const handDelete = (device_id, user_id) => {
        let data = {
            device_id: device_id,
            username: user_id
        }
        apiDeleteWorkersWhitelist(data).then(res => {
            if (res.status == 200) {
                alert('移除成功');
                handleUpdate();
            }
        }).catch(err => {
            console.log(err);
        })
    }

    // select change handler
    const shiftChange = (event) => {
        setWorker(null);
        setDevice(null);
        setDeviceSelect(null);
        setWorkSelect(null);
        let shift = event.target.value;
        setShift(shift);

        if (deviceRecommend != null) {
            let promises = [];
            let allDevice = Object.keys(deviceRecommend[shift.toString()]);
            allDevice.map(id => {
                promises.push(GetDeviceName(id, ""));
            })
            Promise.all(promises).then(response => {
                setDeviceSelect(response.map(item => {
                    return (<MenuItem key={item['id']} value={item['id']}>{`(${item["id"]}) ${item["name"]} 异常次数：${deviceRecommend[shift.toString()][item['id'].toString()]} `}</MenuItem>)
                }))
                console.log()
            })


        }
    }
    const deviceChange = (event) => {
        setWorker(null);
        setWorkSelect(null);
        setDevice(event.target.value);
        let data = {
            device_id: event.target.value.toString(),
            shift: shift === "day" ? false : true
        }

        console.log('apiGetWorkersByDevice : ')
        console.log(apiGetWorkersByDevice(data))


        apiGetWorkersByDevice(data).then(res => {
            // 看 apiGetWorkersByDevice 的資料型態
            setWorkSelect(res.data.map(worker => {
                return (<MenuItem key={worker['username']} value={worker['username']}>{worker['username']}</MenuItem>)
            }))
            console.log('apiGetWorkersByDevice : ')
            console.log(res.data)


        }).catch(err => {
            console.log(err);
        })
    }
    const workChange = (event) => {
        setWorker(event.target.value);
    }
    const addWhiteList = (event) => {

        let data = {
            device_id: device,
            username: worker
        }
        apiPostAddWorkersWhitelist(data).then(res => {
            if (res.status == 200) {
                alert(`新增 ${device}, ${worker}`);
            }
        }).catch(err => {
            alert('重复建立，请重新操作');
            console.log(err);
        })

    }


    return (
        <ThemeProvider theme={darkTheme}>
            <Card >
                <CardHeader title={CONTENT.title}
                    action={(<Button
                        color="primary"
                        size="large"
                        variant="text"
                        onClick={handleUpdate}
                        sx={{ mr: 3 }}
                    >
                        {CONTENT.update}
                    </Button>)} />

                <Divider sx={{ borderBottomWidth: 3 }} />
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        pt: 2
                    }}
                >
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        请选取要显示的车间
                    </Typography>
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        pt: 2
                    }}
                >
                    {
                        selectItem &&
                        <FormControl >
                            <InputLabel id="demo-simple-select-label">WorkShop</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="workshop-select"
                                value={workshop}
                                label="WorkShop"
                                onChange={handleChange}
                                sx={{ minWidth: "200px" }}
                            >
                                {
                                    selectItem
                                }
                            </Select>
                        </FormControl>
                    }
                </Box>
                <PerfectScrollbar>
                    <Box sx={{ minWidth: 800 }}>
                        <Table>
                            <TableHead sx={{ background: "#272d3a" }}>
                                <TableRow>
                                    <TableCell>
                                        {CONTENT.device_id}
                                    </TableCell>
                                    <TableCell>
                                        {CONTENT.device_cname}
                                    </TableCell>
                                    <TableCell >
                                        {CONTENT.id}
                                    </TableCell>
                                    <TableCell >
                                        {CONTENT.name}
                                    </TableCell>
                                    <TableCell >
                                        {CONTENT.remove}
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    deviceMap &&
                                    deviceMap.map(device => {
                                        return device.employee.map(worker => (
                                            (
                                                <TableRow
                                                    hover
                                                    key={device.id}
                                                >
                                                    <TableCell>
                                                        {device.id}
                                                    </TableCell>
                                                    <TableCell>
                                                        {device.name}
                                                    </TableCell>
                                                    <TableCell>
                                                        {worker.username}
                                                    </TableCell>
                                                    <TableCell>
                                                        {worker.full_name}
                                                    </TableCell>
                                                    <TableCell>
                                                        {
                                                            <Button key={device.id} color="error" onClick={() => handDelete(device.id, worker.username)}>移除白名單</Button>
                                                        }
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        ))
                                    })
                                }
                            </TableBody>
                        </Table>
                    </Box>
                </PerfectScrollbar>

            </Card>
            {
                deviceRecommend &&
                <Card sx={{ mt: 5 }}>
                    <CardHeader title={CONTENT.editTitle} />
                    <PerfectScrollbar>
                        <Box sx={{ minWidth: 800 }}>
                            <Table>
                                <TableHead sx={{ background: "#272d3a" }}>
                                    <TableRow>
                                        <TableCell>
                                            {CONTENT.shift}
                                        </TableCell>
                                        <TableCell>
                                            {CONTENT.device_cname}
                                        </TableCell>
                                        <TableCell >
                                            {CONTENT.recommand}
                                        </TableCell>
                                        <TableCell >
                                            {CONTENT.action}
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>
                                            {
                                                workshop &&
                                                <FormControl >
                                                    <InputLabel id="shift-select">{CONTENT.shift}</InputLabel>
                                                    <Select
                                                        labelId="shift-select"
                                                        id="shift-select-id"
                                                        value={shift}
                                                        label="WorkShop"
                                                        onChange={shiftChange}
                                                        sx={{ minWidth: "100px" }}
                                                    >
                                                        <MenuItem key={0} value={"day"}>日</MenuItem>
                                                        <MenuItem key={1} value={"night"}>夜</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            }
                                        </TableCell>
                                        <TableCell>
                                            {
                                                deviceSelect &&
                                                <FormControl >
                                                    <InputLabel id="device-select">{CONTENT.device_cname}</InputLabel>
                                                    <Select
                                                        labelId="device-select"
                                                        id="device-select-id"
                                                        value={device}
                                                        label="device"
                                                        onChange={deviceChange}
                                                        sx={{ minWidth: "200px" }}
                                                    >
                                                        {
                                                            deviceSelect
                                                        }
                                                    </Select>
                                                </FormControl>
                                            }
                                        </TableCell>
                                        <TableCell >
                                            {
                                                workSelect &&
                                                <FormControl >
                                                    <InputLabel id="work-select">{CONTENT.name}</InputLabel>
                                                    <Select
                                                        labelId="work-select"
                                                        id="work-select-id"
                                                        value={worker}
                                                        label="worker"
                                                        onChange={workChange}
                                                        sx={{ minWidth: "100px" }}
                                                    >
                                                        {
                                                            workSelect
                                                        }
                                                    </Select>
                                                </FormControl>
                                            }
                                        </TableCell>
                                        <TableCell >
                                            <Button onClick={addWhiteList} color="success">加入白名單</Button>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </Box>
                    </PerfectScrollbar>

                </Card>
            }

        </ThemeProvider>
    );
}
