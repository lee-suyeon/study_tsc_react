import * as React from 'react';
import { useState, useRef } from 'react';

const GuGuDan = () => {
  const [ first, setFirst ] = useState(Math.ceil(Math.random() * 9))
  const [ second, setSecond ] = useState(Math.ceil(Math.random() * 9))
  const [ value, setValue ] = useState('');
  const [ result, setResult ] = useState('');
  const inputEl = useRef<HTMLInputElement>(null);

  const onSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = inputEl.current;

    // correct answer
    if(parseInt(value) === first * second) {
      setResult("That's the correct answer!");
      setFirst(Math.ceil(Math.random() * 9));
      setSecond(Math.ceil(Math.random() * 9));
      setValue('');
      if(input) {
        input.focus();
      }
    } else { // awrong answer
      setResult("WRONG!");
      if(input) {
        input.focus();
      }
    }
  }

  return (
    <>
      <div>{first} X {second} = ?</div>
      <form onSubmit={onSubmitForm}>
        <input 
          ref={inputEl}
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <div>{result}</div>
      </form>
    </>
  )
}

export default GuGuDan;