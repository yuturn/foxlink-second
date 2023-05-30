import React, { useState, useEffect } from "react";

import { styled } from '@mui/material/styles';
import {
    Alert,
    Box,
    Card,
    CardContent,
    CardHeader,
    Divider,
    TextField,
    Typography,
    createTheme,
    ThemeProvider,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';

import ExcelTableView from "../components/excel-table-view";
import { Parameter } from "../components/parameter";
import { AlertComponent } from "../components/alert-component";

import { Upload } from '../icons/upload';
import { apiGetFileName } from "../api.js";
import { apiDevices, apiWorkShopList, apiDevicesData, apiGetSystemEnvSetting, apiPostSystemEnvSetting, apiGetSystemEnvSettingCount, apiPostSystemEnvSettingCount } from "../api.js";

const CONTENT = {
    id: "装置 ID",
    project: "专案",
    process: "制程段",
    line: "产线",
    device_name: "装置代号",
    device_cname: "装置名称",
    workshop: "车间",
    x_axis: "X 轴座标",
    y_axis: "Y 轴座标",
    is_rescue: "是否为救援站",
    sop_link: "SOP 链接"
}

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#5048E5',
            light: '#828DF8',
            dark: '#7582EB',
            contrastText: '#FFFFFF'
        },
        background: {
            default: '#1a1e2b',
            paper: '#1a1e2b',
        },
        text: {
            primary: '#fff',
        }
    },
});

const Input = styled('input')({
    display: 'none',
});

