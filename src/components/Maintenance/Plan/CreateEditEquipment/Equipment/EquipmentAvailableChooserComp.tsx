import React, {useEffect, FC} from 'react';
import { useLazyQuery } from "@apollo/react-hooks";
import {useHistory} from "react-router";
import {useRouteMatch} from "react-router-dom";
import {AssetChooser, ISimpleItem} from "../../../../Assets/Commons/AssetChooser/AssetChooser";
import {FETCH_EQUIPMENTS_AVAILABLE_GQL, MaintenancesQL} from "../../../../../graphql/Maintenance.ql";

interface IAssetChooserProps {
   multiple: boolean;
   filters: any[];
   disableItems: number[];
   initialSelected: number[];
   onSelectItems(items: ISimpleItem[]) : void
}

export const EquipmentAvailableChooserComp: FC<IAssetChooserProps> = ({disableItems, multiple, initialSelected, filters, onSelectItems}) => {
   const history = useHistory();
   const { path } = useRouteMatch();
   const [pageIndex, setPageIndex] = React.useState(0);
   const [pageSize, setPageSize] = React.useState(10);
   const [searchString, setSearchString] = React.useState<string>('');
   const [fetchEquipmentsAvailable, { called, loading, data }] = useLazyQuery<{maintenances: MaintenancesQL}, any>(FETCH_EQUIPMENTS_AVAILABLE_GQL);

   useEffect(() => {
      fetchEquipmentsAvailable({variables: { searchString, pageIndex: pageIndex, pageSize: pageSize, filters: filters}});
   }, []);

   useEffect(() => {
      fetchEquipmentsAvailable({variables: { searchString, pageIndex: pageIndex, pageSize: pageSize, filters: filters}});
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
      items = {data.maintenances.availableEquipments.content.map(e => ({
         itemId: e.equipmentId,
         code: e.code,
         name: e.name,
         description: e .description
      }))}
      multiple={multiple}
      disableItems={disableItems}
      initialSelected={initialSelected}
      pageIndex = {data.maintenances.availableEquipments.pageInfo.pageIndex}
      pageSize = {data.maintenances.availableEquipments.pageInfo.pageSize}
      totalCount = {data.maintenances.availableEquipments.totalCount}
      searchString = {searchString}
      onSelectItem = {onSelectItems || handleSelectEquipments}
      onChangePage = {handleChangePage}
      onChangeRowsPerPage = {handleChangeRowsPerPage}
      onSearchItem = {handleSearchItems}
   />;
};
