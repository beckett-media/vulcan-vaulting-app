import * as React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { NextPage } from 'next';
import { AppProps } from 'next/app';
import Moralis from 'moralis';
import { Authenticator, Heading, View, Text } from '@aws-amplify/ui-react';
import Amplify from 'aws-amplify';
import { providers } from 'ethers';

import '../src/index.scss';
import './auth.css';
import '@aws-amplify/ui-react/styles.css';

import awsconfig from '../src/aws-exports';
import { Meta } from '../src/components/Meta';
import { ConnectionStatusProvider } from '../src/hooks/useConnectionStatusContext';
import { ModalContextProvider } from '../src/hooks/useModal';
import { Web3ContextProvider } from '../src/libs/web3-data-provider/Web3Provider';
import { Web3ReactProvider } from '@web3-react/core';
import { WalletModalContextProvider } from '../src/hooks/useWalletModal';
Amplify.configure({ ...awsconfig, ssr: true });


type NextPageWithLayout = NextPage & {
  getLayout?: (page: React.ReactElement) => React.ReactNode;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getWeb3Library(provider: any): providers.Web3Provider {
  const library = new providers.Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}

interface MyAppProps extends AppProps {
  Component: NextPageWithLayout;
}

// Client-side cache, shared for the whole session of the user in the browser.

function MyApp(props: MyAppProps) {
  const { Component, pageProps } = props;
  const getLayout = Component.getLayout ?? ((page: React.ReactNode) => page);

  React.useEffect(() => {
    setTimeout(() => {
      Moralis.start({
        serverUrl: process.env.NEXT_PUBLIC_MORALIS_SERVER_URL || 'https://9zo3rpz4iymh.usemoralis.com:2053/server',
        appId: process.env.NEXT_PUBLIC_MORALIS_APP_ID || 'Ftx6YJO9aP4EmAq8wN7pAxHeQKKLvVv909gQq0OK',
      });
    }, 100);
  }, []);

  return (
    <div>
      <Authenticator hideSignUp={true} components={components} formFields={formFields}>
        {({ signOut, user }) => (
          <>
            <Head>
              <meta name="viewport" content="initial-scale=1, width=device-width" />
            </Head>
            <Meta
              title={'Beckett Vaulting'}
              description={'Forms for Beckett Vaulting processes'}
              imageUrl={'https://someicon.png'} // NOTE: Will update with ghost after release
            />
            <Web3ReactProvider getLibrary={getWeb3Library}>
              <Web3ContextProvider>
                <ConnectionStatusProvider>
                  <WalletModalContextProvider>
                    <ModalContextProvider>
                      {getLayout(<Component {...pageProps} />)}
                    </ModalContextProvider>
                  </WalletModalContextProvider>
                </ConnectionStatusProvider>
              </Web3ContextProvider>
            </Web3ReactProvider>
          </>
        )}
      </Authenticator>
    </div>
  );
}

const components = {
  Header() {
    return (
      <View textAlign="center" style={{ marginBotton: 20 }}>
        <Image
          alt="Beckett media logo"
          src={require('../public/Beckett-Logo-Full-Wordmark-0K.png')}
        />
      </View>
    );
  },

  Footer() {
    return (
      <View textAlign="center" marginTop="20px">
        <Text color="white" fontSize={'13px'}>
          &copy; 2022 Beckett Media All Rights Reserved
        </Text>
      </View>
    );
  },

  SignIn: {
    Header() {
      return (
        <Heading style={{ marginTop: 30 }} textAlign={'center'} level={4}>
          Sign in to your account
        </Heading>
      );
    },
  },
};

const formFields = {
  signIn: {
    username: {
      labelHidden: false,
      placeholder: 'Username',
      isRequired: true,
      label: 'Username:',
    },
    password: {
      labelHidden: false,
      placeholder: 'Password',
      isRequired: true,
      label: 'Password:',
    },
  },
};

export default MyApp;
