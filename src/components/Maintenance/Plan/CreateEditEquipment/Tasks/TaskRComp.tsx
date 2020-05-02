import React, {useEffect, useState, useContext} from 'react';
import {useParams, useRouteMatch} from 'react-router-dom';
import { makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import {useLazyQuery, useMutation, useQuery} from "@apollo/react-hooks";
import {useHistory} from "react-router";

import {
   IMaintenancePlans,
   GET_TASK_BY_ID,
   ITask,
   getTaskDefaultInstance, ITaskCategory, FETCH_TASK_CATEGORIES, SAVE_MAINTENANCE_TASKS
} from "../../../../../graphql/Maintenance.type";
import {TaskR} from "./TaskR";
import {appendToPath, clearCache} from "../../../../../utils/globalUtil";

export const TaskRComp: React.FC =  () => {
   const params = useParams();
   const history = useHistory();
   const { path, url } = useRouteMatch();
   const [task, setTask] = useState(getTaskDefaultInstance());
   const [getTaskById, { called, loading, data }] = useLazyQuery<{maintenances: IMaintenancePlans}, any>(GET_TASK_BY_ID);
   const categoryData = useQuery<{taskCategories: ITaskCategory[]}, any>(FETCH_TASK_CATEGORIES);
   const [saveMaintenanceTasks, saveStatus] = useMutation<{ maintenances: IMaintenancePlans }, any>(SAVE_MAINTENANCE_TASKS);
   const taskId = +params.taskId;
   const maintenanceId = +params.maintenanceId;

   useEffect(() => {
     if(taskId && taskId > 0) {
        getTaskById({variables: { taskId }});
     }
   }, []);

   useEffect(() => {
      if(!loading && called && data) {
         setTask(data.maintenances.task);
      }
   }, [called, loading, data]);

   if (loading || saveStatus.loading || (!data && taskId > 0))
      return <div>Loading</div>;

   const onSaveTask = async (task: ITask) => {
      const response = await saveMaintenanceTasks({
         variables: {
            maintenanceId: maintenanceId,
            tasks: [{
               taskId: task.taskId,
               name: task.name,
               description: task.description,
               priority: task.priority,
               duration: task.duration,
               downTimeDuration: task.downTimeDuration,
               attribute1: task.attribute1,
               attribute2: task.attribute2,
               taskCategoryId: task.taskCategory? task.taskCategory.taskCategoryId : null,
               subTasks: task.subTasks.map(s => ({
                  subTaskId: s.subTaskId,
                  order: s.order,
                  group: s.group,
                  description: s.description,
                  mandatory: s.mandatory,
                  subTaskKindId: s.subTaskKind.subTaskKindId
               })),
               taskTriggers: task.taskTriggers.map(t => ({
                  taskTriggerId: t.taskTriggerId,
                  kind: t.kind,
                  description: t.description,
                  fixedSchedule: t.fixedSchedule,
                  frequency: t.frequency,
                  readType: t.readType,
                  limit: t.limit,
                  repeat: t.repeat,
                  operator: t.operator,
                  value: t.value,
                  unitId: t.unit && t.unit.unitId !== 0? t.unit.unitId : null,
                  eventTriggerId: t.eventTrigger && t.eventTrigger.eventTriggerId !== 0 ? t.eventTrigger.eventTriggerId : null
               })),
               taskResources: task.taskResources.map(t => ({
                  taskResourceId: t.taskResourceId,
                  order: t.order,
                  amount: t.amount,
                  resourceType: t.resourceType,
                  unitId: t.unit.unitId,
                  employeeJobId: t.employeeJob? t.employeeJob.employeeJobId : null,
                  inventoryResourceId: t.inventoryResource? t.inventoryResource.itemId : null,
                  humanResourceId: t.humanResource? t.humanResource.employeeId : null,
               }))
            }]
         }
         // , refetchQueries: [{query: GET_TASK_BY_ID, variables: {taskId: task.taskId}}]
         , update: (cache) => {
            clearCache(cache, 'maintenances.task');
         }
      });

      if(response.data) {
         const taskId = response.data.maintenances.createUpdateTasks[0].taskId;
         getTaskById({variables: { taskId }});
         const baseUrl = url.replace(/\/$/, "");
         const basePath = baseUrl.substring(0, baseUrl.lastIndexOf('/') + 1);
         const subPath = history.location.pathname.substr(url.toString().length, history.location.pathname.length - 1);
         history.push(appendToPath(basePath, taskId + subPath));
      }
   };

   return (
      <TaskR task={task}
             taskCategories={!categoryData.data? [] : categoryData.data.taskCategories}
             onSaveTask={onSaveTask}
      />
  );
};
