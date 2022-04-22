import React from "react";
import "./modal.scss";
import Button from "../Button/Button";

const Modal = (props) => {
  const content = props.content;

  return (
    <div className={`modal-background u__fixed u__flex flex__jcc flex__aic`}>
      <div className="modal__outer u__flex flex__v flex__aic u__relative">
        <div
          className="modal__close u__absolute"
          onClick={() => props.setIsVisible(false)}
        >
          &times;
        </div>
        <div className="modal__heading">{content.heading}</div>
        <div className="modal__body">{content.body}</div>
        <div className="modal__inner">test</div>
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
