import * as React from 'react';
import Try from './TryClass'
import { TryInfo } from './types';

const { Component, createRef } = React;

const getNumbers = () => {
  const candidates = [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ];
  const numberArray = [];
  for(let i = 0; i < 4; i += 1) {
    const chosen = candidates.splice(Math.floor(Math.random() * (9 - i)), 1)[0];
    numberArray.push(chosen);
  }
  return numberArray;
}

interface State {
  answer: number[];
  value: string;
  result: string;
  tries: TryInfo[];
}

class NumberBaseball extends Component<{}, State> {
  state = {
    result: '',
    value: '',
    answer: getNumbers(),
    tries: [],
  };

  onSubmitForm = (e: React.ChangeEvent<HTMLFormElement>) => {
    const { value, answer, tries } = this.state;
    e.preventDefault();
    const input = this.inputRef.current;

    if(value === answer.join('')){   // 정답일 때
      this.setState((prevState) => {
        return {
          result: '홈런!',
          tries: [ ...prevState.tries, { try : value, result: '홈런' }]
        }
      });
      alert('게임을 다시 시작합니다.');
      this.setState({
        value: '',
        answer: getNumbers(),
        tries: []
      });
      if(input) {
        input.focus();
      }
    } else {  // 정답이 아닐때
      const answerArray = value.split('').map((v) => parseInt(v));
      let strike = 0;
      let ball = 0;
      if(tries.length >= 9){
        this.setState({
          result: `10번 이상 틀려서 실패! 답은 ${answer.join('')}입니다.`
        })
        if(input) {
          input.focus();
        }
      } else {
        for(let i = 0; i < 4; i++){
          if(answerArray[i] === answer[i]){
            strike += 1;
          } else if (answer.includes(answerArray[i])){
            ball += 1;
          }
        }
        this.setState((prevState) => {
          return {
            value: '',
            tries: [...prevState.tries, { id: tries.length, try: value, result: `${strike}스트라이크 ${ball}볼 입니다` }]
          }
        });
        if(input) {
          input.focus();
        }
      }
    }
  }

  onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      value: e.target.value
    })
  }

  inputRef = createRef<HTMLInputElement>();

  render() {
    const { result, value, tries } = this.state;

    return (
      <div>
        <div>{result}</div>
        <form onSubmit={this.onSubmitForm}>
          <input
            ref={this.inputRef}
            value={value} 
            onChange={this.onChangeInput} 
            maxLength={4}
          />
          <button type="submit">입력</button>
        </form>
        <div>{tries.length}번째 시도</div>
        <ul>
          {tries.map((v, i) => {
            return (
              <Try key={`${i + 1}시도`} tryInfo={v}/>
            )
          })}
        </ul>
    </div>
    )
  }
}

export default NumberBaseball;