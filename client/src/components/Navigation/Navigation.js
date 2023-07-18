import React, { useContext } from 'react'
import { LoginContext } from '../../App';
import { Link } from 'react-router-dom'
import '../Navigation/navigation.css'

export default function Navigation() {
    const [loggedIn, setLoggedIn] = useContext(LoginContext);

    return (
        <div className="mobile-menu">
            <input type="checkbox" className="toggler" role="checkbox" aria-checked="false" tabIndex="0" />
            <div className='hamburger'>
                <div></div>
            </div>
            <div className='menu'>
                <div>
                    <div>
                        {loggedIn.loggedIn === false &&
                            <ul className='mainNav'>
                                <li>
                                    <Link to="/" className='link'>Home</Link>
                                </li>
                                <li>
                                    <Link to="/enter" className='link'>Enter</Link>
                                </li>
                            </ul>
                        }

                        {loggedIn.loggedIn === true &&
                            <ul className='mainNav'>
                                <li>
                                    <Link to="/" className='link'>Home</Link>
                                </li>
                                <li>
                                    <Link to="/profile" className='link'>Profile</Link>
                                </li>
                            </ul>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}
