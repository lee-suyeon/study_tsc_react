import * as React from 'react';
import { Dispatch, FunctionComponent, useCallback } from 'react';
import { clickCell } from './TicTacToe';

interface Props {
  rowIndex: number;
  cellIndex: number;
  dispatch: Dispatch<any>;
  cellData: string;
  children: string;
}

const Td:FunctionComponent<Props> = ({ rowIndex, cellIndex, dispatch, cellData }) => {
  const onClickTd = useCallback(() => {
    if(cellData) {
      return;
    }
    dispatch(clickCell(rowIndex, cellIndex));
  }, [cellData])

  return (
    <td onClick={onClickTd}>{cellData}</td>
  )
}

export default Td;