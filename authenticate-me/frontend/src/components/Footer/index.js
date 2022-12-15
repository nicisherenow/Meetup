import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect, useRef } from 'react';
import { useHistory, NavLink } from 'react-router-dom';
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import CreateAGroupModal from '../CreateAGroupModal';
import './Footer.css'
import * as sessionActions from '../../store/session'


const Footer = () => {
  const user = useSelector(state => state.session.user)
  const [showMenu, setShowMenu] = useState(false);
  const ref = useRef()

  const history = useHistory()
  const dispatch = useDispatch()

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ref.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    closeMenu();
    history.push('/')
  };

  return (
    <div id='footer-container'>
      <div id='footer-border-top'>

      {user ? (
        <div id='profile-div'>
          <h4>Your Account</h4>
          <li className='userinfo' id="logoutButton" onClick={logout}>
                Log Out
          </li>
        </div>
          )
      : (
        <div id='profile-div'>
        <h4>Your Account</h4>
        <span id='loginModalButton'>
              <OpenModalMenuItem
              itemText="Log In"
              onItemClick={closeMenu}
              modalComponent={<LoginFormModal />}
              />
              </span>
            <span id='signupModalButton'>
              <OpenModalMenuItem
              itemText="Sign Up"
              onItemClick={closeMenu}
              modalComponent={<SignupFormModal />}
              />
              </span>
            </div>
          )
        }
      { user ? (
        <div id='discover-div'>
        <h4>Discover</h4>
        <span id={'footer-create-group'}>
          <OpenModalMenuItem
              className={'footer-groups-events'}
              itemText="Create a Group"
              modalComponent={<CreateAGroupModal />}
              /></span>
        <NavLink className={'footer-groups-events'} to={'/groups'}>Groups</NavLink>
        <NavLink className={'footer-groups-events'} to={'/events'}>Events</NavLink>

      </div>
      )
      :
      (

        <div id='discover-div'>
        <h4>Discover</h4>
        <NavLink className={'footer-groups-events'} to={'/groups'}>Groups</NavLink>
        <NavLink className={'footer-groups-events'} to={'/events'}>Events</NavLink>
      </div>
        )
      }
      <div id='meet-sup-div'>
        <h4>Meet, Sup?</h4>
        <NavLink className={'footer-groups-events'} to={'/about'}>About</NavLink>
      </div>
    </div>
      </div>
  )
}

export default Footer;
