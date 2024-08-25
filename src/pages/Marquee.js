import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";

// 樣式化容器
const MarqueeContainer = styled.div`
  .title {
    position: relative;
    white-space: nowrap;
    border: solid 1px rgb(189, 189, 189);
    overflow: hidden;
    width: 450px; /* 調整框的大小 */
    height: 35px;
    font-size: 25px; /* 調整字體大小 */
  }
`;

const Marquee = ({ header, msg }) => {
  const marqueeRef = useRef(null); // 使用useRef來獲取元素引用

  return (
    <div style={{ marginLeft: "50px" }}> {/* 將間距設置為50px */}
      <MarqueeContainer>
        <div className="title">
          <span ref={marqueeRef} className="title__content">
            {header}{msg}
          </span>
        </div>
      </MarqueeContainer>
    </div>
  );
};

export default Marquee;
