import * as React from 'react';
import { useState, useRef, useEffect } from 'react';

const rspCoords = {
  rock : '0',
  scissors : '-142px',
  paper : '-284px'
} as const;

const scores = {
  rock : 0,
  scissors : -1,
  paper : 1
} as const;

type ImgCoords = typeof rspCoords[keyof typeof rspCoords]; // '0' | '-142px' | '-284px';

const computerChoice = (imgCoords: ImgCoords) => {
  return (Object.keys(rspCoords) as ['rock', 'scissors', 'paper']).find((k) => {
    return rspCoords[k] === imgCoords;
  })!;
}

const RSP = () => {
  const[result, setResult] = useState('');
  const[imgCoord, setImgCoord] = useState<ImgCoords>(rspCoords.rock);
  const[score, setScore] = useState(0);
  const interval = useRef<number>();

  useEffect(() => {
    interval.current = window.setInterval(changeHand, 200);
    return () => {
      clearInterval(interval.current);
    }
  }, [ imgCoord ]); 

  const changeHand = () => {
    if (imgCoord === rspCoords.rock){
      setImgCoord(rspCoords.scissors);
    } else if(imgCoord === rspCoords.scissors){
      setImgCoord(rspCoords.paper);
    } else if(imgCoord === rspCoords.paper){
      setImgCoord(rspCoords.rock);
    }
  }

  const onClickBtn = (choice: keyof typeof rspCoords) => () => {
    clearInterval(interval.current);
    const myScore = scores[choice];
    const cpuScore = scores[computerChoice(imgCoord)];
    const diff = myScore - cpuScore;
    if(diff === 0) { 
      setResult( '비겼습니다.')
    } else if([-1, 2].includes(diff)){
      setResult('You win!');
      setScore((prevScore) =>prevScore + 1);
    } else {
      setResult('You lose..');
      setScore((prevScore) => prevScore - 1);
    }
    setTimeout(() => {
      interval.current = window.setInterval(changeHand, 200);
    }, 1000)
  };


  return (
    <div id="RPS">
      <div id="computer" style={{ height: '200px', background: `url(https://en.pimg.jp/023/182/267/1/23182267.jpg) ${imgCoord} 0 `}}></div>
      <div>
        <button id="rock" className="btn" onClick={onClickBtn('rock')}>바위</button>
        <button id="scissor" className="btn" onClick={onClickBtn('scissors')}>가위</button>
        <button id="paper" className="btn" onClick={onClickBtn('paper')}>보</button>
      </div>
      <div>{result}</div>
      <div>현재 : {score}점</div>
    </div>
  );
}

export default RSP;