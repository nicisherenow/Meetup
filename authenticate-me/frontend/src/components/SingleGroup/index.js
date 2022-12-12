import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { fetchGroupById } from "../../store/groups";
import './SingleGroup.css'

const SingleGroup = () => {
  const dispatch = useDispatch()
  const { groupId } = useParams()
  useEffect(()=> {
    dispatch(fetchGroupById(groupId))
  }, [dispatch, groupId])
  const group = useSelector(state => state.groupState.singleGroup)
  console.log(group, groupId)

  if(!group) return null
  return (
    <div className='single-group-container' id={`group-${group.id}-page`}>
      <div className="pic-container">
        <div>Placeholder</div>
      </div>
      <div className="info-container">
      <h1>{group.name}</h1>
      <p>{group.city}, {group.state}</p>
      <p>{group.numMembers} {group.numMembers > 1 || group.numMembers === 0 ? "members" : 'member'} • {group.private === false ? "Public" : "Private"} group</p>
      <p>Organized by {group.Organizer.firstName}</p>
      </div>
    </div>
  )
}


export default SingleGroup;
