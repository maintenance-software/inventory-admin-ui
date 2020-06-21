import React, {FC, FormEvent} from 'react';
import makeStyles from "@material-ui/core/styles/makeStyles";
import TableContainer from "@material-ui/core/TableContainer/TableContainer";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import VisibilityIcon from '@material-ui/icons/Visibility';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import Grid from "@material-ui/core/Grid/Grid";

import ListIcon from '@material-ui/icons/List';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import {useHistory} from "react-router";
import {useRouteMatch} from "react-router-dom";
import Button from '@material-ui/core/Button';
import WorkIcon from '@material-ui/icons/Work';
import AssignmentIcon from '@material-ui/icons/Assignment';
import {SearchInput} from '../../SearchInput/SearchInput';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import IconButton from '@material-ui/core/IconButton';
import moment from 'moment';
import {IWorkOrderEquipment} from "./WorkOrderTypes";
import Link from '@material-ui/core/Link';

const useButtonStyles = makeStyles(theme => ({
   button: {
      margin: theme.spacing(0.25),
      // paddingLeft: '.25rem',
      // paddingRight: '.25rem',
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

const useRowStyles = makeStyles({
   root: {
      '& > *': {
         borderBottom: 'unset',
      },
   },
   noBorder: {
      border: 'none'
   },
   noBottomBorder: {
      borderBottom: 'none'
   }
});

interface IWorkOrderTaskProps {
   workOrderEquipments: IWorkOrderEquipment[];
   onSetWorkOrderResource(workQueueTaskId: number, equipmentId: number, taskId: number): void;
}

export const WorkOrderTasks: FC<IWorkOrderTaskProps> = ({workOrderEquipments, onSetWorkOrderResource}) => {
   const history = useHistory();
   const classes = useStyles2();
   const buttonClasses = useButtonStyles();

   const CustomRow: FC<IWorkOrderEquipment> = (props) => {
      const [open, setOpen] = React.useState(true);
      const classes = useRowStyles();
      return (
         <>
            <TableRow>
               <TableCell className={!open? '' : classes.noBottomBorder} style={{paddingLeft: 0, paddingRight: 0}}>
                  <div style={{display: 'flex'}}>
                     <IconButton size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                     </IconButton>
                  </div>
               </TableCell>
               <TableCell colSpan={5} style={{fontWeight: 'bold'}}>
                  <Button component={Link} href={`#/assets/equipments/${props.equipmentId}`}>
                     {props.name} ({props.code})
                  </Button>
               </TableCell>
            </TableRow>
            {open && props.workOrderTasks.map((workQueueTask, index) => (
               <TableRow key={workQueueTask.workOrderTaskId}>
                  <TableCell padding="checkbox"
                             className={index + 1 == props.workOrderTasks.length? '' : classes.noBorder}
                             style={{paddingRight: 0}}
                  >
                     {
                        workQueueTask.valid ? <IconButton size="small" onClick={() => onSetWorkOrderResource(workQueueTask.workOrderTaskId, props.equipmentId, workQueueTask.taskId)}><VisibilityIcon/></IconButton> :
                           <IconButton color="secondary" aria-label="Set Task Resources" onClick={() => onSetWorkOrderResource(workQueueTask.workOrderTaskId, props.equipmentId, workQueueTask.taskId)}>
                              <NoteAddIcon/>
                           </IconButton>
                     }
                  </TableCell>
                  <TableCell>{workQueueTask.taskName}</TableCell>
                  <TableCell>{workQueueTask.taskPriority}</TableCell>
                  <TableCell>{moment(workQueueTask.scheduledDate, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm')}</TableCell>
                  <TableCell>{workQueueTask.taskCategoryName}</TableCell>
               </TableRow>
            ))}
         </>
      );
   };

   return (
      <>
            <TableContainer className={classes.container}>
               <Table stickyHeader aria-label="collapsible table" size="small">
                  <TableHead>
                     <TableRow>
                        <TableCell colSpan={2}>Assets / Task</TableCell>
                        <TableCell>Priority</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Task Type</TableCell>
                     </TableRow>
                  </TableHead>
                  <TableBody>
                     {workOrderEquipments.map((row) => (
                        <CustomRow key={row.equipmentId} {...row} />
                     ))}
                  </TableBody>
               </Table>
            </TableContainer>
      </>
   );
};
