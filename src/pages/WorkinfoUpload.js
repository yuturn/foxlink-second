import React, { useState, useEffect } from "react";

import { styled } from '@mui/material/styles';
import {
    Box,
    Card,
    CardContent,
    CardHeader,
    Divider,
    Typography,
    createTheme,
    ThemeProvider,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    FormControl,
    InputLabel,
    Button
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';

import { WorkExperiences } from "../components/worker-experiences";
import { Parameter } from "../components/parameter";
import { AlertComponent } from "../components/alert-component";
import { WorkshopPicker } from "../components/workshop-picker.js";

import { Upload } from '../icons/upload';

import { apiGetFileName } from "../api.js";
import { apiWorkerinfos, apiWorkerAll } from "../api.js";

const CONTENT = {
    badge: "员工 ID",
    username: "姓名",
    workshop: "车间",
    level: "层级",
    shift: "班别",
    superior: "领导",
    experiences: "经验",
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

const infotable = (datas) => {
    console.log(datas)
    let keys = ["badge", "username", "workshop", "level", "shift", "superior", "experiences"]
    return (
        <div>
            <Table >
                <TableHead>
                    <TableRow>
                        <TableCell>
                            日班
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableHead sx={{ background: "#272d3a" }}>
                    <TableRow>
                        {
                            keys.map((key, index) => {
                                return <TableCell key={index}>{CONTENT[key]}</TableCell>
                            })
                        }
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        datas['day_shift'].map((data, i) => {
                            return (
                                <TableRow key={i + 1}>
                                    {
                                        keys.map((key, j) => {
                                            if (key == "shift") {
                                                return (
                                                    <TableCell key={key}>
                                                        {
                                                            "日"
                                                        }
                                                    </TableCell>
                                                )
                                            }
                                            else if (key == "experiences") {
                                                return (
                                                    <TableCell key={`${key}_btn`}>
                                                        {
                                                            <WorkExperiences list_data={data["experiences"]}>Experiences</WorkExperiences>
                                                        }
                                                    </TableCell>
                                                )
                                            }
                                            else {
                                                return (
                                                    <TableCell key={key}>
                                                        {
                                                            data[key]
                                                        }
                                                    </TableCell>
                                                )
                                            }

                                        })
                                    }
                                </TableRow>
                            )
                        })
                    }
                </TableBody>
            </Table>
            <Divider sx={{ borderBottomWidth: 3, m: 3 }} />
            <Table >
                <TableHead>
                    <TableRow>
                        <TableCell>
                            夜班
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableHead sx={{ background: "#272d3a" }}>
                    <TableRow >
                        {
                            keys.map((key, index) => {
                                return <TableCell key={index}>{CONTENT[key]}</TableCell>
                            })
                        }
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        datas['night_shift'].map((data, i) => {
                            return (
                                <TableRow key={i + 1}>
                                    {
                                        keys.map((key, j) => {
                                            if (key == "shift") {
                                                return (
                                                    <TableCell key={key}>
                                                        {
                                                            "夜"
                                                        }
                                                    </TableCell>
                                                )
                                            }
                                            else if (key == "experiences") {
                                                return (
                                                    <TableCell key={`${key}_btn`}>
                                                        {
                                                            <WorkExperiences list_data={data["experiences"]}>Experiences</WorkExperiences>
                                                        }
                                                    </TableCell>
                                                )
                                            }
                                            else {
                                                return (
                                                    <TableCell key={key}>
                                                        {
                                                            data[key]
                                                        }
                                                    </TableCell>
                                                )
                                            }

                                        })
                                    }
                                </TableRow>
                            )
                        })
                    }
                </TableBody>
            </Table>
        </div>
    )
}
// Style component
const Input = styled('input')({
    display: 'none',
});

