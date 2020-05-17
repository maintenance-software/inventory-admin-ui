import React, {useEffect, useContext} from 'react';
import { useLazyQuery } from "@apollo/react-hooks";
import {useHistory} from "react-router";
import {useRouteMatch} from "react-router-dom";
import {TaskActivity, TaskActivityList} from './TaskActivityList';
import {FETCH_TASK_ACTIVITIES_GQL, IMaintenancePlans, ITaskActivity} from "../../../graphql/Maintenance.type";

export const TaskActivityListContainer: React.FC = () => {
   const history = useHistory();
   const { path } = useRouteMatch();
   const [pageIndex, setPageIndex] = React.useState(0);
   const [pageSize, setPageSize] = React.useState(10);
   const [searchString, setSearchString] = React.useState<string>('');
   const [fetchTaskActivities, { called, loading, data }] = useLazyQuery<{maintenances: IMaintenancePlans}, any>(FETCH_TASK_ACTIVITIES_GQL);

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
               assetCode: '',
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

   return <TaskActivityList
      taskActivities={grouped}
      totalCount={data.maintenances.taskActivities.totalCount}
      pageIndex={data.maintenances.taskActivities.pageInfo.pageIndex}
      pageSize={data.maintenances.taskActivities.pageInfo.pageSize}
      searchString={searchString}
      onChangePage={handleChangePage}
      onChangeRowsPerPage={handleChangeRowsPerPage}
      onSearchTaskActivity={handleSearch}
   />;
};
