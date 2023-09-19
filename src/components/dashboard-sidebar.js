// 這個頁面是左邊SIDEBAR制控制頁面

import React from "react";

import { Box, Divider, Drawer } from '@mui/material';
import { ChartBar as StatusIcon } from '../icons/chart-bar';
import { Layout as LayoutIcon } from '../icons/layout';
import { QRCode as QRCodeIcon } from '../icons/qrcode';
import { Info as InfoIcon } from '../icons/info';

import SummarizeIcon from '@mui/icons-material/Summarize';
import MapIcon from '@mui/icons-material/Map';
import { Logo } from './logo';
import { DashboardNavbar } from './dashboard-navbar';
import { NavItem } from './nav-item';
import { Link } from "react-router-dom";

export const DashboardSidebar = ({ idx, setIdx }) => {
  const items = [
    {
      url: '/statistics',
      icon: (<StatusIcon fontSize="small" />),
      title: '機臺健康狀況',
      active: false
    },
    {
      url: '/Project',
      icon: (<StatusIcon fontSize="small" />),
      title: '專案頁面',
      active: false
    },
    {
      url: '/backup',
      icon: (<MapIcon fontSize="small" />),
      title: '備份頁面',
      active: false
    },
    {
      url: '/management',
      icon: (<SummarizeIcon fontSize="small" />),
      title: '人員控管',
      active: false
    },
    {
      url: '/LOG',
      icon: (<QRCodeIcon fontSize="small" />),
      title: 'LOG頁面',
      active: false
    },
  ];

  const upload_items = [
    // {
    //   url: '/devices-upload',
    //   icon: (<LayoutIcon fontSize="small" />),
    //   title: 'Layout 座标表 上传',
    //   active: false
    // },
    // {
    //   url: '/worker-info-upload',
    //   icon: (<InfoIcon fontSize="small" />),
    //   title: '员工专职表 上传',
    //   active: false
    // },
    // {
    //   url: '/map-upload',
    //   icon: (<MapIcon fontSize="small" />),
    //   title: '车间地图 上传',
    //   active: false
    // }
  ];
  const content = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <Box sx={{ p: 3 }}>
        <Link to={'/all-status'}>
          <Logo sx={{ height: 42, width: 42 }} />
        </Link>
      </Box>
      <Divider
        sx={{
          borderColor: '#2D3748',
          my: 3,
          height: 1.5
        }}
      />
      <Box sx={{ flexGrow: 1 }}>
        {items.map((item) => (
          <NavItem
            key={item.title}
            icon={item.icon}
            url={item.url}
            title={item.title}
            globalIdx={idx}
            setIdx={setIdx}
          />
        ))}
      </Box>
      <Divider
        sx={{
          borderColor: '#2D3748',
          my: 3,
          height: 1.5
        }}
      />
      <Box sx={{ flexGrow: 1 }}>
        {upload_items.map((item) => (
          <NavItem
            key={item.title}
            icon={item.icon}
            url={item.url}
            title={item.title}
            globalIdx={idx}
            setIdx={setIdx}
          />
        ))}
      </Box>
    </Box>
  );

  return (
    <>
      <Drawer
        anchor="left"
        PaperProps={{
          sx: {
            backgroundColor: '#323232',
            color: '#ffffff',
            text: {
              primary: '#ffffff',
            },
            width: 280,
          }
        }}
        variant="permanent"
      >
        {content}
      </Drawer>
      <DashboardNavbar />
    </>
  );
};