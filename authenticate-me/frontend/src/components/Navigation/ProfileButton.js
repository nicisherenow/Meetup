import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import * as sessionActions from '../../store/session';
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
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
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <>
    <div id='upperRight'>
      <span id='profileButton' onClick={openMenu}>
        {user ? user.firstName[0].toUpperCase() : <i className="fas fa-user-circle" /> }
      </span>
        {showMenu == true ? <span onClick={closeMenu} id='expandDropDown'><i className="fa-solid fa-chevron-up"></i></span> : <span onClick={openMenu} id="collapseDropDown"><i className="fa-solid fa-chevron-down"></i></span>}
    </div>
      <ul className={ulClassName} ref={ulRef}>
        {user ? (
          <div id='loggedIn'>
            <li className='userinfo'>{user.firstName} {user.lastName}</li>
            <li className='userinfo'>{user.email}</li>
            <li className='userinfo' id="logoutButton" onClick={logout}>
              Log Out
            </li>
          </div>
        ) : (
          <div id='notLoggedIn'>
            <OpenModalMenuItem
              itemText="Log In"
              onItemClick={closeMenu}
              modalComponent={<LoginFormModal />}
            />
            <OpenModalMenuItem
              itemText="Sign Up"
              onItemClick={closeMenu}
              modalComponent={<SignupFormModal />}
            />
          </div>
        )}
      </ul>
    </>
  );
}

export default ProfileButton;
