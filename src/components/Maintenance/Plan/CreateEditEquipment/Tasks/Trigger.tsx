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
   getTaskTriggerDefaultInstance,
   ITaskTrigger
} from "../../../../../graphql/Maintenance.type";
import TableFooter from '@material-ui/core/TableFooter';
import { useQuery } from '@apollo/react-hooks';
import {TriggerDialog} from "./TriggerDialog";
import {FETCH_CATEGORIES, FETCH_UNITS, ICategory, IUnit} from "../../../../../graphql/item.type";

const useBottomNoneBorder = makeStyles({
   root: {
      borderBottom: "none"
   }
});

const useButtonStyles = makeStyles(theme => ({
   button: {
      margin: theme.spacing(1),
   }
}));

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

export const TaskTrigger: FC<{triggers: ITaskTrigger[]}> = ({triggers}) => {
   const history = useHistory();
   const classes = useStyles2();
   const bottomNoneBoder = useBottomNoneBorder();
   const [open, setOpen] = React.useState(false);
   const [trigger, setTrigger] = useState<ITaskTrigger>(getTaskTriggerDefaultInstance());
   const eventTriggersData = useQuery<{categories: ICategory[]}, any>(FETCH_CATEGORIES, {variables: {scope: 'EVENT_CATEGORY'}});
   const unitsData = useQuery<{units: IUnit[]}, any>(FETCH_UNITS);

   const handleAddEditTrigger = (trigger: ITaskTrigger) => {
      setOpen(true);
      setTrigger(trigger);
   };

   const handleSaveTrigger = (t: ITaskTrigger) => {

      if(t.taskTriggerId === 0) {
         triggers.push(t);
      } else {
         const index = triggers.findIndex(k => k.taskTriggerId === t.taskTriggerId);
         triggers[index] = t;
      }
      setOpen(false);
   };
   return (
      <>
         <TableContainer className={classes.container}>
            <Table size="small">
               <TableHead>
                  <TableRow>
                     <TableCell>Generated by</TableCell>
                     <TableCell>Description</TableCell>
                     <TableCell>Fix Schedule</TableCell>
                     <TableCell align="center">Options</TableCell>
                  </TableRow>
               </TableHead>
               <TableBody>
                  {triggers.sort((t1, t2) => t1.taskTriggerId - t2.taskTriggerId).map((row: ITaskTrigger, index) => (
                     <TableRow key={index} hover>
                        <TableCell>{row.triggerType}</TableCell>
                        <TableCell>{row.triggerType === 'EVENT' && row.eventTriggerCategory?row.eventTriggerCategory.name : row.description }</TableCell>
                        <TableCell>{row.fixedSchedule}</TableCell>
                        <TableCell align="center">
                           <ButtonGroup variant="text" size="small" color="primary" aria-label="text primary button group">
                              <IconButton aria-label="edit equipment" onClick={() => handleAddEditTrigger(row)}>
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
                           disabled={triggers.length === 3}
                           startIcon={<AddIcon/>}
                           onClick={() => handleAddEditTrigger(getTaskTriggerDefaultInstance())}
                        >
                           Add
                        </Button>
                     </TableCell>
                  </TableRow>
               </TableFooter>
            </Table>
         </TableContainer>
         <TriggerDialog
            setOpen={setOpen}
            open={open}
            triggerTypes={triggers.map(t => t.triggerType)}
            trigger={trigger}
            triggerEvents={eventTriggersData.data? eventTriggersData.data.categories : []}
            units={unitsData.data? unitsData.data.units : []}
            onSaveTrigger={handleSaveTrigger}
         />
      </>
   );
};
