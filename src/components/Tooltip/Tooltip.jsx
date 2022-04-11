import React from "react";
import "./tooltip.scss";

const Tooltip = (props) => {
  console.log(props);
  return (
    <div className={`tooltip u__absolute flex__aic u__flex ${props.className}`}>
      <div className="tooltip-arrow"></div>
      <div className="tooltip-body ">{props.message}</div>
    </div>
  );
};

export default Tooltip;
