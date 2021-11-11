'use strict';

import React, {
  useMemo,
  useEffect,
  useState,
  useRef,
  memo,
  useCallback,
  Profiler
} from 'react';
import { render } from 'react-dom';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
 //import 'ag-grid-community/dist/styles/ag-theme-balham-dark.css';
import rowDefs from './makeData'

function GridExample() {
  console.log('rowData is', rowDefs)
  const [reactui, setReactUi] = useState(true);

  const gridRef = useRef();

  const columnDefs = useMemo(
    () => [
      { field: 'track-id'},
      { field: 'status'},
      { field: 'hits'},
      { field: 'first-detect'},
      { field: 'duration' },
      { field: 'location'},
    ],
    []
  );

  // never changes, so we can use useMemo
  const defaultColDef = useMemo(
    () => ({
      resizable: true,
      sortable: true,
      flex: 1
    }),
    []
  );

  // because row data changes, it needs to be state
  const [rowData, setRowData] = useState(rowDefs);

  const disableReactUI = useCallback(() => {
    setReactUi(false);
  });

  const enableReactUI = useCallback(() => {
    setReactUi(true);
  });

  const onRenderCallback = (
    id, // the "id" prop of the Profiler tree that has just committed
    phase, // either "mount" (if the tree just mounted) or "update" (if it re-rendered)
    actualDuration, // time spent rendering the committed update
    baseDuration, // estimated time to render the entire subtree without memoization
    startTime, // when React began rendering this update
    commitTime, // when React committed this update
    interactions // the Set of interactions belonging to this update
  ) => {
    // Aggregate or log render timings...
    console.log(
      'Phase is', phase,
      'Duration is', actualDuration,
      'Start time is', startTime, 
      'Commit Time is', commitTime,
      'Base time w/o Memoization is', baseDuration
    )
  }

  return (
    <div className={'parent-div'}>
      {/* <div className="buttons-div">
        {reactui && <button onClick={disableReactUI}>Disable React Ui</button>}
        {!reactui && <button onClick={enableReactUI}>Enable React Ui</button>}
        <button onClick={onClickIncreaseMedals}>Increase Medals</button>
      </div> */}
      <div className="grid-div">
        {/* <Profiler id="Table" onRender={onRenderCallback}> */}
        <AgGridReact
          // turn on AG Grid React UI
          reactUi={reactui}
          // used to access grid API
          ref={gridRef}
          // all other properties as normal...
          className="ag-theme-alpine"
          animateRows="false"
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          rowData={rowData}
        />
        {/* </Profiler> */}
      </div>
    </div>
  );
}

render(<GridExample />, document.querySelector('#root'));
