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
import {TablePaginationActions} from '../../../utils/TableUtils';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import IconButton from '@material-ui/core/IconButton';
import {IWorkQueueEquipment} from "../WorkQueue/WorkQueueListContainer";
import moment from 'moment';

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
   workQueueEquipments: IWorkQueueEquipment[];
   onSetWorkOrderResource(workQueueTaskId: number, equipmentId: number, taskId: number): void;
}

export const WorkOrderTasks: FC<IWorkOrderTaskProps> = ({workQueueEquipments, onSetWorkOrderResource}) => {
   const history = useHistory();
   const classes = useStyles2();
   const buttonClasses = useButtonStyles();

   const CustomRow: FC<IWorkQueueEquipment> = (props) => {
      const [open, setOpen] = React.useState(true);
      const classes = useRowStyles();
      return (
         <>
            <TableRow>
               <TableCell className={!open? '' : classes.noBottomBorder} style={{paddingLeft: 0, paddingRight: 0}}>
                  <div style={{display: 'flex'}}>
                     <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                     </IconButton>
                     <IconButton aria-label="expand row" size="small"><VisibilityIcon/></IconButton>
                  </div>
               </TableCell>
               <TableCell colSpan={5} style={{fontWeight: 'bold', fontSize: '1.1rem'}}>
                  {props.name}
                  ({props.code})
               </TableCell>
            </TableRow>
            {open && props.workQueueTasks.map((historyRow, index) => (
               <TableRow key={historyRow.workQueueTaskId}>
                  <TableCell padding="checkbox"
                             className={index + 1 == props.workQueueTasks.length? '' : classes.noBorder}
                             style={{paddingRight: 0}}
                  >
                     <IconButton color="secondary" aria-label="Set Task Resources" onClick={() => onSetWorkOrderResource(historyRow.workQueueTaskId, props.equipmentId, historyRow.taskId)}>
                        <NoteAddIcon/>
                     </IconButton>
                  </TableCell>
                  <TableCell>{historyRow.taskName}</TableCell>
                  <TableCell>{historyRow.taskPriority}</TableCell>
                  <TableCell>{moment(historyRow.scheduledDate, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm')}</TableCell>
                  <TableCell>{historyRow.taskCategoryName}</TableCell>
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
                     {workQueueEquipments.map((row) => (
                        <CustomRow key={row.equipmentId} {...row} />
                     ))}
                  </TableBody>
               </Table>
            </TableContainer>
      </>
   );
};
