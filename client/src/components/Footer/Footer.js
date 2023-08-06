import React, { useContext, useRef, useState, useEffect } from 'react';
import '../Footer/footer.css';
import { AccountContext } from '../../App';


export default function Footer({ socket }) {
  const [accountObject, setAccountObject] = useContext(AccountContext);
  const [isShown, setIsShown] = useState(false);
  const [usersList, updateUsersList] = useState([]);

  const loggedInUsersList = useRef([]); // Ref to track the updating users list across renders

  const handleClick = () => {
    setIsShown(current => !current);
  };

  useEffect(() => {
    const handleLoggedInUsersList = (arg1) => {
      const receivedLoggedInUsersList = arg1;
      console.log("loggedInUsersList received in Footer component from server emit: ", receivedLoggedInUsersList);

      loggedInUsersList.current = receivedLoggedInUsersList;

      updateUsersList(loggedInUsersList.current);
    };

    socket.on('currentLoggedInUsersList', handleLoggedInUsersList);

    // Clean up the event listener when the component unmounts
    return () => {
      socket.off('currentLoggedInUsersList', handleLoggedInUsersList);
    };
  }, [socket]);

  function parseUrl(url) {
    return url.split('//')[1];
  };

  function findProfessionAttributeValue(data) {
    const professionObject = data.find(item => item.trait_type === "profession");
    return professionObject.value
  }

  function accountGrade(balance) {
    const balanceNum = Number(balance);

    if (balanceNum > 1500) {
      return "border-orange";
    } else if (balanceNum > 1000) {
      return "border-purple";
    } else if (balanceNum > 500) {
      return "border-blue";
    } else if (balanceNum > 20) {
      return "border-green";
    } else {
      return "border-white";
    }
  }

  console.log(accountGrade(400))

  // async function xrpScanWalletLookupForXrpBalance(wallet) {
  //   const accountInfo = await fetch(`https://api.xrpscan.com/api/v1/account/${wallet}`);
  //     const jsonInfo = await accountInfo.json();
  //     return jsonInfo.xrpBalance
  // }

  // if(!accountObject.loggedIn) {
  //   socket.emit('signOut', socket.id)
  // }

  return (
    <button id='footerDiv' onClick={handleClick}>
      <em id='publisherName'>Online Users</em>
      <em style={{ color: "white", fontSize: "12px", marginTop: "0px" }}>{isShown ? "(click to minimize)" : "(click to enlarge)"}</em>
      <div id='footerSocials' style={{ display: isShown ? 'flex' : 'none' }}>
        <ul>
          {
            loggedInUsersList.current.map((user) =>
              <li key={user.socket}>
                <div>
                  {/* <em>socket: {user.socket}</em>
                  <em>Wallet: {user.wallet}</em> */}
                  <div className={`footerProfileCard ${accountGrade(user.xrpBalance)}`}>
                    <img src={
                      user.identityNft && user.identityNft.image
                        ? `https://ipfs.io/ipfs/${parseUrl(user.identityNft.image)}`
                        : "https://t4.ftcdn.net/jpg/04/70/29/97/360_F_470299797_UD0eoVMMSUbHCcNJCdv2t8B2g1GVqYgs.jpg"
                    } />                    <div>
                      <p>{user.identityNft && user.identityNft.name ? user.identityNft.name : "No Identity NFT"}</p>
                      <p>{user.identityNft && user.identityNft.attributes ? findProfessionAttributeValue(user.identityNft.attributes) : "No Identity NFT"}</p>
                      {/* <p>{xrpScanWalletLookupForXrpBalance(user.wallet)}</p> */}
                    </div>
                  </div>
                </div>
              </li>
            )
          }
        </ul>

      </div>

    </button>
  )
}
