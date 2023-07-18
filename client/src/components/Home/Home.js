import React from 'react'
import "../Home/home.css";
import { Link } from 'react-router-dom'

import homeImage from "../../images/homeImage.png";

export default function Home() {
  return (
    <div className='homeDiv'>
        <img id="homeImage" src={homeImage}/>

        <h2 id="homeTitle">Originators</h2>
        <button id="homeEnterButton">
            <Link to="/enter" className='link'>
                Enter
            </Link>
        </button>
    </div>
  )
}
