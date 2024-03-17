import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";

const marqueeAnimation = (width) => keyframes`
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(-${width - 400}px, 0); /* 調整框的大小 */
  }
`;

const MarqueeContainer = styled.div`
  .title {
    position: relative;
    white-space: nowrap;
    border: solid 1px rgb(189, 189, 189);
    overflow: hidden;
    width: 400px; /* 調整框的大小 */
    height: 35px;
    .marquee {
      display: block;
      position: absolute;
      animation-duration: ${(props) => (props.width <= 420 ? 3 : (props.width - 420) / 16 + 3)}s;
      animation-name: ${(props) => marqueeAnimation(props.width)};
      animation-timing-function: linear;
      animation-direction: alternate;
      animation-iteration-count: infinite;
    }
    /* 調整字體大小 */
    font-size: 25px;
  }
`;

const Marquee = ({ msg }) => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const marqueeElement = document.querySelector(".title__content");
    const rect = marqueeElement && marqueeElement.getBoundingClientRect();
    if (rect) {
      setWidth(rect.width);
    }
  }, [msg]);

  return (
    <div style={{ marginLeft: "50px" }}> {/* 將間距設置為20px */}
      <MarqueeContainer width={width}>
        <div className="title" >
          <span className={width >= 200 ? "title__content marquee" : "title__content"}>
            前次查詢時間:{msg}
          </span>
        </div>
      </MarqueeContainer>
    </div>
  );
};

export default Marquee;
