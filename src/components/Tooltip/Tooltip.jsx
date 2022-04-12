import React from "react";
import "./tooltip.scss";

const Tooltip = (props) => {
  console.log(props);
  return (
    <div className={`tooltip u__absolute flex__aic u__flex ${props.className}`}>
      {props.direction === "left" && (
        <div className="tooltip-arrow tooltip-arrow--left"></div>
      )}
      <div className="tooltip-body ">{props.message}</div>
      {props.direction === "right" && (
        <div className="tooltip-arrow tooltip-arrow--right"></div>
      )}
    </div>
  );
};

export default Tooltip;
