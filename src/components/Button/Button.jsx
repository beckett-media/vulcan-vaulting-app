import React from "react";
import "./button.scss";

const Button = (props) => {
  return (
    <>
      {props.type === "outline" && (
        <div className={`btn btn__outline--outer gradient__${props.color}`}>
          <div className={`btn btn__outline--inner`}>{props.body}</div>
        </div>
      )}
      {props.type === "solid" && (
        <div className={`btn gradient__${props.color}`}>{props.body}</div>
      )}
    </>
  );
};

export default Button;
