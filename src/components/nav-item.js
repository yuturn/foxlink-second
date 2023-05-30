import { Box, Button, ListItem } from '@mui/material';
import React from "react";
import { Link } from "react-router-dom";

export const NavItem = (props) => {
  const { icon, title, globalIdx, setIdx, url,  ...others } = props;
  const active = ('/' + document.location.href.split('/').at(-1)) === url;
  return (
    <Link to={url} style={{ textDecoration: 'none' }}>
      <ListItem
      disableGutters
      sx={{
        display: 'flex',
        mb: 0.5,
        py: 0,
        px: 2,
        textDecoration:'none'
      }}
    >
      <Button
          component="a"
          startIcon={icon}
          disableRipple
          sx={{
            backgroundColor: active && 'rgba(255,255,255, 0.08)',
            color: active ? '#10B981' : '#D1D5DB',
            fontWeight: active && 'fontWeightBold',
            justifyContent: 'flex-start',
            px: 3,
            textAlign: 'left',
            width: '100%',
            '& .MuiButton-startIcon': {
              color: active ? '#10B981' : '#9CA3AF'
            },
            '&:hover': {
              backgroundColor: 'rgba(255,255,255, 0.08)'
            }
          }}
        >
          <Box sx={{ flexGrow: 1}}>
            {title}
          </Box>
      </Button>
    </ListItem>
    </Link>
  );
};

