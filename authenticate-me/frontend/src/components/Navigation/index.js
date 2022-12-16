import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import OpenModalMenuItem from './OpenModalMenuItem';
import CreateAGroupModal from '../CreateAGroupModal';
import './Navigation.css';
import '../../Images/logo.png'

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);

  return (
    <ul id="nav-ul">
      <li id='homeButton'>
        <NavLink exact to={sessionUser ? "/groups" : '/'}><img className='home-logo' src={require('../../Images/logo.png')} alt={'home-logo'}/></NavLink>
      </li>
      {sessionUser ? (
        <span id={'navigation-create-group'}>
          <OpenModalMenuItem
              className={'navigation-group-create'}
              itemText="Start a new group, TODAY!"
              modalComponent={<CreateAGroupModal />}
              /></span>
              ) : ( null )}

        { isLoaded && sessionUser ? (
            <li>
              <ProfileButton user={sessionUser} />
            </li>
          )
          :
          (<div id='login-signup'>
          <span id='nav-login'>
          <OpenModalMenuItem
          itemText="Log In"
          modalComponent={<LoginFormModal />}
          />

          </span>
          <span id='nav-signup'>
          <OpenModalMenuItem
          itemText="Sign Up"
          modalComponent={<SignupFormModal />}
          />
          </span>
          </div>
          )}

    </ul>
  );
}

export default Navigation;
