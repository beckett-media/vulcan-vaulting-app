import { useRef, useState, useEffect } from "react";
import "./deposit-page.scss";
import DepositForm from "../../components/DepositForm/DepositForm";
import { connectWallet, getCurrentWalletConnected } from "../../utils/interact";
import { ReactComponent as Logo } from "../../static/logo.svg";

const DepositPage = () => {
  const firstNameRef = useRef("");
  const lastNameRef = useRef("");
  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");

  const formSubmissionHandler = (e) => {
    e.preventDefault();
    console.log(firstNameRef.current.value);
    console.log(lastNameRef.current.value);
  };

  const addWalletListener = async () => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWallet(accounts[0]);
          setStatus("Write a message in the text-field above.");
        } else {
          setWallet("");
          setStatus("Connect to Metamask using the top-right button.");
        }
      });
    } else {
      setStatus(
        <p>
          <a
            target="_blank"
            rel="noreferrer"
            href={`https://metamask.io/download.html`}
          >
            You must install Metamask, a virtual Ethereum wallet, in your
            browser.
          </a>
        </p>
      );
    }
  };

  useEffect(() => {
    async function fetchData() {
      const getWallet = await getCurrentWalletConnected();
      setStatus(getWallet.status);
      setWallet(getWallet.address);
    }
    fetchData();
    addWalletListener();
  }, []);

  const connectWalletPressed = async () => {
    console.log("test");
    const walletResponse = await connectWallet();
    setStatus(walletResponse.status);
    setWallet(walletResponse.address);
  };

  const onMintPressed = async () => {
    //TODO: implement
  };

  return (
    <div className="deposit u__center">
      <div className="deposit__hero u__center">
        <Logo />
        <h2 className="heading-secondary">Item Deposit</h2>
        <img className="deposit__hero-image" alt=""></img>
        <div className="deposit__hero-content u__center">
          <p>
            Tell us about yourself and the collectible you would like to vault.
          </p>
          <p>
            A personal concierge will reach out to walk you through the vaulting
            and NFT-minting of your collectible.
          </p>
        </div>
        <div className="deposit__wallet-buttons">
          <button className="btn btn__outline--green deposit__btn">
            I don't have a wallet
          </button>
          <button
            className="btn btn__outline--orange deposit__btn"
            id="walletButton"
            onClick={connectWalletPressed}
          >
            {walletAddress.length > 0 ? (
              "Connected: " +
              String(walletAddress).substring(0, 6) +
              "..." +
              String(walletAddress).substring(38)
            ) : (
              <span>Connect Wallet</span>
            )}
          </button>
        </div>
      </div>
      <DepositForm additionalData={walletAddress} />
    </div>
  );
};

export default DepositPage;
