import React, {useEffect, useState, useContext} from 'react';
import {useTranslation} from 'react-i18next';
import {useParams, useRouteMatch} from 'react-router-dom';
import { makeStyles, Theme, useTheme } from '@material-ui/core/styles';
import {useHistory} from "react-router";
import Typography from "@material-ui/core/Typography/Typography";
import Box from "@material-ui/core/Box/Box";
import {AppBar, Button, Divider} from "@material-ui/core";
import Tabs from "@material-ui/core/Tabs/Tabs";
import Tab from "@material-ui/core/Tab/Tab";
import {
   ITask,
   ITaskCategory
} from "../../../../../graphql/Maintenance.type";
import { useFormik } from 'formik';
import * as Yup from "yup";
import {TaskDetailComp} from "./TaskDetail";
import {TaskTrigger} from "./Trigger";
import {appendToPath, clearCache} from "../../../../../utils/globalUtil";
import {SubTask} from "./SubTask";
import {TaskResource} from "./TaskResource";
import {ICategory} from "../../../../../graphql/item.type";

interface TabPanelProps {
   children?: React.ReactNode;
   index: any;
   value: any;
}

function TabPanel(props: TabPanelProps) {
   const { children, value, index, ...other } = props;

   return (
      <Typography
         component="div"
         role="tabpanel"
         hidden={value !== index}
         id={`wrapped-tabpanel-${index}`}
         aria-labelledby={`wrapped-tab-${index}`}
         {...other}
      >
         {value === index && <Box p={1}>{children}</Box>}
      </Typography>
   );
}

function a11yProps(index: any) {
   return {
      id: `wrapped-tab-${index}`,
      'aria-controls': `wrapped-tabpanel-${index}`,
   };
}

const useStyles = makeStyles((theme: Theme) => ({
   root: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.paper,
   }
}));

interface ITaskProps {
   task: ITask;
   taskCategories: ICategory[];
   onSaveTask(task: ITask): void;
}

interface ITaskDetailForm {
   name: string;
   priority: number;
   durationDD: number;
   durationHH: number;
   durationMM: number;
   downTimeDurationDD: number;
   downTimeDurationMM: number;
   downTimeDurationHH: number;
   attribute1: string;
   attribute2: string;
   taskCategoryId: number;
}

