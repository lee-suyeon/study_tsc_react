import * as React from 'react';
import { useRef, useState, useCallback } from 'react';
import Try from './Try'
import { TryInfo } from './types';

const getNumbers = () => {
  const candidates = [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ];
  const numberArray = [];
  for(let i = 0; i < 4; i += 1) {
    const chosen = candidates.splice(Math.floor(Math.random() * (9 - i)), 1)[0];
    numberArray.push(chosen);
  }
  return numberArray;
}

function NumberBaseball() {
  const [ answer, setAnswer ] = useState(getNumbers());
  const [ value, setValue ] = useState('');
  const [ result, setResult ] = useState('');
  const [ tries, setTries ] = useState<TryInfo[]>([]);
  const inputEl = useRef<HTMLInputElement>(null);

  const onSubmitForm = useCallback((e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = inputEl.current;
    if(value === answer.join('')){   // 정답일 때
      setResult('홈런!');
      setValue('');
      setAnswer(getNumbers());
      setTries((prevTries) => {
          return [...prevTries, { try : value, result: '홈런' }]
      });
      if(input) {
        input.focus();
      }
    } else {  // 정답이 아닐때
      const answerArray = value.split('').map((v) => parseInt(v));
      let strike = 0;
      let ball = 0;
      if(tries.length >= 9){
        setResult(`10번 이상 틀려서 실패! 답은 ${answer.join('')}입니다.`);
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
        setValue('');
        setTries((prevTries) => {
          return [...prevTries, { id: tries.length, try: value, result: `${strike}스트라이크 ${ball}볼 입니다` }]
        })
      }
    }
  }, [value, answer]);

  return (
    <div>
      <div>{result}</div>
      <form onSubmit={onSubmitForm}>
        <input
          ref={inputEl} 
          value={value} 
          onChange={(e) => setValue(e.target.value)} 
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

export default NumberBaseball;