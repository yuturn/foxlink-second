import React, { useState, useEffect, useReducer } from "react";
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
} from '@mui/material';

import LoadingButton from '@mui/lab/LoadingButton';

import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import { Upload } from '../icons/upload';

import { apiMapPost } from "../api.js";
import { apiGetFileName } from "../api.js";

import { AlertComponent } from "../components/alert-component";


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

export default function MapUpload({ token, ...rest }) {
    const [dataStatus, setDataStatus] = useState(" No File Chosen");
    const [uploading, setUpload] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errmsg, setErrMsg] = useState();
    const [alert, setAlert] = useState(false);

    useEffect(() => {
        if (errmsg) {
            setAlert(true);
        }
    }, [errmsg])

    const handleFileChange = (e) => {
        if (e.target.files.length > 0) {
            let filename = e.target.files[0].name;
            let regex = filename.match(/Layout_(.+)_([0-9]+)/);

            if (regex && regex.length == 3) {
                let filename = regex[1];
                setDataStatus(filename);

                setUpload(true);

                const file = e.target.files[0];
                let formData = new FormData();
                formData.append("image", file);

                let data = {};
                data['token'] = token;
                data['file'] = formData;
                data['name'] = filename;

                apiMapPost(data).then(res => {
                    setDataStatus("上传完毕");
                }).catch(err => {
                    // 後端沒有擋擋名錯誤
                    setErrMsg(err.response.statusText);
                }).finally(() => {
                    setUpload(false);
                })

            } else {
                setErrMsg("档名有误, 请重新上传！");
                document.getElementById('contained-button-file').value = null;
                console.log(document.getElementById('contained-button-file').value);
            }
        } else {
            setDataStatus("No File Chosen");
        }
    }

    const [mapName, setMapName] = useState();

    useEffect(() => {
        handleOnClick();
    })

    const updateFileName = (data) => {
        apiGetFileName(data).then(res => {
            console.log(res.data)
            setMapName(res.data.images);
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
            <AlertComponent open={alert} setOpen={setAlert} message={errmsg} severity={"error"} />
            <Card >
                <CardHeader title="车间 Layout 图上传" />
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
                            <Input type="file" accept="image/png" id="contained-button-file" onChange={handleFileChange} value='' />
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
                            档案名称:{mapName}
                        </Typography>
                    </Box>
                </CardContent>
            </Card>
        </ThemeProvider>
    )
}