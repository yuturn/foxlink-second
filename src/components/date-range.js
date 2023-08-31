import React, { useState } from "react";

import { Avatar, Box, Card, CardContent, Grid, LinearProgress, Typography, TextField, Stack, Switch, SwitchProps } from '@mui/material';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { FormControl, Select, MenuItem, InputLabel } from '@mui/material';

export const DateRange = ({ sDate, eDate, setSDate, setEDate, setShift }) => {

  const [shift_, setShift_] = useState("");

  const handleChange = (event) => {
    setShift(event.target.value);
    setShift_(event.target.value);
  };

  return (
    <Card
      sx={{ height: '100%' }}
    >
      <CardContent>
        <Grid
          container
          spacing={3}
          sx={{ justifyContent: 'space-between' }}
        >
          <Grid item>
            <Typography
              color="textSecondary"
              gutterBottom
              variant="overline"
              fontSize="large"
              sx={{ pt: 4, pr: 1 }}
            >
              日期
            </Typography>
          </Grid>
          <Box sx={{ pr: 1, pt: 4 }}>
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
              {/* <DateTimePicker
                label="开始日期"
                value={sDate}
                onChange={(newValue) => {
                  setSDate(newValue);
                }}
                renderInput={(params) => <TextField {...params} />}
              /> */}
            </LocalizationProvider>
          </Box>
          <Box sx={{ pt: 4 }}>
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
            {/* <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                label="结束日期"
                value={eDate}
                onChange={(newValue) => {
                  setEDate(newValue);
                  //console.log(newValue);
                }}
                renderInput={(params) => <TextField {...params} />}
              /> */}
          </Box>
          <Stack direction="row" spacing={1} alignItems="center">
            {/* <Typography>夜</Typography>
              <Switch checked={shift} onChange={handleChange} inputProps={{ 'aria-label': 'controlled' }} />
              <Typography>日</Typography> */}
            <FormControl sx={{ mt: 4, mb: 0, mr: 3, ml: 3 }}>
              <InputLabel id="demo-simple-select-label" >班別</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={shift_}
                label="WorkShop"
                onChange={handleChange}
                sx={{ minWidth: "130px" }}
              >
                <MenuItem key="no-shift" value="無">不分班別</MenuItem>
                <MenuItem key="shift-true" value="夜">夜</MenuItem>
                <MenuItem key="shift-false" value="日">日</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Grid>
      </CardContent>
    </Card >
  );
} 
