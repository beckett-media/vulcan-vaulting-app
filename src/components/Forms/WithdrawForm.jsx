import { API } from 'aws-amplify';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import Lottie from 'lottie-react';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import * as Yup from 'yup';
import loadingSpinner from '../../../public/loading-lottie.json';
import { getExpectedChainId } from '../../../src/utils/networksConfig';
import { useWeb3Context } from '../../libs/hooks/useWeb3Context';
import { getEIP712ForwarderSignature } from '../../utils/utils';
import styles from './forms.module.scss';

const WithdrawForm = (props) => {
  const [success, setSuccess] = useState(false);
  const [serverMessage, setServerMessage] = useState('');
  const [isLoading, setIsLoading] = useState('');
  const [isSigning, setIsSigning] = useState(false);

  const { isExpectedChain, switchNetwork, connected, currentAccount, chainId, signTxData } =
    useWeb3Context();

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

  const handleSwitchClick = async () => {
    console.log('success');

    if (isExpectedChain) {
      return;
    }

    await switchNetwork(getExpectedChainId());
  };

  const getUserSignature = async (tokenId, hash) => {
    let signature;
    let message = {};

    try {
      setIsSigning(true);
      // 1 hour deadline
      const data = await getEIP712ForwarderSignature(
        Number(tokenId),
        currentAccount,
        chainId,
        hash
      );

      message = data.message;
      signature = await signTxData(JSON.stringify(data));

    } catch (e) {
      console.log('error', e);
    } finally {
      setIsSigning(false);
    }

    return {
      signature,
      message
    };
  };

  console.log({ isSigning });

  return (
    <div className="u__relative">
      {!currentAccount && (
        <div className={styles.disabled}>Please connect your wallet to continue.</div>
      )}
      {isSigning && (
        <div className={styles.disabled}>Please complete transaction in signature dialog.</div>
      )}
      {currentAccount && !isExpectedChain && (
        <div className={styles.disabled}>
          <span className="mb__16">Please switch wallet to Polygon Mainnet to continue</span>
          <br></br>
          <div
            className="btn gradient__green"
            style={{ color: 'black' }}
            onClick={() => handleSwitchClick()}
          >
            Connect to Polygon
          </div>
        </div>
      )}
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
          tokenID: '',
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
          zip: Yup.string().required('Required'),
          tokenID: Yup.number().required('Required'),
        })}
        onSubmit={(values, { setSubmitting }) => {
          values.walletAddress = props.additionalData.currentAccount;
          setIsLoading(true);

          const myInit = {
            body: {
              dateOfBirth: `${values.year}-${values.month}-${values.day}`,
              walletAddress: values.walletAddress,
              ...values,
            },
          };

          API.put(apiName, path, myInit)
            .then(async (response) => {
              setSuccess(true);
              setServerMessage(response.message);

              const { signature, message } = await getUserSignature(
                values.tokenID,
                response.user_info_hash
              );
              const vaulted_item_unique_id = response.vaulted_item_unique_id;

              console.log('vaulted_item_uniques_id', vaulted_item_unique_id);
              console.log(response);
              console.log('walletaddress:', walletAddress);
              console.log({ signature });

              const executeData = {
                body: {
                  from: message.from,
                  to: message.to,
                  value: message.value,
                  nonce: message.nonce,
                  gas: message.gas,
                  data: message.data,
                  signature: signature, 
                  token_id: values.tokenID, 
                  vaulted_item_unique_id: vaulted_item_unique_id, 
                },
              };

              await API.post(apiName, '/withdrawexecute', executeData)
                .then((response) => {
                  console.log(response);
                })
                .catch((error) => {
                  console.log(error);
                });

              if (signature) {
                router.push('/success');
              }

              setIsLoading(false);
              setSubmitting(false);
            })
            .catch((error) => {
              console.log(error);
              setServerMessage(error.message);
              setSubmitting(false);
              setIsLoading(false);
            });
        }}
      >
        <Form className={`${styles.form} u__left`}>
          <div className={`${styles.form__row}`}>
            <div className="u__relative">
              <Field
                name="firstName"
                type="text"
                placeholder="First Name*"
                className={`${styles.form__field}`}
              />
              <ErrorMessage name="firstName" component="div" className={styles.error} />
            </div>

            <div className="u__relative">
              <Field
                name="lastName"
                type="text"
                placeholder="Last Name*"
                className={`${styles.form__field}`}
              />
              <ErrorMessage name="lastName" component="div" className={styles.error} />
            </div>

            <div className="u__relative">
              <Field
                name="email"
                type="email"
                placeholder="Email Address*"
                className={`${styles.form__field}`}
              />
              <ErrorMessage name="email" component="div" className={styles.error} />
            </div>
          </div>

          <div className={`${styles.form__row}`}>
            <div className={`${styles.form__col}`}>
              <label htmlFor="month" className="mb16 u__block">
                Birthday*
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
                  <ErrorMessage name="month" component="div" className={styles.error} />
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
                  <ErrorMessage name="day" component="div" className={styles.error} />
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
                  <ErrorMessage name="year" component="div" className={styles.error} />
                </div>
              </div>
            </div>
          </div>

          <div className={`${styles.form__row}`}>
            <div className="u__relative">
              <Field
                name="address1"
                type="text"
                placeholder="Address 1*"
                className={`${styles.form__field}`}
              />
              <ErrorMessage name="address1" component="div" className={styles.error} />
            </div>

            <div className="u__relative">
              <Field
                name="address2"
                type="text"
                placeholder="Address 2"
                className={`${styles.form__field}`}
              />
              <ErrorMessage name="address2" component="div" className={styles.error} />
            </div>

            <div className="u__relative">
              <Field
                name="city"
                type="text"
                placeholder="City*"
                className={`${styles.form__field}`}
              />
              <ErrorMessage name="city" component="div" className={styles.error} />
            </div>

            <div className={`${styles['form__state-zip']}`}>
              <div className={`${styles['form__select-wrapper']} u__flex flex__aic`}>
                <div className={`${styles['form__select-arrow']}`}></div>
                <Field
                  name="state"
                  as="select"
                  className={`${styles.form__select} ${styles.form__field}`}
                >
                  <option value="state">State*</option>
                  {statesArray.map((i) => {
                    return <option value={`${i}`}>{i}</option>;
                  })}
                </Field>
                <ErrorMessage name="state" component="div" className={styles.error} />
              </div>

              <div className="u__relative">
                <Field
                  name="zip"
                  type="text"
                  placeholder="Zip*"
                  className={`${styles.form__field}`}
                />
                <ErrorMessage name="zip" component="div" className={styles.error} />
              </div>
            </div>
          </div>

          <div className={`${styles.form__row}`}>
            <div className="u__relative">
              <Field
                name="tokenID"
                type="text"
                placeholder="NFT Token ID*"
                className={`${styles.form__field} u__w100`}
              />
              <ErrorMessage name="tokenID" component="div" className={styles.error} />
            </div>
          </div>
          <div className="u__w100 u__center">
            <button type="submit" className="btn gradient__green">
              {isLoading && (
                <Lottie animationData={loadingSpinner} loop={true} className="btn__loading" />
              )}
              {!isLoading && 'Next'}
            </button>
          </div>
        </Form>
      </Formik>
    </div>
  );
};

export default WithdrawForm;
