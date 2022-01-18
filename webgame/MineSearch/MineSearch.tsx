import * as React from 'react';
import { useEffect, useReducer, useMemo, Dispatch, createContext } from 'react';
import Table from './Table';
import Form from './Form';

export const CODE = {
  MINE: -7,
  NORMAL: -1,
  QUESTION: -2,
  FLAG: -3,
  QUESTION_MINE: -4,
  FLAG_MINE: -5,
  CLICKED_MINE: -6,
  OPENED: 0
} as const;

interface Context {
  tableData: number[][],
  halted: boolean,
  dispatch: Dispatch<ReducerActions>
}

export const TableContext = createContext<Context>({
  tableData: [],
  halted: true,
  dispatch: () => {}
})

interface ReducerState {
  tableData: number[][],
  data: {
    row: number,
    cell: number,
    mine: number,
  },
  timer: number,
  result: string,
  halted: boolean,
  openedCount: number,
}

const initialState: ReducerState = {
  tableData: [],
  data: {
    row: 0,
    cell: 0,
    mine: 0,
  },
  timer: 0,
  result: "",
  halted: true,
  openedCount: 0
}

const plantMine = (row: number, cell: number, mine: number) => {
  const candidate = Array(row*cell).fill(null).map((arr, i) => {
    return i;
  });

  const shuffle = [];
  while (candidate.length > row * cell - mine){
    const chosen = candidate.splice(Math.floor(Math.random() * candidate.length), 1)[0];
    shuffle.push(chosen);
  }

  const data = [];
  for(let i = 0; i < row; i++){
    const rowData: number[] = [];
    data.push(rowData);
    for(let j = 0; j < cell; j++){
      rowData.push(CODE.NORMAL);
    }
  }

  for(let m = 0; m < shuffle.length; m++){
    const ver = Math.floor(shuffle[m] / cell);
    const hor = shuffle[m] % cell;
    data[ver][hor] = CODE.MINE;
  }
  return data; 
}

export const START_GAME = 'START_GAME' as const;
export const OPEN_CELL = 'OPEN_CELL' as const;
export const CLICK_MINE = 'CLICK_MINE' as const;
export const FLAG_CELL = 'FLAG_CELL' as const;
export const QUESTION_CELL = 'QUESTION_CELL' as const;
export const NORMALIZE_CELL = 'NORMALIZE_CELL' as const;
export const INCREMENT_TIMER = 'INCREMENT_TIMER' as const;


interface StartGameAction {
  type: typeof START_GAME,
  row: number,
  cell: number,
  mine: number
}

const startGame = (row: number, cell:number, mine: number): StartGameAction => {
  return { 
    type: START_GAME, row, cell, mine 
  }
}

interface OpenCellAction {
  type: typeof OPEN_CELL,
  row: number,
  cell: number
}

const openCell = (row: number, cell:number): OpenCellAction => {
  return { 
    type: OPEN_CELL, row, cell 
  }
}

interface ClickMineAction {
  type: typeof CLICK_MINE,
  row: number,
  cell: number,
}

const clickMine = (row: number, cell:number): ClickMineAction => {
  return { 
    type: CLICK_MINE, row, cell 
  }
}

interface FlagCellAction {
  type: typeof FLAG_CELL,
  row: number,
  cell: number,
}

const flagCell = (row: number, cell:number): FlagCellAction => {
  return { 
    type: FLAG_CELL, row, cell 
  }
}

interface QuestionCellAction {
  type: typeof QUESTION_CELL,
  row: number,
  cell: number,
}

const questionCell = (row: number, cell:number): QuestionCellAction => {
  return { 
    type: QUESTION_CELL, row, cell 
  }
}

interface NormalizeCellAction {
  type: typeof NORMALIZE_CELL,
  row: number,
  cell: number,
}

const nomalizeCell = (row: number, cell:number): NormalizeCellAction => {
  return { 
    type: NORMALIZE_CELL, row, cell 
  }
}

interface IncrementTimerAction {
  type: typeof INCREMENT_TIMER,
}

const incrementTimer = (row: number, cell:number): IncrementTimerAction => {
  return { type: INCREMENT_TIMER }
}

type ReducerActions = StartGameAction | OpenCellAction | ClickMineAction | FlagCellAction | NormalizeCellAction | QuestionCellAction | IncrementTimerAction

