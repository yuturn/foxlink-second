// 這個頁面是左邊SIDEBAR制控制頁面
import React, { useState, useEffect, useContext } from "react";
import { GlobalContext } from '../components/GlobalContext';

import { Box, Divider, Drawer, MenuItem, Select, Typography } from '@mui/material';
import { ChartBar as StatusIcon } from '../icons/chart-bar';
import { Layout as LayoutIcon } from '../icons/layout';
import { QRCode as QRCodeIcon } from '../icons/qrcode';
import { Info as Info } from '../icons/info';
import { Search as Search } from '../icons/search';

import SummarizeIcon from '@mui/icons-material/Summarize';
import MapIcon from '@mui/icons-material/Map';
import { Logo } from './logo';
import { DashboardNavbar } from './dashboard-navbar';
import { NavItem } from './nav-item';
import { Link } from "react-router-dom";

export const DashboardSidebar = ({ idx, setIdx }) => {
  const [open, setOpen] = useState(false);
  const { globalVariable, updateGlobalVariable } = useContext(GlobalContext);

  const handleGlobalVariableChange = (event) => {
    const newValue = event.target.value;
    // 调用 updateGlobalVariable 更新全局状态
    updateGlobalVariable(newValue);
  };

  const items = [
    {
      url: '/machinehealth',
      icon: (<Search fontSize="small" />),
      title: (globalVariable == "zh-tw" ? "機況查詢" : globalVariable == "zh-cn" ? "机況查詢" : "Machine status"),
      active: false
    },
    {
      url: '/comparison',
      icon: (<Search fontSize="small" />),
      title: (globalVariable == "zh-tw" ? "預測與實際結果比對查詢" : globalVariable == "zh-cn" ? "预测与实际结果比对查询" : "Comparison"),
      active: false
    },
    {
      url: '/Project',
      icon: (<StatusIcon fontSize="small" />),
      title: (globalVariable == "zh-tw" ? "專案頁面" : globalVariable == "zh-cn" ? "专案页面" : "Project"),
      active: false
    },
    {
      url: '/backup',
      icon: (<MapIcon fontSize="small" />),
      title: (globalVariable == "zh-tw" ? "備份頁面" : globalVariable == "zh-cn" ? "备份页面" : "Backup"),
      active: false
    },
    {
      url: '/consumables',
      icon: (<SummarizeIcon fontSize="small" />),
      title: (globalVariable == "zh-tw" ? "耗材預測頁面" : globalVariable == "zh-cn" ? "耗材预测页面" : "Consumables"),
      active: false
    },
    {
      url: '/LOG',
      icon: (<Info fontSize="small" />),
      title: (globalVariable == "zh-tw" ? "LOG頁面" : globalVariable == "zh-cn" ? "LOG页面" : "LOG"),
      active: false
    },
  ];

  const toggleDrawer = () => {
    setOpen(!open);
  };
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
          borderColor: '#bfbfbf',
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
      <Divider
        sx={{
          borderColor: '#bfbfbf',
          my: 3,
          height: 1.5
        }}
      />
      <Box sx={{ flexGrow: 1 }}>
        <Box display="flex" alignItems="center" justifyContent="center" sx={{ mb: 2 }}>
          <Typography variant="h6" fontWeight="medium">
            {globalVariable == "zh-tw" ? "語言切換" : globalVariable == "zh-cn" ? "语言切换" : "Language switch"}
          </Typography>
        </Box>
        {/* Mui的Select元件 */}
        <Select
          value={globalVariable}
          onChange={handleGlobalVariableChange}
          sx={{ width: '100%' }}
        >
          <MenuItem value="zh-tw">繁體中文</MenuItem>
          <MenuItem value="zh-cn">简体中文</MenuItem>
          <MenuItem value="en">English</MenuItem>
          {/* ... 其他選項 */}
        </Select>
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
            marginLeft: open ? '0' : '-280px', // 控制選單顯示與隱藏
            transition: 'margin-left 0.3s ease', // 添加過渡效果
          }
        }}
        variant="permanent"
        open={open}
      >
        {content}
      </Drawer>
      <Box
        sx={{
          flexGrow: 1,
          marginLeft: open ? '280px' : '0', // 控制右側內容位置
          transition: 'margin-left 1s ease', // 添加過渡效果
        }}
      >
        <DashboardNavbar />
        
      </Box>
      <IconButton
        sx={{
          position: 'fixed',
          top: '20px',
          left: open ? '280px' : '20px', // 控制按鈕位置
          zIndex: 9999,
        }}
        onClick={toggleDrawer}
        color="inherit"
        aria-label="open drawer"
      >
        <MenuIcon />
      </IconButton>
    </>
  );
};