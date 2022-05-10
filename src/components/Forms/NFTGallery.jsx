import Lottie from 'lottie-react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import loadingSpinner from '../../../public/loading-lottie.json';
import { getExpectedChainId } from '../../../src/utils/networksConfig';
import { useWeb3Context } from '../../libs/hooks/useWeb3Context';
import { getTokenURI } from '../../utils/utils';
import styles from './forms.module.scss';

const NFTGallery = (props) => {
  const [success, setSuccess] = useState(false);
  const [serverMessage, setServerMessage] = useState('');
  const [isLoading, setIsLoading] = useState('');
  const [isSigning, setIsSigning] = useState(false);
  const [isSignatureValid, setIsSignatureValid] = useState(null);
  const [tokenInfos, setTokenInfos] = useState([]);

  const {
    isExpectedChain,
    switchNetwork,
    connected,
    currentAccount,
    chainId,
    signTxData,
    ownedTokenIds,
  } = useWeb3Context();

  const router = useRouter();

  const handleSwitchClick = async () => {
    console.log('success');

    if (isExpectedChain) {
      return;
    }

    await switchNetwork(getExpectedChainId());
  };

  React.useEffect(() => {
    (async () => {
      const info = [];
      for await (const tokenId of ownedTokenIds) {
        const tokenUri = await getTokenURI(tokenId, chainId);
        
        // Moralis.Web3API.token.getTokenIdMetadata({
        //   chainId,
        //   address: getNetworkConfig(chainId).vaultAddress,
        //   token_id: tokenId
        // }).then(response => {
        //   console.log('tokenId metadata', tokenId, response);
        // }).catch(err => console.log('metadata error', err));
        console.log('tokenURI', tokenId, tokenUri);

        if (tokenUri && tokenUri.startsWith('ipfs://')) {
          const ipfsUrl = tokenUri.replace('ipfs://', 'https://ipfs.io/ipfs/');

          const response = await fetch(ipfsUrl);
          if (response.ok) {
            const json = await response.json();

            info.push({
              ...json,
              tokenId,
              image: json.image.replace('ipfs://', 'https://ipfs.io/ipfs/'),
            })
          }
        }
      }

      setTokenInfos(info);
      console.log('infpo', info);
    })();
  }, [ownedTokenIds, chainId]);

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
      <div className={`${styles.form__row}`}>
        {tokenInfos.map((info) => (
          <div key={info.tokenId} className="u__relative">
            <h4 style={{textAlign: 'center'}}>{info.name}</h4>
            <Image src={info.image} width={300} height={300} />
          </div>
        ))}
      </div>

      <div className="u__w100 u__center">
        <button type="submit" className="btn gradient__green">
          {isLoading && (
            <Lottie animationData={loadingSpinner} loop={true} className="btn__loading" />
          )}
          {!isLoading && 'Next'}
        </button>
        <div className={`${styles['deposit__hero-content']} u__center`}>
          <h3 className={`heading ${styles.deposit__heading}`}>
            {isSignatureValid && 'There was an error processing your request.'}
          </h3>
          {isSignatureValid && (
            <p>
              Error: {isSignatureValid} <br />
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default NFTGallery;
