import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Hls from 'hls.js'

const contractAbi = require('./LedgerChannel.json').abi

const contractAddress = '0xb80996993505eb2d95efb775333b1a5c2708086f'
const ingridAddress = '0x8ec75ef3adf6c953775d0738e0e7bd60e647e5ef'

const STREAM_ID = 'd8072aae72b84c63f1136e6a525dfef04e2ca5f39f232874da4a4a45372b2ebd'
const SOURCE = 'http://localhost:8935/stream/' + STREAM_ID + '.m3u8'

class App extends Component {
  constructor( ) {
    super()
    window.web3.eth.getAccounts((err, ac) => {
      this.setState({ masterAccount: ac[0] })
      // init contract
      this.web3 = window.web3
      this.contract = this.web3.eth.contract(contractAbi).at(contractAddress)
    })
    window.delegateWeb3.eth.getAccounts((err, ac) => {
      this.delegateWeb3 = window.delegateWeb3
      this.setState({ delegateAccount: ac[0] })
    })
    this.state = {
      masterAccount: '0x',
      delegateAccount: '0x',
        videoStyle: {display: 'hidden'}
    }
    this.videoRef = React.createRef()
  }

  registerDelegateKey = async () => {
    let tx = await new Promise((resolve, reject) => {
      this.contract.registerDelegateKey(this.state.delegateAccount, { from: this.state.masterAccount }, (err, tx) => {
        err ? reject(err) : resolve(tx)
      })
    })
    console.log(tx)
      this.setState({
          videoStyle: {display: 'block'}
      })
  }

  componentDidMount () {
      if(Hls.isSupported()) {
          var hls = new Hls();
          hls.loadSource(SOURCE);
          hls.attachMedia(this.videoRef.current);
      }
  }

  handlePlay () {
      let video = this.videoRef.current
      video.play()
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          Master Account: {this.state.masterAccount}
        </p>
        <p className="App-intro">
          Delegate Account: {this.state.delegateAccount}
        </p>
        <button onClick={this.registerDelegateKey}>Register Delegate Key</button>
        <hr />
          <div style={this.state.videoStyle}>
            <button onClick={this.handlePlay.bind(this)}>Play</button>
            <div className='video-container'>
                <video ref={this.videoRef}/>
            </div>
          </div>
      </div>
    );
  }
}

export default App;
