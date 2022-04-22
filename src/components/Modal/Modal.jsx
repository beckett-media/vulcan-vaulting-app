import React from "react";
import "./modal.scss";
import Button from "../Button/Button";
import Lottie from "lottie-react";

const Modal = (props) => {
  const content = props.content;
  console.log(content.lottie);

  return (
    <div className={`modal-background u__fixed u__flex flex__jcc flex__aic`}>
      <div className="modal__outer u__flex flex__v flex__aic u__relative">
        {content.lottie && (
          <Lottie
            className="modal__lottie"
            animationData={content.lottie}
            loop={false}
          />
        )}
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
