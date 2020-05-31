import React, {useEffect, FC} from 'react';
import { useLazyQuery } from "@apollo/react-hooks";
import {useRouteMatch} from "react-router-dom";
import {AssetChooser, ISimpleItem} from '../../Commons/AssetChooser/AssetChooser';
import {PageQL} from "../../../../graphql/Common.ql";
import {FETCH_EQUIPMENTS_PAGE_GQL, EquipmentQL} from "../../../../graphql/Equipment.ql";

export const EquipmentSelectableComp: FC<{itemId: number,onSelectItem?(items: ISimpleItem[]) : void}> = ({itemId, onSelectItem}) => {
   const [pageIndex, setPageIndex] = React.useState(0);
   const [pageSize, setPageSize] = React.useState(10);
   const [searchString, setSearchString] = React.useState<string>('');
   const [fetchEquipments, { called, loading, data }] = useLazyQuery<{equipments: {page: PageQL<EquipmentQL>}}, any>(FETCH_EQUIPMENTS_PAGE_GQL);
   const filters = [
         {field: "status",operator: "=", value: "ACTIVE"},
         {field: "itemId",operator: "!=", value: itemId.toString()}
      // , {field: "itemType",operator: "in", value: "SUPPLIES,SPARE_PARTS"}
   ];

   useEffect(() => {
      fetchEquipments({variables: { searchString, pageIndex: pageIndex, pageSize: pageSize, filters: filters}});
   }, []);

   useEffect(() => {
      fetchEquipments({variables: { searchString, pageIndex: pageIndex, pageSize: pageSize, filters: filters}});
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

   const handleSelectItem = (items: ISimpleItem[]) => {
      console.log(items)
   };

   return <AssetChooser
      items = {data.equipments.page.content.map(e =>({
         itemId: e.equipmentId,
         code: e.code,
         description: e.description,
         name: e.name
      }))}
      multiple={false}
      disableItems={[]}
      initialSelected={[]}
      pageIndex = {data.equipments.page.pageInfo.pageIndex}
      pageSize = {data.equipments.page.pageInfo.pageSize}
      totalCount = {data.equipments.page.totalCount}
      searchString = {searchString}
      onSelectItem = {onSelectItem || handleSelectItem}
      onChangePage = {handleChangePage}
      onChangeRowsPerPage = {handleChangeRowsPerPage}
      onSearchItem = {handleSearchItems}
   />;
};
