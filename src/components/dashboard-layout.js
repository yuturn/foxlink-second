import React, { useState, useEffect } from "react";

import { Logo } from './logo';
import { Box, Container } from '@mui/material';
import { styled } from '@mui/material/styles';
import { DashboardNavbar } from './dashboard-navbar';
import { DashboardSidebar } from './dashboard-sidebar';
import { Toolbar, IconButton, Typography } from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import MenuIcon from '@mui/icons-material/Menu';

const DashboardLayoutRoot = styled('div')(({ theme, isSidebarOpen }) => ({
  display: 'flex',
  flex: '1 1 auto',
  maxWidth: '100%',
  paddingTop: 64,
  paddingLeft: isSidebarOpen ? 280 : 0,
  [theme.breakpoints.up('lg')]: {
    paddingLeft: isSidebarOpen ? 280 : 0
  }
}));

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#FFFFFF',
    },
  },
});

export const DashboardLayout = ({ children, user }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      // Update the sidebar status based on screen width
      if (window.innerWidth >= 1280) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    // Add event listener for resize
    window.addEventListener('resize', handleResize);

    // Call handleResize immediately to set the initial state
    handleResize();

    // Clean up the event listener
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <ThemeProvider theme={darkTheme}>
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Box sx={{ mb: 3, bgcolor: 'text.primary', color: 'background.paper' }}>
          <AppBar position="fixed" color="primary" enableColorOnDark>
            <Logo sx={{ height: 42, width: 42 }} />
          </AppBar>
        </Box>
        <Container maxWidth={false}>
          <DashboardLayoutRoot isSidebarOpen={isSidebarOpen}>
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
          <DashboardSidebar
            initialOpen={false}
            isOpen={isSidebarOpen}
            toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          />
          <DashboardNavbar user={user} />
        </Container>
      </Box>
    </ThemeProvider>
  );
};

