import React, {useEffect, FormEvent} from 'react';
import { useLazyQuery } from "@apollo/react-hooks";
import { FETCH_ITEMS_GQL, IItem, IItems } from "../../../graphql/item.type";
import {useHistory} from "react-router";
import {useRouteMatch} from "react-router-dom";
import {_ItemSelectableComp} from './_ItemSelectableComp';

export const ItemSelectableComp: React.FC = () => {
   const history = useHistory();
   const { path } = useRouteMatch();
   const [pageIndex, setPageIndex] = React.useState(0);
   const [pageSize, setPageSize] = React.useState(10);
   const [searchString, setSearchString] = React.useState<string>('');
   const [fetchItemTools, { called, loading, data }] = useLazyQuery<{items: IItems}, any>(FETCH_ITEMS_GQL);
   const defaultFilters = [
        {field: "status",operator: "=", value: "ACTIVE"}
      // , {field: "itemType",operator: "in", value: "SUPPLIES,SPARE_PARTS"}
   ];

   useEffect(() => {
      fetchItemTools({variables: { searchString, pageIndex: pageIndex, pageSize: pageSize, filters: defaultFilters}});
   }, []);

   useEffect(() => {
      fetchItemTools({variables: { searchString, pageIndex: pageIndex, pageSize: pageSize, filters: defaultFilters}});
   }, [pageIndex, pageSize, searchString]);

   if (loading || !data) return <div>Loading</div>;

   const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
      setPageIndex(newPage);
   };

   const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setPageSize(parseInt(event.target.value, 10));
      setPageIndex(0);
   };

   const handleSearchItems = (searchString: string) => {
      setSearchString(searchString);
      setPageIndex(0);
   };

   const handleSelectItem = (item: IItem) => {
      console.log(item);
   };

   return <_ItemSelectableComp
      items = {data.items.page.content}
      pageIndex = {data.items.page.pageInfo.pageIndex}
      pageSize = {data.items.page.pageInfo.pageSize}
      totalCount = {data.items.page.totalCount}
      searchString = {searchString}
      onSelectItem = {handleSelectItem}
      onChangePage = {handleChangePage}
      onChangeRowsPerPage = {handleChangeRowsPerPage}
      onSearchItem = {handleSearchItems}
   />;
};
