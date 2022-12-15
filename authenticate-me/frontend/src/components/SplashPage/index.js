import './SplashPage.css'
import Footer from '../Footer';

const SplashPage = () => {
  return (
    <div id="home-splash">
      <div className='splash-container'>
      <div id='splash-content-container'>
        <h1>Hello and welcome to Meet, Sup?!</h1>
        <p>This is a fun new project where you can come to meet like-minded
          folks, find people with shared interests, and make friendships
          that can last a lifetime.</p>
      </div>
      <div id='picture-container'>
        <img id='group-image' src={require('../../Images/group-image.jpg')} alt='group'/>
      </div>
      </div>
      <Footer />
    </div>
  )
}

export default SplashPage;
