import * as React from 'react';
import { Dispatch, FunctionComponent, useMemo } from 'react';
import Td from './Td';

interface Props {
  rowData: string[];
  rowIndex: number;
  dispatch: Dispatch<any>;
}

const Tr:FunctionComponent<Props> = ({ rowData, rowIndex, dispatch }) => {
  return (
    <tr>
       {Array(rowData.length).fill(null).map((td, i) => (
        useMemo(
          () => <Td key={i} dispatch={dispatch} rowIndex={rowIndex} cellData={rowData[i]} >{' '}</Td>,
          [rowData[i]]
        )
      ))}
    </tr>
  )
}

export default Tr;