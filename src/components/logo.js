import { Button } from '@mui/material';
import React from "react";
import foxlinkLogo from '../assets/foxlink_logo.png';

export const Logo = ({handler}) => {
  return (
    <Button>
      <img src={foxlinkLogo}width="178" height="46"/>
    </Button>
  );
};


