import './SplashPage.css'

const SplashPage = () => {
  return (
    <div id="home-splash">
      <div className='splash-container'>
      <div id='splash-content-container'>
        <h1>Hello and welcome to Meet, Sup?!</h1>
        <p>This is a fun new project where you can come to meet like-minded
          folks, find people with shared interests, and make friendships
          that can last a lifetime. Hopefully you can make a few new pals that
          will have some of the same shared interests as you do!</p>
      </div>
      <div id='splash-picture-container'>
        <img id='group-image' src={require('../../Images/group-image.jpg')} alt='group'/>
      </div>
      </div>
      <div id='where-to-start'>
        <p>Not sure where to start!? Feel free to sign up, or login if you already have!</p>
      </div>
    </div>
  )
}

export default SplashPage;
