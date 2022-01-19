import * as React from 'react';
import { TableContext } from './MineSearch';
import { useContext, memo } from 'react';
import Tr from './Tr';

const Table = memo(() => {
  const { tableData } = useContext(TableContext);
  
  return (
    <table>
      <tbody>
        {Array(tableData.length).fill(null).map((tr, i) => <Tr key={`row${i}`} rowIndex={i}/>)}
      </tbody>
    </table>
  )
});

export default Table;