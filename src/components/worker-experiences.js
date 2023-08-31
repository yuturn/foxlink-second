import React, { useState, useEffect } from "react";

import {
  Table, TableRow, TableHead, TableCell, Box, Card, CardContent, Dialog, DialogTitle, DialogContent, Button, DialogActions, TableBody
} from '@mui/material';

const CONTENT = {
  project: "专案",
  process: "制程段",
  device_name: "装置代号",
  line: "产线",
  exp: "经验值"
}

export function WorkExperiences({ list_data, ...rest }) {
  useEffect(() => {
    let keys = ["project", "process", "device_name", "line", "exp"]
    const display = (
      <Card sx={{
        m: 1,
      }}
        key="ex-card">
        <CardContent >
          <Table>
            <TableHead sx={{ background: "#272d3a" }}>
              <TableRow>
                {
                  keys.map((key, index) => {
                    return <TableCell key={index}>{CONTENT[key]}</TableCell>
                  })
                }
              </TableRow>
            </TableHead>
            <TableBody>
              {
                list_data.map(
                  exp => {
                    return (
                      <TableRow>
                        {
                          keys.map((key, index) => {
                            return <TableCell key={exp[key]}>{exp[key]}</TableCell>
                          })
                        }
                      </TableRow>
                    )
                  })
              }
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    )
    setData(display);
  }, [])
  const [data, setData] = useState();
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ pt: 3, minWidth: '100%' }}>
      <Button variant="contained" onClick={handleClickOpen}>
        查看
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{ minWidth: '900px' }}
      >
        <DialogTitle id="alert-dialog-title">
          经验
        </DialogTitle>
        <DialogContent>
          {
            data
          }
        </DialogContent>
        <DialogActions >
          <Button onClick={handleClose} autoFocus variant="contained">
            关闭
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 