export default function WorkerinfoUpload({ token, setAlert, ...rest }) {
    const [workerFile, setWorkFile] = useState();
    const [deviceFile, setDeviceFile] = useState();


    const [dataStatus, setDataStatus] = useState("");
    const [uploading, setUpload] = useState(false);
    const [loading, setLoading] = useState(false);

    const [data, setData] = useState();

    const [parameter, setParameter] = useState();

    const [workshop, setWorkshop] = useState("");

    useEffect(() => {
        //UpdateData();
        if (workshop != "") {
            UpdateData();
        }
    }, [workshop])
    String.prototype.replaceAt = function (index, char) {
        var a = this.split("");
        a[index] = char;
        return a.join("");
    }

    const UpdateData = () => {
        setDataStatus("Loading Data ...");
        let data = {
            'token': token,
            'workshop': workshop
        };

        apiWorkerAll(data).then(res => {
            setData(res.data);
            console.log(res.data);
        }).catch(err => {
            console.log(err);
            setAlert({
                'open': true,
                'msg': "資料载入異常",
                'type': 'error'
            });
        }).finally(() => {
            setDataStatus("");
        })
    }

    const parseParm = (str) => {
        let rawdata = str.split(/\n/);
        let processed_data = [];
        let keys = []
        // Data processing
        rawdata.map((line, i) => {
            if (i == 0) {
                keys = line.split(',');
                keys[0] = 'idx';
            } else {
                let flag = false;
                for (let i = 0; i < line.length; i++) {
                    if (line[i] == '(') {
                        flag = true;
                    }
                    if (flag == true) {
                        if (line[i] == ',') continue;
                        if (line[i] == ')') flag = false;
                    } else {
                        if (line[i] == ',') line = line.replaceAt(i, '@');
                    }
                }
                let temp = line.split('@');
                let obj = {}
                temp.map((item, j) => {
                    obj[keys[j]] = temp[j];
                })
                processed_data.push(obj);
            }

        })
        let csv_data = {
            'keys': keys,
            'datas': processed_data
        }
        setParameter(csv_data);
    }

    const workerFileChangeHandler = (event) => {
        if (event.target.files.length > 0) {
            setWorkFile(event.target.files[0]);
        }
    };
    const deviceFileChangeHandler = (event) => {
        if (event.target.files.length > 0) {
            setDeviceFile(event.target.files[0]);
        }
    };
    const postData = (data) => {
        apiWorkerinfos(data).then(res => {
            parseParm(res.data);
            setAlert({
                'open': true,
                'msg': "上传成功",
                'type': 'success'
            });
        }).catch(err => {
            console.log(err);
            setAlert({
                'open': true,
                'msg': "上传錯誤",
                'type': 'error'
            });
        }).finally(() => {
            setUpload(false);
            setWorkFile(null);
            setDeviceFile(null);
        });
    }
    const handleUpload = () => {
        if (workerFile == null) {
            setAlert({
                'open': true,
                'msg': "请完整选取档案",
                'type': 'error'
            });
        }
        else {
            setUpload(true);
            let fd = new FormData();
            fd.append("worker_file", workerFile);
            //fd.append("device_file", deviceFile)
            let data = {
                'token': token,
                'file': fd
            };
            postData(data);
        }
    }

    const [workerinfoName, setWorkerinfoName] = useState();

    useEffect(() => {
        handleOnClick();
    })

    const updateFileName = (data) => {
        apiGetFileName(data).then(res => {
            console.log(res.data)
            setWorkerinfoName(res.data.worker);
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
            token: token,
        }
        updateFileName(data);
    }

    return (
        <ThemeProvider theme={darkTheme}>
            <Card >
                <CardHeader title="员工专职表上传" />
                <Divider sx={{ borderBottomWidth: 3 }} />
                <CardContent>
                    {/* icon */}
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',

                        }}
                    >
                        <Upload fontSize="large" />
                    </Box>
                    {/* 員工專職 */}
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            pt: 2
                        }}
                    >
                        <label htmlFor="contained-button-work-file">
                            <Input type="file" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" id="contained-button-work-file" onChange={workerFileChangeHandler} />
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
                                    workerFile ? "已载入" : "选择员工专职表"
                                }
                            </LoadingButton>
                        </label>
                    </Box>
                    {/* 座標表 */}
                    {/* <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            pt: 2
                        }}
                    >
                        <label htmlFor="contained-button-device-file">
                            <Input type="file" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" id="contained-button-device-file" onChange={deviceFileChangeHandler} />
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
                                    deviceFile ? "已载入" : "选择座标表档案"
                                }
                            </LoadingButton>
                        </label>
                    </Box> */}
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
                                mt: 4
                            }}
                            loading={uploading}
                            onClick={handleUpload}
                        >
                            上传资料
                        </LoadingButton>
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
                            档案名称:{workerinfoName}
                        </Typography>
                    </Box>
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
                        <FormControl >
                            <InputLabel id="demo-simple-select-label">WorkShop</InputLabel>
                            <WorkshopPicker token={token} workshop={workshop} setWorkshop={setWorkshop} />
                        </FormControl>
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
                                <Parameter csv_data={parameter} />
                            </Box>
                        )
                    }
                    <Box>
                        {
                            data && infotable(data)
                        }
                    </Box>
                </CardContent>
            </Card>
        </ThemeProvider>
    )
}