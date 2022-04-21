import '../src/index.scss';

import { NextPage } from 'next';
import { AppProps } from 'next/app';
import Head from 'next/head';
import * as React from 'react';

import { Meta } from '../src/components/Meta';
import { ConnectionStatusProvider } from '../src/hooks/useConnectionStatusContext';
import { ModalContextProvider } from '../src/hooks/useModal';
import { Web3ContextProvider } from '../src/libs/web3-data-provider/Web3Provider';
import { Web3ReactProvider } from '@web3-react/core';
import { providers } from 'ethers';
import { WalletModalContextProvider } from '../src/hooks/useWalletModal';

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

export default function MyApp(props: MyAppProps) {
  const { Component, pageProps } = props;
  const getLayout = Component.getLayout ?? ((page: React.ReactNode) => page);
  return (
    <div>
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
              <ModalContextProvider>{getLayout(<Component {...pageProps} />)}</ModalContextProvider>
            </WalletModalContextProvider>
          </ConnectionStatusProvider>
        </Web3ContextProvider>
      </Web3ReactProvider>
    </div>
  );
}
