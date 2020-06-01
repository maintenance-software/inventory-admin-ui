import React, {FC, FormEvent} from 'react';
import makeStyles from "@material-ui/core/styles/makeStyles";
import TableContainer from "@material-ui/core/TableContainer/TableContainer";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TablePagination from "@material-ui/core/TablePagination/TablePagination";
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
import VisibilityIcon from '@material-ui/icons/Visibility';
import {TaskActivityQL} from "../../../graphql/Maintenance.ql";
import {EntityStatusQL} from "../../../graphql/User.ql";
import Collapse from '@material-ui/core/Collapse';
import Box from '@material-ui/core/Box';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import {ITaskActivity} from "../TaskActivity/TaskActivityListContainer";

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
}

export const WorkOrderTasks: FC<IWorkOrderTaskProps> = ({workOrderTasks}) => {
   const history = useHistory();
   const classes = useStyles2();
   const buttonClasses = useButtonStyles();

   const CustomRow: FC<ITaskActivity> = (props) => {
      const [open, setOpen] = React.useState(true);
      const classes = useRowStyles();
      return (
         <>
            <TableRow>
               <TableCell className={!open? '' : classes.noBottomBorder} colSpan={7} style={{fontWeight: 'bold', fontSize: '1.1rem'}}>
                  <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                     {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                  </IconButton>
                  {props.assetName}
                  ({props.assetCode})
               </TableCell>
            </TableRow>
            {open && props.activities.map((historyRow, index) => (
               <TableRow key={historyRow.taskActivityId}>
                  <TableCell padding="checkbox" className={index + 1 == props.activities.length? '' : classes.noBorder}>
                     <Checkbox
                        color='primary'
                        inputProps={{ 'aria-labelledby': index.toString() }}
                     />
                  </TableCell>
                  <TableCell>{historyRow.taskName}</TableCell>
                  <TableCell>{historyRow.taskPriority}</TableCell>
                  <TableCell>{historyRow.triggerDescription}</TableCell>
                  <TableCell>{historyRow.scheduledDate}</TableCell>
                  <TableCell>{historyRow.calculatedDate}</TableCell>
                  <TableCell>{historyRow.status}</TableCell>
               </TableRow>
            ))}
         </>
      );
   };
   //const classes = useStyles2();
   return (
      <Paper className={classes.root}>
         <TableContainer className={classes.container}>
            <Table stickyHeader aria-label="collapsible table" size="small">
               <TableHead>
                  <TableRow>
                     <TableCell/>
                     <TableCell>Task</TableCell>
                     <TableCell>Priority</TableCell>
                     <TableCell>Trigger</TableCell>
                     <TableCell>Scheduled</TableCell>
                     <TableCell>Calc Date</TableCell>
                     <TableCell>Status</TableCell>
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
   );
};
