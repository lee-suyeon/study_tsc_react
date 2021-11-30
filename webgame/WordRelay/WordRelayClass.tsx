import * as React from 'react';
import { Component, createRef } from 'react'

interface State {
  word: string;
  value: string;
  result: string;
}

class WordRelayClass extends Component<{}, State> {
  state = {
    word: '스루비',
    value: '',
    result: '',
  }

  onSubmitForm = (e : React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { word, value } = this.state;
    const input = this.onRefInput.current;

    if(word[word.length - 1] === value[0]){
      this.setState({
        word: value,
        value: '',
        result: 'good'
      })
      if(input) {
        input.focus();
      }
    } else {
      this.setState({
        result: 'WRONG',
        value: ''
      })
      if(input) {
        input.focus();
      }
    }
  }

  onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ value: e.target.value });
  }
  
  onRefInput = createRef<HTMLInputElement>();

  render() {
    const { word, value, result } = this.state;

    return (
      <>
        <div>{word}</div>
        <form onSubmit={this.onSubmitForm}>
          <input 
            ref={this.onRefInput}
            value={value}
            onChange={this.onChange}
          />
          <div>{result}</div>
        </form>
      </>
    )
  }
}

export default WordRelayClass;