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
import {ITaskActivity} from "../../../graphql/Maintenance.type";
import {EntityStatus} from "../../../graphql/users.type";
import Collapse from '@material-ui/core/Collapse';
import Box from '@material-ui/core/Box';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';

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

export interface TaskActivity {
   assetId: number;
   assetName: string;
   assetCode: string;
   taskCount: number;
   maintenanceCount: number;
   activities: Activity[];
}

export interface Activity {
   scheduledDate: string;
   calculatedDate: string;
   status: EntityStatus;
   taskName: string;
   taskPriority: number;
   triggerDescription: string;
   taskId: number;
   taskTriggerId: number;
}


interface TaskActivityProps {
   taskActivities: TaskActivity[];
   pageIndex: number;
   pageSize: number;
   totalCount: number;
   searchString?: string;
   onChangePage?(event: React.MouseEvent<HTMLButtonElement> | null, newPage: number): void;
   onChangeRowsPerPage?(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void;
   onSearchTaskActivity?(searchString: string) : void;
}

const CustomRow: FC<TaskActivity> = (props) => {
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
            </TableCell>
         </TableRow>
         {open && props.activities.map((historyRow, index) => (
            <TableRow key={historyRow.taskId}>
               <TableCell padding="checkbox" className={index + 1 == props.activities.length? '' : classes.noBorder}>
                  <Checkbox
                     color='primary'
                     checked={true}
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

export const  CollapsibleTable: FC<{taskActivities: TaskActivity[]}> = ({taskActivities}) => {
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
                  <CustomRow key={row.assetId} {...row} />
               ))}
            </TableBody>
         </Table>
      </TableContainer>
   );
};

export const TaskActivityList: FC<TaskActivityProps> = ({taskActivities, pageIndex, pageSize, totalCount, searchString, onChangePage, onChangeRowsPerPage, onSearchTaskActivity}) => {
   const history = useHistory();
   const classes = useStyles2();
   const buttonClasses = useButtonStyles();
   const [searchInput, setSearchInput] = React.useState<string>(searchString || '');
   const onSearch = (event: FormEvent) => {
      event.preventDefault();
      onSearchTaskActivity && onSearchTaskActivity(searchInput);
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
               >
                  Create OT
               </Button>
               <Button
                  variant="contained"
                  color="default"
                  size="small"
                  startIcon={<WorkIcon/>}
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

         <CollapsibleTable taskActivities={taskActivities}/>

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
