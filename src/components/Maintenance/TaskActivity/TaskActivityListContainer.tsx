import React, {useEffect, useContext} from 'react';
import { useLazyQuery, useMutation, useQuery } from "@apollo/react-hooks";
import {useHistory} from "react-router";
import {useRouteMatch} from "react-router-dom";
import {TaskActivity, TaskActivityList} from './TaskActivityList';
import {
   FETCH_TASK_ACTIVITIES_GQL, GET_MAINTENANCE_PLAN_BY_ID,
   IMaintenancePlans,
   ITaskActivity,
   SAVE_TASK_ACTIVITY_EVENT_GQL
} from "../../../graphql/Maintenance.type";
import {TaskAvailableDialog} from "./TaskActivityEventDialog";
import {clearCache} from "../../../utils/globalUtil";
import moment from 'moment';
import {GET_USER_SESSION_GQL, ISession} from "../../../graphql/session.type";

export const TaskActivityListContainer: React.FC = () => {
   const history = useHistory();
   const { path } = useRouteMatch();
   const [open, setOpen] = React.useState(false);
   const [pageIndex, setPageIndex] = React.useState(0);
   const [pageSize, setPageSize] = React.useState(10);
   const [searchString, setSearchString] = React.useState<string>('');
   const sessionQL = useQuery<{session: ISession}, any>(GET_USER_SESSION_GQL);
   const [fetchTaskActivities, { called, loading, data }] = useLazyQuery<{maintenances: IMaintenancePlans}, any>(FETCH_TASK_ACTIVITIES_GQL);
   const [saveTaskActivityEvent, saveActivityStatus] = useMutation<{ maintenances: IMaintenancePlans }, any>(SAVE_TASK_ACTIVITY_EVENT_GQL);
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

   const grouped: TaskActivity[] = [];

   data.maintenances.taskActivities.content.forEach((taskActivity: ITaskActivity) => {
      const groupIndex = grouped.findIndex((item: TaskActivity) => {
         return item.assetId === taskActivity.assetId;
      });
      groupIndex !== -1 ? grouped[groupIndex].activities.push({
            scheduledDate: taskActivity.scheduledDate,
            calculatedDate: taskActivity.calculatedDate,
            status: taskActivity.status,
            taskName: taskActivity.taskName,
            taskPriority: taskActivity.taskPriority,
            triggerDescription: taskActivity.triggerDescription,
            taskId: taskActivity.taskId,
            taskTriggerId: taskActivity.taskTriggerId,
         })
         : grouped.push(
            {
               assetId: taskActivity.assetId,
               assetName: taskActivity.assetName,
               assetCode: taskActivity.assetCode,
               taskCount: 1,
               maintenanceCount: 2,
               activities: [{
                  scheduledDate: taskActivity.scheduledDate,
                  calculatedDate: taskActivity.calculatedDate,
                  status: taskActivity.status,
                  taskName: taskActivity.taskName,
                  taskPriority: taskActivity.taskPriority,
                  triggerDescription: taskActivity.triggerDescription,
                  taskId: taskActivity.taskId,
                  taskTriggerId: taskActivity.taskTriggerId,
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

   return(
   <>
      <TaskActivityList
         taskActivities={grouped}
         totalCount={data.maintenances.taskActivities.totalCount}
         pageIndex={data.maintenances.taskActivities.pageInfo.pageIndex}
         pageSize={data.maintenances.taskActivities.pageInfo.pageSize}
         searchString={searchString}
         onChangePage={handleChangePage}
         onChangeRowsPerPage={handleChangeRowsPerPage}
         onSearchTaskActivity={handleSearch}
         onCreateActivityByEvent={() => setOpen(true)}
      />
      <TaskAvailableDialog open={open} setOpen={setOpen} onAccept={onAcceptHandle}/>
   </>);
};
