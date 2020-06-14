import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import {useFormik} from 'formik';
import * as Yup from "yup";
import { useLazyQuery, useQuery, useMutation } from '@apollo/react-hooks';
import {useHistory} from "react-router";
import {useParams, useRouteMatch} from 'react-router-dom';
import {
   GET_TASK_RESOURCE_BY_ID_QL,
   GET_WORK_ORDER_BY_ID_QL, SAVE_WORK_ORDER_QL,
   WorkOrderQL
} from "../../../graphql/WorkOrder.ql";
import {IWorkQueueEquipment} from "../WorkQueue/WorkQueueListContainer";
import {WorkOrderTasks} from "./WorkOrderTasks";
import {WorkOrderFormDetails} from "./WorkOrderFormDetails";
import {WorkOrderResourceDialog} from "./WorkOrderResourceDialog";
import {MaintenancesQL, TaskResourceQL} from "../../../graphql/Maintenance.ql";
import Box from '@material-ui/core/Box';
import {GET_USER_SESSION_GQL, getSessionDefaultInstance, SessionQL} from "../../../graphql/Session.ql";
import {buildFullName} from "../../../utils/globalUtil";

export interface IWorkOrder {
   workOrderId: number;
   workOrderCode: string;
   workOrderStatus: string;
   estimateDuration: number;
   executionDuration: number;
   rate: number;
   totalCost: number;
   percentage: number;
   notes: string;
   workQueueEquipments: IWorkQueueEquipment[];
}

export interface IWorkOrderResource {
   resourceId: number;
   description: string;
   resource: string;
   itemId: number;
   inventoryItemId: number;
   employeeCategoryId: number;
   personId: number;
   resourceType: string;
   amount: number;
}

export interface IWorkOrderForm {
   workOrderCode: string;
   estimateDurationDD: number;
   estimateDurationHH: number;
   estimateDurationMM: number;
   executionDurationDD: number;
   executionDurationHH: number;
   executionDurationMM: number;
   rate: number;
   totalCost: number;
   percentage: number;
   notes: string;
   generatedBy: {personId: number, fullName: string};
   responsible: {personId: number, fullName: string};
}

const getIWorkOrderDefaultInstance = ():IWorkOrder => ({
   workOrderId: 0,
   workOrderCode: '',
   workOrderStatus: '',
   estimateDuration: 0,
   executionDuration: 0,
   rate: 0,
   totalCost: 0,
   percentage: 0,
   notes: '',
   workQueueEquipments: []
});

