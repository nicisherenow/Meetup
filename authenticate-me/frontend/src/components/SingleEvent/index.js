import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { fetchEventById, deleteAnEvent } from '../../store/events';
import './SingleEvent.css'


const SingleEvent = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { eventId } = useParams()
  const event = useSelector(state => state.eventState.singleEvent)
  const group = useSelector(state => state.groupState.allGroups[event.Group?.id])
  const user = useSelector(state => state.session.user)

  useEffect(()=> {
    dispatch(fetchEventById(eventId))
  }, [dispatch])

  const handleDeleteClick = (e) => {
    e.preventDefault()
    dispatch(deleteAnEvent(event))
    history.push('/events')
  }

  if (!event) return null
  return (
    <div className='single-event-content-container'>
      <h1>{event.name}</h1>
      <div id='event-image-container'>
      <img src={event.EventImages?.length ? event.EventImages[0]?.url : 'https://picsum.photos/600/337'} id='single-event-image' alt='SingleEventTime' />
      </div>
      <h2>Details</h2>
      <p>{event.description}</p>
      {user?.id === group?.organizerId ? (

        <div className="delete-edit">

        <span id='delete-event-button' onClick={handleDeleteClick}>Delete event</span>

      </div>
        ) : (null)}
    </div>
  )
}

export default SingleEvent;
