import * as React from 'react';
import { Component } from 'react'

interface State {
  first: number;
  second: number;
  value: string;
  result: string;
}

class GuGuDan extends Component<{}, State> {
  state = {
    first: Math.ceil(Math.random() * 9),
    second: Math.ceil(Math.random() * 9),
    value: '',
    result: '',
  }

  onSubmitForm = (e : React.FormEvent<HTMLFormElement>) => {
    const { value, first, second } = this.state;
    e.preventDefault();

    if(parseInt(value) === first * second) {
      this.setState((prevState) => {
        return {
          result: `${prevState.value} is the correct answer!`,
          first: Math.ceil(Math.random() * 9),
          second: Math.ceil(Math.random() * 9),
          value: '',
        }
      });
      if(this.input) {
        this.input.focus();
      }
    } else { // awrong answer
      this.setState({
        result: 'WRONG',
        value: ''
      })
      if(this.input) {
        this.input.focus();
      }
    }
  }

  onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ value: e.target.value });
  }
  
  input: HTMLInputElement | null = null;
  onRefInput = (c: HTMLInputElement) => { this.input = c; };

  render() {
    const { first, second, value, result } = this.state;

    return (
      <>
        <div>{first} X {second} = ?</div>
        <form onSubmit={this.onSubmitForm}>
          <input 
            ref={this.onRefInput}
            type="number"
            value={value}
            onChange={this.onChange}
          />
          <div>{result}</div>
        </form>
      </>
    )
  }
}

export default GuGuDan;