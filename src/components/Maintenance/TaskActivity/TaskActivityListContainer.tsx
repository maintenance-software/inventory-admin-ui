import React, {useEffect, useContext} from 'react';
import { useLazyQuery, useMutation, useQuery } from "@apollo/react-hooks";
import {useHistory} from "react-router";
import {useRouteMatch} from "react-router-dom";
import {TaskActivityList} from './TaskActivityList';
import {
   FETCH_TASK_ACTIVITIES_GQL,
   MaintenancesQL,
   TaskActivityQL,
   SAVE_TASK_ACTIVITY_EVENT_GQL
} from "../../../graphql/Maintenance.ql";
import {TaskAvailableDialog} from "./TaskActivityEventDialog";
import {clearCache} from "../../../utils/globalUtil";
import moment from 'moment';
import {GET_USER_SESSION_GQL, SessionQL} from "../../../graphql/Session.ql";
import {EntityStatusQL} from "../../../graphql/User.ql";

export interface ITaskActivity {
   assetId: number;
   assetName: string;
   assetCode: string;
   taskCount: number;
   maintenanceCount: number;
   activities: IActivity[];
}

export interface IActivity {
   taskActivityId: number;
   scheduledDate: string;
   calculatedDate: string;
   status: EntityStatusQL;
   taskName: string;
   taskPriority: number;
   taskCategoryId: number;
   taskCategoryName: string;
   triggerDescription: string;
   taskId: number;
   taskTriggerId: number;
}

export const TaskActivityListContainer: React.FC = () => {
   const history = useHistory();
   const { path } = useRouteMatch();
   const [open, setOpen] = React.useState(false);
   const [taskActivitiesSelected, setTaskActivitiesSelected] = React.useState<ITaskActivity[]>([]);
   const [pageIndex, setPageIndex] = React.useState(0);
   const [pageSize, setPageSize] = React.useState(10);
   const [searchString, setSearchString] = React.useState<string>('');
   const sessionQL = useQuery<{session: SessionQL}, any>(GET_USER_SESSION_GQL);
   const [fetchTaskActivities, { called, loading, data }] = useLazyQuery<{maintenances: MaintenancesQL}, any>(FETCH_TASK_ACTIVITIES_GQL);
   const [saveTaskActivityEvent, saveActivityStatus] = useMutation<{ maintenances: MaintenancesQL }, any>(SAVE_TASK_ACTIVITY_EVENT_GQL);
   useEffect(() => {
      fetchTaskActivities({variables: { searchString, pageIndex: pageIndex, pageSize: pageSize }});
   }, []);

   useEffect(() => {
      fetchTaskActivities({variables: { searchString, pageIndex, pageSize }});
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

   const taskActivities: ITaskActivity[] = [];

   data.maintenances.taskActivities.content.forEach((taskActivity: TaskActivityQL) => {
      const groupIndex = taskActivities.findIndex((item: ITaskActivity) => {
         return item.assetId === taskActivity.assetId;
      });
      groupIndex !== -1 ? taskActivities[groupIndex].activities.push({
            taskActivityId: taskActivity.taskActivityId,
            scheduledDate: taskActivity.scheduledDate,
            calculatedDate: taskActivity.calculatedDate,
            status: taskActivity.status,
            taskName: taskActivity.taskName,
            taskPriority: taskActivity.taskPriority,
            taskCategoryId: taskActivity.taskCategoryId,
            taskCategoryName: taskActivity.taskCategoryName,
            triggerDescription: taskActivity.triggerDescription,
            taskId: taskActivity.taskId,
            taskTriggerId: taskActivity.taskTriggerId
         })
         : taskActivities.push(
            {
               assetId: taskActivity.assetId,
               assetName: taskActivity.assetName,
               assetCode: taskActivity.assetCode,
               taskCount: 1,
               maintenanceCount: 2,
               activities: [{
                  taskActivityId: taskActivity.taskActivityId,
                  scheduledDate: taskActivity.scheduledDate,
                  calculatedDate: taskActivity.calculatedDate,
                  status: taskActivity.status,
                  taskName: taskActivity.taskName,
                  taskPriority: taskActivity.taskPriority,
                  taskCategoryId: taskActivity.taskCategoryId,
                  taskCategoryName: taskActivity.taskCategoryName,
                  triggerDescription: taskActivity.triggerDescription,
                  taskId: taskActivity.taskId,
                  taskTriggerId: taskActivity.taskTriggerId
               }]
            });
   });

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
      history.push({pathname: '/maintenances/workOrders/0', state: {taskActivities: taskActivitiesSelected}});
   };

   const handleSelectTaskActivity = (taskActivityId: number, assetId: number, taskId: number, checked: boolean) => {
      let newSelected = taskActivitiesSelected.concat();
      if(checked) {
         const [taskActivity] = taskActivities.filter(ta => !!ta.activities.find(a => a.taskActivityId === taskActivityId));
         const [activity] = taskActivity.activities.filter(a => a.taskActivityId === taskActivityId);

         if(!newSelected.find(ta => ta.assetId === assetId)) {
            newSelected.push({
               assetId: taskActivity.assetId,
               assetName: taskActivity.assetName,
               assetCode: taskActivity.assetCode,
               taskCount: taskActivity.taskCount,
               maintenanceCount: taskActivity.maintenanceCount,
               activities: []
            });
         }

         const [ta] = newSelected.filter(ta => ta.assetId === assetId);
         if(!ta.activities.find(a => a.taskActivityId === taskActivityId)) {
            ta.activities.push({
               taskActivityId: activity.taskActivityId,
               scheduledDate: activity.scheduledDate,
               calculatedDate: activity.calculatedDate,
               status: activity.status,
               taskName: activity.taskName,
               taskPriority: activity.taskPriority,
               taskCategoryId: activity.taskCategoryId,
               taskCategoryName: activity.taskCategoryName,
               triggerDescription: activity.triggerDescription,
               taskId: activity.taskId,
               taskTriggerId: activity.taskTriggerId
            })
         }
      } else {
          newSelected = newSelected.map( ta => ({
             assetId: ta.assetId,
             assetName: ta.assetName,
             assetCode: ta.assetCode,
             taskCount: ta.taskCount,
             maintenanceCount: ta.maintenanceCount,
             activities: ta.activities.filter(a => a.taskActivityId !== taskActivityId)
          })).filter(ta => ta.activities.length > 0);
      }
      setTaskActivitiesSelected(newSelected);
   };

   return(
   <>
      <TaskActivityList
         taskActivities={taskActivities}
         totalCount={data.maintenances.taskActivities.totalCount}
         pageIndex={data.maintenances.taskActivities.pageInfo.pageIndex}
         pageSize={data.maintenances.taskActivities.pageInfo.pageSize}
         searchString={searchString}
         taskActivitiesSelected={taskActivitiesSelected.map(ta => ta.activities.map(a => a.taskActivityId)).flat()}
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
