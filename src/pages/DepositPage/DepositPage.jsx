import Web3 from 'web3';
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';

import DepositForm from '../../components/Forms/DepositForm';
import Tooltip from '../../components/Tooltip/Tooltip';
import gsap from 'gsap';

import { useRef, useState, useEffect } from 'react';
import { ReactComponent as Logo } from '../../static/logo.svg';

import './deposit-page.scss';

const DepositPage = () => {
  const INITIAL_STATE = {
    walletAddress: '',
    status: '',
    web3: null,
    provider: null,
    connected: false,
    chainId: 1,
    networkId: 1,
  };

  const [walletAddress, setWallet] = useState(INITIAL_STATE.walletAddress);
  const [status, setStatus] = useState(INITIAL_STATE.status);
  const [web3, setWeb3] = useState(INITIAL_STATE.web3);
  const [provider, setProvider] = useState(INITIAL_STATE.provider);
  const [connected, setConnected] = useState(INITIAL_STATE.connected);
  const [chainId, setChainId] = useState(INITIAL_STATE.chainId);
  const [networkId, setNetworkId] = useState(INITIAL_STATE.networkId);

  const infuraId = 'process.env.REACT_APP_INFURA_ID';
  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        infuraId,
      },
    },
  };

  // configure the web3modal
  const web3Modal = new Web3Modal({
    cacheProvider: false,
    disableInjectedProvider: false,
    providerOptions,
  });

  const el = useRef();
  const q = gsap.utils.selector(el);

  const fadeIn = (selector) => {
    const t1 = gsap.timeline();
    t1.to(q(`${selector}`), { display: 'flex', opacity: 1 }).to(q(`${selector}`), {
      opacity: 0,
      display: 'none',
      delay: 4,
    });

    return () => {
      t1.kill();
    };
  };

  const onConnect = async () => {
    if (connected) return;

    const provider = await web3Modal.connect();

    await subscribeProvider(provider);

    const web3 = new Web3(provider);

    // await provider.enable();

    const accounts = await web3.eth.getAccounts();

    const address = accounts[0];

    const networkId = await web3.eth.net.getId();

    const chainId = await web3.eth.getChainId();

    // update state
    setConnected(true);
    setWeb3(web3);
    setWallet(address);
  };

  const resetApp = async () => {
    if (web3 && web3.currentProvider && web3.currentProvider.close) {
      await web3.currentProvider.close();
    }
    await web3Modal.clearCachedProvider();

    setWallet(INITIAL_STATE.walletAddress);
    setStatus(INITIAL_STATE.status);
    setWeb3(INITIAL_STATE.web3);
    setProvider(INITIAL_STATE.provider);
    setConnected(INITIAL_STATE.connected);
    setChainId(INITIAL_STATE.chainId);
    setNetworkId(INITIAL_STATE.networkId);
  };

  const subscribeProvider = async (provider) => {
    if (!provider.on) {
      return;
    }
    provider.on('close', () => resetApp());
    provider.on('accountsChanged', async (accounts) => {
      setWallet(accounts[0]);
    });
    provider.on('chainChanged', async (chainId) => {
      const networkId = await web3.eth.net.getId();
      setChainId(chainId);
      setNetworkId(networkId);
    });
    provider.on('networkChanged', async (networkId) => {
      const chainId = await web3.eth.getChainId();
      setChainId(chainId);
      setNetworkId(networkId);
    });
  };

  useEffect(() => {}, []);

  const onMintPressed = async () => {
    //TODO: implement
  };

  const data = {
    walletAddress,
  };

  return (
    <div className="deposit u__center" ref={el}>
      <div className="deposit__hero u__center">
        <Logo className="deposit__logo" />
        <h2 className=" heading heading__secondary deposit__heading">Item Deposit</h2>

        <img className="deposit__hero-image" alt=""></img>
        <div className="deposit__hero-content u__center">
          <p>Tell us about yourself and the collectible you would like to vault.</p>
          <p>
            A personal concierge will reach out to walk you through the vaulting and NFT-minting of
            your collectible.
          </p>
        </div>
        <div className="deposit__wallet-buttons u__relative flex__aic">
          <Tooltip
            className="deposit__tooltip--left"
            message={'Please fill out the form below and your concierge will help you create one.'}
            direction={'right'}
          />
          <div className="btn__outline--outer gradient__orange">
            {walletAddress ? (
              <button className="btn btn__outline--inner deposit__btn" onClick={resetApp}>
                Disconnect Wallet
              </button>
            ) : (
              <button
                className="btn btn__outline--inner deposit__btn"
                onClick={() => fadeIn('.deposit__tooltip--left')}
              >
                I don't have a wallet
              </button>
            )}
          </div>

          <div className="btn__outline--outer gradient__green">
            <button
              className="btn btn__outline--inner deposit__btn u__flex flex__jcsa flex__aic"
              id="walletButton"
              onClick={onConnect}
            >
              {walletAddress.length > 0 ? (
                <>
                  <span>
                    {String(walletAddress).substring(0, 6) +
                      '...' +
                      String(walletAddress).substring(38)}
                  </span>
                  <div className={`status-dot ${walletAddress ? 'bg__green' : 'bg__grey'}`}></div>
                </>
              ) : (
                <>
                  <div>Connect Wallet</div>{' '}
                  <div className={`status-dot ${walletAddress ? 'bg__green' : 'bg__grey'}`}></div>
                </>
              )}
            </button>
          </div>
          <Tooltip className="deposit__tooltip--right" message={status} direction={'left'} />
        </div>
      </div>
      <div className="deposit__form u__flex flex__jcc">
        <DepositForm additionalData={data} />
      </div>
    </div>
  );
};

export default DepositPage;
