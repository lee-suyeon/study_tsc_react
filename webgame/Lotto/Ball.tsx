import * as React from 'react';
import { FunctionComponent } from 'react';

const Ball: FunctionComponent<{ number: number}> = ({ number }) => {
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
};

export default Ball;