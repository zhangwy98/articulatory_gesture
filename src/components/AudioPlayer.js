import React from 'react';
import Waveform from 'waveform-react';
import D2_audio from '../public/D2_audio.wav'

class AudioPlayer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            play: false,
            segmentStart: 1.2,
            segmentEnd: 2.2,
            playbackRate: 1,
            buffer: null,
            context: this.getContext()
        }
        this.audio = new Audio(D2_audio);
        this.audio.segmentEnd = this.state.segmentEnd;
        this.audio.playbackRate = this.state.playbackRate;
        const context = this.getContext();
        this.getFile('test', context)
    }
  
    componentDidMount() {
        this.audio.addEventListener('ended', () => this.setState({ play: false }));
        this.audio.addEventListener('timeupdate', function () {
          if (this.segmentEnd && this.currentTime >= this.segmentEnd) {
            this.pause();
          }
        }, false)
    }
    
    componentWillUnmount() {
      this.audio.removeEventListener('ended', () => this.setState({ play: false }));  
    }


    getAudioBuffer = async (path, context) => {
      return fetch('../public/D2_audio.ogg')
      .then(function(response) {
        return response.arrayBuffer();
      })
      .then(function(buffer) {
        console.log(buffer)
        // context.decodeAudioData(buffer, function(decodedData) {
        //   this.setState({buffer: decodedData});
        // })
      })


      // const response = await fetch('../public/D2_audio.ogg');
      // const audioData = await response.arrayBuffer();
      // console.log(audioData)
      // return new Promise((resolve, reject) => {
      //   context.decodeAudioData(audioData, buffer => {
      //     return resolve(buffer);
      //   })
      // })
    }

    getContext = () => {
      window.AudioContext =
        window.AudioContext ||
        window.webkitAudioContext
        // window.mozAudioContext ||
        // window.oAudioContext;
      const context = new AudioContext();
      return context;
    };


    getFile = async (path, context) => {
      const buffer = await this.getAudioBuffer(path, context);
    }
     
    playSegment = () => {
      this.getFile('../public/D2_audio.ogg', this.state.context)
      if (this.state.play === false) {
        this.audio.currentTime = this.state.segmentStart;
        this.setState({play: true});
        this.audio.play();
      } else {
        this.setState({play: false});
        this.audio.pause();
      }
    } 

    render() {
      return (
        <div>
          <button onClick={this.playSegment}>{this.state.play ? 'Pause' : 'Play'}</button>
          <Waveform
            buffer={this.state.buffer}
          ></Waveform>
        </div>
      );
    }
  }
  
  export default AudioPlayer;