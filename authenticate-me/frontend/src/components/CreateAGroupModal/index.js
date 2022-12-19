import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { createAGroup } from "../../store/groups";
import './CreateAGroup.css';

function CreateAGroupModal() {
  const history = useHistory();
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const [type, setType] = useState("In person");
  const [isPrivate, setIsPrivate] = useState("false");
  const [city, setCity] = useState("");
  const [state, setState] = useState("")
  const [previewImage, setPreviewImage] = useState("")
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
      setErrors([]);
      return dispatch(createAGroup({ name, about, type, private: isPrivate, city, state }, previewImage))
        .then((data) => history.push(`/groups/${data.id}`))
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) setErrors(data.errors);
        });
  };

  return (
    <div id='createAGroupForm'>
      <form onSubmit={handleSubmit}>
      <h1 id='groupH1'>Create a Group</h1>
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
        <label>
          Preview Image URL
          <input
          type='text'
          value={previewImage}
          onChange={(e) => setPreviewImage(e.target.value)}
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
        <button id='createGroup' type="submit">Create Group</button>
      </form>
    </div>
  );
}

export default CreateAGroupModal;
