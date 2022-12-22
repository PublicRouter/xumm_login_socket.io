import React, {useContext} from 'react'
import '../Profile/profile.css'

import { LoginContext } from '../../App';

export default function Profile() {
    const [loggedIn, setLoggedIn] = useContext(LoginContext);

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
          <img src="https://preview.free3d.com/img/2015/12/2212629374522361670/qo3s5umx.jpg" id='characterImage' />
          {/* <p>Authenticated: {loggedIn.loggedIn}</p>
          <p>Wallet Access: {loggedIn.rAddress}</p>
          <p>User Token: {loggedIn.xummToken}</p> */}
          <div id='profileStats'>
            <p className='skillPoint'>Attack:  <em>21</em></p>
            <p className='skillPoint'>Strength:  <em>63</em></p>
            <p className='skillPoint'>Defence:  <em>1</em></p>
            <p className='skillPoint'>Stamina:  <em>44</em></p>
          </div>
          
        </div>
        {/* <div id='profileBodyMain'>

        </div> */}
      </div>
    </div>
  )
}
