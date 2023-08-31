import React, { useState, useEffect, useRef } from "react";

import {
  Box,
  Card,
  Skeleton,
  Grid,
  Button,
  Typography,
  FormControl,
  InputLabel
} from '@mui/material';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Emergency } from "../components/emergency.js";
import { MissionNeedRepair } from "../components/mission-need-repair.js";
import { WorkshopPicker } from "../components/workshop-picker.js";

import { apiMissionEmergency, apiMissionNeedRepair } from "../api.js";


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

export default function ENRMission({ token, ...rest }) {
  const _isMounted = useRef(true);
  const [emergencyMission, setEmergencyMission] = useState();
  const [needRepairMissions, setNeedRepairMissions] = useState();
  const [workshop, setWorkshop] = useState("");
  
  useEffect(() => {
    //updatedata();
  }, [])

  const updatedata = (data) => {
    setEmergencyMission(null);
    setNeedRepairMissions(null);
    apiMissionNeedRepair(data).then(res => {
      setNeedRepairMissions(res.data);
    }).catch(err => {
      console.log(err);
    })
    apiMissionEmergency(data).then(res => {
      setEmergencyMission(res.data);
    }).catch(err => {
      if(workshop === ""){
        alert("请选取车间");
      }
      console.log(err);
    })
  }
  const handleOnClick = () => {
    let now = new Date(Date.now());
    const data = {
      token: token,
      workshop: workshop,
      start: now.toISOString(),
      end: now.toISOString(),
    }
    updatedata(data);
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <Grid
        container
        spacing={3}
        sx={{pb:5}}
        >
        <Grid item xs={4} justifyContent={"center"}>
          <Card >
            <Box>
              <FormControl sx={{mt:3, mb:3, mr:3, ml: 3}}>
                  <InputLabel id="demo-simple-select-label" >WorkShop</InputLabel>
                  <WorkshopPicker token={token} workshop={workshop} setWorkshop={setWorkshop} />
              </FormControl>
              <Button sx={{mt:3, mb:3}} size="large"  variant="contained" onClick={handleOnClick}>更新资料</Button>
            </Box>
          </Card>
        </Grid>
      </Grid>
      {
        emergencyMission && 
        <Grid
        container
        spacing={3}
        >
        <Grid
          item
          lg={4}
        >
          <Emergency list_data={emergencyMission} />
        </Grid>
        <Grid
        item
        lg={4}
        >
          {
            needRepairMissions ?  
            (
              <MissionNeedRepair list_data={needRepairMissions} />
            ) : 
            (
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  p: 8,
                }}
              >
                <Skeleton
                  sx={{ bgcolor: 'grey.900' }}
                  variant="rectangular"
                  width={1000}
                  height={80}
                >
                  <Typography>.</Typography>
                </Skeleton>
              </Box>
            )
          }
        </Grid>
        </Grid>
      }
    </ThemeProvider>

  );
}