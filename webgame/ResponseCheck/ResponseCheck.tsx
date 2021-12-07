import * as React from 'react';
import { useState, useRef, useCallback } from 'react';

const ResponseCheck = () => {
  const [ state, setState ] = useState('waiting');
  const [ message, setMessage ] = useState('');
  const [ result, setResult ] = useState<number[]>([]);
  const timeOut = useRef<number | null>(null);
  const startTime = useRef(0);
  const endTime = useRef(0);

  const onClickScreen = useCallback(() => {
    if(state === 'waiting'){
      timeOut.current = window.setTimeout(()=> {
        setState('now');
        setMessage('지금 클릭');
        startTime.current = new Date().getTime();
      },Math.floor(Math.random() * 1000) + 2000) as unknown as number; 
      setState('ready');
      setMessage('초록색이 되면 클릭하세요');
    } else if (state === 'ready'){
      if(timeOut.current) {
        clearTimeout(timeOut.current);
        setState('waiting');
        setMessage( '너무 성급하시군요. 초록색이 된 후에 클릭하세요')
      }
    } else  if (state === 'now'){ 
      endTime.current = new Date().getTime();
      setState('waiting');
      setMessage('클릭해서 시작하세요.');
      setResult((prevResult) => {
        return [...prevResult, endTime.current - startTime.current]
      });
    }
  }, [state]);

const onReset = useCallback(() => {
  setResult([]);
}, []);

const renderAverage = () => {
  return result.length === 0
    ? null
    : <>
      <div>평균 시간: {result.reduce((a, c) => a + c) / result.length}ms</div>
      <button onClick={onReset}>리셋</button>
    </>
};

  return (
    <>
      <div
        id="screen"
        className={state}
        onClick={onClickScreen}
      >
        {message}
      </div>
      {renderAverage()}
    </>
  )
}

export default ResponseCheck;