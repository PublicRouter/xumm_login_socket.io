import React, { useContext } from 'react'
import { useState } from 'react';
import "../AccountInfoTab/accountInfoTab.css";

import { AccountContext } from '../../App';

import profileIcon from "../../images/profileIcon.svg"
import { useNavigate } from 'react-router-dom';

export default function AccountInfoTab({socket}) {
    const navigate = useNavigate();

    const [accountObject, setAccountObject] = useContext(AccountContext);
    const [toggler, setToggler] = useState(false);

    function toggleAccountInfo(e) {
        e.preventDefault();
        if (toggler) {
            setToggler(false);
        } else {
            setToggler(true);
        };
    };

    function parseUrl(url) {
        return url.split('//')[1];
    };

    function logoutAccount() {
        socket.emit('signOut',  async (callback) => {
            const signOutResponse = await callback;
            console.log(signOutResponse)
        });
        setAccountObject({ loggedIn: false });
        window.sessionStorage.clear();
        navigate("/");
    };

    // const identityImg = async () => {
    //     const rawUrl = await parseUrl(accountObject.userIdentityNft.image)
    //     const image = await fetch(`https://ipfs.io/ipfs/${rawUrl}`)
    //     return image
    // }

  return (
    <div id='accountInfoDiv'>
        {/* <button onClick={toggleAccountInfo}></button> */}
        <img id="accountInfoImg" src={profileIcon} onClick={toggleAccountInfo} />
        { toggler ?
            <div id="accountInfoData">
                <p>Welcome, <em>{accountObject.userIdentityNft? accountObject.userIdentityNft.name : 'No user identity name to access.'}</em></p>
                <img src={accountObject.userIdentityNft? `https://ipfs.io/ipfs/${parseUrl(accountObject.userIdentityNft.image)}` : null} />
                <p>Logged in: <br></br><em>{accountObject.loggedIn ? "True" : "False"}</em></p>
                <p id="wallet">Wallet: <br /><em>{accountObject.wallet}</em></p>
                <p>Identity NFT: <em>{accountObject.userIdentityNft === null ? "False" : "True"}</em></p>
                <button onClick={logoutAccount}>Log Out</button>
            </div>
            :
            null
        }
    </div>
  )
}
