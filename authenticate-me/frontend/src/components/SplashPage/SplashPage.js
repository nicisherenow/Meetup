
const SplashPage = () => {
  return (
    <div id="home-splash">
      <div id='content-container'>
        <h1>Hello and welcome to Meet, Sup?!</h1>
        <p>This is a fun new project where you can come to meet like-minded
          folks, find people with shared interests, and make friendships
          that can last a lifetime.</p>
        <img id='group-image' src={require('../../Images/group-image.jpg')} alt='group'/>
      </div>
    </div>
  )
}

export default SplashPage;
