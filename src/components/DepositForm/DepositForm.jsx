import React from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

const DepositForm = (props) => {
  const d = new Date();
  const daysArray = [...Array(32).keys()].slice(1);
  const monthsArray = [...Array(13).keys()].slice(1);
  const yearsArray = [...Array(d.getFullYear()).keys()].slice(1900);
  const statesArray = [
    "AL",
    "AK",
    "AS",
    "AZ",
    "AR",
    "CA",
    "CO",
    "CT",
    "DE",
    "DC",
    "FM",
    "FL",
    "GA",
    "GU",
    "HI",
    "ID",
    "IL",
    "IN",
    "IA",
    "KS",
    "KY",
    "LA",
    "ME",
    "MH",
    "MD",
    "MA",
    "MI",
    "MN",
    "MS",
    "MO",
    "MT",
    "NE",
    "NV",
    "NH",
    "NJ",
    "NM",
    "NY",
    "NC",
    "ND",
    "MP",
    "OH",
    "OK",
    "OR",
    "PW",
    "PA",
    "PR",
    "RI",
    "SC",
    "SD",
    "TN",
    "TX",
    "UT",
    "VT",
    "VI",
    "VA",
    "WA",
    "WV",
    "WI",
    "WY",
  ];
  const walletAddress = props.additionalData;

  return (
    <Formik
      initialValues={{
        firstName: "",
        lastName: "",
        email: "",
        month: "MM",
        day: "DD",
        year: "YYYY",
        address1: "",
        address2: "",
        city: "",
        state: "",
        zip: "",
        itemName: "",
        itemDesc: "",
      }}
      validationSchema={Yup.object({
        firstName: Yup.string().required("Required"),
        lastName: Yup.string().required("Required"),
        email: Yup.string().email("Invalid email address").required("Required"),
        month: Yup.string().required("Required"),
        day: Yup.string().required("Required"),
        year: Yup.string().required("Required"),
        address1: Yup.string().required("Required"),
        address2: "",
        city: Yup.string().required("Required"),
        state: "",
        zip: Yup.number().required("Required"),
        itemName: Yup.string().required("Required"),
        itemDesc: Yup.string().required("Required"),
      })}
      onSubmit={(values, { setSubmitting }) => {
        values.walletAddress = walletAddress;
        setTimeout(() => {
          alert(JSON.stringify(values, null, 2));
          setSubmitting(false);
        }, 400);
      }}
    >
      <Form>
        <Field name="firstName" type="text" placeholder="First Name" />
        <ErrorMessage name="firstName" />

        <Field name="lastName" type="text" placeholder="Last Name" />
        <ErrorMessage name="lastName" />

        <Field name="email" type="email" placeholder="Email Address" />
        <ErrorMessage name="email" />

        <label htmlFor="month">Birthday</label>
        <Field name="month" as="select" className="my-select">
          <option value="MM">MM</option>
          {monthsArray.map((i) => {
            const month = i.toString().padStart(2, "0");
            return <option value={`${month}`}>{month}</option>;
          })}
        </Field>
        <ErrorMessage name="month" />

        <Field name="day" as="select" className="my-select">
          <option value="DD">DD</option>
          {daysArray.map((i) => {
            const day = i.toString().padStart(2, "0");
            return <option value={`${day}`}>{day}</option>;
          })}
        </Field>
        <ErrorMessage name="day" />

        <Field name="year" as="select" className="my-select">
          <option value="YYYY">YYYY</option>
          {yearsArray.map((i) => {
            return <option value={`${i}`}>{i}</option>;
          })}
        </Field>
        <ErrorMessage name="year" />

        <Field name="address1" type="text" placeholder="Address 1" />
        <ErrorMessage name="address1" />

        <Field name="address2" type="text" placeholder="Address 2" />
        <ErrorMessage name="address2" />

        <Field name="city" type="text" placeholder="City" />
        <ErrorMessage name="city" />

        <Field name="state" as="select" className="my-select">
          <option value="state">State</option>
          {statesArray.map((i) => {
            return <option value={`${i}`}>{i}</option>;
          })}
        </Field>

        <Field name="zip" type="text" placeholder="Zip" />
        <ErrorMessage name="zip" />

        <Field name="itemName" type="text" placeholder="Vaulted item name" />
        <ErrorMessage name="itemName" />

        <Field
          name="itemDesc"
          as="textarea"
          placeholder="Vaulted item description"
        />
        <ErrorMessage name="itemDesc" />

        <button type="submit">Submit</button>
      </Form>
    </Formik>
  );
};

export default DepositForm;
