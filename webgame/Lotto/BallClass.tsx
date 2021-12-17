import * as React from 'react';
import { Component } from 'react';

class Balls extends Component<{ number: number }> {
  render () {
    const { number } = this.props;
    let background;
    if(number <= 10) {
      background = '#fcbdab';
    } else if(number <= 20){
      background = '#94d183';
    } else if(number <= 30){
      background = '#6ebda8';
    } else if(number <= 40){
      background = '#269493';
    } else {
      background = '#20485a';
    }
    return (
      <div className="ball" style={{ background }}>{number}</div>
    )
  }
}

export default Balls;