export const TaskR: React.FC<ITaskProps> =  ({task, taskCategories, onSaveTask}) => {
   const [t, i18n] = useTranslation();
   const params = useParams();
   const history = useHistory();
   const theme = useTheme();
   const { path, url } = useRouteMatch();
   const [activeTab, setActiveTab] = useState('1');
   const classes = useStyles();
   const taskDetailFormik = useFormik<ITaskDetailForm>({
      enableReinitialize: true,
      initialValues: {
         name: task.name,
         priority: task.priority,
         durationDD: Math.floor(task.duration / 1440),
         durationHH: Math.floor((task.duration % 1440) / 60),
         durationMM: Math.round(task.duration % 60),
         downTimeDurationDD: Math.floor(task.downTimeDuration / 1440),
         downTimeDurationHH: Math.floor((task.downTimeDuration % 1440) / 60),
         downTimeDurationMM: Math.round(task.downTimeDuration % 60),
         attribute1: task.attribute1,
         attribute2: task.attribute2,
         taskCategoryId: task.taskCategory? task.taskCategory.categoryId: -1
      },
      validationSchema: Yup.object().shape({
         name: Yup.string().required('Name is required'),
         durationDD: Yup.number().moreThan(-1),
         durationHH: Yup.number().moreThan(-1).lessThan(24),
         durationMM: Yup.number().moreThan(-1).lessThan(60),
         downTimeDurationDD: Yup.number().moreThan(-1),
         downTimeDurationHH: Yup.number().moreThan(-1).lessThan(24),
         downTimeDurationMM: Yup.number().moreThan(-1).lessThan(60),
      }),
      onSubmit: (values, bag) => {
         // callback(values, bag.resetForm);
      }
   });

   const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
      history.push(appendToPath(url, newValue === 'home'? '' : newValue));
   };

   const handlerSaveTask = async () => {
      const durationDD = +taskDetailFormik.getFieldProps('durationDD').value;
      const durationHH = +taskDetailFormik.getFieldProps('durationHH').value;
      const durationMM = +taskDetailFormik.getFieldProps('durationMM').value;
      const downTimeDurationDD = +taskDetailFormik.getFieldProps('downTimeDurationDD').value;
      const downTimeDurationHH = +taskDetailFormik.getFieldProps('downTimeDurationHH').value;
      const downTimeDurationMM = +taskDetailFormik.getFieldProps('downTimeDurationMM').value;
      const categoryId = +taskDetailFormik.getFieldProps('taskCategoryId').value;

      const newTask: ITask = {
         taskId: task.taskId,
         name: taskDetailFormik.getFieldProps('name').value,
         description: taskDetailFormik.getFieldProps('description').value,
         attribute1: task.attribute1,
         attribute2: task.attribute2,
         priority: taskDetailFormik.getFieldProps('priority').value,
         duration: durationMM + 60 * durationHH + 1440 * durationDD,
         downTimeDuration: downTimeDurationMM + 60 * downTimeDurationHH + 1440 * downTimeDurationDD,
         taskCategory: taskCategories.find(c => c.categoryId === categoryId),
         subTasks: task.subTasks.map(s => ({
            subTaskId: s.subTaskId,
            order: s.order,
            group: s.group,
            description: s.description,
            mandatory: s.mandatory,
            modifiedDate: task.modifiedDate,
            createdDate: task.createdDate,
            subTaskCategory: s.subTaskCategory
         })),
         taskTriggers: task.taskTriggers.map(t => ({
            taskTriggerId: t.taskTriggerId,
            triggerType: t.triggerType,
            description: t.description,
            fixedSchedule: t.fixedSchedule,
            frequency: t.frequency,
            readType: t.readType,
            limit: t.limit,
            repeat: t.repeat,
            operator: t.operator,
            value: t.value,
            unit: t.unit,
            eventTriggerCategory: t.eventTriggerCategory,
            modifiedDate: t.modifiedDate,
            createdDate: t.createdDate
         })),
         taskResources: task.taskResources.map(t => ({
            taskResourceId: t.taskResourceId,
            order: t.order,
            amount: t.amount,
            resourceType: t.resourceType,
            unit: t.unit,
            employeeCategory: t.employeeCategory,
            inventoryResource: t.inventoryResource,
            modifiedDate: t.modifiedDate,
            createdDate: t.createdDate
         })),
         maintenanceId: 0,
         modifiedDate: task.modifiedDate,
         createdDate: task.createdDate
      };
      onSaveTask(newTask);
      taskDetailFormik.resetForm({});
      // onSaveTask()
   };
   const option = history.location.pathname.substr(url.toString().length, history.location.pathname.length - 1).replace(/[\/]+/g, '');
   const value = !option? 'home' : option;
   return (
      <div className={classes.root}>
         <AppBar position="static" color="default">
            <Tabs value={value} onChange={handleChange} aria-label="task tabs">
               <Tab value="home" label="Details" {...a11yProps('home')}/>
               <Tab value="subtasks" label="Subtasks" {...a11yProps('subtasks')} />
               <Tab value="triggers" label="Triggers" {...a11yProps('triggers')} />
               <Tab value="resources" label="Resources" {...a11yProps('resources')} />
            </Tabs>
         </AppBar>
         <TabPanel value={value} index="home">
            <TaskDetailComp
               taskDetailForm={taskDetailFormik}
               taskCategories={taskCategories}
            />
         </TabPanel>
         <TabPanel value={value} index="subtasks">
            <SubTask subtasks={task.subTasks}/>
         </TabPanel>
         <TabPanel value={value} index="triggers">
            <TaskTrigger triggers={task.taskTriggers || []}/>
         </TabPanel>
         <TabPanel value={value} index="resources">
            <TaskResource taskRecources={task.taskResources || []} />
         </TabPanel>
         <Divider/>
         <div>
            <Button color="secondary">Cancel</Button>
            <Button color="primary" onClick={handlerSaveTask}>
               Save
            </Button>
         </div>
      </div>
  );
};
