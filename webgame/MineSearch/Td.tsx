import * as React from 'react';
import { useContext, memo, FC, useCallback } from 'react';
import { TableContext, CODE, Codes } from './MineSearch';
import { openCell, clickMine, flagCell, questionCell, normalizeCell } from './action'

interface Props {
  rowIndex: number;
  cellIndex: number;
}

const getTdStyle = (code: Codes) => {
  switch(code){
    case CODE.NORMAL:
    case CODE.MINE:
      return {
        background: '#666',
        boxShadow: '2px 2px rgba(0, 0, 0, 0.4) inset'
      }
    case CODE.CLICKED_MINE:
    case CODE.OPENED:   
      return {
        background: '#fff',
      }
    case CODE.FLAG:
    case CODE.FLAG_MINE:
      return {
        background: '#f9ca24',
      }
    case CODE.QUESTION:
    case CODE.QUESTION_MINE:
      return {
        background: '#ff7979',
      }
    default:
      return {
        bakcground: '#fff'
      };
  }
};

const getTdText = (code: Codes) => {
  switch(code){
    case CODE.NORMAL:
      return '';
    case CODE.MINE:
      return 'π£';
    case CODE.CLICKED_MINE:
      return 'π₯';
    case CODE.FLAG:
    case CODE.FLAG_MINE:
      return 'π³οΈβπ';
    case CODE.QUESTION:
    case CODE.QUESTION_MINE:
      return 'β'
    default:
      return code || ''; // μ½λκ° 0μ΄λ©΄ λΉλ¬Έμ
  }
}


const Td :FC<Props> = ({ rowIndex, cellIndex }) => {
  const { tableData, dispatch, halted } = useContext(TableContext);

  const onClickTd = useCallback(() => {
    if(halted) return;

    switch( tableData[rowIndex][cellIndex]) {
      // ν΄λ¦­ λ§κΈ°
      case CODE.OPENED:
      case CODE.FLAG_MINE:
      case CODE.FLAG:
      case CODE.QUESTION_MINE:
      case CODE.QUESTION:
        return;
      case CODE.NORMAL:
        dispatch(openCell(rowIndex, cellIndex));
        return;
      case CODE.MINE:
        dispatch(clickMine(rowIndex, cellIndex));
        return;
      default:
        return;
    }
  }, [tableData[rowIndex][cellIndex], halted]);

  const onRightClickTd = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    if(halted) return;

    switch( tableData[rowIndex][cellIndex]) {
      case CODE.NORMAL:
      case CODE.MINE:
        dispatch(flagCell(rowIndex, cellIndex)); // κΉλ°μ μ¬λλ€
        return;
      case CODE.FLAG_MINE:
      case CODE.FLAG:
        dispatch(questionCell(rowIndex, cellIndex)); // λ¬Όμνλ₯Ό νμνλ€.
        return;
      case CODE.QUESTION_MINE:
      case CODE.QUESTION:
        dispatch(normalizeCell(rowIndex, cellIndex)); // λ³΄ν΅μΉΈμΌλ‘ λλλ¦°λ€
        return;
      default:
        return;
    }
  }, [tableData[rowIndex][cellIndex], halted]);

  return (
    <RealTd
      onClickTd={onClickTd}
      onRightClickTd={onRightClickTd}
      data={tableData[rowIndex][cellIndex]}
    />
  )
};

interface RealTdProps {
  onClickTd: () => void;
  onRightClickTd: (e: React.MouseEvent) => void;
  data: Codes;
}

const RealTd: FC<RealTdProps> = memo(({ onClickTd, onRightClickTd, data }) => {
  return (
    <td
      style={getTdStyle(data)}
      onClick={onClickTd}
      onContextMenu={onRightClickTd}
    >{getTdText(data)}</td>
  );
})

export default memo(Td);