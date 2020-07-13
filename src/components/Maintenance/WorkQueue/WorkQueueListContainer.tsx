import React, {useEffect, useContext} from 'react';
import { useLazyQuery, useMutation, useQuery } from "@apollo/react-hooks";
import {useHistory} from "react-router";
import {useRouteMatch} from "react-router-dom";
import {WorkQueueList} from './WorkQueueList';
import { MaintenancesQL } from "../../../graphql/Maintenance.ql";
import {TaskAvailableDialog} from "./WorkQueueEventDialog";
import {clearCache} from "../../../utils/globalUtil";
import moment from 'moment';
import {GET_USER_SESSION_GQL, SessionQL} from "../../../graphql/Session.ql";
import {
   FETCH_WORK_QUEUES_QL,
   SAVE_TASK_ACTIVITY_EVENT_GQL, SAVE_WORK_ORDER_QL, WorkOrdersQL,
   WorkQueuesQL
} from "../../../graphql/WorkOrder.ql";
import { IWorkOrderEquipment } from "../WorkOrder/WorkOrderTypes";
import {workQueuesConverter} from "../WorkOrder/converter";

export const WorkQueueListContainer: React.FC = () => {
   const history = useHistory();
   const { path } = useRouteMatch();
   const [open, setOpen] = React.useState(false);
   const [workQueueEquipmentSelected, setWorkQueueEquipmentSelected] = React.useState<IWorkOrderEquipment[]>([]);
   const [pageIndex, setPageIndex] = React.useState(0);
   const [pageSize, setPageSize] = React.useState(10);
   const [searchString, setSearchString] = React.useState<string>('');
   const sessionQL = useQuery<{session: SessionQL}, any>(GET_USER_SESSION_GQL);
   const [fetchWorkQueues, { called, loading, data }] = useLazyQuery<{workQueues: WorkQueuesQL}, any>(FETCH_WORK_QUEUES_QL);
   const [saveTaskActivityEvent, saveActivityStatus] = useMutation<{ workQueues: MaintenancesQL }, any>(SAVE_TASK_ACTIVITY_EVENT_GQL);
   const [saveWorkOrder, saveWorkOrderResponse] = useMutation<{workOrders: WorkOrdersQL}, any>(SAVE_WORK_ORDER_QL);

   useEffect(() => {
      fetchWorkQueues({variables: { searchString, pageIndex: pageIndex, pageSize: pageSize }});
   }, []);

   useEffect(() => {
      fetchWorkQueues({variables: { searchString, pageIndex, pageSize }});
   }, [pageIndex, pageSize, searchString]);

   useEffect(() => {
      if(saveWorkOrderResponse.data && saveWorkOrderResponse.data.workOrders.createUpdateWorkOrder.workOrderId) {
         history.push({pathname: '/maintenances/workOrders/' + saveWorkOrderResponse.data.workOrders.createUpdateWorkOrder.workOrderId});
      }
   }, [saveWorkOrderResponse, saveWorkOrderResponse.data]);

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

   const workQueueEquipments: IWorkOrderEquipment[] = workQueuesConverter(data.workQueues.fetchPendingWorkQueues.content);

   const onAcceptHandle = (equipmentId: number, taskId: number, triggerId: number, maintenanceId: number, hasAssetFailure: boolean, incidentDate: string) => {
      const date = moment(incidentDate, 'YYYY-MM-DD').format("YYYY-MM-DD HH:mm:ss.SSSSSS UTC");
      saveTaskActivityEvent({
         variables: {
            taskTriggerId: triggerId,
            taskId: taskId,
            maintenanceId: !maintenanceId? null : maintenanceId,
            assetId: equipmentId,
            hasAssetFailure: hasAssetFailure,
            incidentDate: date,
            reportedById: sessionQL.data? +sessionQL.data.session.authId : -1
         },
         refetchQueries: [{query: FETCH_WORK_QUEUES_QL, variables: { searchString, pageIndex, pageSize }}],
         update: (cache) => {
            // clearCache(cache, 'maintenances.availableEquipments');
            // clearCache(cache, 'workQueues.fetchPendingWorkQueues');
         }
      });
      setOpen(false);
   };

   const handleNeWorkOrder = () => {
      saveWorkOrder({variables: {
            workOrderId: 0,
            estimateDuration: workQueueEquipmentSelected.map(woe => woe.workQueueTasks.map(wot => wot.taskDuration)).flat().reduce((s, v) => s + v),
            rate: 0,
            notes: '',
            workQueueIds: workQueueEquipmentSelected.map(woe => woe.workQueueTasks.map(wot => wot.workQueueTaskId)).flat()
         },
         refetchQueries: [{query: FETCH_WORK_QUEUES_QL, variables: { searchString, pageIndex, pageSize }}],
         update: (cache) => {
            clearCache(cache, 'workOrders.page');
         }
      });
   };

   const handleSelectTaskActivity = (workQueueTaskId: number, equipmentId: number, taskId: number, checked: boolean) => {
      let newSelected = workQueueEquipmentSelected.concat();
      if(checked) {
         const [workQueueEquipment] = workQueueEquipments.filter(ta => !!ta.workQueueTasks.find(a => a.workQueueTaskId === workQueueTaskId));
         const [workQueueTask] = workQueueEquipment.workQueueTasks.filter(a => a.workQueueTaskId === workQueueTaskId);

         if(!newSelected.find(ta => ta.equipmentId === equipmentId)) {
            newSelected.push({
               equipmentId: workQueueEquipment.equipmentId,
               name: workQueueEquipment.name,
               code: workQueueEquipment.code,
               taskCount: workQueueEquipment.taskCount,
               maintenanceCount: workQueueEquipment.maintenanceCount,
               workQueueTasks: []
            });
         }

         const [ta] = newSelected.filter(ta => ta.equipmentId === equipmentId);
         if(!ta.workQueueTasks.find(a => a.workQueueTaskId === workQueueTaskId)) {
            ta.workQueueTasks.push({
               workQueueTaskId: workQueueTask.workQueueTaskId,
               rescheduledDate: workQueueTask.rescheduledDate,
               scheduledDate: workQueueTask.scheduledDate,
               status: workQueueTask.status,
               taskName: workQueueTask.taskName,
               taskDuration: workQueueTask.taskDuration,
               taskPriority: workQueueTask.taskPriority,
               taskCategoryId: workQueueTask.taskCategoryId,
               taskCategoryName: workQueueTask.taskCategoryName,
               triggerDescription: workQueueTask.triggerDescription,
               taskId: workQueueTask.taskId,
               taskTriggerId: workQueueTask.taskTriggerId,
               startDate: '',
               endDate: '',
               duration: 0,
               notes: '',
               lastModified: '',
               taskResources: [],
               subTasks: [],
               valid: false
            })
         }
      } else {
          newSelected = newSelected.map( ta => ({
             equipmentId: ta.equipmentId,
             name: ta.name,
             code: ta.code,
             taskCount: ta.taskCount,
             maintenanceCount: ta.maintenanceCount,
             workQueueTasks: ta.workQueueTasks.filter(a => a.workQueueTaskId !== workQueueTaskId)
          })).filter(ta => ta.workQueueTasks.length > 0);
      }
      setWorkQueueEquipmentSelected(newSelected);
   };

   return(
   <>
      <WorkQueueList
         workQueues={workQueueEquipments}
         totalCount={data.workQueues.fetchPendingWorkQueues.totalCount}
         pageIndex={data.workQueues.fetchPendingWorkQueues.pageInfo.pageIndex}
         pageSize={data.workQueues.fetchPendingWorkQueues.pageInfo.pageSize}
         searchString={searchString}
         taskActivitiesSelected={workQueueEquipmentSelected.map(ta => ta.workQueueTasks.map(a => a.workQueueTaskId)).flat()}
         onChangePage={handleChangePage}
         onChangeRowsPerPage={handleChangeRowsPerPage}
         onSearchTaskActivity={handleSearch}
         onCreateActivityByEvent={() => setOpen(true)}
         onCreateWorkOrder={() => handleNeWorkOrder()}
         onSelectTaskActivity={handleSelectTaskActivity}
      />
      <TaskAvailableDialog open={open} setOpen={setOpen} onAccept={onAcceptHandle}/>
   </>);
};
