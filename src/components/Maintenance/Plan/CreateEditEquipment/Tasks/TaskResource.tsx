import React, {FC, FormEvent, useState} from 'react';
import makeStyles from "@material-ui/core/styles/makeStyles";
import TableContainer from "@material-ui/core/TableContainer/TableContainer";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import {useHistory} from "react-router";
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import {
   getTaskResourceDefaultInstance,
   TaskResourceQL
} from "../../../../../graphql/Maintenance.ql";
import TableFooter from '@material-ui/core/TableFooter';
import { useQuery } from '@apollo/react-hooks';
import {FETCH_CATEGORIES, FETCH_UNITS, CategoryQL, UnitQL} from "../../../../../graphql/Item.ql";
import {buildFullName} from "../../../../../utils/globalUtil";
import {TaskResourceDialog} from "./TaskResourceDialog";

const useBottomNoneBorder = makeStyles({
   root: {
      borderBottom: "none"
   }
});

const useStyles2 = makeStyles({
   root: {
      width: '100%',
   },
   container: {
      // height: '31rem',
   },
   title: {
      flex: '1 1 100%',
   }
});

export const TaskResource: FC<{taskRecources: TaskResourceQL[]}> = ({taskRecources}) => {
   const history = useHistory();
   const classes = useStyles2();
   const bottomNoneBoder = useBottomNoneBorder();
   const [open, setOpen] = React.useState(false);
   const [resource, setResource] = useState<TaskResourceQL>(getTaskResourceDefaultInstance());
   // const employeeJobsData = useQuery<{maintenances: {employeeJobs: IEmployeeJob[]}}, any>(FETCH_EMPLOYEE_JOBS);
   const employeeJobsData = useQuery<{categories: CategoryQL[]}, any>(FETCH_CATEGORIES, {variables: {scope:'EMPLOYEE_JOB_CATEGORY'}});
   const unitsData = useQuery<{units: UnitQL[]}, any>(FETCH_UNITS);

   const handleAddEditResource = (trigger: TaskResourceQL) => {
      setOpen(true);
      setResource(trigger);
   };

   const handleSaveResource = (t: TaskResourceQL) => {
      t.order = taskRecources.length;
      if(t.taskResourceId === 0) {
         t.taskResourceId = -taskRecources.length;
         taskRecources.push(t);
      } else {
         const index = taskRecources.findIndex(k => k.taskResourceId === t.taskResourceId);
         taskRecources[index] = t;
      }
      setOpen(false);
   };

   const getDescription = (r: TaskResourceQL) => {
      switch (r.resourceType) {
         case 'INVENTORY': return r.inventoryResource? r.inventoryResource.name : '';
         case 'HUMAN': return r.employeeCategory? r.employeeCategory.name : '';
      }
      return '';
   };
   return (
      <>
         <TableContainer className={classes.container}>
            <Table size="small">
               <TableHead>
                  <TableRow>
                     <TableCell>Description</TableCell>
                     <TableCell>Unit</TableCell>
                     <TableCell>Amount</TableCell>
                     <TableCell>Type</TableCell>
                     <TableCell align="center">Options</TableCell>
                  </TableRow>
               </TableHead>
               <TableBody>
                  {taskRecources.sort((t1, t2) => t1.order - t2.order).map((row: TaskResourceQL, index) => (
                     <TableRow key={row.taskResourceId} hover>
                        <TableCell>{getDescription(row)}
                        </TableCell>
                        <TableCell>{row.unit.label}</TableCell>
                        <TableCell>{row.amount}</TableCell>
                        <TableCell>{row.resourceType}</TableCell>
                        <TableCell align="center">
                           <ButtonGroup variant="text" size="small" color="primary" aria-label="text primary button group">
                              <IconButton aria-label="edit equipment" onClick={() => handleAddEditResource(row)}>
                                 <EditIcon/>
                              </IconButton>
                           </ButtonGroup>
                        </TableCell>
                     </TableRow>
                  ))}
               </TableBody>
               <TableFooter>
                  <TableRow>
                     <TableCell  colSpan={4} className={bottomNoneBoder.root}>
                        <Button
                           variant="contained"
                           color="default"
                           size="small"
                           startIcon={<AddIcon/>}
                           onClick={() => handleAddEditResource(getTaskResourceDefaultInstance())}
                        >
                           Add
                        </Button>
                     </TableCell>
                  </TableRow>
               </TableFooter>
            </Table>
         </TableContainer>
         {/*<TriggerDialog
            setOpen={setOpen}
            open={open}
            trigger={resource}
            triggerEvents={eventTriggersData.data? eventTriggersData.data.maintenances.eventResources : []}
            units={unitsData.data? unitsData.data.units : []}
            onSaveEventTrigger={handleSaveResource}
         />*/}
         <TaskResourceDialog
            taskResource={resource}
            employeeCategories={employeeJobsData.data?employeeJobsData.data.categories : []}
            units={unitsData.data?unitsData.data.units : []}
            open={open}
            setOpen={setOpen}
            onAccept={handleSaveResource}
         />
      </>
   );
};
