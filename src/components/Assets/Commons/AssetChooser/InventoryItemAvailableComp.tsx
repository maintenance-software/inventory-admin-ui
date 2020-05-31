import React, {useEffect, FC} from 'react';
import { useLazyQuery } from "@apollo/react-hooks";
import { FETCH_ITEMS_GQL, ItemQL, ItemsQL } from "../../../../graphql/Item.ql";
import {useHistory} from "react-router";
import {useRouteMatch} from "react-router-dom";
import {AssetChooser} from './AssetChooser';
import {FETCH_AVAILABLE_ITEMS} from "../../../../graphql/Inventory.ql";
import {PageQL} from "../../../../graphql/Common.ql";

export const InventoryItemAvailableComp: FC<{inventoryId: number, onSelectItem?(item: ItemQL[]) : void}> = ({inventoryId, onSelectItem}) => {
   const history = useHistory();
   const { path } = useRouteMatch();
   const [pageIndex, setPageIndex] = React.useState(0);
   const [pageSize, setPageSize] = React.useState(10);
   const [searchString, setSearchString] = React.useState<string>('');
   const [fetchItemTools, { called, loading, data }] = useLazyQuery<{inventories: {inventory: {availableItems: PageQL<ItemQL>}}}, any>(FETCH_AVAILABLE_ITEMS);
   const defaultFilters = [
        {field: "status",operator: "=", value: "ACTIVE"}
      // , {field: "itemType",operator: "in", value: "SUPPLIES,SPARE_PARTS"}
   ];

   useEffect(() => {
      fetchItemTools({variables: { inventoryId, searchString, pageIndex: pageIndex, pageSize: pageSize, filters: defaultFilters}});
   }, []);

   useEffect(() => {
      fetchItemTools({variables: { inventoryId, searchString, pageIndex: pageIndex, pageSize: pageSize, filters: defaultFilters}});
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

   const handleSelectItem = (items: ItemQL[]) => {
      console.log(items)
   };

   return <AssetChooser
      items = {data.inventories.inventory.availableItems.content}
      multiple={false}
      disableItems={[]}
      initialSelected={[]}
      pageIndex = {data.inventories.inventory.availableItems.pageInfo.pageIndex}
      pageSize = {data.inventories.inventory.availableItems.pageInfo.pageSize}
      totalCount = {data.inventories.inventory.availableItems.totalCount}
      searchString = {searchString}
      onSelectItem = {onSelectItem || handleSelectItem}
      onChangePage = {handleChangePage}
      onChangeRowsPerPage = {handleChangeRowsPerPage}
      onSearchItem = {handleSearchItems}
   />;
};
