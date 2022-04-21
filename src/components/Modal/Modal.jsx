import React from "react";
import "./modal.scss";
import Button from "../Button/Button";

const Modal = (props) => {
  const content = props.content;

  return (
    <div className="modal-background u__fixed">
      <div className="modal">
        <div className="modal__heading">{content.heading}</div>
        <div className="modal__body">{content.body}</div>
        <div className="modal__container"></div>
        <div className="modal__buttons">
          {content.buttonOne && (
            <Button
              type={content.buttonOne.type}
              color={content.buttonOne.color}
              body={content.buttonOne.body}
            />
          )}
          {content.buttonTwo && (
            <Button
              type={content.buttonTwo.type}
              color={content.buttonTwo.color}
              body={content.buttonTwo.body}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
