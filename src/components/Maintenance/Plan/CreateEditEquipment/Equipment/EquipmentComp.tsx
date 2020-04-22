import React, {useEffect, useContext} from 'react';
import {useRouteMatch, useParams} from "react-router-dom";
import {Equipment} from './Equipment';
import {GET_MAINTENANCE_PLAN_BY_ID, IMaintenancePlans} from "../../../../../graphql/Maintenance.type";
import { useQuery } from '@apollo/react-hooks';


export const PlanEquipmentComp: React.FC = () => {
   const params = useParams();
   const maintenanceId = +params.maintenanceId;
   const { called, loading, data } = useQuery<{maintenances: IMaintenancePlans}, any>(GET_MAINTENANCE_PLAN_BY_ID, {variables: {maintenanceId}});
   if (!data || loading) return <div>Loading</div>;
   return <Equipment equipments={data.maintenances.maintenance.equipments} />;
};
