import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { API } from 'aws-amplify';
import styles from './forms.module.scss';
import * as Yup from 'yup';

const DepositForm = (props) => {
  const d = new Date();
  const daysArray = [...Array(32).keys()].slice(1);
  const monthsArray = [...Array(13).keys()].slice(1);
  const yearsArray = [...Array(d.getFullYear()).keys()].slice(1900);
  const statesArray = [
    'AL',
    'AK',
    'AS',
    'AZ',
    'AR',
    'CA',
    'CO',
    'CT',
    'DE',
    'DC',
    'FM',
    'FL',
    'GA',
    'GU',
    'HI',
    'ID',
    'IL',
    'IN',
    'IA',
    'KS',
    'KY',
    'LA',
    'ME',
    'MH',
    'MD',
    'MA',
    'MI',
    'MN',
    'MS',
    'MO',
    'MT',
    'NE',
    'NV',
    'NH',
    'NJ',
    'NM',
    'NY',
    'NC',
    'ND',
    'MP',
    'OH',
    'OK',
    'OR',
    'PW',
    'PA',
    'PR',
    'RI',
    'SC',
    'SD',
    'TN',
    'TX',
    'UT',
    'VT',
    'VI',
    'VA',
    'WA',
    'WV',
    'WI',
    'WY',
  ];
  const walletAddress = props.additionalData;

  const apiName = "vulcanAPI";
  const path = "/deposit";

  return (
    <Formik
      initialValues={{
        firstName: '',
        lastName: '',
        email: '',
        month: 'MM',
        day: 'DD',
        year: 'YYYY',
        address1: '',
        address2: '',
        city: '',
        state: '',
        zip: '',
        itemName: '',
        itemDesc: '',
      }}
      validationSchema={Yup.object({
        firstName: Yup.string().required('Required'),
        lastName: Yup.string().required('Required'),
        email: Yup.string().email('Invalid email address').required('Required'),
        month: Yup.string()
          .test('is-month', 'Required', (value) => value !== 'MM')
          .required('Required'),
        day: Yup.string()
          .test('is-day', 'Required', (value) => value !== 'DD')
          .required('Required'),
        year: Yup.string()
          .test('is-year', 'Required', (value) => value !== 'YYYY')
          .required('Required'),
        address1: Yup.string().required('Required'),
        address2: '',
        city: Yup.string().required('Required'),
        state: Yup.string()
          .test('is-state', 'Required', (value) => value !== 'state')
          .required('Required'),
        zip: Yup.number().required('Required'),
        itemName: Yup.string().required('Required'),
        itemDesc: Yup.string().required('Required'),
      })}
      onSubmit={(values, { setSubmitting }) => {
        values.walletAddress = props.additionalData.walletAddress;

        // const myInit = {
        //   body: {
        //     "date_of_birth": `${values.month}/${values.day}/${values.year}`,
        //     "first_name": values.firstName,
        //     "email": values.email,
        //     "zip": values.zip,
        //     "city": values.city,
        //     "last_name": values.lastName,
        //     "wallet_address": values.walletAddress,
        //     "vaulted_item_description": values.itemDesc,
        //     "address_line_1": values.address1,
        //     "vaulted_item_name": values.itemName,
        //     "address_line_2": values.address2,
        //     "state": values.state,
        //   },
        // };

        // API.put(apiName, path, myInit).then((response) => {
        //   console.log(response);
        //   setSubmitting(false);
        // }).catch((error) => {
        //   console.log(error);
        //   setSubmitting(false);
        // });
        const createDateOfBirth = (values) => {
          const dateOfBirth = `${values.year}-${values.month}-${values.day}`;
          return dateOfBirth;
        };

        const myInit = {
          body: {
            ...values,
            dateOfBirth: createDateOfBirth(values),
          },
        };


        API.put(apiName, path, myInit)
          .then((response) => {
            console.log(response);
            setSubmitting(false);
          })
          .catch((error) => {
            console.log(error.response);
            setSubmitting(false);
          });
      

        // setTimeout(() => {
        //   alert(JSON.stringify(values, null, 2));
        //   setSubmitting(false);
        // }, 400);
      }}
    >
      <Form className={`${styles.form} u__left`}>
        <div className={`${styles.form__row}`}>
          <Field
            name="firstName"
            type="text"
            placeholder="First Name"
            className={`${styles.form__field}`}
          />
          {/* <ErrorMessage name="firstName" /> */}

          <Field
            name="lastName"
            type="text"
            placeholder="Last Name"
            className={`${styles.form__field}`}
          />
          {/* <ErrorMessage name="lastName" /> */}

          <Field
            name="email"
            type="email"
            placeholder="Email Address"
            className={`${styles.form__field}`}
          />
          {/* <ErrorMessage name="email" /> */}
        </div>

        <div className={`${styles.form__row}`}>
          <div className={`${styles.form__col}`}>
            <label htmlFor="month" className="mb16 u__block">
              Birthday
            </label>
            <div className={`${styles['form__select-group']}`}>
              <div className={`${styles['form__select-wrapper']} u__flex flex__aic`}>
                <div className={`${styles['form__select-arrow']}`}></div>
                <Field
                  name="month"
                  as="select"
                  className={`${styles.form__select} ${styles.form__field}`}
                >
                  <option value="MM">MM</option>
                  {monthsArray.map((i) => {
                    const month = i.toString().padStart(2, '0');
                    return <option value={`${month}`}>{month}</option>;
                  })}
                </Field>
                {/* <ErrorMessage name="month" /> */}
              </div>

              <div className={`${styles['form__select-wrapper']} u__flex flex__aic`}>
                <div className={`${styles['form__select-arrow']}`}></div>
                <Field
                  name="day"
                  as="select"
                  className={`${styles.form__select} ${styles.form__field}`}
                >
                  <option value="DD">DD</option>
                  {daysArray.map((i) => {
                    const day = i.toString().padStart(2, '0');
                    return <option value={`${day}`}>{day}</option>;
                  })}
                </Field>
                {/* <ErrorMessage name="day" /> */}
              </div>

              <div className={`${styles['form__select-wrapper']} u__flex flex__aic`}>
                <div className={`${styles['form__select-arrow']}`}></div>
                <Field
                  name="year"
                  as="select"
                  className={`${styles.form__select} ${styles.form__field}`}
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

        <div className={`${styles.form__row}`}>
          <Field
            name="address1"
            type="text"
            placeholder="Address 1"
            className={`${styles.form__field}`}
          />
          {/* <ErrorMessage name="address1" /> */}

          <Field
            name="address2"
            type="text"
            placeholder="Address 2"
            className={`${styles.form__field}`}
          />
          {/* <ErrorMessage name="address2" /> */}

          <Field name="city" type="text" placeholder="City" className={`${styles.form__field}`} />
          {/* <ErrorMessage name="city" /> */}

          <div className={`${styles['form__state-zip']}`}>
            <div className={`${styles['form__select-wrapper']} u__flex flex__aic`}>
              <div className={`${styles['form__select-arrow']}`}></div>
              <Field
                name="state"
                as="select"
                className={`${styles.form__select} ${styles.form__field}`}
              >
                <option value="state">State</option>
                {statesArray.map((i) => {
                  return <option value={`${i}`}>{i}</option>;
                })}
              </Field>
              {/* <ErrorMessage name="state" /> */}
            </div>

            <Field name="zip" type="text" placeholder="Zip" className={`${styles.form__field}`} />
            {/* <ErrorMessage name="zip" /> */}
          </div>
        </div>

        <div className={`${styles.form__row}`}>
          <Field
            name="itemName"
            type="text"
            placeholder="Vaulted item name"
            className={`${styles.form__field}`}
          />
          {/* <ErrorMessage name="itemName" /> */}

          <div>&nbsp;</div>

          <Field
            name="itemDesc"
            as="textarea"
            placeholder="Vaulted item description"
            className={`${styles.form__field} ${styles.form__textarea} grid__full`}
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
