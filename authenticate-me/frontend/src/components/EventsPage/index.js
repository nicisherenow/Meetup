import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { clearEvent, fetchAllEvents } from '../../store/events'
import './EventsPage.css'
import { NavLink } from 'react-router-dom'


const EventsPage = () => {
  const dispatch = useDispatch()
  const events = useSelector(state => Object.values(state.eventState.allEvents))

  const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
  useEffect(() => {
    dispatch(fetchAllEvents())
    .then(dispatch(clearEvent()))
  }, [dispatch])
  
  if (!events) return null
  return (
    <div id='event-container'>
      <div id='group-event-navigation-container'>
        <NavLink className={'stop-underline'} id={'events-groups'} to={'/groups'}>Groups</NavLink>
        <NavLink className={'stop-underline'} id={'events-groups'} to={'/events'}>Events</NavLink>
      </div>
      {events.map(event => (
          <NavLink key={event.id} to={`/events/${event.id}`} id={`event-${event.id}`} className='events'>
              <div id='event-pic-container'>
                <img src={event.previewImage === 'no preview image found' ? 'https://picsum.photos/178/100' : event.previewImage} alt='groupTime' className='event-pics'/>
              </div>
              <div id='event-details'>
                <h4 style={{color: "#877457", marginBottom: 5}}>{new Date(event.startDate).toLocaleTimeString('en-US', options)}</h4>
                <h3 style={{color: 'black', marginTop: 5, marginBottom: 5}}>{event.name}</h3>
                <p style={{color: '#757575', marginTop: 5, marginBottom: 20}}>{event.Group?.name} • {event.Group?.city}, {event.Group?.state}</p>
                <p style={{color: "#757575"}}>{event.numAttending} {event.numAttending > 1 || event.numAttending === 0 ? 'attendees' : 'attendee'}</p>
              </div>
          </NavLink>
      ))}
    </div>
  )
}

export default EventsPage;
