import { csrfFetch } from "./csrf";

const LOAD_GROUPS = 'groups/loadGroups';
const LOAD_GROUP = 'group/loadGroup';
const CREATE_GROUP = 'group/createGroup';
const DELETE_GROUP = 'group/deleteGroup';
const EDIT_GROUP = 'group/editGroup'
const CLEAR_GROUP = 'group/clearGroup'

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

export const createGroup = (group, previewImage) => {
  return {
    type: CREATE_GROUP,
    group,
    previewImage
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

export const clearGroup = () => {
  return {
    type: CLEAR_GROUP,
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

export const createAGroup = (payload, imagePayload) => async dispatch => {
  const response = await csrfFetch('/api/groups', {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(payload),
    })
  const group = await response.json()

  const imageResponse = await csrfFetch(`/api/groups/${group.id}/images`, {
    method: "POST",
    headers: {"Content-Type": 'application/json'},
    body: JSON.stringify({url: imagePayload, groupId: group.id, preview: true})
  })

  const previewImage = await imageResponse.json()
    if (response.ok && imageResponse.ok) {
      dispatch(createGroup(group, previewImage))
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
      newState.allGroups[action.group.id].previewImage = action.previewImage.url
      return newState
    case DELETE_GROUP:
      newState = { ...state}
      delete newState.allGroups[action.group.id]
      return newState
    case EDIT_GROUP:
      newState = { ...state }
      newState.allGroups[action.group.id] = action.group
      return newState
    case CLEAR_GROUP:
      newState = { ...initialState }
      return newState
    default:
      return state
    }
}

export default groupsReducer;
