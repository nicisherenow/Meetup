import './PageNotFound.css'
import { NavLink } from 'react-router-dom';

const PageNotFound = () => {

  return (
    <div id='pagenotfound-content'>
      <h1>Page Not Found</h1>
      <img style={{width: 500, height: 500}}src={require('../../Images/where-page.gif')} alt='lost' />
      <NavLink className={'pagenotfoundgroups'} to={'/groups'}>Return to Groups</NavLink>
    </div>
  )
}

export default PageNotFound;
