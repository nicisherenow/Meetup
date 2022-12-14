import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { fetchEventById } from '../../store/events';
import './SingleEvent.css'


const SingleEvent = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { eventId } = useParams()
  const event = useSelector(state => state.eventState.singleEvent)

  useEffect(()=> {
    dispatch(fetchEventById(eventId))
  }, [dispatch])

  if (!event) return null
  return (
    <div className='single-event-content-container'>
      <h1>{event.name}</h1>
      <img src={event.EventImages?.length ? event.EventImages[0]?.url : 'https://picsum.photos/600/337'} id='single-event-image' alt='SingleEventTime' />
      <h2>Details</h2>
      <p>{event.description}</p>
    </div>
  )
}

export default SingleEvent;
