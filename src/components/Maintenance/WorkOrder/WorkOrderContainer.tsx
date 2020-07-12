import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import {useFormik} from 'formik';
import * as Yup from "yup";
import { useLazyQuery, useQuery, useMutation } from '@apollo/react-hooks';
import {useHistory} from "react-router";
import {useParams, useRouteMatch} from 'react-router-dom';
import {
   GET_TASK_RESOURCE_BY_ID_QL,
   GET_WORK_ORDER_BY_ID_QL, SAVE_WORK_ORDER_PROGRESS_GQL, SAVE_WORK_ORDER_QL,
   WorkOrderQL, WorkOrdersQL
} from "../../../graphql/WorkOrder.ql";
import {WorkOrderTasks} from "./WorkOrderTasks";
import {WorkOrderFormDetails} from "./WorkOrderFormDetails";
import {WorkOrderResourceDialog} from "./WorkOrderResourceDialog";
import {MaintenancesQL, SubTaskQL, TaskResourceQL} from "../../../graphql/Maintenance.ql";
import Box from '@material-ui/core/Box';
import {GET_USER_SESSION_GQL, getSessionDefaultInstance, SessionQL} from "../../../graphql/Session.ql";
import {buildFullName, clearCache} from "../../../utils/globalUtil";
import {
   getIWorkOrderDefaultInstance,
   IWorkOrder,
   IWorkQueueEquipment,
   IWorkOrderResource,
   getIWorkOrderTaskDefaultInstance, IWorkOrderTask
} from "./WorkOrderTypes";
import {workOrderResourceConverter, workQueuesConverter} from "./converter";
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
   // const [workOrderResource, setWorkOrderResource] = React.useState<IWorkOrderResource[]>([]);
   const [[workQueueTaskId, equipmentId, taskId], setWorkQueueTask] = React.useState([0, 0, 0]);
   const [getWorkOrderById, { called, loading, data }] = useLazyQuery<{workOrders: WorkOrdersQL}, any>(GET_WORK_ORDER_BY_ID_QL);
   const [getTaskById, taskResponse] = useLazyQuery<{maintenances: MaintenancesQL}, any>(GET_TASK_RESOURCE_BY_ID_QL);
   const [saveWorkOrder, saveWorkOrderResponse] = useMutation<{maintenances: MaintenancesQL}, any>(SAVE_WORK_ORDER_QL);
   const [saveWorkOrderTaskProgress, saveWorkOrderTaskProgressResponse] = useMutation<{workOrders: WorkOrdersQL}, any>(SAVE_WORK_ORDER_PROGRESS_GQL);

   const [isValid, setIsValid] = useState(false);

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
            responsibleId: bWorkOrder.responsible.personId,
            responsibleName: buildFullName(bWorkOrder.responsible.firstName, bWorkOrder.responsible.lastName),
            generatedById: bWorkOrder.generatedBy.personId,
            generatedByName: buildFullName(bWorkOrder.generatedBy.firstName, bWorkOrder.generatedBy.lastName),
            equipments: workQueuesConverter(bWorkOrder.workQueues).sort((e1, e2) => e1.equipmentId - e2.equipmentId),
         };
         console.log(newWorkOrder);
         setWorOrder(newWorkOrder);
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
            generatedById: workOrder.generatedById,
            generatedByName: workOrder.generatedByName,
            responsibleId: workOrder.responsibleId,
            responsibleName: workOrder.responsibleName,
            equipments: (history.location.state.workQueueEquipments || []).map((w: IWorkQueueEquipment) =>({
               equipmentId: w.equipmentId,
               name: w.name,
               code: w.code,
               taskCount: 0,
               maintenanceCount: 0,
               workQueueTasks: w.workQueueTasks.map(wt => ({
                  workQueueTaskId: wt.workQueueTaskId,
                  rescheduledDate: wt.rescheduledDate,
                  scheduledDate: wt.scheduledDate,
                  status: wt.status,
                  taskName: wt.taskName,
                  taskPriority: wt.taskPriority,
                  taskCategoryId: wt.taskCategoryId,
                  taskCategoryName: wt.taskCategoryName,
                  triggerDescription: wt.triggerDescription,
                  taskId: wt.taskId,
                  taskTriggerId: wt.taskTriggerId,
                  taskResources: [],
                  valid: false,
               })),
            }))
         };
         setWorOrder(newWorkOrder);
      }
   }, []);

   useEffect(() => {
      if(saveWorkOrderTaskProgressResponse.data && saveWorkOrderTaskProgressResponse.data.workOrders.saveWorkOrderProgress) {
         setSubTaskDialogOpen(false);
      }
   }, [saveWorkOrderTaskProgressResponse, saveWorkOrderTaskProgressResponse.data]);

   useEffect(() => {
      if(workQueueTaskId && equipmentId && taskId) {
         // const [workOrderEquipment] = workOrder.equipments.filter(e =>  e.equipmentId === equipmentId);
         // const [workQueueTask] = workOrderEquipment.workQueueTasks.filter(workQueueTask => workQueueTask.workQueueTaskId === workQueueTaskId);
         // if(workQueueTask.taskResources.length > 0) {
         //    setWorkOrderResource(workQueueTask.taskResources);
         // } else {
         //    getTaskById({variables: {taskId: taskId}});
         // }
         getTaskById({variables: {taskId: taskId}});
      }
   }, [workQueueTaskId, equipmentId, taskId]);

   useEffect(() => {
      if(taskResponse && taskResponse.data) {
         const resources: TaskResourceQL[] = taskResponse.data? taskResponse.data.maintenances.task.taskResources : [];
         const subTasks: SubTaskQL[] = taskResponse.data? taskResponse.data.maintenances.task.subTasks : [];
         const newWorkOrderResources = workOrderResourceConverter(resources);

         const [workOrderTaskTemp] = workOrder.equipments.map(woe => {
            const [temp] = woe.workQueueTasks.filter(wot => wot.workQueueTaskId === workQueueTaskId);
            return temp
         }).filter(wot => wot);

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
      }
   }, [taskResponse, taskResponse.data]);

   const handleWorkOrderResourceOpenDialog = (workQueueTaskId: number, equipmentId: number, taskId: number) => {
      setWorkQueueTask([workQueueTaskId, equipmentId, taskId]);
      setResourceDialogOpen(true);
   };

   const handleWorkOrderSubTaskOpenDialog = async (workQueueTaskId: number, equipmentId: number, taskId: number) => {
      setWorkQueueTask([workQueueTaskId, equipmentId, taskId]);
      setSubTaskDialogOpen(true);
   };

   const handleWorkOrderResourceAcceptDialog = (resources: IWorkOrderResource[]) => {
      // const [workEquipment] = workOrder.equipments.filter(e =>  e.equipmentId === equipmentId);
      // workEquipment.workQueueTasks.forEach(workOrderTask => {
      //    if(workOrderTask.workQueueTaskId === workQueueTaskId) {
      //       workOrderTask.taskResources = resources;
      //       workOrderTask.valid = true;
      //    }
      // });
      const newWorkOrder: IWorkOrder = {
         workOrderId: workOrder.workOrderId,
         workOrderCode: workOrder.workOrderCode,
         workOrderStatus: workOrder.workOrderStatus,
         estimateDuration: workOrder.estimateDuration,
         executionDuration: workOrder.executionDuration,
         rate: workOrder.rate,
         totalCost: workOrder.totalCost,
         percentage: workOrder.percentage,
         notes: workOrder.notes,
         generatedById: workOrder.generatedById,
         generatedByName: workOrder.generatedByName,
         responsibleId: workOrder.responsibleId,
         responsibleName: workOrder.responsibleName,
         equipments: workOrder.equipments.concat()
      };
      setWorOrder(newWorkOrder);
      setResourceDialogOpen(false);
      let isValid = true;
      newWorkOrder.equipments.map(w => {
         w.workQueueTasks.forEach(t => {
            isValid = isValid && t.valid;
         });
      });
      setIsValid(isValid);
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
      const workQueueTaskIds: number[] = [];
      let workOrderResources: { workOrderResourceId: number, amount: number, humanResourceId: number | null, inventoryItemId: number | null, workQueueTaskId: number}[] = [];
      workOrder.equipments.forEach(w =>{
         w.workQueueTasks.forEach(t => {
            workQueueTaskIds.push(t.workQueueTaskId);
            workOrderResources = workOrderResources.concat(t.taskResources.map(r =>({
               workOrderResourceId: r.workOrderResourceId,
               amount: r.amount,
               humanResourceId: !r.personId? null : r.personId,
               inventoryItemId: !r.inventoryItemId? null : r.inventoryItemId,
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

      const response = await saveWorkOrder({
         variables: workOrderSaveRequest
         , update: (cache) => {
            clearCache(cache, 'equipments.fetchWorkQueues');
         }
      });
      if(!response.data)
         return;
      // getEquipmentById({variables: { equipmentId: response.data.equipments.saveEquipment.equipmentId }});
      // history.push(response.data.equipments.saveEquipment.equipmentId.toString());
      // console.log(response);
   };

   const handleSaveWorkOrderTask = (workOrderTask: IWorkOrderTask, finalize: boolean) => {
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
         refetchQueries: [{query: GET_WORK_ORDER_BY_ID_QL, variables: {workOrderId}}],
      });
   };
  return (
     <>
     <Box display="flex" flex='1'>
        <Box display="flex" flexDirection='column' style={{maxWidth: '60rem'}}>
           <WorkOrderFormDetails form={workOrderform} onSubmit={handleOnsubmit} error={!isValid}/>
           <WorkOrderTasks
              workOrderEquipments={workOrder.equipments}
              onSetWorkOrderResource={handleWorkOrderResourceOpenDialog}
              onWorkOrderSubTask={handleWorkOrderSubTaskOpenDialog}
           />
           <WorkOrderResourceDialog
              resources={workOrderTask.taskResources}
              open={resourceDialogOpen}
              setOpen={setResourceDialogOpen}
              onAccept={handleWorkOrderResourceAcceptDialog}
           />
           <WorkOrderSubTaskDialog
              task={workOrderTask}
              open={subTaskDialogOpen}
              setOpen={setSubTaskDialogOpen}
              onSaveWorkOrderTask={handleSaveWorkOrderTask}
           />
        </Box>
     </Box>
     </>
  );
};
