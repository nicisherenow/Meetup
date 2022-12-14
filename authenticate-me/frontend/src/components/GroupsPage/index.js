import { useEffect } from 'react'
import { fetchGroups } from '../../store/groups'
import { useDispatch, useSelector } from 'react-redux'
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem'
import CreateAGroupModal from '../CreateAGroupModal'
import './GroupsPage.css'
import { NavLink } from 'react-router-dom'


const GroupsPage = () => {
  const dispatch = useDispatch()
  const groups = useSelector(state => Object.values(state.groupState.allGroups))
  useEffect(() => {
    dispatch(fetchGroups())
  }, [dispatch])

  if (!groups) return null
  return (
    <div id='groups-container'>
      <p>Got a fun idea for a new Group?
        <span id='createAGroupModal'>
          <OpenModalMenuItem
              itemText="Create a Group"
              modalComponent={<CreateAGroupModal />}
            /></span></p>
      <div id='group-event-navigation-container'>
        <NavLink className={'stop-underline'} id={'events-groups'} to={'/groups'}>Groups</NavLink>
        <NavLink className={'stop-underline'} id={'events-groups'} to={'/events'}>Events</NavLink>
      </div>
      {groups.map(group => (
          <NavLink to={`/groups/${group.id}`} id={`group-${group.id}`} className='groups'>
            <div className='group-pic-container'>
              <img src={group.previewImage} alt='groupTime' className='group-pics'/>
            </div>
            <div className='group-content-container'>
              <h2 className='area2'>{group.name}</h2>
              <h4 className='area3'>{group.city}, {group.state}</h4>
              <p className='area4'>{group.about}</p>
              <p className='area5'>{group.numMembers} {group.numMembers > 1 || group.numMembers === 0 ? "members" : 'member'} • {group.private === false ? "Public" : "Private"}</p>
            </div>
          </NavLink>
      ))}

    </div>
  )
}

export default GroupsPage;
