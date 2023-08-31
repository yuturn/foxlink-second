import React from 'react';
import { useNavigate } from 'react-router-dom';
import "./404.css";
export const NotFound = () => {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate('/login');
    }
    return(
    <div class="flex-container">
        <div class="text-center">
        <h1>
            <span class="fade-in" id="digit1">4</span>
            <span class="fade-in" id="digit2">0</span>
            <span class="fade-in" id="digit3">4</span>
        </h1>
        <h3 class="fadeIn">PAGE NOT FOUND</h3>
        <button type="button" name="button" onClick={handleClick}>返回登入页</button>
        </div>
    </div>
  );
}