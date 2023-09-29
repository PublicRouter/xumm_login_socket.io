import React from 'react'
import "../Home/home.css";
import { Link } from 'react-router-dom'
import oybg from "../../images/oybg.png"

export default function Home() {
  return (
    <div className='homeDiv'>
      <img id="moneyTransferSvg" src={oybg} />

      <div id='homeAnimationContainer'>
        <div className='homeAnimationObject hexagon' id="object1" />
        <div className='homeAnimationObject' id="object2" />
      </div>      

      <div id="landingPageMainDiv">
        <h2 id="homeTitle">XRPL <span>Account</span> Interface.</h2>
        {/* <p>Display, view, and interact with other online XRPL accounts.</p> */}
        <p>Visualize, interact, and control your wallet.</p>
        <button id="homeEnterButton">
          <Link to="/enter" className='homeEnterLink secondButtonPop'>
            Connect
          </Link>
        </button>
      </div>
    </div>
  )
}
