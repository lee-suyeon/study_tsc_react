import * as React from 'react';
import { Component } from 'react';
import Balls from './BallClass';

const getWinNumbers = () => {
  const candidate = Array(45).fill(null).map((v, i) => i + 1);
  const shuffle = [];
  while (candidate.length > 0) {
    shuffle.push(candidate.splice(Math.floor(Math.random() * candidate.length), 1)[0]);
  }
  const bonusNumber = shuffle[shuffle.length - 1];
  const winNumbers = shuffle.slice(0, 6).sort((p, c) => p - c);

  return [...winNumbers, bonusNumber];
}

interface State {
  winNumbers: number[];
  winBalls: number[];
  bonus: number | null;
  redo : boolean;
}

class Lotto extends Component<{}, State> {
  state: State = {
    winNumbers: getWinNumbers(), // 숫자를 미리 뽑아둔다. 
    winBalls: [], // 당첨 공
    bonus: null, // 보너스 공
    redo : false // reset
  };
  timeouts: number[] = [];
  
  lotteryBalls = () => {
    const { winNumbers } = this.state;
    for(let i = 0; i < winNumbers.length - 1; i++){
      this.timeouts[i] = window.setTimeout(() => {
        this.setState((prevState) => {
          return {
            winBalls: [...prevState.winBalls, winNumbers[i]]
          }
        })
      }, 1000 * (i + 1));
    }
    this.timeouts[6] = window.setTimeout(() => {
      this.setState({
        bonus : winNumbers[6],
        redo: true,
      })
    }, 7000);
  }

  componentDidMount() {
    this.lotteryBalls();
  }

  componentDidUpdate(prevProps: {}, prevState: State) {
    if(this.timeouts.length === 0){
      this.lotteryBalls();
    }
  }

  componentWillUnmount() {
    this.timeouts.forEach((v) => {
      clearTimeout(v);
    });
  }

  onClickRedo = () => {
    this.setState({
      winNumbers: getWinNumbers(), 
      winBalls: [],
      bonus: null,
      redo : false
    });
    this.timeouts = [];
  }

  render() {
    const { winBalls, bonus, redo } = this.state;
    return (
      <div id="Lotto">
        <div id="numbers">당첨 숫자</div>
        <div id="result">
            {winBalls.map((v) => <Balls key={v} number={v} />)}
        </div>
        <div id="bonus">보너스</div>
          { bonus && <Balls number={bonus} />}
          { redo ? <button className="redo" onClick={this.onClickRedo}>한번 더!</button> : null}
      </div>
    )
  }
}


export default Lotto;