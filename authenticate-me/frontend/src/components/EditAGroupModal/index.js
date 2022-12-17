import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { editAGroup, fetchGroupById } from "../../store/groups";
import './EditAGroupModal.css';

function EditAGroupModal() {

  const group = useSelector(state => state.groupState.singleGroup)

  const dispatch = useDispatch();
  const [id,] = useState(group.id)
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
      return dispatch(editAGroup({ id, name, about, type, private: isPrivate, city, state}))
        .then((data) => dispatch(fetchGroupById(data.id)))
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
        <label htmlFor='type-select'>Choose a type
          <select name={type} value={type} id="type-select" onChange={(e) => setType(e.target.value)} required>
              <option disabled value=''>--Select type</option>
              <option value='Online'>Online</option>
              <option value='In person'>In person</option>
          </select>
        </label>
        <label htmlFor='private-select'>Privacy
          <select name={isPrivate} value={isPrivate} id="private-select" onChange={(e) => setIsPrivate(e.target.value)} required>
              <option disabled value=''>--Select privacy</option>
              <option value={false}>Public</option>
              <option value={true}>Private</option>
          </select>
        </label>
        <button id='editGroup' type="submit">Submit Group Edit</button>
      </form>
    </div>
  );
}

export default EditAGroupModal;
