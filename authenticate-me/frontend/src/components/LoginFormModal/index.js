import React, { useState, useEffect } from "react";
import * as sessionActions from "../../store/session";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import SignupFormModal from "../SignupFormModal";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { useHistory } from "react-router-dom";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const user = useSelector(state => state.session.user)
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();
  const history = useHistory()


  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([]);
    return dispatch(sessionActions.login({ credential, password }))
    .then(closeModal)
    .then(() => history.push('/groups'))
    .catch(
      async (res) => {
        const data = await res.json();
        if (data && data.errors) setErrors(data.errors)
      }
      );
    };
    const handleDemoSubmit = (e) => {
      e.preventDefault();
      setErrors([]);
      history.push('/groups')
      return dispatch(sessionActions.login({ credential: 'demo@user.io', password: 'password' }))
    .then(closeModal)
    .catch(
      async (res) => {
        const data = await res.json();
        if (data && data.errors) setErrors(data.errors)
      }
      );
  };

  return (
    <div className='loginForm'>
      <form onSubmit={handleSubmit}>
      <h1 id='loginH1'>Log In</h1>
      <p>Not a member yet?
        <span id='signupModal'>
          <OpenModalMenuItem
              itemText="Sign Up"
              modalComponent={<SignupFormModal />}
            /></span></p>
        <ul>
          {errors.map((error, idx) => (
            <li key={idx}>{error}</li>
          ))}
        </ul>
        <label>
          Email
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button id='loginButton' type="submit">Log In</button>
      </form>
    <div id='issaDemo'>
      <button id='demoLogin' type="submit" onClick={handleDemoSubmit}>Log in as Demo User</button>
    </div>
    </div>
  );
}

export default LoginFormModal;
