import { useSelector, useDispatch } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import { useEffect } from "react";
import { fetchGroupById, deleteAGroup } from "../../store/groups";
import './SingleGroup.css'

const SingleGroup = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { groupId } = useParams();


  useEffect(()=> {
    dispatch(fetchGroupById(groupId))
  }, [dispatch, groupId])

  const group = useSelector(state => state.groupState.singleGroup)

  const handleDeleteClick = (e) => {
    e.preventDefault()
    dispatch(deleteAGroup(group))
    history.push('/groups')
  }

  if(!group) return null
  return (
    <>
    <div className='single-group-container' id={`group-${group.id}-page`}>
      <div className="pic-container">
        <div>Placeholder</div>
      </div>
      <div className="info-container">
      <h1>{group.name}</h1>
      <p>{group.city}, {group.state}</p>
      <p>{group.numMembers} {group.numMembers > 1 || group.numMembers === 0 ? "members" : 'member'} • {group.private === false ? "Public" : "Private"} group</p>
      <p>Organized by {group.Organizer?.firstName}</p>
      </div>
    </div>
      <div className="about-section">
        <h3>What we're about</h3>
        <p>{group.about}</p>
      </div>
      <div className="delete-edit">
        <button onClick={handleDeleteClick}>Delete group</button>
        <button>Edit group</button>
      </div>
    </>
  )
}


export default SingleGroup;
