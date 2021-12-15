import * as React from 'react';
import { Component } from 'react';

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

interface State {
  result: string,
  imgCoords: ImgCoords,
  score: number
}

class RSP extends Component<{}, State> {
  state: State = {
    imgCoords : rspCoords.rock,
    result: '❓❓❓',
    score: 0,
  }
  interval: number | null = null;

  componentDidMount() {
    this.interval = window.setInterval(this.changeHand, 100);
  }

  componentWillUnmount() {
    window.clearInterval(this.interval!);
  }

  changeHand = () => {
    const { imgCoords } = this.state;
    if(imgCoords === rspCoords.rock){
      this.setState({
        imgCoords : rspCoords.scissors
      });
    } else if(imgCoords === rspCoords.scissors){
      this.setState({
        imgCoords : rspCoords.paper
      });
    } else if(imgCoords === rspCoords.paper){
      this.setState({
        imgCoords : rspCoords.rock
      });
    }
  };

  onClickButton = (choice: keyof typeof rspCoords) => (e: React.MouseEvent) => {
    const { imgCoords } = this.state;
    clearInterval(this.interval!);
    const myScore = scores[choice];
    const computerScore = scores[computerChoice(imgCoords)!];
    const scoreCount = myScore - computerScore;
    if(scoreCount === 0){
      this.setState({
        result : "DRAW😌"
      });
    } else if([1, -2].includes(scoreCount)) { //scoreCount === 1 || scoreCount === -2
      this.setState((prevState) => {
        return {
          result : "You Win!😆",
          score : prevState.score + 1
        }
      });
    } else { 
      this.setState((prevState) => {
        return {
          result : "You Lose😢",
          score : prevState.score - 1
        }
      });
    }
    setTimeout(() => {
      this.interval = window.setInterval(this.changeHand, 100);
    }, 1000)
  }


  render () {
    const { result, score, imgCoords } = this.state;
    return (
      <div id="RPS">
        <div id="computer" style={{backgroundPosition : `${imgCoords} center`}}></div>
        <div className="result">{result}</div>
        <div className="buttons">
          <button id="rock" className="button" onClick={this.onClickButton('rock')}>rock</button>
          <button id="scissors" className="button" onClick={this.onClickButton('scissors')}>scissors</button>
          <button id="paper" className="button" onClick={this.onClickButton('paper')}>paper</button>
        </div>
        <div className="score">SCORE : {score}</div>
      </div>
    )
  }
}

export default RSP; 