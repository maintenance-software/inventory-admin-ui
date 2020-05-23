import React, {useEffect, FC} from 'react';
import { useLazyQuery } from "@apollo/react-hooks";
import {useHistory} from "react-router";
import {useRouteMatch} from "react-router-dom";
import {AssetChooser, ISimpleItem} from "../../Assets/Commons/AssetChooser/AssetChooser";
import {FETCH_EQUIPMENTS_AVAILABLE_GQL, IMaintenancePlans} from "../../../graphql/Maintenance.type";
import {FETCH_EQUIPMENTS_PAGE_GQL, IEquipments} from "../../../graphql/equipment.type";

interface IAssetChooserProps {
   multiple: boolean;
   filters: any[];
   disableItems: number[];
   initialSelected: number[];
   onSelectItems(items: ISimpleItem[]) : void
}

export const EquipmentChooserComp: FC<IAssetChooserProps> = ({disableItems, multiple, initialSelected, filters, onSelectItems}) => {
   const history = useHistory();
   const { path } = useRouteMatch();
   const [pageIndex, setPageIndex] = React.useState(0);
   const [pageSize, setPageSize] = React.useState(10);
   const [searchString, setSearchString] = React.useState<string>('');
   const [fetchEquipments, { called, loading, data }] = useLazyQuery<{equipments: IEquipments}, any>(FETCH_EQUIPMENTS_PAGE_GQL);

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

   const handleSelectEquipments = (items: ISimpleItem[]) => {
      onSelectItems && onSelectItems(items);
   };

   return <AssetChooser
      items = {data.equipments.page.content.map(e => ({
         itemId: e.equipmentId,
         code: e.code,
         name: e.name,
         description: e .description
      }))}
      multiple={multiple}
      disableItems={disableItems}
      initialSelected={initialSelected}
      pageIndex = {data.equipments.page.pageInfo.pageIndex}
      pageSize = {data.equipments.page.pageInfo.pageSize}
      totalCount = {data.equipments.page.totalCount}
      searchString = {searchString}
      onSelectItem = {onSelectItems || handleSelectEquipments}
      onChangePage = {handleChangePage}
      onChangeRowsPerPage = {handleChangeRowsPerPage}
      onSearchItem = {handleSearchItems}
   />;
};
