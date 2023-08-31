import React from "react";

import { Logo } from './logo';
import { Box, Container } from '@mui/material';
import { styled } from '@mui/material/styles';
import { DashboardNavbar } from './dashboard-navbar';
import { DashboardSidebar } from './dashboard-sidebar';
import { Toolbar, IconButton, Typography } from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import MenuIcon from '@mui/icons-material/Menu';

const DashboardLayoutRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  flex: '1 1 auto',
  maxWidth: '100%',
  paddingTop: 64,
  [theme.breakpoints.up('lg')]: {
    paddingLeft: 280
  }
}));

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1976d2',
    },
  },
});

export const DashboardLayout = ({children, user}) => {
  return (
  <ThemeProvider theme={darkTheme}>
    <Box
      component="main"
      sx={{
      flexGrow: 1,
      }}
    >
      <Box sx={{ mb:3, bgcolor: 'text.primary', color: 'background.paper',}}>
        <AppBar position="fixed" color="primary" enableColorOnDark>
          <Logo sx={{ height: 42, width: 42 }} />
        </AppBar>
      </Box>
      <Container maxWidth={false}>
      <DashboardLayoutRoot>
        <Box
          sx={{
            display: 'flex',
            flex: '1 1 auto',
            flexDirection: 'column',
            width: '100%',
          }}
        >
          {children}
        </Box>
      </DashboardLayoutRoot>
      <DashboardSidebar />
      <DashboardNavbar user={user} />
      </Container>
    </Box>  
  </ThemeProvider>
  );
};
