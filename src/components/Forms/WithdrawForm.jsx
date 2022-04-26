import { API } from 'aws-amplify';
import { Field, Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import * as Yup from 'yup';
import styles from './forms.module.scss';

const WithdrawForm = (props) => {
  const router = useRouter();
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

  const apiName = 'vulcanAPI';
  const path = '/withdraw';
  const [success, setSuccess] = useState(false);
  const [serverMessage, setServerMessage] = useState('');

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
        tokenId: '',
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
        tokenId: Yup.number().required('Required'),
      })}
      onSubmit={(values, { setSubmitting }) => {
        values.walletAddress = props.additionalData.currentAccount;

        const myInit = {
          body: {
            dateOfBirth: `${values.year}-${values.month}-${values.day}`,
            walletAddress: values.walletAddress,
            ...values,
          },
        };

        API.put(apiName, path, myInit)
          .then((response) => {
            console.log(response.status_code);
            console.log(response.message);
            setSuccess(true);
            setSubmitting(false);
          })
          .catch((error) => {
            console.log(error);
            setServerMessage(error.message);
            setSubmitting(false);
          });
        // const createDateOfBirth = (values) => {
        //   const dateOfBirth = `${values.year}-${values.month}-${values.day}`;
        //   return dateOfBirth;
        // };

        // const myInit = {
        //   body: {
        //     ...values,
        //     dateOfBirth: createDateOfBirth(values),
        //     walletAddress: values.walletAddress,
        //   },
        // };

        // API.put(apiName, path, myInit)
        //   .then((response) => {
        //     console.log(response);
        //     setSubmitting(false);
        //   })
        //   .catch((error) => {
        //     console.log(error.response);
        //     setSubmitting(false);
        //   });

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
            name="tokenId"
            type="number"
            placeholder="NFT Token ID"
            className={`${styles.form__field} u__w100`}
          />
          {/* <ErrorMessage name="tokenId" /> */}

          <div>&nbsp;</div>
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

export default WithdrawForm;
