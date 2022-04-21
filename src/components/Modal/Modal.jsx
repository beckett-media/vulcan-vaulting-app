import React from "react";
import "./modal.scss";

const Modal = (props) => {
  const content = props.content;

  return (
    <div className="modal-background u__fixed">
      <div className="modal">
        <div className="modal__heading">{content.heading}</div>
        <div className="modal__body">{content.body}</div>
        <div className="modal__container"></div>
      </div>
    </div>
  );
};

export default Modal;
