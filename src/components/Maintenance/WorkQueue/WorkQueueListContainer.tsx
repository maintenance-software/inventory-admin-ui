import React, {useEffect, useContext} from 'react';
import { useLazyQuery, useMutation, useQuery } from "@apollo/react-hooks";
import {useHistory} from "react-router";
import {useRouteMatch} from "react-router-dom";
import {WorkQueueList} from './WorkQueueList';
import {
   FETCH_TASK_ACTIVITIES_GQL,
   MaintenancesQL
} from "../../../graphql/Maintenance.ql";
import {TaskAvailableDialog} from "./WorkQueueEventDialog";
import {clearCache} from "../../../utils/globalUtil";
import moment from 'moment';
import {GET_USER_SESSION_GQL, SessionQL} from "../../../graphql/Session.ql";
import {EntityStatusQL} from "../../../graphql/User.ql";
import {EquipmentQL, EquipmentsQL} from "../../../graphql/Equipment.ql";
import {
   FETCH_WORK_QUEUES_QL,
   SAVE_TASK_ACTIVITY_EVENT_GQL,
   WorkQueueQL,
   WorkQueuesQL
} from "../../../graphql/WorkOrder.ql";
import {IWorkQueueEquipment, IWorkOrderResource} from "../WorkOrder/WorkOrderTypes";
import {workQueuesConverter} from "../WorkOrder/converter";

// export interface IWorkQueueEquipment {
//    equipmentId: number;
//    name: string;
//    code: string;
//    taskCount: number;
//    maintenanceCount: number;
//    workQueueTasks: IWorkQueueTask[];
// }
//
// export interface IWorkQueueTask {
//    workQueueTaskId: number;
//    rescheduledDate: string;
//    scheduledDate: string;
//    status: string;
//    taskName: string;
//    taskPriority: number;
//    taskCategoryId: number;
//    taskCategoryName: string;
//    triggerDescription: string;
//    taskId: number;
//    taskTriggerId: number;
//    taskResources: IWorkOrderResource[];
//    valid: boolean;
// }

export const WorkQueueListContainer: React.FC = () => {
   const history = useHistory();
   const { path } = useRouteMatch();
   const [open, setOpen] = React.useState(false);
   const [workQueueEquipmentSelected, setWorkQueueEquipmentSelected] = React.useState<IWorkQueueEquipment[]>([]);
   const [pageIndex, setPageIndex] = React.useState(0);
   const [pageSize, setPageSize] = React.useState(10);
   const [searchString, setSearchString] = React.useState<string>('');
   const sessionQL = useQuery<{session: SessionQL}, any>(GET_USER_SESSION_GQL);
   const [fetchWorkQueues, { called, loading, data }] = useLazyQuery<{workQueues: WorkQueuesQL}, any>(FETCH_WORK_QUEUES_QL);
   const [saveTaskActivityEvent, saveActivityStatus] = useMutation<{ maintenances: MaintenancesQL }, any>(SAVE_TASK_ACTIVITY_EVENT_GQL);
   useEffect(() => {
      fetchWorkQueues({variables: { searchString, pageIndex: pageIndex, pageSize: pageSize }});
   }, []);

   useEffect(() => {
      fetchWorkQueues({variables: { searchString, pageIndex, pageSize }});
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

   const workQueueEquipments: IWorkQueueEquipment[] = workQueuesConverter(data.workQueues.fetchPendingWorkQueues.content);

   // const workQueueEquipments: IWorkQueueEquipment[] = data.equipments.fetchWorkQueues.content.map((equipment: EquipmentQL) => ({
   //    equipmentId: equipment.equipmentId,
   //    name: equipment.name,
   //    code: equipment.code,
   //    taskCount: 0,
   //    maintenanceCount: 0,
   //    workQueueTasks: equipment.workQueues.filter(wq => wq.status === 'PENDING').map((workQueueTask: WorkQueueQL) =>({
   //       workQueueTaskId: workQueueTask.workQueueId,
   //       rescheduledDate: workQueueTask.rescheduledDate,
   //       scheduledDate: workQueueTask.scheduledDate,
   //       status: workQueueTask.status,
   //       taskName: workQueueTask.task.name,
   //       taskPriority: workQueueTask.task.priority,
   //       taskCategoryId: workQueueTask.task.taskCategory? workQueueTask.task.taskCategory.categoryId : 0,
   //       taskCategoryName: workQueueTask.task.taskCategory? workQueueTask.task.taskCategory.name : '',
   //       triggerDescription: workQueueTask.taskTrigger.triggerType,
   //       taskId: workQueueTask.task.taskId,
   //       taskTriggerId: workQueueTask.taskTrigger.taskTriggerId,
   //       taskResources: [],
   //       valid: false
   //    }))
   // }));

   // const sortedTasksActivities = data.maintenances.taskActivities.content.sort((a, b) => a.assetId - b.assetId);
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
         refetchQueries: [{query: FETCH_TASK_ACTIVITIES_GQL, variables: { searchString, pageIndex, pageSize }}],
         update: (cache) => {
            // clearCache(cache, 'maintenances.availableEquipments');
            clearCache(cache, 'maintenances.taskActivities');
         }
      });
      setOpen(false);
   };

   const handleNeWorkOrder = () => {
      history.push({pathname: '/maintenances/workOrders/0', state: {workQueueEquipments: workQueueEquipmentSelected}});
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
               taskDuration: 0,
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
