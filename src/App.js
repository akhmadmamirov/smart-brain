import './App.css';
import Navigation from './components/Navigation/Navigation'
import Signin from './components/Signin/Signin'
import Register from './components/Register/Register'
import FaceRecognition from './components/FaceRecognition/FaceRecognition'
import Logo from './components/Logo/Logo'
import Clarifai from 'clarifai';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm'
import Rank from './components/Rank/Rank'
import ParticlesBg from 'particles-bg'
import { Component } from 'react';

const app = new Clarifai.App({
  apiKey: '839847fefc1a442ea31d85c8b182338d'
 });

const  particlesOptions ={
  
}
const initialState = {
    input: '',
    imageUrl: '',
    box: {},
    route: 'signin',
    isSignedIn: false,
    user: {
      id: '',
      name: '',
      email: '',
      entries: 0,
      joined: ''
    }
  }

class App extends Component {
  constructor() {
    super();
    this.state = initialState
  }
  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }
    })
  }
  calculateFaceLocation = (data) =>{
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage')
    const width = Number(image.width);
    const height = Number(image.height)
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height),
    }
  }
  displayFaceBox = (box) =>{
    this.setState({box: box})
  }
  onInputChange = (event) =>{
    this.setState({input: event.target.value});
  }
  onButtonSubmit = () => {
    console.log('click')
    this.setState({imageUrl: this.state.input})
      const USER_ID = 'akhmadillo';
    // Your PAT (Personal Access Token) can be found in the portal under Authentification
    const PAT = '454054a761014081af49cb89a6cc8b5f';
    const APP_ID = 'firstapp';
    // Change these to whatever model and image URL you want to use
    const MODEL_ID = 'face-detection';
    const MODEL_VERSION_ID = '6dc7e46bc9124c5c8824be4822abe105';    
    const IMAGE_URL = this.state.input
    const raw = JSON.stringify({
      "user_app_id": {
          "user_id": USER_ID,
          "app_id": APP_ID
      },
      "inputs": [
          {
              "data": {
                  "image": {
                      "url": IMAGE_URL
                  }
              }
          }
      ]
  });

  const requestOptions = {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Authorization': 'Key ' + PAT
      },
      body: raw
  };

  fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/versions/" + MODEL_VERSION_ID + "/outputs", requestOptions)
  .then(response => response.json())
  .then(result => {
    if (result) {
      fetch('https://damp-ravine-96019.herokuapp.com/image', {
        method: 'put',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          id: this.state.user.id
        })
      })
        .then(result => result.json())
        .then(count => {
          this.setState(Object.assign(this.state.user, { entries: count}))
        })
        .catch(console.log)
    }
    this.displayFaceBox(this.calculateFaceLocation(result))
  })
  .catch(error => console.log('error', error));

}


  onRouteChange = (route) => {
    if (route === 'signout'){
      this.setState(initialState)
    } else if (route === 'home'){
      this.setState({isSignedIn: true})
    }
    this.setState({route: route})
  }

  render(){
    const {isSignedIn, imageUrl, route, box} = this.state;
    return (
      <div className="App">
        <ParticlesBg className='particles'
        config={particlesOptions} type="custom" bg={true} />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
        {route === 'home'
          ?<div>
            <Logo />
            <Rank name={this.state.user.name} entries={this.state.user.entries}/>
            <ImageLinkForm 
              onInputChange={this.onInputChange} 
              onButtonSubmit={this.onButtonSubmit}
              /> 
            <FaceRecognition box={box} imageUrl={imageUrl}/> 
          </div> 
          :(
            route === 'signin' 
            ?<Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
            :<Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
          )
        }
      </div>
    );
  }
 
}

export default App;
