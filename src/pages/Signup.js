import React from 'react';
import { useState } from 'react';

// @mui material components
import { Box, TextField, Typography, Grid, Card, Link, Container } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import LoadingButton from '@mui/lab/LoadingButton';
import { AlertComponent } from "../components/alert-component";
import { apiPostPeddingList } from "../api"
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

  const [alert, setAlert] = useState(false);
  const [successMsg, setSuccessMsg] = useState();
  function handleOnClick() {
    try {
      const name = document.getElementById("name").value;
      const acc = document.getElementById("badge").value;
      const passwd = document.getElementById("password").value;
      const temp_data = {
        "badge": name,
        "username": acc,
        "password": passwd
      };
      console.log(temp_data)
      apiPostPeddingList(temp_data)
        .then(res => {
          console.log(res.data)
          setSuccessMsg(res.data.badge)
        })
      console.log(temp_data)
    } catch (e) {
      console.log(e);
    };
    document.getElementById("name").value = "";
    document.getElementById("badge").value = "";
    document.getElementById("password").value = "";
    setAlert(true)
    setTimeout(handleClose, 3000)
  }
  const handleClose = () => {
    setAlert(false);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <AlertComponent open={alert} setOpen={setAlert} message={`${successMsg}已申請`} severity={"success"} />
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        sx={{ minHeight: '100vh' }}
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
              background: '#62aaf4',
              borderRadius: 4,
              border: 'solid',
              borderColor: '#2D3748'
            }}
          >
            <Container maxWidth="sm">
              <Box sx={{
                pt: 5,
                my: 3
              }}>
                <Typography variant="h4" fontWeight="medium" color="textPrimary" mt={1}>
                  帳號申請
                </Typography>
                <Typography display="block" variant="button" color="textPrimary" my={1}>
                  請輸入姓名、員工ID(帳號)、密碼
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
                label="姓名"
                margin="normal"
                name="name"
                id="name"
                variant="outlined"
              />
              <TextField
                fullWidth
                label="員工ID"
                margin="normal"
                name="badge"
                id="badge"
                variant="outlined"
              />
              <TextField
                fullWidth
                label="密码"
                margin="normal"
                name="password"
                id="password"
                type="password"
                variant="outlined"
              />
              <Box sx={{ py: 2 }}>
                <LoadingButton variant="contained" color="info" onClick={handleOnClick} fullWidth>
                  提出申請
                </LoadingButton>
              </Box>
              <Box mt={3} mb={1} textAlign="center">
                如果有你帳號了按右方連結回到
                <Link href='/login' underline="hover">
                  登入頁面
                </Link>
              </Box>
            </Container>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider >
  );
}
