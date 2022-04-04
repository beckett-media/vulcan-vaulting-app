import { useRef, useState } from "react";
import "./intake-form.scss";

const IntakeForm = () => {
  const firstNameRef = useRef("");
  const lastNameRef = useRef("");

  const formSubmissionHandler = (e) => {
    e.preventDefault();
    console.log(firstNameRef.current.value);
    console.log(lastNameRef.current.value);
  };

  return (
    <>
      <button>Connect to Wallet</button>
      <form className="u-flex-v-tl" onSubmit={formSubmissionHandler}>
        <input placeholder="First name" type="text" ref={firstNameRef} />
        <input placeholder="Last name" type="text" ref={lastNameRef} />
        <input placeholder="Birthday MM/DD/YYYY" type="text" />
        <input placeholder="Email address" type="email" />
        <input placeholder="Address 1" type="text" />
        <input placeholder="Address 2" type="text" />
        <input placeholder="City" type="text" />
        <input placeholder="State" type="text" />
        <input placeholder="Zip" type="text" />
        <input placeholder="Vaulted item name" type="text" />
        <textarea placeholder="Vaulted item description" type="text" />
        <button>Submit</button>
      </form>
    </>
  );
};

export default IntakeForm;
