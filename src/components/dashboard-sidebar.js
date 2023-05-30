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

export const DashboardSidebar = ({idx, setIdx}) => {
  const items = [
      {
        url: '/statistics',
        icon: (<StatusIcon fontSize="small" />),
        title: '统计资料',
        active: false
      },
      {
        url : '/ENRMission',
        icon: (<StatusIcon fontSize="small"/>),
        title: '紧急和需维修任务',
        active: false
      },
      {
        url: '/qrcode-download',
        icon: (<QRCodeIcon fontSize="small" />),
        title: 'QR Code 下载',
        active: false
      },
      {
        url: '/map',
        icon: (<MapIcon fontSize="small" />),
        title: '车间地图',
        active: false
      },
      {
        url : '/white-list',
        icon: (<SummarizeIcon fontSize="small"/>),
        title: '白名單',
        active: false
      }
  ];

  const upload_items = [
    {
      url: '/devices-upload',
      icon: (<LayoutIcon fontSize="small" />),
      title: 'Layout 座标表 上传',
      active: false
    },
    {
      url: '/worker-info-upload',
      icon: (<InfoIcon fontSize="small" />),
      title: '员工专职表 上传',
      active: false
    },
    {
      url : '/map-upload',
      icon: (<MapIcon fontSize="small"/>),
      title: '车间地图 上传',
      active: false
    }
  ];
  const content = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }}
    >
      <Box sx={{ p: 3 }}>
        <Link to={'/all-status'}>
          <Logo sx={{height: 42, width: 42 }} />
        </Link>
      </Box>
      <Divider
        sx={{
          borderColor: '#2D3748',
          my: 3,
          height:1.5
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
          height:1.5
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
            backgroundColor: '#111827',
            color: '#FFFFFF',
            width: 280
          }
        }}
        variant="permanent"
      >
        {content}
      </Drawer>
      <DashboardNavbar  />
    </>
  );
};