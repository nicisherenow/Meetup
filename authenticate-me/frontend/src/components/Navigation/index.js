import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';
import '../../Images/logo.png'

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);

  return (
    <ul id="nav-ul">
      <li id='homeButton'>
        <NavLink exact to={sessionUser ? "/groups" : '/'}><img className='home-logo' src={require('../../Images/logo.png')} alt={'home-logo'}/></NavLink>
      </li>
      {isLoaded && (
        <li>
          <ProfileButton user={sessionUser} />
        </li>
      )}
      
    </ul>
  );
}

export default Navigation;
