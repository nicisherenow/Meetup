import { csrfFetch } from "./csrf";

const LOAD_EVENTS = 'events/loadEvents';

export const loadEvents = (events) => {
  return {
    type: LOAD_EVENTS,
    events
  }
}

export const fetchAllEvents = () => async dispatch => {
  const response = await csrfFetch("/api/events")
  const events = await response.json()
  dispatch(loadEvents(events))
}

const initialState = { allEvents: {}, singleEvent: {} };

const eventsReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case LOAD_EVENTS:
      newState = { ...state }
      Object.values(action.events.Events).forEach(event => { newState.allEvents[event.id] = event})
      return newState
    default:
      return state
    }
}

export default eventsReducer;
