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
      return '💣';
    case CODE.CLICKED_MINE:
      return '💥';
    case CODE.FLAG:
    case CODE.FLAG_MINE:
      return '🏳️‍🌈';
    case CODE.QUESTION:
    case CODE.QUESTION_MINE:
      return '❓'
    default:
      return code || ''; // 코드가 0이면 빈문자
  }
}


const Td :FC<Props> = ({ rowIndex, cellIndex }) => {
  const { tableData, dispatch, halted } = useContext(TableContext);

  const onClickTd = useCallback(() => {
    if(halted) return;

    switch( tableData[rowIndex][cellIndex]) {
      // 클릭 막기
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
        dispatch(flagCell(rowIndex, cellIndex)); // 깃발을 심는다
        return;
      case CODE.FLAG_MINE:
      case CODE.FLAG:
        dispatch(questionCell(rowIndex, cellIndex)); // 물음표를 표시한다.
        return;
      case CODE.QUESTION_MINE:
      case CODE.QUESTION:
        dispatch(normalizeCell(rowIndex, cellIndex)); // 보통칸으로 되돌린다
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