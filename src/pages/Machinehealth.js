import React, { useState, useRef } from "react";

import {
  Box,
  Card,
  Grid,
  FormControl,
  InputLabel
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { DateRange } from "../components/date-range.js";
import { Rate } from "../components/rate.js";
import { CrashedDevices } from "../components/crashed-devices.js";
import { AcceptMissionEmployees } from "../components/accept-mission-employees.js";
import { RejectMissionEmployees } from "../components/reject-mission-employees.js";
import { AbnormalMissions } from "../components/abnormal-missions.js";
import { AbnormalDevices } from "../components/abnormal-devices.js";
import { WorkshopPicker } from "../components/workshop-picker.js";
import { apiStatisticsWithDate, apiStatisticsWithShift } from "../api.js";

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
    primary: {
      // Purple and green play nicely together.
      main: '#5048E5',
    },
  },
});

export default function Machinehealth({ token, setAlert, ...rest }) {
  const _isMounted = useRef(true);
  const [statusData, setData] = useState();
  const [workshop, setWorkshop] = useState("");
  const [loading, setLoading] = useState(false);

  const [sDate, setSDate] = useState(new Date());
  const [eDate, setEDate] = useState(new Date());
  const [shift, setShift] = useState();

  const updatedata = (data) => {
    setData(null);
    console.log(data);
    setLoading(true);
    if (data.shift !== null) {
      // 更改時間，讓時間只剩下日期(正崴需求! (2023/01/10 17:46))
      // data['start'] = data['start'].substring(0, 10)
      // data['end'] = data['end'].substring(0, 10)

      apiStatisticsWithShift(data).then(res => {
        setData(res.data);
        setAlert({
          'open': true,
          'msg': "更新成功",
          'type': 'success'
        });
      }).catch(err => {
        setAlert({
          'open': true,
          'msg': "错误代码：" + err.response.status,
          'type': 'error'
        });
        console.log(err);
      }).finally(() => {
        setLoading(false);
      });
    }
    else {
      apiStatisticsWithDate(data).then(res => {
        console.log('APICALL資料(不分班別)')
        console.log(res.data)
        setData(res.data);
        setAlert({
          'open': true,
          'msg': "更新成功",
          'type': 'success'
        });
      }).catch(err => {
        setAlert({
          'open': true,
          'msg': "请选取车间",
          'type': 'error'
        });
        console.log(err);
      }).finally(() => {
        setLoading(false);
      });
    }
  }
  const handleOnClick = () => {
    if (workshop === "") {
      setAlert({
        'open': true,
        'msg': "请选取车间",
        'type': 'error'
      });
      return;
    }
    let _shift;
    if (shift == "夜") {
      _shift = true;
    } else if (shift == "日") {
      _shift = false;
    } else {
      _shift = null;
    }
    const data = {
      token: token,
      start: new Date(sDate).toISOString(),
      end: new Date(eDate).toISOString(),
      workshop: workshop,
      shift: _shift
    }
    updatedata(data);
  }

  return (
    <ThemeProvider theme={darkTheme}>
      {/* <Grid
        container
        spacing={3}
        sx={{ pb: 5 }}
      >
        <Grid item xs={8}>
          <DateRange sDate={sDate} eDate={eDate} setSDate={setSDate} setEDate={setEDate} setShift={setShift} />
        </Grid>
        <Grid item xs={4} justifyContent={"center"}>
          <Card >
            <Box>
              <FormControl sx={{ mt: 3, mb: 3, mr: 3, ml: 3 }}>
                <InputLabel id="demo-simple-select-label" >WorkShop</InputLabel>
                <WorkshopPicker token={token} workshop={workshop} setWorkshop={setWorkshop} />
              </FormControl>
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
                loading={loading}
                onClick={handleOnClick}
              >
                更新资料
              </LoadingButton>
            </Box>
          </Card>
        </Grid>
      </Grid>
      {
        statusData &&
        <Grid
          container
          spacing={3}
        >
          <Grid
            item
            lg={4}
          >
            {
              statusData
              && <Rate list_data={statusData.login_users_percentage_this_week} />
              // statusData
              // && (statusData['login_users_percentage_this_week'] == 0 ? <Rate rate={0} /> :
              //   <Rate list_data={statusData['login_users_percentage_this_week'][0] * 100} />
              // )
              // && <Rate list_data={statusData.login_users_percentage_this_week[1].login_users} />
            }
          </Grid>
          <Grid
            item
            lg={4}
          >
            {
              statusData.devices_stats &&
              <CrashedDevices list_data={statusData.devices_stats.most_frequent_crashed_devices} />
            }
          </Grid>
          <Grid
            item
            lg={4}
          >
            {
              statusData.top_most_accept_mission_employees &&
              <AcceptMissionEmployees list_data={statusData.top_most_accept_mission_employees} />
            }

          </Grid>
          <Grid
            item
            lg={4}
          >
            {
              statusData.top_most_reject_mission_employees &&
              <RejectMissionEmployees list_data={statusData.top_most_reject_mission_employees} />
            }

          </Grid>
          <Grid
            item
            lg={4}
          >
            {
              statusData.devices_stats &&
              <AbnormalMissions list_data={statusData.devices_stats.top_abnormal_missions_this_month} />
            }

          </Grid>
          <Grid
            item
            lg={4}
          >
            {
              statusData.devices_stats &&
              <AbnormalDevices list_data={statusData.devices_stats.top_abnormal_devices} />
            }
          </Grid>
        </Grid>
      } */}
    </ThemeProvider>
  );
}