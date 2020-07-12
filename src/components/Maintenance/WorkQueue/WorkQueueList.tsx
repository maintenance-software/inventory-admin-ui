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
import {useHistory} from "react-router";
import Button from '@material-ui/core/Button';
import WorkIcon from '@material-ui/icons/Work';
import AssignmentIcon from '@material-ui/icons/Assignment';
import {SearchInput} from '../../SearchInput/SearchInput';
import {TablePaginationActions} from '../../../utils/TableUtils';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import IconButton from '@material-ui/core/IconButton';
import Checkbox from '@material-ui/core/Checkbox';
import {IWorkQueueEquipment} from "../WorkOrder/WorkOrderTypes";

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

interface IWorkQueueProps {
   workQueues: IWorkQueueEquipment[];
   pageIndex: number;
   pageSize: number;
   totalCount: number;
   searchString?: string;
   taskActivitiesSelected: number[];
   onChangePage?(event: React.MouseEvent<HTMLButtonElement> | null, newPage: number): void;
   onChangeRowsPerPage?(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void;
   onSearchTaskActivity?(searchString: string) : void;
   onCreateActivityByEvent?() : void;
   onCreateWorkOrder() : void;
   onSelectTaskActivity(taskActivityId: number, assetId: number, taskId: number, checked: boolean): void;
}

export const WorkQueueList: FC<IWorkQueueProps> = ({workQueues, pageIndex, pageSize, totalCount, searchString, taskActivitiesSelected, onChangePage, onChangeRowsPerPage, onSearchTaskActivity, onCreateActivityByEvent, onCreateWorkOrder, onSelectTaskActivity}) => {
   const history = useHistory();
   const classes = useStyles2();
   const buttonClasses = useButtonStyles();
   const [searchInput, setSearchInput] = React.useState<string>(searchString || '');
   const onSearch = (event: FormEvent) => {
      event.preventDefault();
      onSearchTaskActivity && onSearchTaskActivity(searchInput);
   };

   const CustomRow: FC<IWorkQueueEquipment> = (props) => {
      const [open, setOpen] = React.useState(true);
      const classes = useRowStyles();
      return (
         <>
            <TableRow>
               <TableCell className={!open? '' : classes.noBottomBorder} colSpan={7} style={{fontWeight: 'bold', fontSize: '1.1rem'}}>
                  <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                     {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                  </IconButton>
                  {props.name}
                  ({props.code})
               </TableCell>
            </TableRow>
            {open && props.workQueueTasks.map((historyRow, index) => (
               <TableRow key={historyRow.workQueueTaskId}>
                  <TableCell padding="checkbox" className={index + 1 == props.workQueueTasks.length? '' : classes.noBorder}>
                     <Checkbox
                        color='primary'
                        onChange={(event) => onSelectTaskActivity(historyRow.workQueueTaskId, props.equipmentId, historyRow.taskId, event.target.checked)}
                        checked={taskActivitiesSelected.indexOf(historyRow.workQueueTaskId) !== -1}
                        inputProps={{ 'aria-labelledby': index.toString() }}
                     />
                  </TableCell>
                  <TableCell>{historyRow.taskName}</TableCell>
                  <TableCell>{historyRow.taskPriority}</TableCell>
                  <TableCell>{historyRow.triggerDescription}</TableCell>
                  <TableCell>{historyRow.rescheduledDate}</TableCell>
                  <TableCell>{historyRow.scheduledDate}</TableCell>
                  <TableCell>{historyRow.status}</TableCell>
               </TableRow>
            ))}
         </>
      );
   };

   const  CollapsibleTable: FC<{taskActivities: IWorkQueueEquipment[]}> = ({taskActivities}) => {
      const classes = useStyles2();
      return (
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
                  {taskActivities.map((row) => (
                     <CustomRow key={row.equipmentId} {...row} />
                  ))}
               </TableBody>
            </Table>
         </TableContainer>
      );
   };

   return (
      <Paper className={classes.root}>
         <Grid container direction="row" justify="flex-start" wrap='nowrap'>
            <Grid container wrap='nowrap'>
               <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  startIcon={<AssignmentIcon/>}
                  className={buttonClasses.button}
                  disabled={taskActivitiesSelected.length === 0}
                  onClick={()=> onCreateWorkOrder() }
               >
                  Create OT
               </Button>
               <Button
                  variant="contained"
                  color="default"
                  size="small"
                  startIcon={<WorkIcon/>}
                  onClick={()=> onCreateActivityByEvent && onCreateActivityByEvent() }
                  className={buttonClasses.button}
               >
                  Tarea no planificada
               </Button>

               <Button
                  variant="contained"
                  color="default"
                  size='small'
                  startIcon={<ListIcon/>}
                  className={buttonClasses.button}
               >
                  Options
               </Button>
            </Grid>
            <Grid container alignItems='center' justify='flex-end' style={{paddingRight:'.5rem'}}>
               <form  noValidate autoComplete="off" onSubmit={onSearch}>
                  <SearchInput placeholder="Search" value={searchInput} onChange={(event: React.ChangeEvent<{value: string}>) => setSearchInput(event.target.value)}/>
               </form>
            </Grid>
         </Grid>

         <CollapsibleTable taskActivities={workQueues}/>

         <TablePagination
            component="div"
            rowsPerPageOptions={[5, 10, 25, 50, 100]}
            count={totalCount}
            rowsPerPage={pageSize}
            page={pageIndex}
            SelectProps={{
               inputProps: { 'aria-label': 'rows per page' },
               native: true,
            }}
            onChangePage={onChangePage || (() =>{})}
            onChangeRowsPerPage={onChangeRowsPerPage}
            ActionsComponent={TablePaginationActions}
         />
      </Paper>
   );
};
