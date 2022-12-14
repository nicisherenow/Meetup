import { csrfFetch } from "./csrf";

const LOAD_EVENTS = 'events/loadEvents';
const LOAD_EVENT = 'event/loadEvent';

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
    default:
      return state
    }
}

export default eventsReducer;
