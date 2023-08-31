import React, { useState, useEffect } from "react";
import {
  useNavigate
} from 'react-router-dom'
import { Select, MenuItem } from '@mui/material';
import {apiWorkShopList} from "../api.js";

export const WorkshopPicker = ({token, workshop, setWorkshop, setAlert}) => {
  const navigate = useNavigate();
  const [selectItem, setSelectItem] = useState();

  const handleChange = (event) => {
    setWorkshop(event.target.value);
  };

  useEffect(()=> {
    apiWorkShopList(token).then(res => {
        setSelectItem(res.data.map(name=>{
            return(<MenuItem key={name} value={name}>{name}</MenuItem>)
        }))
    }).catch(err => {
     
    });
}, [])

  return (
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={workshop}
          label="WorkShop"
          onChange={handleChange}
          sx={{minWidth:"130px"}}
        >
        {
          selectItem 
        }
        </Select>
  );
} 