export default function DevicesUpload({ token, ...rest }) {
    const [dataStatus, setDataStatus] = useState("No File Chosen");
    const [uploading, setUpload] = useState(false);
    const [loading, setLoading] = useState(false);
    // init workshop
    const [selectItem, setSelectItem] = useState("");
    const [workshop, setWorkshop] = useState("");
    const [keys, setKeys] = useState();
    const [id2words, setId2Word] = useState();
    const [datas, setDatas] = useState();

    const [parameter, setParameter] = useState();

    const [alert, setAlert] = useState(false);
    const [errmsg, setErrMsg] = useState();

    const [rescueStatus, setRescueStatus] = useState("");
    const [rescueCount, setRescueCount] = useState("");
    const [rescueTime, setRescueTime] = useState("");

    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    useEffect(() => {
        updateData();
    }, [])

    useEffect(() => {
        if (errmsg) {
            setAlert(true);
        }
    }, [errmsg])

    const updateData = () => {
        setUpload(false);
        setWorkshop(null);
        setKeys(null);
        setDatas(null);
        // 先抓當前救援站數量
        apiGetSystemEnvSettingCount({ "key": "rescue_count", token: token }).then(res => {
            setRescueCount(() => {
                return (res.data.value)
            })
        });
        // 抓救援站設定
        apiGetSystemEnvSetting({ "key": "auto_rescue", token: token }).then(res => {
            if (res.data.value == "1") {
                setRescueStatus(() => {
                    return ('自动')
                })
            } else {
                setRescueStatus(() => {
                    return ('手动')
                })
            }
        });
        apiWorkShopList(token).then(res => {
            setSelectItem(res.data.map(name => {
                return (<MenuItem key={name} value={name}>{name}</MenuItem>)
            }))
        }).catch(err => {
        });
    }

    // useEffect(() => {
    //     handleOnClickGetEnv();
    //     handleOnClickGetCount();
    // }, [])

    // const handleOnClickGetEnv= () => {
    //     const data = {
    //         "key": "auto_rescue",
    //         "token": token
    //     }
    //     apiGetSystemEnvSetting(data).then(res => {
    //         if (res.data.value == "1") {
    //             setRescueStatus(() => {
    //                 return ('自动')
    //             })
    //         } else {
    //             setRescueStatus(() => {
    //                 return ('手动')
    //             })
    //         }
    //     });
    // }
    // const handleOnClickGetCount = () => {
    //     const data = {
    //         "key": "rescue_count",
    //         "token": token
    //     }
    //     apiGetSystemEnvSettingCount(data).then(res => {
    //         setRescueCount(() => {
    //             return (res.data.value)
    //         })
    //     });
    // }

    const fetchData = (name) => {
        let data = {
            name: name,
            token: token
        }
        apiDevicesData(data).then(res => {

            let keys = Object.keys(res.data[0]);
            let newKeys = []
            keys.map(key => {
                newKeys.push(CONTENT[key]);
            })
            setKeys(keys);
            setId2Word(newKeys);
            setDatas(res.data);
        }).catch(err => {
            setErrMsg(err.response.statusText);
        }).finally(() => {
            setUpload(false);
        })
    }
    const handleWorkshopChange = (event) => {
        setWorkshop(event.target.value);
        fetchData(event.target.value);
    }

    const handleFileChange = (e) => {
        if (e.target.files.length > 0) {

            setDataStatus(e.target.files[0].name);

            setUpload(true);

            const file = e.target.files[0];
            let formData = new FormData();
            formData.append("file", file);
            formData.append("clear_all", true);

            let data = {};
            data['token'] = token;
            data['file'] = formData;

            apiDevices(data).then(res => {
                if (res.status === 201) {
                    setUpload(false);
                    updateData();
                    let rawdata = res.data['parameter'].split(/\n/);
                    let processed_data = [];
                    let keys = []
                    rawdata.map((line, i) => {
                        if (i == 0) {
                            keys = line.split(',');
                            keys[0] = 'idx';
                        } else {
                            let temp = line.split(',');
                            let obj = {};
                            temp.map((item, j) => {
                                obj[keys[j]] = temp[j];
                            })
                            processed_data.push(obj);
                        }
                    });
                    let csv_data = {
                        'keys': keys,
                        'datas': processed_data
                    }

                    setParameter(csv_data);
                }
                handleOpen()
            }).catch(err => {
                console.log(err);
                setErrMsg("档案格式有误, 请重新上传！");
                updateData();
            })
        } else {
            setDataStatus("No File Chosen");
        }
    }

    const [deviceName, setDeviceName] = useState();

    useEffect(() => {
        handleOnClick();
    })

    const updateFileName = (data) => {
        apiGetFileName(data).then(res => {
            // console.log(res.data)
            setDeviceName(res.data.devices);
            // setAlert({
            //     'open': true,
            //     'msg': "更新成功",
            //     'type': 'success'
            // });
        })
        // .catch(err => {
        //     console.log(err)
        //     setAlert({
        //         'open': true,
        //         'msg': "错误代码：" + err.response,
        //         'type': 'error'
        //     });
        //     console.log(err);
        // }).finally(() => {
        //     setLoading(false);
        // });
    }
    const handleOnClick = () => {
        const data = {
            "token": token,
        }
        updateFileName(data);
    }

    // useEffect(() => {
    //     valueChange();
    // })

    // const valueChange = () => {
    //     const data = {
    //         token: token,
    //         key: "auto_rescue",
    //     }
    //     apiGetSystemEnvSetting(data).then(res => {
    //         setRescueValue(res.data.value)
    //         console.log('接到的Settings value')
    //         console.log(rescueValue)
    //         if (res.data.value == "0") {
    //             setRescueStatus("手動")
    //         }
    //         else if (res.data.value == "1") {
    //             setRescueStatus("自動")
    //         }
    //     })
    // }

    // useEffect(() => {
    //     // Just run the first time
    //     const data = {
    //         "token": token,
    //         "key": "auto_rescue"
    //     }
    //     apiGetSystemEnvSetting(data, res => {
    //         console.log(res.data)
    //         if (res.data.value == "1") {
    //             setRescueStatus('自动')
    //         } else {
    //             setRescueStatus('手动')
    //         }
    //     })
    // })

    // 設定救援站設定
    const handleOnClickSetting = () => {
        let temp = ""
        if (rescueStatus == "自动") {
            temp = "0"
        } else {
            temp = "1"
        }
        const data = {
            "token": token,
            "key": 'auto_rescue',
            "value": temp
        }
        apiPostSystemEnvSetting(data).then(res => {
            if (res.data.value == "1") {
                setRescueStatus(() => {
                    return ('自动')
                })
                handleOpen()
            } else {
                setRescueStatus(() => {
                    return ('手动')
                })
                handleOpen()
            }
        }).catch(err => {
            console.log(err);
            setErrMsg("更新失败！");
        })
        // apiGetSystemEnvSetting(data).then(res => {
        //     if (res.data.value == '0') {
        //         data.value = '1'
        //         apiPostSystemEnvSetting(data)
        //         console.log('我要 Post 內容')
        //         console.log(data.value)
        //         console.log(data.token)
        //         setRescueStatus('自动')
        //     }
        //     else if (res.data.value == '1') {
        //         data.value = '0'
        //         apiPostSystemEnvSetting(data)
        //         console.log('我要 Post 內容')
        //         console.log(data.value)
        //         setRescueStatus('手动')
        //     }
        // })
    }

    // 設定救援站數量
    const handleOnClickSettingQuantity = () => {
        const data = {
            "token": token,
            "key": 'rescue_count',
            "value": rescueCount
        }
        data.value = document.getElementById('quantity').value;
        apiPostSystemEnvSettingCount(data).catch(err => {
            console.log(err);
            setErrMsg("更新失败！");
        })
        handleOpen()
        setRescueCount(document.getElementById('quantity').value)
    }

    // 設定救援站區間
    // const handleOnClickSettingTime = () => {
    //     const data = {
    //         "token": token,
    //         "key": 'rescue_count',
    //         "value": rescueCount,
    //         "start": 0,
    //         "end": 0
    //     }
    //     data.start = document.getElementById('start').value;
    //     data.end = document.getElementById('end').value;
    //     apiPostSystemEnvSettingCount(data).catch(err => {
    //         console.log(err);
    //         setErrMsg("更新失败！");
    //     })
    //     handleOpen()
    //     setRescueTime(document.getElementById('start').value + document.getElementById('end').value)
    // }

    return (
        <ThemeProvider theme={darkTheme}>
            <AlertComponent open={alert} setOpen={setAlert} message={errmsg} severity={"error"} />
            <AlertComponent open={open} setOpen={setOpen} message="更新成功" severity={"success"} />
            <Card >
                <CardHeader title="车间 Layout 座标表上传" />
                <Divider sx={{ borderBottomWidth: 3 }} />
                <CardContent>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',

                        }}
                    >
                        <Upload fontSize="large" />
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            pt: 2
                        }}
                    >
                        <label htmlFor="contained-button-file">
                            <Input type="file" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" id="contained-button-file" onChange={handleFileChange} />
                            <LoadingButton
                                color="success"
                                variant="contained"
                                size="large"
                                component="span"
                                startIcon={<CloudUploadOutlinedIcon sx={{ mr: 1 }} />}
                                sx={{
                                    borderRadius: 4,
                                    minWidth: 200,
                                    justifyContent: 'center',
                                    letterSpacing: 3,
                                }}
                                type="input"
                                loading={uploading}
                            >
                                {
                                    uploading ? "上传中..." : "选择档案"
                                }
                            </LoadingButton>
                        </label>
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            pt: 2
                        }}
                    >
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                            {dataStatus}
                        </Typography>
                    </Box>
                    {
                        parameter && (
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    pt: 2
                                }}
                            >
                                <Divider sx={{ borderBottomWidth: 3 }} />
                                <Parameter csv_data={parameter} />
                            </Box>
                        )
                    }
                    <Divider sx={{ borderBottomWidth: 3, m: 3 }} />
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            pt: 2
                        }}
                    >
                        <Typography
                            color="textSecondary"
                            gutterBottom
                            variant="overline"
                            fontSize="large"
                        >
                            目前救援站狀態:{rescueStatus}
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            pt: 2
                        }}
                    >
                        <LoadingButton
                            variant="contained"
                            size="large"
                            component="span"
                            sx={{
                                borderRadius: 4,
                                justifyContent: 'center',
                                letterSpacing: 3,
                                mt: 2
                            }}
                            loading={loading}
                            onClick={handleOnClickSetting}
                        >
                            救援站开关
                        </LoadingButton>
                    </Box>
                    <Divider sx={{ borderBottomWidth: 3, m: 3 }} />
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            pt: 2
                        }}
                    >
                        <Typography
                            color="textSecondary"
                            gutterBottom
                            variant="overline"
                            fontSize="large"
                        >
                            目前救援站数量:{rescueCount}
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            pt: 2
                        }}
                    >
                        <TextField
                            label="请输入救援站数量"
                            margin="normal"
                            name="quantity"
                            id="quantity"
                            variant="outlined"
                        />
                        <LoadingButton
                            variant="contained"
                            size="medium"
                            component="span"
                            sx={{
                                borderRadius: 4,
                                justifyContent: 'center',
                                letterSpacing: 3,
                                mt: 2,
                                ml: 2
                            }}
                            loading={loading}
                            onClick={handleOnClickSettingQuantity}
                        >
                            更新数量
                        </LoadingButton>
                    </Box>
                    {/* <Divider sx={{ borderBottomWidth: 3, m: 3 }} />
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            pt: 2
                        }}
                    >
                        <Typography
                            color="textSecondary"
                            gutterBottom
                            variant="overline"
                            fontSize="large"
                        >
                            目前救援站區間:{rescueTime}
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            pt: 2
                        }}
                    >
                        <TextField
                            label="请输入救援站區間"
                            margin="normal"
                            name="start"
                            id="start"
                            variant="outlined"
                        />
                        <TextField
                            label="请输入救援站區間"
                            margin="normal"
                            name="end"
                            id="end"
                            variant="outlined"
                        />
                        <LoadingButton
                            variant="contained"
                            size="medium"
                            component="span"
                            sx={{
                                borderRadius: 4,
                                justifyContent: 'center',
                                letterSpacing: 3,
                                mt: 2,
                                ml: 2
                            }}
                            loading={loading}
                            onClick={handleOnClickSettingTime}
                        >
                            更新區間
                        </LoadingButton>
                    </Box> */}
                    <Divider sx={{ borderBottomWidth: 3, m: 3 }} />
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            pt: 2
                        }}
                    >
                        <LoadingButton
                            variant="contained"
                            size="large"
                            component="span"
                            sx={{
                                borderRadius: 4,
                                justifyContent: 'center',
                                letterSpacing: 3,
                                mt: 2
                            }}
                            loading={loading}
                            onClick={handleOnClick}
                        >
                            更新资料
                        </LoadingButton>
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            pt: 2
                        }}
                    >
                        <Typography
                            color="textSecondary"
                            gutterBottom
                            variant="overline"
                            fontSize="large"
                        >
                            档案名称:{deviceName}
                        </Typography>
                    </Box>
                    {
                        selectItem &&
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                m: 2
                            }}
                        >
                            <Typography sx={{ m: 1 }}>
                                现有资料 :
                            </Typography>
                            <FormControl sx={{ width: 300 }}>
                                <InputLabel id="workshop-label">Workshop</InputLabel>
                                <Select
                                    labelId="workshop-label"
                                    id="workshop-select"
                                    value={workshop == null ? '' : workshop}
                                    onChange={handleWorkshopChange}
                                >
                                    {
                                        selectItem
                                    }
                                </Select>
                            </FormControl>
                        </Box>
                    }
                    <Box>
                        {
                            keys && datas && id2words &&
                            <ExcelTableView keys={keys} datas={datas} id2words={id2words} />
                        }
                    </Box>
                </CardContent>
            </Card>
        </ThemeProvider>
    );
}