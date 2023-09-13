import React from 'react';

// @mui material components
import { Box, Button, Container, TextField, Typography, Grid, Card, CardHeader, Link } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import LoadingButton from '@mui/lab/LoadingButton';
// import Checkbox from "@mui/material/Checkbox";


const darkTheme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#1976d2',
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

export default function SignUp() {
  function handleOnClick() {
    try {
      const name = document.getElementById("name").value;
      const acc = document.getElementById("account").value;
      const passwd = document.getElementById("password").value;
      // if (name === "" || acc === "" || passwd === "") { throw "帐密不可為空" };
      const temp_data = {
        "badge": name,
        "username": acc,
        "password": passwd
      };
      const data = JSON.stringify(temp_data)
      fetch('http://192.168.0.115/users/pending-approval-user', {
        method: 'POST',
        body: data,
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
        }
      })
      console.log(data)
      // apiPendingApprovalUser(data);
    } catch (e) {
      console.log(e);
      // setAlert({
      //   open: true,
      //   msg: e,
      //   type: "error",
    };
    document.getElementById("name").value = "";
    document.getElementById("account").value = "";
    document.getElementById("password").value = "";
  }
  return (
    <ThemeProvider theme={darkTheme}>
      <Card>
        <Box
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="success"
          mx={2}
          mt={-3}
          p={3}
          mb={1}
          textAlign="center"
        >
          <Typography variant="h4" fontWeight="medium" color="white" mt={1}>
            帳號申請
          </Typography>
          <Typography display="block" variant="button" color="white" my={1}>
            請輸入姓名、員工ID(帳號)、密碼
          </Typography>
        </Box>
        <Box pt={4} pb={3} px={3}>
          <Box component="form" role="form">
            <Box mb={2}>
              <TextField type="text" label="姓名" variant="standard" id="name" fullWidth />
            </Box>
            <Box mb={2}>
              <TextField type="account" label="員工ID" variant="standard" id="account" fullWidth />
            </Box>
            <Box mb={2}>
              <TextField type="password" label="密碼" variant="standard" id="password" fullWidth />
            </Box>
            <Box mt={4} mb={1}>
              <LoadingButton variant="gradient" color="info" onClick={handleOnClick} fullWidth>
                提出申請
              </LoadingButton>
            </Box>
            <Box mt={3} mb={1} textAlign="center">
              如果有你帳號了按右方連結回到
              <Link href='/login' underline="hover">
                登入頁面
              </Link>
            </Box>
          </Box>
        </Box>
      </Card>
    </ThemeProvider>
  );
}