const reducer = (state = initialState, action: ReducerActions): ReducerState => {
  switch(action.type){
    case START_GAME : 
      return {
        ...state,
        data: {
          row: action.row,
          cell: action.cell,
          mine: action.mine
        }, // 가로줄, 세로줄, 지뢰갯수 기록
        openedCount: 0,
        timer: 0,
        tableData: plantMine(action.row, action.cell, action.mine),
        halted: false,
      }
    case OPEN_CELL: {
      const tableData = [...state.tableData];
      tableData.forEach((row, i) => {
        tableData[i] = [...state.tableData[i]];
      });
      const checked: number[] = [];
      let openedCount = 0;
      const checkAround = (row: number, cell: number) => {
        // 클릭했을 때 자동으로 열리면 안되는 칸 필터링
        if([CODE.OPENED, CODE.FLAG_MINE, CODE.FLAG, CODE.QUESTION_MINE, CODE.QUESTION].includes(tableData[row][cell])){
          return;
        }
        if(row < 0 || row >= tableData.length || cell < 0 || cell >= tableData[0].length){ //상하좌우가 칸이 없는 경우 필터링
          return;
        }
        if (checked.includes(row + '/' + cell)) { // 이미 검사한 칸인지 체크
          return;
        } else {
          checked.push(row + '/' + cell);
        } 
        // 주변 셀 구하기 : 클릭한 칸의 주변 8칸을 검사한다. 
        let around = [
          tableData[row][cell - 1], tableData[row][cell + 1],
        ];
        if(tableData[row -1 ]){ //윗줄이 있는지 check -> 윗줄의 3칸을 넣어준다. 
          around = around.concat(
            tableData[row - 1][cell - 1], 
            tableData[row - 1][cell], 
            tableData[row - 1][cell + 1]
          );
        }
        around = around.concat(
          tableData[row][cell - 1], 
          tableData[row][cell + 1], 
        );
        if(tableData[row + 1 ]){ //아랫줄이 있는지 check -> 아랫줄의 3칸을 넣어준다. 
          around = around.concat(
            tableData[row + 1][cell - 1], 
            tableData[row + 1][cell], 
            tableData[row + 1][cell + 1]
          );
        }
        // 주변에 설치된 지뢰의 수를 계산한 후 갯수 표시
        const count = around.filter((v) => [CODE.MINE, CODE.FLAG_MINE, CODE.QUESTION_MINE].includes(v)).length;
        // *** 주변에 지뢰가 없고 또 그 주변에 지뢰가 없을 때 연결해서 오픈
        if(count === 0){ 
          const near = [];
          if(row - 1 > -1){ //제일 윗칸을 클릭했을 때
            near.push([row - 1, cell - 1]);
            near.push([row - 1, cell]);
            near.push([row - 1, cell + 1]);
          }
          near.push([row, cell - 1]);
          near.push([row, cell + 1]);
          if(row + 1 < tableData.length){ // 제일 아랫칸을 클릭했을 때 
            near.push([row + 1, cell - 1]);
            near.push([row + 1, cell]);
            near.push([row + 1, cell + 1]);
          }
            near.forEach((n) => {
              if (tableData[n[0]][n[1]] !== CODE.OPENED) { //주변칸들이 열려있지 않으면
                checkAround(n[0], n[1]);
              }
            })
          }
        if(tableData[row][cell] === CODE.NORMAL){ // 이미 열린칸을 중복으로 카운트 하지 않기 위한 조건
            openedCount += 1;
        } 
        tableData[row][cell] = count;
      };
      checkAround(action.row, action.cell);
      // 승리조건 
      let halted = false;
      let result = '';
      if(state.data.row * state.data.cell - state.data.mine === state.openedCount + openedCount){
        halted = true; // 게임을 멈추고
        result = `${state.timer}초만에 승리하셨습니다`
      }
      return {
        ...state,
        tableData,
        openedCount: state.openedCount + openedCount,
        halted,
        result
      };
    }
    case CLICK_MINE: {
      const tableData = [...state.tableData];
      tableData[action.row] = [...state.tableData[action.row]];
      tableData[action.row][action.cell] = CODE.CLICKED_MINE; 
      return {
        ...state,
        tableData,
        halted: true,
      };
    }
    case FLAG_CELL: {
      const tableData = [...state.tableData];
      tableData[action.row] = [...state.tableData[action.row]];
      if(tableData[action.row][action.cell] === CODE.MINE){
        tableData[action.row][action.cell] = CODE.FLAG_MINE; 
      } else {
        tableData[action.row][action.cell] = CODE.FLAG;
      }
      return {
        ...state,
        tableData,
      };
    }
    case QUESTION_CELL: {
      const tableData = [...state.tableData];
      tableData[action.row] = [...state.tableData[action.row]];
      if(tableData[action.row][action.cell] === CODE.FLAG_MINE){
        tableData[action.row][action.cell] = CODE.QUESTION_MINE; 
      } else {
        tableData[action.row][action.cell] = CODE.QUESTION;
      }
      return {
        ...state,
        tableData,
      }
    }
    case NORMALIZE_CELL: {
      const tableData = [...state.tableData];
      tableData[action.row] = [...state.tableData[action.row]];
      if(tableData[action.row][action.cell] === CODE.QUESTION_MINE){
        tableData[action.row][action.cell] = CODE.MINE; 
      } else {
        tableData[action.row][action.cell] = CODE.NORMAL;
      }
      return {
        ...state,
        tableData,
      }
    }
    case INCREMENT_TIMER: {
      return {
        ...state,
        timer: state.timer + 1,
      }
    }
    default :
      return state;
  }
}

const MineSearch = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { tableData, halted, timer, result } = state;

  const value = useMemo(() => ({ tableData, halted, dispatch }), [tableData, halted])

  useEffect(() => {
    let timer: number; 
    if(halted === false){
      timer = window.setInterval(() => {
          dispatch({ type: INCREMENT_TIMER });
      }, 1000)
    }
    return () => {
      clearInterval(timer);
    }
  },[halted])


  return (
    <TableContext.Provider value={value}>
      <Form />
      <div className="timer">{timer}</div>
      <Table />
      <div className="result">{result}</div>
    </TableContext.Provider>
  )
}

export default MineSearch;