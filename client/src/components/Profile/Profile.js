import React, {useContext, useEffect} from 'react'
import '../Profile/profile.css'

import { LoginContext } from '../../App';

export default function Profile() {
    const [loggedIn, setLoggedIn] = useContext(LoginContext);

    function parseUrl(url) {
      return url.split('//')[1];
    };

    const imageIpfsUrl = parseUrl(loggedIn.nftMetaData.image);
    // const imageData = await fetch(`https://ipfs.io/ipfs/${imageIpfsUrl}`);
    // console.log(imageData)
    
    // useEffect(async () => {
    //   const imageIpfsUrl = await parseUrl(loggedIn.nftMetaData.image);
    //   const imageData = await fetch(`https://ipfs.io/ipfs/${imageIpfsUrl}`);
    // }, []);
    
  return (
    <div className='profileMain'>
      <div className='profileHead'>
        <h1>Profile Page</h1>
      </div>
      <div id='profileInfo'>
        <p id='loggedInLoggedIn'>Online: <br /><em>{loggedIn.loggedIn ? "True": "False"}</em></p>
        <p id='loggedInRAddress'>Account: <br /><em>{loggedIn.rAddress}</em></p>
        <p id='loggedInXummToken'>User Token: <br /><em>{loggedIn.xummToken}</em></p>
      </div>
      <div className='profileBody'>
        <div id='profileCard'>
          <img src={`https://ipfs.io/ipfs/${imageIpfsUrl}`} alt={imageIpfsUrl} id='characterImage' />
          <div id='profileStats'>
            <h4>Username: <em>{loggedIn.nftMetaData.name}</em></h4>
            <p>class: {loggedIn.nftMetaData.attributes[0].value}</p>
            <p>Title: {loggedIn.nftMetaData.attributes[0].description}</p>
          </div>
        </div>
        <div id='profileBodyMain'>

        </div>
      </div>
    </div>
  )
}
