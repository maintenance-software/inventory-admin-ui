import React, {useEffect, useContext} from 'react';
import {useHistory} from "react-router";
import {useRouteMatch, useParams} from "react-router-dom";
import {Task} from './Task';
import {
   GET_MAINTENANCE_PLAN_BY_ID,
   getTaskDefaultInstance,
   MaintenancesQL,
   TaskQL
} from "../../../../../graphql/Maintenance.ql";
import { useQuery } from '@apollo/react-hooks';


export const TaskComp: React.FC = () => {
   const params = useParams();
   const maintenanceId = +params.maintenanceId;
   const { called, loading, data } = useQuery<{maintenances: MaintenancesQL}, any>(GET_MAINTENANCE_PLAN_BY_ID, {variables: {maintenanceId}});
   if (!data || loading) return <div>Loading</div>;
   return <Task maintenanceId={maintenanceId} tasks={data.maintenances.maintenance.tasks} />;
};
