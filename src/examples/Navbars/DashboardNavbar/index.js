// react-router components
import React from 'react';
import { useLocation } from "react-router-dom";


// @material-ui core components
import AppBar from "@mui/material/AppBar";

import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

function DashboardNavbar() {
  // const [navbarType, setNavbarType] = useState();
  // const [controller, dispatch] = useMaterialUIController();
  // const { transparentNavbar, fixedNavbar, darkMode } = controller;
  // const { miniSidenav, transparentNavbar, fixedNavbar, openConfigurator, darkMode } = controller;
  // const [openMenu, setOpenMenu] = useState(false);
  const route = useLocation().pathname.split("/").slice(1);
  const username = "使用者姓名";

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 3 }}>
            {route}
          </Typography>
          <Typography variant="h6" component="div" sx={{ flexDirection: "row-reverse" }}>
            {username}
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

// Setting default values for the props of DashboardNavbar
DashboardNavbar.defaultProps = {
  absolute: false,
  light: false,
};

export default DashboardNavbar;
