
const LOAD_GROUPS = 'groups/loadGroups';
const LOAD_GROUP = 'group/loadGroup';

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
export const fetchGroups = () => async dispatch => {
  const response = await fetch('/api/groups');
  const groups = await response.json();
  dispatch(loadGroups(groups));
};

export const fetchGroupById = (id) => async dispatch => {
  const response = await fetch(`/api/groups/${id}`);
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
      newState = { ...state }
      newState.singleGroup = action.group
      return newState
    default:
      return state
    }
}

export default groupsReducer;
