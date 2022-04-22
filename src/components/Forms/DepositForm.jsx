import React from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { API } from "aws-amplify";
import "./forms.scss";
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

  const apiName = "vulcanAPI";
  const path = "/deposit";

  // useState to check the server response
  const [serverResponse, setServerResponse] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  console.log(serverResponse); // this is the server response from the server after the form is submitted
  console.log(loading); // this is the loading state of the form after the form is submitted

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
        month: Yup.string()
          .test("is-month", "Required", (value) => value !== "MM")
          .required("Required"),
        day: Yup.string()
          .test("is-day", "Required", (value) => value !== "DD")
          .required("Required"),
        year: Yup.string()
          .test("is-year", "Required", (value) => value !== "YYYY")
          .required("Required"),
        address1: Yup.string().required("Required"),
        address2: "",
        city: Yup.string().required("Required"),
        state: Yup.string()
          .test("is-state", "Required", (value) => value !== "state")
          .required("Required"),
        zip: Yup.number().required("Required"),
        itemName: Yup.string().required("Required"),
        itemDesc: Yup.string().required("Required"),
      })}
      onSubmit={(values, { setSubmitting }) => {
        values.walletAddress = props.additionalData.walletAddress;

        // ####################### LOADING AND API POST REQUEST #####################################
        const createDateOfBirth = (values) => {
          const dateOfBirth = `${values.year}-${values.month}-${values.day}`;
          return dateOfBirth;
        };

        const myInit = {
          body: {
            ...values,
            "dateOfBirth": createDateOfBirth(values),
          },
        };

        // function that check the server response and drigger loading state
        const handleSubmit = async (response, error) => {
          setLoading(true); // set loading state to true
          if (response.status_code === 200) {
            // if the server response is 200
            setServerResponse(response.status); // set the server response to the state
            setLoading(false); // set the loading state to false
            console.log(response.status);
          } else {
            // if the server response is not 200
            setServerResponse(error.status); // set the server response to the state
            console.log(error);
            setLoading(false); // set the loading state to false
          }
        };

        API.put(apiName, path, myInit) // API call
          .then((response) => {
            // if the server response is 200
            console.log(response);
            handleSubmit(response); // call the function that check the server response
          })
          .catch((error) => {
            // if the server response is not 200
            console.log(error.response);
            handleSubmit(error.response); // call the function that check the server response
          });
        // #############################################################################

        // setTimeout(() => {
        //   alert(JSON.stringify(values, null, 2));
        //   setSubmitting(false);
        // }, 400);
      }}
    >
      <Form className="form u__left">
        <div className="form__row">
          <Field
            name="firstName"
            type="text"
            placeholder="First Name"
            className="form__field"
          />
          {/* <ErrorMessage name="firstName" /> */}

          <Field
            name="lastName"
            type="text"
            placeholder="Last Name"
            className="form__field"
          />
          {/* <ErrorMessage name="lastName" /> */}

          <Field
            name="email"
            type="email"
            placeholder="Email Address"
            className="form__field"
          />
          {/* <ErrorMessage name="email" /> */}
        </div>

        <div className="form__row">
          <div className="form__col">
            <label htmlFor="month" className="mb16 u__block">
              Birthday
            </label>
            <div className="form__select-group">
              <div className="form__select-wrapper u__flex flex__aic">
                <div className="form__select-arrow"></div>
                <Field
                  name="month"
                  as="select"
                  className="form__select form__field"
                >
                  <option value="MM">MM</option>
                  {monthsArray.map((i) => {
                    const month = i.toString().padStart(2, "0");
                    return <option value={`${month}`}>{month}</option>;
                  })}
                </Field>
                {/* <ErrorMessage name="month" /> */}
              </div>

              <div className="form__select-wrapper u__flex flex__aic">
                <div className="form__select-arrow"></div>
                <Field
                  name="day"
                  as="select"
                  className="form__select form__field"
                >
                  <option value="DD">DD</option>
                  {daysArray.map((i) => {
                    const day = i.toString().padStart(2, "0");
                    return <option value={`${day}`}>{day}</option>;
                  })}
                </Field>
                {/* <ErrorMessage name="day" /> */}
              </div>

              <div className="form__select-wrapper u__flex flex__aic">
                <div className="form__select-arrow"></div>
                <Field
                  name="year"
                  as="select"
                  className="form__select form__field"
                >
                  <option value="YYYY">YYYY</option>
                  {yearsArray.map((i) => {
                    return <option value={`${i}`}>{i}</option>;
                  })}
                </Field>
                {/* <ErrorMessage name="year" /> */}
              </div>
            </div>
          </div>
        </div>

        <div className="form__row">
          <Field
            name="address1"
            type="text"
            placeholder="Address 1"
            className="form__field"
          />
          {/* <ErrorMessage name="address1" /> */}

          <Field
            name="address2"
            type="text"
            placeholder="Address 2"
            className="form__field"
          />
          {/* <ErrorMessage name="address2" /> */}

          <Field
            name="city"
            type="text"
            placeholder="City"
            className="form__field"
          />
          {/* <ErrorMessage name="city" /> */}

          <div className="form__state-zip">
            <div className="form__select-wrapper u__flex flex__aic">
              <div className="form__select-arrow"></div>
              <Field
                name="state"
                as="select"
                className="form__select form__field"
              >
                <option value="state">State</option>
                {statesArray.map((i) => {
                  return <option value={`${i}`}>{i}</option>;
                })}
              </Field>
              {/* <ErrorMessage name="state" /> */}
            </div>

            <Field
              name="zip"
              type="text"
              placeholder="Zip"
              className="form__field"
            />
            {/* <ErrorMessage name="zip" /> */}
          </div>
        </div>

        <div className="form__row">
          <Field
            name="itemName"
            type="text"
            placeholder="Vaulted item name"
            className="form__field"
          />
          {/* <ErrorMessage name="itemName" /> */}

          <div>&nbsp;</div>

          <Field
            name="itemDesc"
            as="textarea"
            placeholder="Vaulted item description"
            className="form__field form__textarea grid__full"
          />
          {/* <ErrorMessage name="itemDesc" /> */}
        </div>

        <div className="u__w100 u__center">
          <button type="submit" className="btn gradient__green">
            Submit
          </button>
        </div>
      </Form>
    </Formik>
  );
};

export default DepositForm;
