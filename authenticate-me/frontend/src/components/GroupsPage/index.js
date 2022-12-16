import { useEffect } from 'react'
import { clearGroup, fetchGroups } from '../../store/groups'
import { useDispatch, useSelector } from 'react-redux'
import './GroupsPage.css'
import { NavLink } from 'react-router-dom'


const GroupsPage = () => {
  const dispatch = useDispatch()
  const groups = useSelector(state => Object.values(state.groupState.allGroups))

  useEffect(() => {
    dispatch(fetchGroups())
    .then(dispatch(clearGroup()))
  }, [dispatch])
  if (!groups) return null
  return (
    <div id='groups-container'>
      <div id='group-event-navigation-container'>
        <NavLink className={'stop-underline'} id={'events-groups'} to={'/groups'}>Groups</NavLink>
        <NavLink className={'stop-underline'} id={'events-groups'} to={'/events'}>Events</NavLink>
      </div>
      {groups.map(group => (
          <NavLink to={`/groups/${group.id}`} key={group.id} id={`group-${group.id}`} className='groups'>
            <div className='group-pic-container'>
              <img src={group.previewImage === 'no preview image' ? 'https://picsum.photos/178/100' : group.previewImage } alt='groupTime' className='group-pics'/>
            </div>
            <div className='group-content-container'>
              <h2 style={{color: 'black', marginTop: 15, marginBottom: 5}}>{group.name}</h2>
              <h4 style={{color: "#877457", marginTop: 5}}>{group.city}, {group.state}</h4>
              <p style={{color: '#757575'}}>{group.about}</p>
              <p style={{color: '#757575'}}>{group.numMembers} {group.numMembers > 1 || group.numMembers === 0 ? "members" : 'member'} • {group.private === false ? "Public" : "Private"}</p>
            </div>
          </NavLink>
      ))}
    </div>
  )
}

export default GroupsPage;
