import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useParams, NavLink } from 'react-router-dom';
import { useEffect } from 'react';
import { fetchEventById, deleteAnEvent, clearEvent } from '../../store/events';
import './SingleEvent.css'
import { clearGroup, fetchGroups } from '../../store/groups';


const SingleEvent = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { eventId } = useParams()
  const event = useSelector(state => state.eventState.singleEvent)
  const user = useSelector(state => state.session.user)

  const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
  const usableStart = new Date(event.startDate).toLocaleTimeString('en-US', options)
  const usableEnd = new Date(event.endDate).toLocaleTimeString('en-US', options)

  const group = useSelector(state => state.groupState.allGroups[event.Group?.id])

  useEffect(()=> {
    dispatch(fetchEventById(eventId))
    .then(dispatch(fetchGroups()))
    .then(dispatch(clearEvent()))
    .then(dispatch(clearGroup()))
  }, [dispatch, eventId])

  const handleDeleteClick = (e) => {
    e.preventDefault()
    dispatch(deleteAnEvent(event))
    history.push('/events')
  }
  if (!event) return null
  if (!group) return null
  return (

      <div id='for-centering'>

      <div className='single-event-content-container'>
            <h1>{event?.name}</h1>
      <div className='top-bit'>

      <div id='event-image-container'>
      <img src={event.EventImages?.length ? event.EventImages[0]?.url : 'https://picsum.photos/600/337'} id='single-event-image' alt='SingleEventTime' />
      </div>

      <div id='event-group-info'>

        <NavLink to={`/groups/${group.id}`} id='like-an-onion'>
            <img src={group.previewImage} alt='grouptab' id='grouptab' />
            <div id='group-info-for-event'>
            <p id='groupfromevent'>{group.name}</p>
            <p id='grey-group-text'>{group.private === true ? 'Private' : 'Public'} group</p>
          </div>
        </NavLink>
        {event.Venue? (
          <div id='event-location-info'>
            <p>{usableStart} to {usableEnd}</p>
            <p>{event.Venue?.name}</p>
            <p>{event.Venue?.address} • {event.Venue?.city}, {event.Venue?.state}</p>
            </div>
            ) : ( null )
        }
        </div>
      </div>
        <h2>Details</h2>
        <p>Description: {event.description}</p>
        <p>Capacity: {event.capacity}</p>
        <p>Price: {event.price}</p>
        <p>Attendance: {event.numAttending} {event.numAttending > 1 || event.numAttending === 0 ? 'attendees' : 'attendee'}</p>



        {user?.id === group?.organizerId ? (

          <div className="delete-edit">

          <span id='delete-event-button' onClick={handleDeleteClick}>Delete event</span>

          </div>
        ) : (null)}
        </div>
      </div>
    )
  }

export default SingleEvent;
