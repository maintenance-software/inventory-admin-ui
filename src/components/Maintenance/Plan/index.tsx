import React, {useEffect, useContext} from 'react';
import { useLazyQuery } from "@apollo/react-hooks";
import {useHistory} from "react-router";
import {useRouteMatch} from "react-router-dom";
import {MaintenancePlanComp_} from './MaintenancePlanComp_';
import {MaintenancePlanContext} from "../Routes";
import {FETCH_MAINTENANCE_PLAN_GQL, IMaintenancePlan, IMaintenancePlans} from "../../../graphql/Maintenance.type";
import {appendToPath} from "../../../utils/globalUtil";

export const MaintenancePlanComp: React.FC = () => {
   const history = useHistory();
   const { path, url } = useRouteMatch();
   const {setMaintenanceId} = useContext(MaintenancePlanContext);
   const [pageIndex, setPageIndex] = React.useState(0);
   const [pageSize, setPageSize] = React.useState(10);
   const [searchString, setSearchString] = React.useState<string>('');
   const [fetchMaintenancePlans, { called, loading, data }] = useLazyQuery<{maintenances: IMaintenancePlans}, any>(FETCH_MAINTENANCE_PLAN_GQL);

   useEffect(() => {
      fetchMaintenancePlans({variables: { searchString, pageIndex: pageIndex, pageSize: pageSize }});
   }, []);

   useEffect(() => {
      fetchMaintenancePlans({variables: { searchString, pageIndex: pageIndex, pageSize: pageSize }});
   }, [pageIndex, pageSize, searchString]);

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

   return <MaintenancePlanComp_
      maintenances={data.maintenances.page.content}
      totalCount={data.maintenances.page.totalCount}
      pageIndex={data.maintenances.page.pageInfo.pageIndex}
      pageSize={data.maintenances.page.pageInfo.pageSize}
      searchString={searchString}
      onChangePage={handleChangePage}
      onChangeRowsPerPage={handleChangeRowsPerPage}
      onSearchMaintenancePlan={handleSearch}
      onAddMaintenancePlan={() => history.push(appendToPath(url, '0'))}
      onEditMaintenancePlan={(maintenance: IMaintenancePlan) => history.push(appendToPath(url, maintenance.maintenanceId.toString()))}
   />;
};
