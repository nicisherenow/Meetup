import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { createAGroup } from "../../store/groups";
import './CreateAGroup.css';

function CreateAGroupModal() {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const [type, setType] = useState("In person");
  const [isPrivate, setIsPrivate] = useState("false");
  const [city, setCity] = useState("");
  const [state, setState] = useState("")
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
      setErrors([]);
      return dispatch(createAGroup({ name, about, type, private: isPrivate, city, state }))
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) setErrors(data.errors);
        });
  };

  return (
    <div id='createAGroupForm'>
      <h1 id='groupH1'>Create a Group</h1>
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
        <button id='createGroup' type="submit">Create Group</button>
      </form>
    </div>
  );
}

export default CreateAGroupModal;
