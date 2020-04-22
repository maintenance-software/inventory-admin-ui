import React, {useEffect, useState, useContext} from 'react';
import {useParams, useRouteMatch} from 'react-router-dom';
import { makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import {useLazyQuery, useMutation, useQuery} from "@apollo/react-hooks";
import {useHistory} from "react-router";

import {
   IMaintenancePlans,
   GET_TASK_BY_ID,
   ITask,
   getTaskDefaultInstance, ITaskCategory, FETCH_TASK_CATEGORIES
} from "../../../../../graphql/Maintenance.type";
import {TaskR} from "./TaskR";


export const TaskRComp: React.FC =  () => {
   const params = useParams();
   const history = useHistory();
   const { path, url } = useRouteMatch();
   // const [saveMaintenance] = useMutation<{ maintenances: IMaintenancePlans }, any>(SAVE_MAINTENANCE_PLAN);
   const [getTaskById, { called, loading, data }] = useLazyQuery<{maintenances: IMaintenancePlans}, any>(GET_TASK_BY_ID);
   const categoryData = useQuery<{taskCategories: ITaskCategory[]}, any>(FETCH_TASK_CATEGORIES);

   const taskId = +params.taskId;
   const maintenanceId = +params.maintenanceId;

   useEffect(() => {
     if(taskId && taskId > 0) {
        getTaskById({variables: { taskId }});
     }
  }, []);

   if (loading || (!data && taskId > 0))
      return <div>Loading</div>;

   let task: ITask = getTaskDefaultInstance();

   if(data) {
      task = data.maintenances.task;
   }

   return (
      <TaskR maintenanceId={maintenanceId} task={task} taskCategories={!categoryData.data? [] : categoryData.data.taskCategories}/>
  );
};
