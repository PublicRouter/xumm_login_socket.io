import React, {useContext} from 'react'
import { LoginContext } from '../../App';

export default function Profile() {
    const [loggedIn, setLoggedIn] = useContext(LoginContext);

  return (
    <div>Profile</div>
  )
}
