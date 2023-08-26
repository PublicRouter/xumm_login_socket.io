import React, { useState } from 'react'
import "../Home/home.css";
import { Link } from 'react-router-dom'

// import TestForm from '../TestForm/TestForm';

import moneyTransferSvg from "../../images/moneyTransfer.svg";
import collabSvg from "../../images/collabSvg.svg"
import CollapsibleTree from '../CollapsibleTree/CollapsibleTree';
import oybg from "../../images/oybg.png"
// const testData = {
//   NFTokenMint: [
//     {
//       Account: 'rBXukLuM52hNabfx8Me2e5hVivAEQeRTJK',
//       Fee: '10',
//       Flags: 2,
//       LastLedgerSequence: 77083302,
//       Memos: [Array],
//       NFTokenTaxon: 0,
//       Sequence: 76684342,
//       SigningPubKey: '03E151CD9F6D090A28812D78F048810902C15A470F861A56FA239F082AB1C55090',
//       TransactionType: 'NFTokenMint',
//       TransferFee: 0,
//       TxnSignature: '3044022011DAF7B611E54B75BF9705FE19951C0A92C04C9CE83A695B6F9F797E50279EF402204EAFC059AEFDE44182A482BE145D21DA7240AAF9D50C3A9150C84F84497C1611',
//       URI: '697066733A2F2F626166797265696269796C3433346D3277343566376A376A3679696E34376679326A6567667834333462763469707736367971716D7A63347534652F6D657461646174612E6A736F6E',
//       hash: 'CE1DF01F1129555F6E58EFC5AC9D8CD675419463F3CF2301AE5F9149952A8290',
//       ledger_index: 77083294,
//       date: 726907412
//     },
//     {
//       Account: 'rBXukLuM52hNabfx8Me2e5hVivAEQeRTJK',
//       Fee: '10',
//       Flags: 2,
//       LastLedgerSequence: 76704950,
//       Memos: [Array],
//       NFTokenTaxon: 0,
//       Sequence: 76684340,
//       SigningPubKey: '03E151CD9F6D090A28812D78F048810902C15A470F861A56FA239F082AB1C55090',
//       TransactionType: 'NFTokenMint',
//       TransferFee: 0,
//       TxnSignature: '30440220688644D0426FA8B030EA4EB2EE6EDF5E1F18BDB4FA9C5BE95083B4F800463C5B02205902C1AFA66C539AC30482C250A8A3FE6116C4920DB6E218193DC3D2F560FBFE',
//       URI: '68747470733A2F2F697066732E696F2F697066732F6261667972656963327078636978366B6D6C61636D32746F653373677972617675766C666E6134646A616B6A69696D6B356C35676436703777796D2F6D657461646174612E6A736F6E',
//       hash: '208FCD3D9914500985FACB42C029DACC80236881CB095C8CA83BF21B0532E557',
//       ledger_index: 76704942,
//       date: 725432112
//     }
//   ],
//   NFTokenBurn: [
//     {
//       Account: 'rBXukLuM52hNabfx8Me2e5hVivAEQeRTJK',
//       Fee: '10',
//       LastLedgerSequence: 76926543,
//       NFTokenID: '000200007389C4962D043F400084A68058A57751CB62BA730000099B00000000',
//       Sequence: 76684341,
//       SigningPubKey: '03E151CD9F6D090A28812D78F048810902C15A470F861A56FA239F082AB1C55090',
//       TransactionType: 'NFTokenBurn',
//       TxnSignature: '30440220200906BFFA88F29B0FFB9D7E453A2A7E46A3553E3552B8D8F7AB31416D562C2B022054CE98848792F633A2B4A32572340F5E40E7CD2D326043CC56DC152DD05639B0',
//       hash: '36BAF054083D3C18477F98FD0D22D81116A4143DABD55376688202339C837CE5',
//       ledger_index: 76926535,
//       date: 726294700
//     }
//   ],
//   Payment: [
//     {
//       Account: 'rKvE3ZUV4e975D5MfzTN4nYLeLgTu1HHF6',
//       Amount: '20000000',
//       Destination: 'rBXukLuM52hNabfx8Me2e5hVivAEQeRTJK',
//       Fee: '15',
//       LastLedgerSequence: 76684348,
//       Sequence: 72169666,
//       SigningPubKey: '0290A457D7C9150D0C99FE6A6F84A69C123AC3C55C97C73E9424E2C79EC97F1479',
//       TransactionType: 'Payment',
//       TxnSignature: '3045022100BEA8276F9F1D98316ADDFB46A2AF0CD9B35B4588629F6D5D2113457CB632B22202200113C4873E62C720BE46C6301E716E129ECA630EFC8CD10EFF4C1F65329A010A',
//       hash: '89284E355E6E610E48E392324F69B1456E3D2504ECF73CBFD091925176DA0E72',
//       ledger_index: 76684340,
//       date: 725352120
//     }
//   ]
// }

export default function Home( {socket}) {
  const [usersList, setUsersList] = useState([])
  const checkConnectedUsers = () => {
    socket.emit("checkConnectedList", async (callback) => {
      const connectedUsersList = await callback;
      setUsersList(connectedUsersList)
  
    });
  }
 
  return (
    <div className='homeDiv'>
      <img id="moneyTransferSvg" src={oybg} />
    
      <div id="landingPageMainDiv">
        <img />
      
        <h2 id="homeTitle">Bring your account<br />object to life.</h2>
        <p>Display, view, and interact with other online XRPL accounts.</p>
        <button id="homeEnterButton">
          <Link to="/enter" className='link'>
            Enter
          </Link>
        </button>

        <img />
      
        {/* <div id="collapsibleTree">
          <CollapsibleTree data={testData} />
        </div> */}
   
       
      </div>
    </div>
  )

  
}
