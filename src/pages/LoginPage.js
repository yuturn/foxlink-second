import React, { useRef, useEffect } from "react";

import { Box, Button, Container, TextField, Typography, Grid, Card, CardHeader, Link } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Logo } from "../components/logo-login.js";

import { apiUserLogin, apiSystemSpace } from "../api.js";

import { useNavigate } from 'react-router-dom';

import { encrypt, verify } from "../tools/crypt";

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        background: {
            default: '#696969',
            paper: '#EDF2F7',
        },
        text: {
            primary: '#696969',
        },
        primary: {
            // Purple and green play nicely together.
            main: '#2196f3',
        },
        secondary: {
            main: '#696969',
        },
    },
});

export default function Login({ setUser, setAlert }) {
    const navigate = useNavigate();
    const _isMounted = useRef(true);
    useEffect(() => {
        return () => {
            _isMounted.current = false;
        }
    }, []);

    function handleOnClick() {
        try {
            let account = document.getElementById('account').value;
            let password = document.getElementById('password').value;
            const hashPassWord = encrypt(password, "$5$rounds=10000$F0XL1NKPWDHaSH");

            if (account == '' || password == '') throw "帐密不可為空";
            apiUserLogin(`grant_type=&username=${account}&password=${hashPassWord}&scope=&client_id=123&client_secret=`)
                .then(res => {
                    if (_isMounted.current) {
                        setUser({
                            'token': res.data['access_token'],
                            'token_type': res.data['token_type'],
                            'username': '',
                            'level': '',
                        })
                        apiSystemSpace(res.data['access_token'])
                            .then(res => {
                                setAlert({
                                    'open': true,
                                    'msg': `硬盘使用率 : ${(100 * Number(res.data)).toFixed(2)}%`,
                                    'type': 'warning',
                                    'duration': 10000
                                })
                                navigate('/all-status');
                            })
                    }
                })
                .catch(err => {
                    let errMsg = '';
                    if (err.response && err.response.status == 401) errMsg = '帐密错误';
                    else if (err.response && err.response.status == 422) errMsg = '验证错误，请重试';
                    else errMsg = '服务器拒绝连线，请联络相关人员';
                    setAlert({
                        'open': true,
                        'msg': errMsg,
                        'type': 'error'
                    })
                })

        } catch (e) {
            console.log(e);
            setAlert({
                'open': true,
                'msg': e,
                'type': 'error'
            })
        }
        document.getElementById('account').value = "";
        document.getElementById('password').value = "";
    }

    return (
        <ThemeProvider theme={darkTheme}>
            <Grid
                container
                spacing={0}
                direction="column"
                alignItems="center"
                justifyContent="center"
                sx={{ minHeight: '100vh', background: '#696969' }}
            >
                <Grid item xs={3}>
                    <Box
                        component="main"
                        sx={{
                            alignItems: 'center',
                            display: 'flex',
                            flexGrow: 1,
                            minHeight: '100%',
                            maxWidth: 'sm',
                            background: '#FFFFFF',
                            borderRadius: 4,
                            border: 'solid',
                            borderColor: '#FFFFFF'
                        }}
                    >
                        <Container maxWidth="sm">
                            <Grid
                                container
                                spacing={0}
                                direction="column"
                                alignItems="center"
                                justifyContent="center"
                                sx={{ pt: 5, background: "#FFFFFF" }}
                            >
                                <Grid item xs={3}>
                                    <Logo />
                                </Grid>
                            </Grid>
                            <Box sx={{
                                pt: 5,
                                my: 3
                            }}>
                                <Typography
                                    color="textPrimary"
                                    variant="h4"
                                    align="center"
                                >
                                    系统登入
                                </Typography>
                            </Box>
                            <Box
                                sx={{
                                    pb: 1,
                                    pt: 3
                                }}
                            >
                            </Box>
                            <TextField
                                fullWidth
                                label="帐户"
                                margin="normal"
                                name="account"
                                id="account"
                                variant="outlined"
                                color='secondary'
                                focused
                            />
                            <TextField
                                fullWidth
                                label="密码"
                                margin="normal"
                                name="password"
                                id="password"
                                type="password"
                                variant="outlined"
                                color='secondary'
                                focused
                            />
                            <Box sx={{ py: 2 }}>
                                <Button
                                    color="primary"
                                    fullWidth
                                    size="large"
                                    type="submit"
                                    variant="contained"
                                    onClick={handleOnClick}
                                >
                                    登入
                                </Button>
                            </Box>
                            {/* <Box sx={{ py: 2 }}>
                                如果沒有帳號請點選下方按鈕
                                <Link href='/login/signup' underline="hover">
                                    註冊帳號
                                </Link>
                            </Box>
                            <Box sx={{ py: 2 }}>
                                <Link href='/' underline="hover">
                                    測試登入
                                </Link>
                            </Box> */}
                        </Container>
                    </Box>
                </Grid>
            </Grid>
        </ThemeProvider>
    );
}