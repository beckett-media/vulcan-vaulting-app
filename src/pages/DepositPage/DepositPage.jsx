import { useRef, useState, useEffect } from "react";
import "./deposit-page.scss";
import DepositForm from "../../components/Forms/DepositForm";
import { connectWallet, getCurrentWalletConnected } from "../../utils/interact";
import { ReactComponent as Logo } from "../../static/logo.svg";
import gsap from "gsap";
import Tooltip from "../../components/Tooltip/Tooltip";

const DepositPage = () => {
  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");

  const el = useRef();
  const q = gsap.utils.selector(el);

  console.log(status);

  const addWalletListener = async () => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {});
    } else {
      setStatus(
        "🦊 You must install Metamask, a virtual Ethereum wallet, in your browser."
      );
    }
  };

  useEffect(() => {
    async function fetchData() {
      const getWallet = await getCurrentWalletConnected();
      setWallet(getWallet.address);
    }
    fetchData();
    addWalletListener();
  }, []);

  const connectWalletPressed = async () => {
    const walletResponse = await connectWallet();
    setWallet(walletResponse.address);

    if (status.length !== 0) {
      gsap
        .timeline()
        .to(q(".deposit__tooltip--right"), { display: "flex", opacity: 1 })
        .to(q(".deposit__tooltip--right"), {
          opacity: 0,
          display: "none",
          delay: 4,
        });
    }
  };

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
        <h2 className=" heading heading__secondary deposit__heading">
          Item Deposit
        </h2>

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
        <div className="deposit__wallet-buttons u__relative flex__aic">
          <div className="btn__outline--outer gradient__orange">
            {walletAddress ? (
              <button
                className="btn btn__outline--inner deposit__btn"
                onClick={() => {
                  setWallet("");
                }}
              >
                Disconnect Wallet
              </button>
            ) : (
              <button className="btn btn__outline--inner deposit__btn">
                I don't have a wallet
              </button>
            )}
            <Tooltip className="deposit__tooltip--left" message={status} />
          </div>

          <div className="btn__outline--outer gradient__green">
            <button
              className="btn btn__outline--inner deposit__btn u__flex flex__jcsa flex__aic"
              id="walletButton"
              onClick={connectWalletPressed}
            >
              {walletAddress.length > 0 ? (
                <>
                  <span>
                    {String(walletAddress).substring(0, 6) +
                      "..." +
                      String(walletAddress).substring(38)}
                  </span>
                  <div
                    className={`status-dot ${
                      walletAddress ? "bg__green" : "bg__grey"
                    }`}
                  ></div>
                </>
              ) : (
                <>
                  <div>Connect Wallet</div>{" "}
                  <div
                    className={`status-dot ${
                      walletAddress ? "bg__green" : "bg__grey"
                    }`}
                  ></div>
                </>
              )}
            </button>
          </div>
          <Tooltip className="deposit__tooltip--right" message={status} />
        </div>
      </div>
      <div className="deposit__form u__flex flex__jcc">
        <DepositForm additionalData={data} />
      </div>
    </div>
  );
};

export default DepositPage;
