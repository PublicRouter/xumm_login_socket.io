import React, { useContext } from 'react'
import { AccountContext } from '../../App';
import { Link } from 'react-router-dom'
import "./navigation.css"

export default function Navigation() {
    const [accountObject] = useContext(AccountContext); // Removed setAccountObject as it's not being used

    return (
        <div id="navigation">
            <div className="mobile-menu">
                <input type="checkbox" className="toggler" role="checkbox" aria-checked="false" tabIndex="0" />
                <div className='hamburger'>
                    <div></div>
                </div>
                <div className='menu'>
                    <div>
                        <div>
                            <ul className='mainNav'>
                                <li>
                                    <Link to="/" className='navLink navButtonPop'>Home</Link>
                                </li>
                                {accountObject.loggedIn ? (
                                    <li>
                                        <Link to="/profile" className='navLink navButtonPop'>Profile</Link>
                                    </li>
                                ) : (
                                    <li>
                                        <Link to="/enter" className='navLink navButtonPop'>Connect</Link>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <h1 id="appMainHead">PocketWallet</h1>
        </div>
    );
};

