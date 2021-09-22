import React, {useEffect, useState} from 'react';
import {AgGridReact} from 'ag-grid-react';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';


import PodcastDescriptionTooltip from './PodcastDescriptionTooltip.jsx'

export function PodcastGrid(props) {

    const [rowData, setRowData] = useState([]);

    useEffect(()=>{

      fetch(props.rssfeed)
                .then(response => response.text())
                .then(str => new window.DOMParser().parseFromString(str, 'text/xml'))
                .then(data => {            
                    const itemList = data.querySelectorAll('item');
            
                    const items=[];
                    itemList.forEach(el => {
                        items.push({
                        pubDate: new Date(el.querySelector('pubDate').textContent),
                        title: el.querySelector('title').innerHTML,
                        mp3: el.querySelector('enclosure').getAttribute('url'),
                        description: el
                            .querySelector('description')
                            .textContent.replace(/(<([^>]+)>)/gi, ''),
                        });
                    });

                    setRowData(items)
                });

    },[props.rssfeed]);

    var columnDefs = [
        {
          headerName: 'Episode Title',
          field: 'title',
          wrapText: true,
          autoHeight: true,
          flex: 1,
          resizable: true,
          filter: `agGridTextFilter`
        },
        {
          headerName: 'Description',
          field: 'description',
          wrapText: true,
          autoHeight: true,
          flex: 2,
          resizable: true,
          filter: `agGridTextFilter`,
          valueFormatter: params => params.data.description.length>125 ? params.data.description.substr(0,125) + "..." : params.data.description,
          tooltipField:"description",
          tooltipComponent: 'podcastDescriptionTooltip'
        },
        {
          headerName: 'Published',
          field: 'pubDate',
          sortable: true,
          filter: 'agDateColumnFilter'
        },
        {
          headerName: 'Episode',
          field: 'mp3',
          flex: 2,
          cellRenderer: ((params)=>`<audio controls preload="none">
                                        <source src=${params.value} type="audio/mpeg" />
                                    </audio>`),
          autoHeight: true
        }
      ];

    return (
       <div className="ag-theme-alpine" style={{height: props.height, width: props.width}}>   
           <AgGridReact
                rowData={rowData}
                columnDefs ={columnDefs}
                tooltipShowDelay={0}
                frameworkComponents={{ podcastDescriptionTooltip: PodcastDescriptionTooltip }}
                >
           </AgGridReact>
       </div>
    )
};