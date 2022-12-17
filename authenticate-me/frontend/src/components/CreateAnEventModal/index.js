import './CreateAnEvent.css'
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { createAnEvent } from "../../store/events";

function CreateAnEventModal() {
  const group = useSelector(state => state.groupState.singleGroup)
  const history = useHistory();
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [type, setType] = useState("In person");
  const [capacity, setCapacity] = useState(0);
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState()
  const [endDate, setEndDate] = useState()
  const [previewImage, setPreviewImage] = useState("")
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
      setErrors([]);
      return dispatch(createAnEvent(group, { name, type, capacity, price, description, startDate, endDate }, previewImage))
        .then((data) => history.push(`/events/${data.id}`))
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) setErrors(data.errors);
        });
  };

  return (
    <div id='createAnEventForm'>

      <form onSubmit={handleSubmit}>
      <h1 id='groupH1'>Create an Event</h1>
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
          Capacity
          <input
            type="number"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            required
          />
        </label>
        <label>
          Price
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </label>
        <label>
          Description
          <input
            type="text-area"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            />
        </label>
        <label>
          Preview Image
          <input
          type='text'
          value={previewImage}
          onChange={(e) => setPreviewImage(e.target.value)}
          required
          />
        </label>
        <label>
          Start Date
          <input
            className='Date-style'
            type="datetime-local"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
            />
        </label>
        <label>
          End Date
          <input
            className='Date-style'
            type="datetime-local"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
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
        <button id='createEvent' type="submit">Create Event</button>
      </form>
    </div>
  );
}

export default CreateAnEventModal;
