import React from 'react';
import { Link } from 'react-router-dom';
import headerLogo from '../images/logo.svg';



function Header (props) {
  return (
    <header className="header">
      <div className="header__logo" style={{ backgroundImage: `url(${headerLogo})` }} ></div>
      <div className="header__status">
        <p className="header__user-email">{props.email}</p>
        <Link to={props.urlAdress} className="header__link" onClick={props.onSingOut}>{props.urlName}</Link>
      </div>
    </header>
  )
}

export default Header; 