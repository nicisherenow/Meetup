import './AboutPage.css'

const AboutPage = () => {

  return (
    <div id='about-page-container'>
      <div id='about-page-image-container'>
        <img src={require('../../Images/creator-pic.png')} alt='me' id='me-image' />
      </div>
      <div id='brief-intro-container'>
        <h1>About Me: </h1>
        <h2>My name is Nicholas Talbot, but I commonly go by Nic.</h2>
        <h3>That painting was painted by my grandma.</h3>
        <p>When I have spare time, I enjoy going hiking, working out, and just being active overall.</p>
        <p>I really appreciate you taking the time to come and checkout this page on my very first project.
          It has been lots of fun and a great learning opportunity.
        </p>
        <p>Enough about me, I hope you enjoyed my site! It's definitely still a work in progress but I am always eager to learn and love a
           fun challenge.
        </p>
      </div>
    </div>
  )
}

export default AboutPage;
