import React, { Component } from 'react';
import  moment  from 'moment'
// import logo from './logo.svg';
import './App.css';

const Header = () => (<h1>Pomodoro Clock</h1>)

const SetTimer = ({ type, value, handleClick  }) => (
  <div className = "lenght">
    <h2 id = {`${type}-label`}>{type === "session" ? "Session " : "Break "}Length</h2>
    <div className = "incre-decre">
      <button id = {`${type}-decrement`} onClick={() => handleClick(false, `${type}Value`)}>-</button>
      <div className = "breakSession" id = {`${type}-length`}>{value}</div>
      <button id = {`${type}-increment`} onClick={() => handleClick(true, `${type}Value`)}>+</button>
    
    </div>
  </div>
)

const Timer = ({ mode, time}) => (
<div className = "timer">
<h1  className = "timer-label" id = "timer-label">{mode === "session" ? "Working " : "Break "}</h1>  
<h1 className = "time-left" id = "time-left">{time}</h1>
</div>
)
const Controls = ({ active, handleReset, handlePlayPause }) => (
  <div className = "start-reset">
    <button className = "myButton" id = "start_stop" onClick = {() => handlePlayPause()}>{active ? "Pause" : "Start"}</button>
    <button className = "myButton" id = "reset" onClick = {() => handleReset()}>Reset</button>
  </div>
)

class App extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      breakValue: 5,
      sessionValue: 25,
      mode: "session",
      time: 25 * 60 * 1000,
      active: false,
      sessionActive: false
    }
  }
  
  componentDidUpdate(prevProps, prevState){
    if(prevState.time === 0 && prevState.mode === "session"){
      this.setState({ time: this.state.breakValue * 60 * 1000, mode: "break" })
      this.audio.play()
    }
    if(prevState.time === 0 && prevState.mode === "break"){
      this.setState({ time: this.state.sessionValue * 60 * 1000, mode: "session" })
      this.audio.play()
    }
  }
  
  handleSetTimer = (inc, type) => {
     if (inc && this.state[type] === 60) return
     if (!inc && this.state[type] === 1) return
     this.setState({ [type]: this.state[type] + (inc ? 1 : -1) })
  }
  
  handleReset = () => {
    this.setState({ breakValue: 5, sessionValue: 25, mode: "session", time: 25 * 60 * 1000, active: false, sessionActive: false })
    clearInterval(this.countdown)
    this.audio.pause()
    this.audio.currentTime = 0
  }
  
  handlePlayPause = () => {
    if(this.state.active){
      clearInterval(this.countdown)
      this.setState({ active:false})
       }else{
         if(this.state.sessionActive){
            this.countdown = setInterval(()=> this.setState({time: this.state.time-1000}), 1000)
            this.setState({ active:true })  
            }else{
             this.setState({
               time: this.state.sessionValue * 60 * 1000,
               sessionActive: true,
               active: true}, () => this.countdown = setInterval(()=> this.setState({time: this.state.time-1000}), 1000))          
             
           
         }
       
    }   
    
  }
  
  render(){
    return(
    <div className = "container">
        <Header />
        <div className = "incre-decre">
        <SetTimer type = "break" value={this.state.breakValue} handleClick = {this.handleSetTimer}/>
        <Timer mode = {this.state.mode} time = {moment(this.state.time).format("mm:ss")} />
        <SetTimer type = "session" value={this.state.sessionValue} handleClick = {this.handleSetTimer}/>
        </div>
        <Controls active = {this.state.active} handlePlayPause = {this.handlePlayPause} handleReset = {this.handleReset} />
        <audio id="beep" src = "https://www.soundjay.com/mechanical/sounds/clong-2.mp3" ref = {element => this.audio = element}></audio>
    <footer>Coded and designed by Noel Miranda</footer>
      </div>
      
    )
  }
}


export default App;
