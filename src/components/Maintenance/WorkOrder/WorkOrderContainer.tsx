import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import {useFormik} from 'formik';
import * as Yup from "yup";
import { useLazyQuery, useQuery } from '@apollo/react-hooks';
import {useHistory} from "react-router";
import {useParams, useRouteMatch} from 'react-router-dom';
import {
   GET_TASK_RESOURCE_BY_ID_QL,
   GET_WORK_ORDER_BY_ID_QL,
   getWorkOrderDefaultInstance,
   WorkOrderQL, WorkOrderResourceQL
} from "../../../graphql/WorkOrder.ql";
import {ITaskActivity} from "../TaskActivity/TaskActivityListContainer";
import {WorkOrderTasks} from "./WorkOrderTasks";
import {WorkOrderFormDetails} from "./WorkOrderFormDetails";
import {IWorkOrderResource, WorkOrderResourceDialog} from "./WorkOrderResourceDialog";
import {MaintenancesQL, TaskResourceQL} from "../../../graphql/Maintenance.ql";


export const WorkOrderContainer: React.FC =  () => {
   const history = useHistory();
   const { path } = useRouteMatch();
   const params = useParams();
   const [resourceDialogOpen, setResourceDialogOpen] = React.useState(false);
   const [workOrder, setWorOrder] = React.useState<WorkOrderQL>(getWorkOrderDefaultInstance());
   const [selectedTaskId, setSelectedTaskId] = React.useState(0);
   const [getWorkOrderById, { called, loading, data }] = useLazyQuery<{maintenances: {workOrder: WorkOrderQL}}, any>(GET_WORK_ORDER_BY_ID_QL);
   const [getTaskById, taskResponse] = useLazyQuery<{maintenances: MaintenancesQL}, any>(GET_TASK_RESOURCE_BY_ID_QL);
   const workOrderId = +params.workOrderId;
   const taskActivities: ITaskActivity[] = history.location.state? history.location.state.taskActivities : [];

   useEffect(() => {
      if(workOrderId) {
         getWorkOrderById({variables: {workOrderId}})
      }
   }, []);

   useEffect(() => {
      if(called && !loading && data) {
         setWorOrder(data.maintenances.workOrder);
      }
   }, [called, loading, data]);

   useEffect(() => {
      if(selectedTaskId) {
         getTaskById({variables: {taskId: selectedTaskId}})
      }
   }, [selectedTaskId]);

   const handleSetWorkOrderResource = (taskId: number) => {
      setResourceDialogOpen(true);
      setSelectedTaskId(taskId);
   };

   const convertWorkOrderResources = (resources: TaskResourceQL[]): IWorkOrderResource[]  => {
      let workOrderResources: IWorkOrderResource[] = [];
      let index = 0;
      resources.forEach(r => {
         if(r.resourceType === 'INVENTORY' && r.inventoryResource) {
            workOrderResources.push({
               resourceId: -index,
               description: r.inventoryResource.name,
               resource: '',
               itemId: r.inventoryResource.itemId,
               inventoryItemId: 0,
               employeeCategoryId: 0,
               personId: 0,
               resourceType: 'INVENTORY',
               amount: r.amount
            });
            index++;
         } else if(r.resourceType === 'HUMAN' && r.employeeCategory) {
            const humanResources: IWorkOrderResource[] = [];
            for (let i = 0; i < r.amount; i++) {
               humanResources.push({
                  resourceId: -index,
                  description: r.employeeCategory.name,
                  resource: '',
                  itemId: 0,
                  inventoryItemId: 0,
                  employeeCategoryId: r.employeeCategory.categoryId,
                  personId: 0,
                  resourceType: 'HUMAN',
                  amount: 1
               });
               index++;
            }
            workOrderResources = workOrderResources.concat(humanResources);
         }
      });

      return workOrderResources;
   };

  return (
     <>
        <WorkOrderFormDetails/>
        <WorkOrderTasks workOrderTasks={taskActivities} onSetWorkOrderResource={handleSetWorkOrderResource}/>
        <WorkOrderResourceDialog
           resources={convertWorkOrderResources(taskResponse.data? taskResponse.data.maintenances.task.taskResources : [])}
           open={resourceDialogOpen}
           setOpen={setResourceDialogOpen}
           onAccept={() =>{}}
        />
     </>
  );
};
