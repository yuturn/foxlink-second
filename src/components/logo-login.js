import { Button } from '@mui/material';
import React from "react";
import foxlinkLogo from '../assets/foxlink-logo-noColor.png';

export const Logo = ({ handler }) => {
  return (
    <Button>
      <img src={foxlinkLogo} width="230" height="60" />
    </Button>
  );
};


