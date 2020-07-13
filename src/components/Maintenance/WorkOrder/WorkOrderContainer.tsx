import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useLazyQuery, useQuery, useMutation } from '@apollo/react-hooks';
import {useHistory} from "react-router";
import {useParams, useRouteMatch} from 'react-router-dom';
import {
   GET_TASK_RESOURCE_BY_ID_QL,
   GET_WORK_ORDER_BY_ID_QL, SAVE_WORK_ORDER_PROGRESS_GQL, SAVE_WORK_ORDER_QL, SAVE_WORK_ORDER_RESOURCES_GQL,
   WorkOrderQL, WorkOrdersQL
} from "../../../graphql/WorkOrder.ql";
import {WorkOrderTasks} from "./WorkOrderTasks";
import {WorkOrderFormDetails} from "./WorkOrderFormDetails";
import {WorkOrderResourceDialog} from "./WorkOrderResourceDialog";
import { MaintenancesQL, SubTaskQL, TaskResourceQL } from "../../../graphql/Maintenance.ql";
import Box from '@material-ui/core/Box';
import {GET_USER_SESSION_GQL, getSessionDefaultInstance, SessionQL} from "../../../graphql/Session.ql";
import {buildFullName, clearCache} from "../../../utils/globalUtil";
import {
   getIWorkOrderDefaultInstance,
   IWorkOrder,
   IWorkOrderEquipment,
   IWorkOrderResource,
   getIWorkOrderTaskDefaultInstance, IWorkOrderTask, IWorkOrderSubTask
} from "./WorkOrderTypes";
import {workOrderResourceCalcAndConverter, workQueuesConverter} from "./converter";
import {WorkOrderSubTaskDialog} from "./WorkOrderSubTaskDialog";

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

