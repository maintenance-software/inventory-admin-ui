import React, {useEffect, useContext, useState} from 'react';
import {useParams} from "react-router-dom";
import {Equipment} from './Equipment';
import {
   GET_MAINTENANCE_PLAN_BY_ID, getMaintenancePlanDefaultInstance,
   IMaintenancePlans,
   SAVE_TASK_ACTIVITY
} from "../../../../../graphql/Maintenance.type";
import { useQuery, useMutation, useLazyQuery } from '@apollo/react-hooks';
import {MaintenanceEquipmentDialog} from "./MaintenanceEquipmentDialog";
import moment from 'moment';
import {GET_USERS_GQL} from "../../../../../graphql/users.type";
import {clearCache} from "../../../../../utils/globalUtil";

export const PlanEquipmentComp: React.FC = () => {
   const params = useParams();
   const maintenanceId = +params.maintenanceId;
   const [open, setOpen] = React.useState(false);
   const [maintenance, setMaintenance] = useState(getMaintenancePlanDefaultInstance());
   //const { called, loading, data } = useQuery<{maintenances: IMaintenancePlans}, any>(GET_MAINTENANCE_PLAN_BY_ID, {variables: {maintenanceId}});
   const [getMaintenanceById, { called, loading, data }] = useLazyQuery<{maintenances: IMaintenancePlans}, any>(GET_MAINTENANCE_PLAN_BY_ID);
   const [saveTaskActivity, saveActivityStatus] = useMutation<{ maintenances: IMaintenancePlans }, any>(SAVE_TASK_ACTIVITY);

   useEffect(() => {
      if(maintenanceId && maintenanceId > 0) {
         getMaintenanceById({variables: {maintenanceId}});
      }
   }, []);

   useEffect(() => {
      if(!loading && called && data) {
         setMaintenance(data.maintenances.maintenance);
      }
   }, [called, loading, data]);

   if (loading || saveActivityStatus.loading || (!data && maintenanceId > 0))
      return <div>Loading</div>;

   const handleOnAcceptResource = (equipmentId: number, dateString: string) => {
      const date = moment(dateString, 'YYYY-MM-DD').utc().format();
      saveTaskActivity({
         variables: {lastMaintenanceDate: date, assetId: equipmentId, maintenanceId},
         refetchQueries: [{query: GET_MAINTENANCE_PLAN_BY_ID, variables: {maintenanceId}}],
         update: (cache) => {
            clearCache(cache, 'maintenances.availableEquipments');
         }
      });
      setOpen(false);
   };

   const handleAddEquipment = () => {
      setOpen(true);
   };

   return (
      <>
         <Equipment equipments={maintenance.equipments} onAddEquipment={handleAddEquipment}/>
         <MaintenanceEquipmentDialog
            open={open}
            setOpen={setOpen}
            onAccept={handleOnAcceptResource}
            maintenanceIds={maintenance.equipments.map(e => e.equipmentId)}
         />
      </>
      );
};
