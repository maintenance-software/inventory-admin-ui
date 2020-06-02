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
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import {TaskActivityQL} from "../../../graphql/Maintenance.ql";
import {EntityStatusQL} from "../../../graphql/User.ql";
import Collapse from '@material-ui/core/Collapse';
import Box from '@material-ui/core/Box';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import {ITaskActivity} from "../TaskActivity/TaskActivityListContainer";
import moment from 'moment';
import {WorkOrderResourceDialog} from "./WorkOrderResourceDialog";

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
      height: '31rem',
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
   workOrderTasks: ITaskActivity[];
   onSetWorkOrderResource(taskId: number): void;
}

export const WorkOrderTasks: FC<IWorkOrderTaskProps> = ({workOrderTasks, onSetWorkOrderResource}) => {
   const history = useHistory();
   const classes = useStyles2();
   const buttonClasses = useButtonStyles();

   const CustomRow: FC<ITaskActivity> = (props) => {
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
                  {props.assetName}
                  ({props.assetCode})
               </TableCell>
            </TableRow>
            {open && props.activities.map((historyRow, index) => (
               <TableRow key={historyRow.taskActivityId}>
                  <TableCell padding="checkbox"
                             className={index + 1 == props.activities.length? '' : classes.noBorder}
                             style={{paddingRight: 0}}
                  >
                     <IconButton color="secondary" aria-label="Set Task Resources" onClick={() => onSetWorkOrderResource(historyRow.taskId)}>
                        <NoteAddIcon/>
                     </IconButton>
                  </TableCell>
                  <TableCell>{historyRow.taskName}</TableCell>
                  <TableCell>{historyRow.taskPriority}</TableCell>
                  <TableCell>{moment(historyRow.calculatedDate, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm')}</TableCell>
                  <TableCell>{historyRow.taskCategoryName}</TableCell>
               </TableRow>
            ))}
         </>
      );
   };

   return (
      <>
         <Paper className={classes.root}>
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
                     {workOrderTasks.map((row) => (
                        <CustomRow key={row.assetId} {...row} />
                     ))}
                  </TableBody>
               </Table>
            </TableContainer>
         </Paper>
      </>
   );
};
