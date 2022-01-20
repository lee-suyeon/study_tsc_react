import * as React from 'react';
import { TableContext } from './MineSearch';
import { useState, useCallback, useContext, memo } from 'react';
import { startGame } from './action';

const Form = () => {
  const [row, setRow] = useState(10); 
  const [cell, setCell] = useState(10); 
  const [mine, setMine] = useState(20); 
  const { dispatch } = useContext(TableContext);


  const onChangeRow = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setRow(Number(e.target.value));
  },[]);

  const onChangeCell = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      setCell(Number(e.target.value));
  },[]);

  const onChangeMine = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      setMine(Number(e.target.value));
  },[]);

  const onClickBtn = useCallback(() => {
    dispatch(startGame(row, cell, mine));
  },[row, cell, mine]);

  return (
    <form>
      <label>row
        <input type="number" placeholder="row" value={row} onChange={onChangeRow} />
      </label>
      <label>cell
        <input type="number" placeholder="cell" value={cell} onChange={onChangeCell} />
      </label>
      <label>mine
        <input type="number" placeholder="mine" value={mine} onChange={onChangeMine} />
      </label>
      <button onClick={onClickBtn}>Start</button>
    </form>
  )
}

export default memo(Form);