import React from 'react'
import { useState } from 'react';
import "../AccountInfoTab/accountInfoTab.css";

// import { LoginContext } from '../../App';

import profileIcon from "../../images/profileIcon.svg"
export default function AccountInfoTab({loggedIn}) {
    // const [loggedInContext, setLoggedInContext] = useContext(LoginContext);
    const [toggler, setToggler] = useState(false);

    function toggleAccountInfo(e) {
        e.preventDefault();
        if (toggler) {
            setToggler(false);
        } else {
            setToggler(true)
        }
    };

    function parseUrl(url) {
        return url.split('//')[1];
    };

    // const identityImg = async () => {
    //     const rawUrl = await parseUrl(loggedIn.userIdentityNft.image)
    //     const image = await fetch(`https://ipfs.io/ipfs/${rawUrl}`)
    //     return image
    // }

  return (
    <div id='accountInfoDiv'>
        {/* <button onClick={toggleAccountInfo}></button> */}
        <img id="accountInfoImg" src={profileIcon} onClick={toggleAccountInfo} />
        { toggler ?
            <div id="accountInfoData">
                <p>Welcome, {loggedIn.userIdentityNft.name}</p>
                <img src={ `https://ipfs.io/ipfs/${parseUrl(loggedIn.userIdentityNft.image)}`} />
                <p>Logged in: <br></br>{loggedIn.loggedIn ? "True" : "False"}</p>
                <p id="wallet">Wallet: <br /><em>{loggedIn.wallet}</em></p>
                <p>Identity NFT: {loggedIn.userIdentityNft === null ? "False" : "True"}</p>
            </div>
            :
            null
        }
    </div>
  )
}
