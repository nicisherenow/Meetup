import { useSelector, useDispatch } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import { useEffect } from "react";
import { fetchGroupById, deleteAGroup, clearGroup } from "../../store/groups";
import CreateAnEventModal from "../CreateAnEventModal";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import EditAGroupModal from "../EditAGroupModal";
import './SingleGroup.css'

const SingleGroup = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { groupId } = useParams();
  const user = useSelector(state => state.session.user)


  const group = useSelector(state => state.groupState.singleGroup)

  useEffect(()=> {
    dispatch(fetchGroupById(groupId))
    .then(dispatch(clearGroup()))
  }, [dispatch, groupId])

  const handleDeleteClick = (e) => {
    e.preventDefault()
    dispatch(deleteAGroup(group))
    .then(dispatch(clearGroup()))
    .then(() => history.push('/groups'))
  }

  if(!group) return null
  return (
    <>
    <div id="for-centering-group">

    <div className='single-group-container' id={`group-${group.id}-page`}>
      <div className="pic-container">
        <img src={group.GroupImages?.length ? group.GroupImages[0]?.url : 'https://picsum.photos/600/337'} alt='SingleGroupTime' id="SingleGroupPic" />
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
        <p>This is an "{group.type}" group.</p>
        <p>This is flavor text, it is whatever flavor it needs to be. I personally prefer gummies, however, it can be whatever
          you want it to be in your imagination. The choice is yours. {group.name} is the name of the group, but it can be about
          whatever you want it to be about in your heart.
        </p>
      </div>
      {user?.id === group.Organizer?.id ? (

        <div className="delete-edit">

        <span id='delete-group-button' onClick={handleDeleteClick}>Delete group</span>
        <span id='createAGroupModal'>
          <OpenModalMenuItem
              itemText="Edit this Group"
              modalComponent={<EditAGroupModal />}
              /></span>
            <span id='createAGroupModal'>
          <OpenModalMenuItem
              itemText="Create an Event"
              modalComponent={<CreateAnEventModal />}
              /></span>
      </div>
              ) : (null)}
              </div>
    </>
  )
}


export default SingleGroup;
