import React from 'react'
import "../Home/home.css";
import { Link } from 'react-router-dom'

// import TestForm from '../TestForm/TestForm';

import moneyTransferSvg from "../../images/moneyTransfer.svg";
import collabSvg from "../../images/collabSvg.svg"

export default function Home() {
  return (
    <div className='homeDiv'>
      <img id="moneyTransferSvg" src={collabSvg} />

      <div id="landingPageMainDiv">
        <h2 id="homeTitle">Bring your account<br />object to life.</h2>
        <p>Display, view, and interact with other online XRPL accounts.</p>
        <button id="homeEnterButton">
          <Link to="/enter" className='link'>
            Enter
          </Link>
        </button>
      </div>
    </div>
  )

  
}
