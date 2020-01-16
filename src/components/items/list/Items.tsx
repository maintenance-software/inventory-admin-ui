import React, { useEffect } from 'react';
import './Items.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';
import { gql } from 'apollo-boost';
import {useLazyQuery, useQuery} from '@apollo/react-hooks';

import {Pagination, PaginationItem, PaginationLink, Table} from "reactstrap";
import {SearchInput} from "../../SearchInput/SearchInput";
import {useHistory} from "react-router";
import {Column, usePagination, useTable} from "react-table";
import {PersonData} from "../../../demos/makeData";
import {IItem, IItems} from '../../../graphql/item.type';
import {IUser} from "../../../graphql/users.type";


export const GET_ITEMS_GQL = gql`
  query fetchItems($pageIndex: Int, $pageSize: Int) {
  items {
    page(pageIndex: $pageIndex, pageSize: $pageSize) {
      totalCount
      pageInfo {
        pageIndex
        pageSize
        hasNext
        hasPreview
      }
      content {
        itemId
        name
        unit
        defaultPrice
        description
        images
        createdDate
        modifiedDate
        category {
          categoryId
          name
        }
      }
    }
  }
}
`;

interface ITable<T extends object> {
   columns: Column<T>[];
   data: T[];
   fetchData: any;
   loading: boolean;
   pageCount: number;
   totalCount: number;
}

const ItemTable:React.FC<ITable<IItem>> = ({ columns,
                                             data,
                                             fetchData,
                                             loading,
                                             pageCount: controlledPageCount,
                                             totalCount
                                            }) => {
   // Use the state and functions returned from useTable to build your UI
   const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      headers,
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
   } = useTable<IItem>(
      {
         columns,
         data,
         initialState: { pageIndex: 2 },
         manualPagination: true,
         pageCount: controlledPageCount
      },
      usePagination
   );

   useEffect(() => {
      fetchData({variables: { pageIndex, pageSize}});
   }, [pageIndex, pageSize]);

   return (
      <>
         <div className="d-flex h-100 flex-column">
            <div className="d-flex p-2 justify-content-between align-items-center">
               <div>
                  <button className="btn btn-light">
                     <FontAwesomeIcon icon="user-plus"/>
                     New Item
                  </button>
               </div>
               <SearchInput/>
            </div>

            <div className="d-flex flex-fill-custom d-flex justify-content-start">
               <div className="d-flex flex-fill tableFixHead">
                  <Table hover bordered {...getTableProps()}>
                     <thead>
                     <tr>
                        {headers.map(column => (
                           <th {...column.getHeaderProps()}>
                              {column.render('Header')}
                              <span>
                        </span>
                           </th>
                        ))}
                     </tr>
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
                     </tbody>
                  </Table>
               </div>

            </div>

            <div className="d-flex">
               <Pagination aria-label="Item pagination">
                  <PaginationItem disabled={!canPreviousPage}>
                     <PaginationLink first onClick={() => gotoPage(0)}/>
                  </PaginationItem>
                  <PaginationItem disabled={!canPreviousPage}>
                     <PaginationLink previous onClick={() => previousPage()}/>
                  </PaginationItem>
                  {
                     Array.from(Array(pageCount).keys()).map(index =>(
                        <PaginationItem key={index} active={index === pageIndex}>
                           <PaginationLink onClick={() => gotoPage(index)}>
                              {index + 1}
                           </PaginationLink>
                        </PaginationItem>
                     ))
                  }
                  <PaginationItem disabled={!canNextPage}>
                     <PaginationLink next onClick={() => nextPage()}/>
                  </PaginationItem>
                  <PaginationItem disabled={!canNextPage}>
                     <PaginationLink last onClick={() => gotoPage(pageCount - 1)} />
                  </PaginationItem>
               </Pagination>

               <div className="pagination">
                  <select className="form-control"
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

            </div>
         </div>
      </>
   )
};



const Items: React.FC =  () => {
  const [t, i18n] = useTranslation();
   const history = useHistory();
   const [fetchData, { called, loading, data }] = useLazyQuery<{items: IItems}, any>(GET_ITEMS_GQL);
   const columns: Column<IItem>[] = [
      { Header: '#', accessor: '#'},
      { Header: 'Name', accessor: 'name' },
      { Header: 'Description', accessor: 'description' },
      { Header: 'Unit', accessor: 'unit' },
      { Header: 'Category', accessor: 'category.name' }
   ];


   let users: IItem[] = [];
   let totalCount = 0;
   let pageCount = 0;
   if(data) {
      totalCount = data.items.page.totalCount;
      pageCount = Math.ceil( totalCount / data.items.page.pageInfo.pageSize);
      users = data.items.page.content;
   }

   return (
    <>
       <ItemTable
          columns={columns}
          data={users}
          fetchData={fetchData}
          loading={loading}
          pageCount={pageCount}
          totalCount={totalCount}
       />
    </>
  );
};
export default Items;
