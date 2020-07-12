import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import {Equipment} from './Equipment';
import {
   GET_MAINTENANCE_PLAN_BY_ID, getMaintenancePlanDefaultInstance,
   MaintenancesQL
} from "../../../../../graphql/Maintenance.ql";
import { useMutation, useLazyQuery } from '@apollo/react-hooks';
import {MaintenanceEquipmentDialog} from "./MaintenanceEquipmentDialog";
import moment from 'moment';
import {clearCache} from "../../../../../utils/globalUtil";
import {EquipmentQL, SET_MAINTENANCE_GQL} from "../../../../../graphql/Equipment.ql";
import {SAVE_TASK_ACTIVITY_DATE_GQL} from "../../../../../graphql/WorkOrder.ql";

export const PlanEquipmentContainer: React.FC = () => {
   const params = useParams();
   const maintenanceId = +params.maintenanceId;
   const [open, setOpen] = React.useState(false);
   const [maintenance, setMaintenance] = useState(getMaintenancePlanDefaultInstance());
   const [getMaintenanceById, { called, loading, data }] = useLazyQuery<{maintenances: MaintenancesQL}, any>(GET_MAINTENANCE_PLAN_BY_ID);
   const [saveTaskActivity, saveActivityStatus] = useMutation<{ maintenances: MaintenancesQL }, any>(SAVE_TASK_ACTIVITY_DATE_GQL);
   const [saveSetMaintenance, saveSetMaintenanceStatus] = useMutation<{ equipments: EquipmentQL }, any>(SET_MAINTENANCE_GQL);

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

   const handleSaveTaskActivity = (equipmentId: number, dateString: string) => {
      const date = moment(dateString, 'YYYY-MM-DD').format("YYYY-MM-DD HH:mm:ss.SSSSSS UTC");
      saveTaskActivity({
         variables: {lastMaintenanceDate: date, assetId: equipmentId, maintenanceId},
      });

      saveSetMaintenance({
         variables: {equipmentId, maintenanceId},
         refetchQueries: [{query: GET_MAINTENANCE_PLAN_BY_ID, variables: {maintenanceId}}],
         update: (cache) => {
            clearCache(cache, 'maintenances.availableEquipments');
            clearCache(cache, 'maintenances.taskActivities');
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
            onSaveTaskActivity={handleSaveTaskActivity}
            maintenanceIds={maintenance.equipments.map(e => e.equipmentId)}
         />
      </>
      );
};
