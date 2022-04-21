import React from "react";

const Button = (props) => {
  return <div className={`btn gradient__${props.color}`}>{props.body}</div>;
};

export default Button;
