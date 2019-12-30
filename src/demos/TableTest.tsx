import React from 'react'
import {Column, usePagination, useSortBy, useTable} from 'react-table'
import makeData, { PersonData } from './makeData'

interface ITable<T extends object> {
   columns: Column<T>[];
   data: T[];
   fetchData: any;
   loading: boolean;
   pageCount: number;
}

const Table:React.FC<ITable<PersonData>> = ({ columns,
                                               data,
                                               fetchData,
                                               loading,
                                               pageCount: controlledPageCount
}) => {
   // Use the state and functions returned from useTable to build your UI
   const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      prepareRow,
      page, // Instead of using 'rows', we'll use page,
      // which has only the rows for the active page

      // The rest of these things are super handy, too ;)
      canPreviousPage,
      canNextPage,
      pageOptions,
      pageCount,
      gotoPage,
      nextPage,
      previousPage,
      setPageSize,
      state: { pageIndex, pageSize },
   } = useTable<PersonData>(
      {
         columns,
         data,
         initialState: { pageIndex: 2 },
         manualPagination: true,
         pageCount: controlledPageCount
      },
      usePagination
   );

   // Listen for changes in pagination and use the state to fetch our new data
   React.useEffect(() => {
      fetchData({ pageIndex, pageSize })
   }, [fetchData, pageIndex, pageSize]);
   // Render the UI for your table
   return (
      <>
         <pre>
        <code>
          {JSON.stringify(
             {
                pageIndex,
                pageSize,
                pageCount,
                canNextPage,
                canPreviousPage,
             },
             null,
             2
          )}
        </code>
      </pre>
         <table {...getTableProps()}>
            <thead>
            {headerGroups.map(headerGroup => (
               <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map(column => (
                     <th {...column.getHeaderProps()}>
                        {column.render('Header')}
                        <span>
                  </span>
                     </th>
                  ))}
               </tr>
            ))}
            </thead>
            <tbody {...getTableBodyProps()}>
            {page.map((row, i) => {
               prepareRow(row);
               return (
                  <tr {...row.getRowProps()}>
                     {row.cells.map(cell => {
                        return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                     })}
                  </tr>
               )
            })}
            <tr>
               {loading ? (
                  // Use our custom loading state to show a loading indicator
                  <td colSpan={10000}>Loading...</td>
               ) : (
                  <td colSpan={10000}>
                     Showing {page.length} of ~{controlledPageCount * pageSize}{' '}
                     results
                  </td>
               )}
            </tr>
            </tbody>
         </table>
         {/*
        Pagination can be built however you'd like.
        This is just a very basic UI implementation:
      */}
         <div className="pagination">
            <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
               {'<<'}
            </button>{' '}
            <button onClick={() => previousPage()} disabled={!canPreviousPage}>
               {'<'}
            </button>{' '}
            <button onClick={() => nextPage()} disabled={!canNextPage}>
               {'>'}
            </button>{' '}
            <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
               {'>>'}
            </button>{' '}
            <span>
          Page{' '}
               <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{' '}
        </span>
            <span>
          | Go to page:{' '}
               <input
                  type="number"
                  defaultValue={(pageIndex + 1) + ''}
                  onChange={e => {
                     const page = e.target.value ? Number(e.target.value) - 1 : 0;
                     gotoPage(page)
                  }}
                  style={{ width: '100px' }}
               />
        </span>{' '}
            <select
               value={pageSize}
               onChange={e => {
                  setPageSize(Number(e.target.value))
               }}
            >
               {[10, 20, 30, 40, 50].map(pageSize => (
                  <option key={pageSize} value={pageSize}>
                     Show {pageSize}
                  </option>
               ))}
            </select>
         </div>
      </>
   )
};

const serverData = makeData(10000);

function TableTest() {
   const columns: Column<PersonData>[] = React.useMemo(
      () => [
         {
            Header: 'Name',
            columns: [
               {
                  Header: 'First Name',
                  accessor: 'firstName',
               },
               {
                  Header: 'Last Name',
                  accessor: 'lastName',
               },
            ],
         },
         {
            Header: 'Info',
            columns: [
               {
                  Header: 'Age',
                  accessor: 'age',
               },
               {
                  Header: 'Visits',
                  accessor: 'visits',
               },
               {
                  Header: 'Status',
                  accessor: 'status',
               },
               {
                  Header: 'Profile Progress',
                  accessor: 'progress',
               },
            ],
         },
      ],
      []
   );

   // const data = React.useMemo(() => makeData(100000), []);

   const [data, setData] = React.useState<PersonData[]>([]);
   const [loading, setLoading] = React.useState(false);
   const [pageCount, setPageCount] = React.useState(0);
   const fetchIdRef = React.useRef(0);

   const fetchData = React.useCallback(({ pageSize, pageIndex }) => {
      // This will get called when the table needs new data
      // You could fetch your data from literally anywhere,
      // even a server. But for this example, we'll just fake it.

      // Give this fetch an ID
      const fetchId = ++fetchIdRef.current;

      // Set the loading state
      setLoading(true);

      // We'll even set a delay to simulate a server here
      setTimeout(() => {
         // Only update the data if this is the latest fetch
         if (fetchId === fetchIdRef.current) {
            const startRow = pageSize * pageIndex;
            const endRow = startRow + pageSize;
            setData(serverData.slice(startRow, endRow));

            // Your server could send back total page count.
            // For now we'll just fake it, too
            setPageCount(Math.ceil(serverData.length / pageSize));

            setLoading(false)
         }
      }, 2000)
   }, []);


   // console.log(data);
   return (
         <Table
            columns={columns}
            data={data}
            fetchData={fetchData}
            loading={loading}
            pageCount={pageCount}
         />
   )
}

export default TableTest;
