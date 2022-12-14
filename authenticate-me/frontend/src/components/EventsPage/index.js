import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllEvents } from '../../store/events'
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem'
import './EventsPage.css'
import { NavLink } from 'react-router-dom'


const EventsPage = () => {
  const dispatch = useDispatch()
  const events = useSelector(state => Object.values(state.eventState.allEvents))
  useEffect(() => {
    dispatch(fetchAllEvents())
  }, [dispatch])

  if (!events) return null
  return (
    <div id='event-container'>
      <div id='group-event-navigation-container'>
        <NavLink className={'stop-underline'} id={'events-groups'} to={'/groups'}>Groups</NavLink>
        <NavLink className={'stop-underline'} id={'events-groups'} to={'/events'}>Events</NavLink>
      </div>
      {events.map(event => (
          <NavLink to={`/groups/${event.id}`} id={`event-${event.id}`} className='events'>
            <div id='event-alignment'>
              <div id='event-pic-container'>
                <div>Placeholder</div>
              </div>
              <div id='event-details'>
                <h4>{event.startDate}</h4>
                <h3>{event.name}</h3>
                <p>{event.Group?.name} • {event.Venue?.city}, {event.Venue?.state}</p>
                <p>{event.numAttending} {event.numAttending > 1 || event.numAttending === 0 ? 'attendees' : 'attendee'}</p>
              </div>
            </div>
          </NavLink>
      ))}

    </div>
  )
}

export default EventsPage;