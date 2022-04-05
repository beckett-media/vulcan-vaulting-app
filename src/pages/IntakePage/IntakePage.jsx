import { useRef } from "react";
import "./intake-page.scss";

const IntakeForm = () => {
  const firstNameRef = useRef("");
  const lastNameRef = useRef("");

  const formSubmissionHandler = (e) => {
    e.preventDefault();
    console.log(firstNameRef.current.value);
    console.log(lastNameRef.current.value);
  };

  return "test";
};

export default IntakeForm;