export const WorkOrderContainer: React.FC =  () => {
   const history = useHistory();
   const { path } = useRouteMatch();
   const params = useParams();
   const [resourceDialogOpen, setResourceDialogOpen] = React.useState(false);
   const [workOrder, setWorOrder] = React.useState<IWorkOrder>(getIWorkOrderDefaultInstance());
   const [workOrderResource, setWorkOrderResource] = React.useState<IWorkOrderResource[]>([]);
   const [[workQueueTaskId, equipmentId, taskId], setWorkQueueTask] = React.useState([0, 0, 0]);
   const [getWorkOrderById, { called, loading, data }] = useLazyQuery<{maintenances: {workOrder: WorkOrderQL}}, any>(GET_WORK_ORDER_BY_ID_QL);
   const [getTaskById, taskResponse] = useLazyQuery<{maintenances: MaintenancesQL}, any>(GET_TASK_RESOURCE_BY_ID_QL);
   const [saveWorkOrder, saveWorkOrderResponse] = useMutation<{maintenances: MaintenancesQL}, any>(SAVE_WORK_ORDER_QL);

   const sessionQL = useQuery<{session: SessionQL}, any>(GET_USER_SESSION_GQL);
   const workOrderId = +params.workOrderId;

   useEffect(() => {
      if(called && !loading && data) {
         // setWorOrder(data.maintenances.workOrder);
      }
   }, [called, loading, data]);

   useEffect(() => {
      if(workOrderId) {
         getWorkOrderById({variables: {workOrderId}});
      } else if(history.location.state) {
         const newWorkOrder:IWorkOrder = {
            workOrderId: workOrder.workOrderId,
            workOrderCode: workOrder.workOrderCode,
            workOrderStatus: workOrder.workOrderStatus,
            estimateDuration: workOrder.estimateDuration,
            executionDuration: workOrder.executionDuration,
            rate: workOrder.rate,
            totalCost: workOrder.totalCost,
            percentage: workOrder.percentage,
            notes: workOrder.notes,
            workQueueEquipments: history.location.state.workQueueEquipments || []
         };
         setWorOrder(newWorkOrder);
      }
   }, []);

   useEffect(() => {
      if(workQueueTaskId && equipmentId && taskId) {
         const [workQueueEquipment] = workOrder.workQueueEquipments.filter(workQueueEquipment =>  workQueueEquipment.equipmentId === equipmentId);
         const [workQueueTask] = workQueueEquipment.workQueueTasks.filter(workQueueTask => workQueueTask.workQueueTaskId === workQueueTaskId);
         if(workQueueTask.taskResources.length > 0) {
            setWorkOrderResource(workQueueTask.taskResources);
         } else {
            getTaskById({variables: {taskId: taskId}});
         }
      }
   }, [workQueueTaskId, equipmentId, taskId]);

   useEffect(() => {
      if(taskResponse && taskResponse.data) {
         const resources: TaskResourceQL[] = taskResponse.data? taskResponse.data.maintenances.task.taskResources : [];
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
         setWorkOrderResource(workOrderResources);
      }
   }, [taskResponse, taskResponse.data]);

   const handleWorkOrderResourceOpenDialog = (workQueueTaskId: number, equipmentId: number, taskId: number) => {
      setWorkQueueTask([workQueueTaskId, equipmentId, taskId]);
      setResourceDialogOpen(true);
   };

   const handleWorkOrderResourceAcceptDialog = (resources: IWorkOrderResource[]) => {
      const [workQueueEquipment] = workOrder.workQueueEquipments.filter(workQueueEquipment =>  workQueueEquipment.equipmentId === equipmentId);
      workQueueEquipment.workQueueTasks.forEach(workQueueTask => {
         if(workQueueTask.workQueueTaskId === workQueueTaskId) {
            workQueueTask.taskResources = resources;
         }
      });
      const newWorkOrder = {
         workOrderId: workOrder.workOrderId,
         workOrderCode: workOrder.workOrderCode,
         workOrderStatus: workOrder.workOrderStatus,
         estimateDuration: workOrder.estimateDuration,
         executionDuration: workOrder.executionDuration,
         rate: workOrder.rate,
         totalCost: workOrder.totalCost,
         percentage: workOrder.percentage,
         notes: workOrder.notes,
         workQueueEquipments: workOrder.workQueueEquipments.concat()
      };
      setWorOrder(newWorkOrder);
      setResourceDialogOpen(false);
   };

   const session = sessionQL.data? sessionQL.data.session : getSessionDefaultInstance();
   const workOrderform: IWorkOrderForm = {
      workOrderCode: workOrder.workOrderCode,
      rate: workOrder.rate,
      totalCost: workOrder.totalCost,
      percentage: workOrder.percentage,
      notes: workOrder.notes,
      generatedBy: {personId: +session.authId, fullName: buildFullName(session.firstName, session.lastName)},
      responsible: {personId: 0, fullName: ''},
      estimateDurationDD: Math.floor(workOrder.estimateDuration / 1440),
      estimateDurationHH: Math.floor((workOrder.estimateDuration % 1440) / 60),
      estimateDurationMM: Math.round(workOrder.estimateDuration% 60),
      executionDurationDD: Math.floor(workOrder.executionDuration / 1440),
      executionDurationHH: Math.floor((workOrder.executionDuration % 1440) / 60),
      executionDurationMM: Math.round(workOrder.executionDuration % 60)
   };

   const handleOnsubmit = (form: IWorkOrderForm): void => {
      const workQueueTaskIds: number[] = [];
      let workOrderResources: { workOrderResourceId: number, amount: number, humanResourceId: number, inventoryItemId: number, workQueueTaskId: number}[] = [];
      workOrder.workQueueEquipments.forEach(w =>{
         w.workQueueTasks.forEach(t => {
            workQueueTaskIds.push(t.workQueueTaskId);
            workOrderResources = workOrderResources.concat(t.taskResources.map(r =>({
               workOrderResourceId: r.resourceId,
               amount: r.amount,
               humanResourceId: r.personId,
               inventoryItemId: r.inventoryItemId,
               workQueueTaskId: t.workQueueTaskId
            })));
         });
      });
      const workOrderSaveRequest = {
         workOrderId: workOrder.workOrderId,
         estimateDuration: form.estimateDurationMM + 60 * form.estimateDurationHH + 1440 * form.estimateDurationDD,
         rate: form.rate,
         notes: form.notes,
         generatedById: form.generatedBy.personId,
         responsibleId: form.responsible.personId,
         workQueueIds: workQueueTaskIds,
         resources: workOrderResources
      };
      console.log(workOrderSaveRequest);
   };

  return (
     <>
     <Box display="flex" flex='1'>
        <Box display="flex" flexDirection='column' style={{maxWidth: '60rem'}}>
           <WorkOrderFormDetails form={workOrderform} onSubmit={handleOnsubmit}/>
           <WorkOrderTasks workQueueEquipments={workOrder.workQueueEquipments} onSetWorkOrderResource={handleWorkOrderResourceOpenDialog}/>
           <WorkOrderResourceDialog
              resources={workOrderResource}
              open={resourceDialogOpen}
              setOpen={setResourceDialogOpen}
              onAccept={handleWorkOrderResourceAcceptDialog}
           />
        </Box>
     </Box>
     </>
  );
};
