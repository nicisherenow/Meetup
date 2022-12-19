import { csrfFetch } from "./csrf";

const LOAD_EVENTS = 'events/loadEvents';
const LOAD_EVENT = 'event/loadEvent';
const CREATE_EVENT = 'event/createEvent'
const DELETE_EVENT = 'event/deleteEvent'
const CLEAR_EVENT = 'event/clearEvent'

export const loadEvents = (events) => {
  return {
    type: LOAD_EVENTS,
    events
  }
}

export const loadEvent = (event) => {
  return {
    type: LOAD_EVENT,
    event
  }
}

export const createEvent = (event, previewImage) => {
  return {
    type: CREATE_EVENT,
    event,
    previewImage
  }
}

export const deleteEvent = (message, event) => {
  return {
    type: DELETE_EVENT,
    message,
    event
  }
}

export const clearEvent = () => {
  return {
    type: CLEAR_EVENT,
  }
}

export const deleteAnEvent = (payload) => async dispatch => {
  const response = await csrfFetch(`/api/events/${payload.id}`, {
    method: "DELETE",
  })

  if (response.ok) {
    const message = await response.json()
    dispatch(deleteEvent(message, payload))
  }
}

export const fetchAllEvents = () => async dispatch => {
  const response = await csrfFetch("/api/events")
  const events = await response.json()
  dispatch(loadEvents(events))
}

export const fetchEventById = (eventId) => async dispatch => {
  const response = await csrfFetch(`/api/events/${eventId}`)
  const event = await response.json()
  dispatch(loadEvent(event))
}

export const createAnEvent = (group, payload, imagePayload) => async dispatch => {
  const response = await csrfFetch(`/api/groups/${group.id}/events`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(payload)
  })
  const event = await response.json()

  const imageResponse = await csrfFetch(`/api/events/${event.id}/images`, {
    method: "POST",
    headers: {"Content-Type": 'application/json'},
    body: JSON.stringify({url: imagePayload, eventId: event.id, preview: true})
  })
  const previewImage = await imageResponse.json()
  if (response.ok && imageResponse.ok) {
    dispatch(createEvent(event, previewImage))
    return event
  }
}


const initialState = { allEvents: {}, singleEvent: {} };

const eventsReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case LOAD_EVENTS:
      newState = { ...state }
      Object.values(action.events.Events).forEach(event => { newState.allEvents[event.id] = event})
      return newState
    case LOAD_EVENT:
      newState = { ...state }
      newState.singleEvent = action.event
      return newState
    case CREATE_EVENT:
      newState = { ...state }
      newState.allEvents[action.event.id] = action.event
      newState.allEvents[action.event.id].previewImage = action.previewImage.url
      return newState
    case DELETE_EVENT:
      newState = { ...state }
      delete newState.allEvents[action.event.id]
      return newState
    case CLEAR_EVENT:
      newState = { ...initialState}
      return newState
    default:
      return state
    }
}

export default eventsReducer;