export const WorkOrderContainer: React.FC =  () => {
   const history = useHistory();
   const { path } = useRouteMatch();
   const params = useParams();
   const [resourceDialogOpen, setResourceDialogOpen] = React.useState(false);
   const [subTaskDialogOpen, setSubTaskDialogOpen] = React.useState(false);
   const [workOrder, setWorOrder] = React.useState<IWorkOrder>(getIWorkOrderDefaultInstance());
   const [workOrderTask, setWorkOrderTask] = React.useState<IWorkOrderTask>(getIWorkOrderTaskDefaultInstance());
   const [[workQueueTaskId, equipmentId, taskId, window], setWorkQueueTask] = React.useState([0, 0, 0, '']);
   const [getWorkOrderById, { called, loading, data }] = useLazyQuery<{workOrders: WorkOrdersQL}, any>(GET_WORK_ORDER_BY_ID_QL);
   const [getTaskById, taskResponse] = useLazyQuery<{maintenances: MaintenancesQL}, any>(GET_TASK_RESOURCE_BY_ID_QL);
   const [saveWorkOrder, saveWorkOrderResponse] = useMutation<{maintenances: MaintenancesQL}, any>(SAVE_WORK_ORDER_QL);
   const [saveWorkOrderTaskProgress, saveWorkOrderTaskProgressResponse] = useMutation<{workOrders: WorkOrdersQL}, any>(SAVE_WORK_ORDER_PROGRESS_GQL);
   const [saveWorkOrderResources, saveWorkOrderResourcesResponse] = useMutation<{workOrders: WorkOrdersQL}, any>(SAVE_WORK_ORDER_RESOURCES_GQL);

   const sessionQL = useQuery<{session: SessionQL}, any>(GET_USER_SESSION_GQL);
   const workOrderId = +params.workOrderId;

   useEffect(() => {
      if(called && !loading && data) {
         const bWorkOrder: WorkOrderQL = data.workOrders.workOrder;
         const newWorkOrder: IWorkOrder = {
            workOrderId: bWorkOrder.workOrderId,
            workOrderCode: bWorkOrder.workOrderCode,
            workOrderStatus: bWorkOrder.workOrderStatus,
            estimateDuration: bWorkOrder.estimateDuration,
            executionDuration: bWorkOrder.executionDuration,
            rate: bWorkOrder.rate,
            totalCost: bWorkOrder.totalCost,
            percentage: bWorkOrder.percentage,
            notes: bWorkOrder.notes,
            responsibleId: bWorkOrder.responsible? bWorkOrder.responsible.personId : 0,
            responsibleName: bWorkOrder.responsible? buildFullName(bWorkOrder.responsible.firstName, bWorkOrder.responsible.lastName) : '',
            generatedById: bWorkOrder.generatedBy? bWorkOrder.generatedBy.personId : 0,
            generatedByName: bWorkOrder.generatedBy? buildFullName(bWorkOrder.generatedBy.firstName, bWorkOrder.generatedBy.lastName) : '',
            equipments: workQueuesConverter(bWorkOrder.workQueues)
         };
         setWorOrder(newWorkOrder);
      }
   }, [called, loading, data]);

   useEffect(() => {
      if(workOrderId) {
         getWorkOrderById({variables: {workOrderId}});
      }
   }, []);

   useEffect(() => {
      if(saveWorkOrderTaskProgressResponse.data && saveWorkOrderTaskProgressResponse.data.workOrders.saveWorkOrderProgress) {
         setSubTaskDialogOpen(false);
      }
   }, [saveWorkOrderTaskProgressResponse, saveWorkOrderTaskProgressResponse.data]);

   useEffect(() => {
      if(workQueueTaskId && equipmentId && taskId) {
         getTaskById({variables: {taskId: taskId}});
      }
   }, [workQueueTaskId, equipmentId, taskId, window]);

   useEffect(() => {
      if(taskResponse && taskResponse.data) {
         const resources: TaskResourceQL[] = taskResponse.data? taskResponse.data.maintenances.task.taskResources : [];
         const subTasks: SubTaskQL[] = taskResponse.data? taskResponse.data.maintenances.task.subTasks : [];

         const [workOrderTaskTemp] = workOrder.equipments.map(woe => {
            const [temp] = woe.workQueueTasks.filter(wot => wot.workQueueTaskId === workQueueTaskId);
            return temp
         }).filter(wot => wot);

         let newWorkOrderResources: IWorkOrderResource[] = [];
         if(workOrderTaskTemp.taskResources.length > 0) {
            newWorkOrderResources = workOrderTaskTemp.taskResources.map(tr => {
               if(tr.resourceType === 'HUMAN') {
                  return {
                     workOrderResourceId: tr.workOrderResourceId,
                     resourceName: tr.resourceName,
                     itemId: tr.itemId,
                     inventoryItemId: tr.inventoryItemId,
                     employeeCategoryId: tr.employeeCategoryId,
                     humanResourceId: tr.humanResourceId,
                     resourceType: tr.resourceType,
                     amount: tr.amount,
                  }
               } else {
                  const [{inventoryResource}] = resources.filter(trQL => tr.resourceType === 'INVENTORY' && trQL.inventoryResource && trQL.inventoryResource.itemId === tr.itemId);
                  return {
                     workOrderResourceId: tr.workOrderResourceId,
                     resourceName: inventoryResource? inventoryResource.name : '',
                     itemId: tr.itemId,
                     inventoryItemId: tr.inventoryItemId,
                     employeeCategoryId: tr.employeeCategoryId,
                     humanResourceId: tr.humanResourceId,
                     resourceType: tr.resourceType,
                     amount: tr.amount,
                  }
               }
            });
         } else {
            newWorkOrderResources = workOrderResourceCalcAndConverter(resources);
         }
         const newWorkOrderSubTasks = subTasks.map((st, index) => {
            const workOrderSubTaskTemp = workOrderTaskTemp.subTasks.find(wost => wost.subTaskId === st.subTaskId);
            return {
               workOrderSubTaskId: workOrderSubTaskTemp? workOrderSubTaskTemp.workOrderSubTaskId : -index,
               subTaskId: st.subTaskId,
               subTaskCategoryKey: st.subTaskCategory.key,
               subTaskDescription: st.description,
               value: workOrderSubTaskTemp? workOrderSubTaskTemp.value : ''
            };
         });
         const newWorkOrderTask: IWorkOrderTask = {...workOrderTaskTemp, taskResources: newWorkOrderResources, subTasks: newWorkOrderSubTasks};
         setWorkOrderTask(newWorkOrderTask);
         if(window === 'RESOURCES') {
            setResourceDialogOpen(true);
         }

         if(window === 'SUBTASKS') {
            setSubTaskDialogOpen(true);
         }
      }
   }, [taskResponse, taskResponse.data]);

   const handleWorkOrderResourceOpenDialog = (workQueueTaskId_: number, equipmentId_: number, taskId_: number) => {
      if(workQueueTaskId === workQueueTaskId_ && equipmentId === equipmentId_ && taskId === taskId_) {
         setResourceDialogOpen(true);
      } else {
         setWorkQueueTask([workQueueTaskId_, equipmentId_, taskId_, 'RESOURCES']);
      }
   };

   const handleWorkOrderSubTaskOpenDialog = (workQueueTaskId_: number, equipmentId_: number, taskId_: number) => {
      if(workQueueTaskId === workQueueTaskId_ && equipmentId === equipmentId_ && taskId === taskId_) {
         setSubTaskDialogOpen(true);
      } else {
         setWorkQueueTask([workQueueTaskId_, equipmentId_, taskId_, 'SUBTASKS']);
      }
   };

   const session = sessionQL.data? sessionQL.data.session : getSessionDefaultInstance();
   const workOrderform: IWorkOrderForm = {
      workOrderCode: workOrder.workOrderCode,
      rate: workOrder.rate,
      totalCost: workOrder.totalCost,
      percentage: workOrder.percentage,
      notes: workOrder.notes,
      generatedBy: {personId: +session.authId, fullName: buildFullName(session.firstName, session.lastName)},
      responsible: {personId: workOrder.responsibleId, fullName: workOrder.responsibleName},
      estimateDurationDD: Math.floor(workOrder.estimateDuration / 1440),
      estimateDurationHH: Math.floor((workOrder.estimateDuration % 1440) / 60),
      estimateDurationMM: Math.round(workOrder.estimateDuration% 60),
      executionDurationDD: Math.floor(workOrder.executionDuration / 1440),
      executionDurationHH: Math.floor((workOrder.executionDuration % 1440) / 60),
      executionDurationMM: Math.round(workOrder.executionDuration % 60)
   };

   const handleOnsubmit = async (form: IWorkOrderForm) => {
      const workOrderSaveRequest = {
         workOrderId: workOrder.workOrderId,
         estimateDuration: form.estimateDurationMM + 60 * form.estimateDurationHH + 1440 * form.estimateDurationDD,
         rate: form.rate,
         notes: form.notes,
         generatedById: form.generatedBy.personId,
         responsibleId: form.responsible.personId,
         workQueueIds: []
      };

      const response = await saveWorkOrder({
         variables: workOrderSaveRequest,
         refetchQueries: [{query: GET_WORK_ORDER_BY_ID_QL, variables: {workOrderId}}],
         update: (cache) => {
            clearCache(cache, 'workOrders.page');
         }
      });
      if(!response.data)
         return;
   };

   const handleSaveWorkOrderResource = (resources: IWorkOrderResource[]) => {
      saveWorkOrderResources({
         variables: {
            resources: resources.map(r => ({
               workOrderResourceId: r.workOrderResourceId,
               amount: r.amount,
               resourceType: r.resourceType,
               employeeCategoryId: r.employeeCategoryId || null,
               humanResourceId: r.humanResourceId || null,
               itemId: r.itemId || null,
               inventoryItemId: r.inventoryItemId || null,
               workQueueTaskId: workQueueTaskId
            }))
         },
         refetchQueries: [{query: GET_WORK_ORDER_BY_ID_QL, variables: {workOrderId}}]
      });
      setResourceDialogOpen(false);
   };

   const handleSaveWorkOrderSubTasks = (workOrderTask: IWorkOrderTask, finalize: boolean) => {
      saveWorkOrderTaskProgress({variables: {
            workQueueId: workOrderTask.workQueueTaskId,
            workOrderId: workOrderId,
            startWorkDate: workOrderTask.startDate,
            finishedWorkDate: workOrderTask.endDate,
            notes: workOrderTask.notes,
            status: !finalize? workOrderTask.status : 'WO_TASK_COMPLETED',
            workOrderSubTasks: workOrderTask.subTasks.map(st => ({
               workOrderSubTaskId: st.workOrderSubTaskId,
               value: st.value,
               subTaskId: st.subTaskId
            })),
         },
         refetchQueries: [{query: GET_WORK_ORDER_BY_ID_QL, variables: {workOrderId}}]
      });
   };

  return (
     <>
     <Box display="flex" flex='1'>
        <Box display="flex" flexDirection='column' style={{maxWidth: '60rem'}}>
           <WorkOrderFormDetails form={workOrderform} onSubmit={handleOnsubmit}/>
           <WorkOrderTasks
              workOrderEquipments={workOrder.equipments}
              onSetWorkOrderResource={handleWorkOrderResourceOpenDialog}
              onWorkOrderSubTask={handleWorkOrderSubTaskOpenDialog}
           />
           <WorkOrderResourceDialog
              resources={workOrderTask.taskResources}
              open={resourceDialogOpen}
              setOpen={setResourceDialogOpen}
              onSaveWorkOrderResources={handleSaveWorkOrderResource}
           />
           <WorkOrderSubTaskDialog
              task={workOrderTask}
              open={subTaskDialogOpen}
              setOpen={setSubTaskDialogOpen}
              onSaveWorkOrderTask={handleSaveWorkOrderSubTasks}
           />
        </Box>
     </Box>
     </>
  );
};
