import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { editAGroup } from "../../store/groups";
import './EditAGroupModal.css';

function EditAGroupModal() {

  const group = useSelector(state => state.groupState.singleGroup)

  const history = useHistory();
  const dispatch = useDispatch();
  const [id, setId] = useState(group.id)
  const [name, setName] = useState(group.name);
  const [about, setAbout] = useState(group.about);
  const [type, setType] = useState(group.type);
  const [isPrivate, setIsPrivate] = useState(group.private.toString());
  const [city, setCity] = useState(group.city);
  const [state, setState] = useState(group.state)
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
      setErrors([]);
      return dispatch(editAGroup({ id, name, about, type, private: isPrivate, city, state }))
        .then((data) => history.push(`/groups/${data.id}`))
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) setErrors(data.errors);
        });
  };

  return (
    <div id='editAGroupForm'>
      <h1 id='groupH1'>Edit This Group</h1>
      <form onSubmit={handleSubmit}>
        <ul>
          {errors.map((error, idx) => <li key={idx}>{error}</li>)}
        </ul>
        <label>
          Name
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <label>
          About
          <input
            type="text-area"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            required
          />
        </label>
        <label>
          City
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
        </label>
        <label>
          State
          <input
            type="text"
            value={state}
            onChange={(e) => setState(e.target.value)}
            required
          />
        </label>
        <span className="radio-buttons">
        <label>
          Online
          <input
            type="radio"
            value='Online'
            onChange={(e) => setType(e.target.value)}
            required
            checked={type === 'Online' ? true : false}
          />
        </label>
        <label>
          In person
          <input
            type="radio"
            value='In person'
            onChange={(e) => setType(e.target.value)}
            required
            checked={type === "In person" ? true : false}
            />
        </label>
            </span>
        <span className="radio-buttons">
        <label>
          Private
          <input
            type="radio"
            value='true'
            onChange={(e) => setIsPrivate(e.target.value)}
            required
            checked={isPrivate === "true" ? true : false}
          />
        </label>
        <label>
          Public
          <input
            type="radio"
            value='false'
            onChange={(e) => setIsPrivate(e.target.value)}
            required
            checked={isPrivate === "false" ? true : false}
          />
        </label>
            </span>
        <button id='editGroup' type="submit">Submit Group Edit</button>
      </form>
    </div>
  );
}

export default EditAGroupModal;
