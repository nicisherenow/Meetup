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
  const [startDate, setStartDate] = useState(Date.now())
  const [endDate, setEndDate] = useState(Date.now())
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
      setErrors([]);
      return dispatch(createAnEvent(group, { name, type, capacity, price, description, startDate, endDate }))
        .then((data) => history.push(`/events/${data.id}`))
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) setErrors(data.errors);
        });
  };

  return (
    <div id='createAnEventForm'>
      <h1 id='groupH1'>Create an Event</h1>
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
        <button id='createEvent' type="submit">Create Event</button>
      </form>
    </div>
  );
}

export default CreateAnEventModal;
