import { csrfFetch } from "./csrf";

const LOAD_GROUPS = 'groups/loadGroups';
const LOAD_GROUP = 'group/loadGroup';
const CREATE_GROUP = 'group/createGroup';
const DELETE_GROUP = 'group/deleteGroup';
const EDIT_GROUP = 'group/editGroup'

export const loadGroups = (groups) => {
  return {
    type: LOAD_GROUPS,
    groups
  }
}
export const loadGroup = (group) => {
  return {
    type: LOAD_GROUP,
    group
  }
}

export const createGroup = (group) => {
  return {
    type: CREATE_GROUP,
    group
  }
}

export const deleteGroup = (message, group) => {
  return {
    type: DELETE_GROUP,
    message,
    group
  }
}

export const editGroup = (group) => {
  return {
    type: EDIT_GROUP,
    group
  }
}

export const editAGroup = (payload) => async dispatch => {
  const response = await csrfFetch(`/api/groups/${payload.id}`, {
    method: "PUT",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(payload)
  })

  if(response.ok) {
    const group = await response.json()
    dispatch(editGroup(group))
    return group
  }
}

export const deleteAGroup = (payload) => async dispatch => {
  const response = await csrfFetch(`/api/groups/${payload.id}`, {
    method: "DELETE",
  })

  if (response.ok) {
    const message = await response.json()
    dispatch(deleteGroup(message, payload))
  }
}

export const createAGroup = (payload) => async dispatch => {
  const response = await csrfFetch('/api/groups', {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(payload),
    })

    const group = await response.json()
    if (response.ok) {
      dispatch(createGroup(group))
      return group
    } else {

    }
}

export const fetchGroups = () => async dispatch => {
  const response = await csrfFetch('/api/groups');
  const groups = await response.json();
  dispatch(loadGroups(groups));
};

export const fetchGroupById = (id) => async dispatch => {
  const response = await csrfFetch(`/api/groups/${id}`);
  const group = await response.json();
  dispatch(loadGroup(group));
};
const initialState = { allGroups: {}, singleGroup: {} };

const groupsReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case LOAD_GROUPS:
      newState = { ...state }
      Object.values(action.groups.Groups).forEach(group => { newState.allGroups[group.id] = group})
      return newState
    case LOAD_GROUP:
      newState = { ...state}
      newState.singleGroup = action.group
      return newState
    case CREATE_GROUP:
      newState = { ...state}
      newState.allGroups[action.group.id] = action.group
      newState.singleGroup = action.group
      return newState
    case DELETE_GROUP:
      newState = { ...state}
      delete newState.allGroups[action.group.id]
      delete newState.singleGroup[action.group.id]
      return newState
    case EDIT_GROUP:
      newState = { ...state }
      newState.allGroups[action.group.id] = action.group
      newState.singleGroup = action.group
      return newState
    default:
      return state
    }
}

export default groupsReducer;