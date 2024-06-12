// 這就有關於整體布局
import React, { useState, useEffect } from "react";
import { Box, Container } from '@mui/material';
import { styled } from '@mui/material/styles';
import { AppBar } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Logo } from './logo';
import { DashboardNavbar } from './dashboard-navbar';
import { DashboardSidebar } from './dashboard-sidebar';

const DashboardLayoutRoot = styled('div')(({ theme, isSidebarOpen }) => ({
  display: 'flex',
  flex: '1 1 auto',
  maxWidth: '100%',
  paddingTop: 64,
  paddingLeft: isSidebarOpen ? 0 : 280,
  [theme.breakpoints.up('lg')]: {
    paddingLeft: isSidebarOpen ? 0 : 280
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
  const [userToggledSidebar, setUserToggledSidebar] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      // Only update the sidebar status if it wasn't toggled by the user
      if (!userToggledSidebar) {
        setIsSidebarOpen(window.innerWidth >= 1280);
      }
    };

    // Add event listener for resize
    window.addEventListener('resize', handleResize);

    // Call handleResize immediately to set the initial state
    handleResize();

    // Clean up the event listener
    return () => window.removeEventListener('resize', handleResize);
  }, [userToggledSidebar]);

  const toggleSidebar = () => {
    setUserToggledSidebar(true);
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Box sx={{ mb: 3, bgcolor: 'text.primary', color: 'background.paper' }}>
          <AppBar position="fixed" color="primary" enableColorOnDark>
            <Logo sx={{ height: 42, width: 42 }} />
          </AppBar>
        </Box>
        <Container maxWidth={true}>
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
            toggleSidebar={toggleSidebar}
          />
          <DashboardNavbar user={user} />
        </Container>
      </Box>
    </ThemeProvider>
  );
};
