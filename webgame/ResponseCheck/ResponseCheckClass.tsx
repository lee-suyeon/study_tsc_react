import * as React from 'react';
import { Component } from 'react';

interface State {
  state: 'waiting' | 'now' | 'ready';
  message: string;
  result: number[];
}

class ResponseCheckClass extends Component<{}, State> {  
  state: State = {
    state : 'waiting', 
    message : '⚡️ Click anywhere to start ⚡️',
    result : []
  }

  startTime: number | null = null;
  endTime: number | null = null;
  timer: number | null = null;

  onClickScreen = () => {
    const { state, message, result } = this.state;
    if(state === 'waiting'){
      this.setState({
        state : 'ready',
        message: 'Wait for green 🍀'
      });
      this.timer = window.setTimeout(() => {
        this.setState({
          state: 'now',
          message: 'Click! 👌'
        });
        this.startTime = new Date().getTime();
      }, Math.floor(Math.random() * 1000) + 2000);
    }
    if (state === 'ready'){
      if(this.timer) {
        clearTimeout(this.timer);
      }
      this.setState({
        message: 'Too soon 🙅‍♀️'
      });
      window.setTimeout(() => {
        this.setState({
          state: 'waiting',
          message: '⚡️ Click anywhere to start ⚡️'
        });
      }, 1000);
  } else if(state === 'now'){
    this.endTime = new Date().getTime();
    this.setState((prevState) => {
      return {
        state: 'waiting',
        message: '⚡️ Click anywhere to start ⚡️',
        result : [ ...prevState.result, this.endTime! - this.startTime! ]
      }
    });
  }
}

renderAverage = () => {
  const { result } = this.state;
  return result.length === 0 
    ? null 
    : <div className="average"> Average : {result.reduce((a, c) => a + c ) / result.length}ms</div>
  {/* {result.length !== 0 && <div className="average">평균시간 : {result.reduce((a, c) => a + b ) / result.length}ms</div>} */}
}

render () {
  const { state, message } = this.state;
  return (
    <div id="responseCheck">
      <div 
        id="screen" 
        className={state} 
        onClick={this.onClickScreen}>{message}
        <div className="average">{this.renderAverage()}</div>
      </div>
    </div>
  )
}
}

export default ResponseCheckClass;