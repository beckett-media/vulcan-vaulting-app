import { useRef } from "react";
import "./intake-page.scss";
import InttakeForm from "../../components/InttakeForm/InttakeForm";

const IntakePage = () => {
  const firstNameRef = useRef("");
  const lastNameRef = useRef("");

  const formSubmissionHandler = (e) => {
    e.preventDefault();
    console.log(firstNameRef.current.value);
    console.log(lastNameRef.current.value);
  };

  return <InttakeForm />;
};

export default IntakePage;
