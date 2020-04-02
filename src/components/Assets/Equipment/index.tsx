import React, {useEffect, FormEvent} from 'react';
import { useLazyQuery, useMutation } from "@apollo/react-hooks";
import {useHistory} from "react-router";
import {useRouteMatch} from "react-router-dom";
import {EquipmentComp_} from './EquipmentComp_';
import {FETCH_EQUIPMENTS_PAGE_GQL, IEquipment, IEquipments} from "../../../graphql/equipment.type";

export const EquipmentComp: React.FC = () => {
   const history = useHistory();
   const { path } = useRouteMatch();
   const [viewMode, setViewMode] = React.useState<'GRID'|'TREE'>('GRID');
   const [pathTree, setPathTree] = React.useState<IEquipment[]>([]);
   const [pageIndex, setPageIndex] = React.useState(0);
   const [pageSize, setPageSize] = React.useState(10);
   const [searchString, setSearchString] = React.useState<string>('');
   const [fetchEquipments, { called, loading, data }] = useLazyQuery<{equipments: IEquipments}, any>(FETCH_EQUIPMENTS_PAGE_GQL);

   useEffect(() => {
      fetchEquipments({variables: { searchString, pageIndex: pageIndex, pageSize: pageSize }});
   }, []);

   useEffect(() => {
      let filters = [];
      if(viewMode === 'TREE' && pathTree.length === 0) {
         filters.push({field: "parentId", operator: "=", value: "null"});
      } else if(viewMode === 'TREE' && pathTree.length > 0)  {
         filters.push({field: "parentId", operator: "=", value: pathTree[pathTree.length - 1].equipmentId.toString()});
      }
      fetchEquipments({variables: { searchString, pageIndex, pageSize, filters }});
   }, [pageIndex, pageSize, searchString, viewMode, pathTree]);

   if (loading || !data) return <div>Loading</div>;

   const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
      setPageIndex(newPage);
   };

   const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setPageSize(parseInt(event.target.value, 10));
      setPageIndex(0);
   };

   const handleSearch = (searchString: string) => {
      setSearchString(searchString);
      setPageIndex(0);
   };

   const handleExpand = (equipment: IEquipment) => {
      setPathTree(pathTree.concat(equipment));
   };

   const handleChangeMViewMode = (event: React.ChangeEvent<HTMLInputElement>) => {
      if(event.target.checked) {
         setViewMode('TREE');
      } else {
         setPathTree([]);
         setViewMode('GRID');
      }
   };

   const handleBreadcrumbs = (index: number) => {
      if(index < 0) {
         setPathTree([]);
      } else {
         setPathTree(pathTree.filter((e, i) => i <= index));
      }
   };

   return <EquipmentComp_
      equipments={data.equipments.page.content}
      totalCount={data.equipments.page.totalCount}
      pageIndex={data.equipments.page.pageInfo.pageIndex}
      pageSize={data.equipments.page.pageInfo.pageSize}
      searchString={searchString}
      viewMode={viewMode}
      treePath={pathTree}
      onChangePage={handleChangePage}
      onChangeRowsPerPage={handleChangeRowsPerPage}
      onSearchEquipment={handleSearch}
      onChangeViewMode={handleChangeMViewMode}
      onExpand={handleExpand}
      onBreadcrumbs={handleBreadcrumbs}
      onAddEquipment={() => history.push(path + '/' + 0)}
      onEditEquipment={(equipment: IEquipment) => history.push(path + '/' + equipment.equipmentId)}
   />;
};
