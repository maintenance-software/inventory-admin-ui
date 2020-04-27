import React, {useEffect, FC} from 'react';
import { useLazyQuery } from "@apollo/react-hooks";
import { FETCH_ITEMS_GQL, IItem, IItems } from "../../../../graphql/item.type";
import {useHistory} from "react-router";
import {useRouteMatch} from "react-router-dom";
import {AssetChooser, ISimpleItem} from './AssetChooser';
import {FETCH_AVAILABLE_ITEMS} from "../../../../graphql/inventory.type";
import {IPage} from "../../../../graphql/page.type";

interface IAssetChooserProps {
   multiple: boolean;
   filters: any[];
   disableItems: number[];
   initialSelected?: ISimpleItem[];
   onSelectItems?(item: IItem[]) : void
}
export const AssetChooserComp: FC<IAssetChooserProps> = ({disableItems, multiple, initialSelected, filters, onSelectItems}) => {
   const history = useHistory();
   const { path } = useRouteMatch();
   const [pageIndex, setPageIndex] = React.useState(0);
   const [pageSize, setPageSize] = React.useState(10);
   const [searchString, setSearchString] = React.useState<string>('');
   const [fetchItems, { called, loading, data }] = useLazyQuery<{items: IItems}, any>(FETCH_ITEMS_GQL);

   useEffect(() => {
      fetchItems({variables: { searchString, pageIndex: pageIndex, pageSize: pageSize, filters: filters}});
   }, []);

   useEffect(() => {
      fetchItems({variables: { searchString, pageIndex: pageIndex, pageSize: pageSize, filters: filters}});
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

   const handleSelectItem = (items: IItem[]) => {
      onSelectItems && onSelectItems(items);
   };

   return <AssetChooser
      items = {data.items.page.content}
      multiple={multiple}
      disableItems={disableItems}
      initialSelected={initialSelected}
      pageIndex = {data.items.page.pageInfo.pageIndex}
      pageSize = {data.items.page.pageInfo.pageSize}
      totalCount = {data.items.page.totalCount}
      searchString = {searchString}
      onSelectItem = {onSelectItems || handleSelectItem}
      onChangePage = {handleChangePage}
      onChangeRowsPerPage = {handleChangeRowsPerPage}
      onSearchItem = {handleSearchItems}
   />;
};
