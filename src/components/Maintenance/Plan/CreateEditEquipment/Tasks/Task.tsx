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
import IconButton from '@material-ui/core/IconButton';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import {TablePaginationActions} from "../../../../../utils/TableUtils";
import {ITask} from "../../../../../graphql/Maintenance.type";

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
      height: '31rem',
   },
   title: {
      flex: '1 1 100%',
   }
});

interface TaskProps {
   tasks: ITask[];
   // onChangePage?(event: React.MouseEvent<HTMLButtonElement> | null, newPage: number): void;
   // onChangeRowsPerPage?(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void;
   // onSearchMaintenancePlan?(searchString: string) : void;
   // onAddMaintenancePlan?(): void;
   // onEditMaintenancePlan?(maintenance: IMaintenancePlan): void;
}

export const Task: FC<TaskProps> = ({tasks}) => {
   const history = useHistory();
   const classes = useStyles2();
   const buttonClasses = useButtonStyles();

   return (
      <Paper className={classes.root}>
         <TableContainer className={classes.container}>
            <Table stickyHeader size="small">
               <TableHead>
                  <TableRow>
                     <TableCell>Name</TableCell>
                     <TableCell>Description</TableCell>
                     <TableCell>Status</TableCell>
                     <TableCell align="center">Options</TableCell>
                  </TableRow>
               </TableHead>
               <TableBody>
                  {tasks.map((row: ITask, index) => (
                     <TableRow key={row.taskId} hover>
                        <TableCell>{row.name}</TableCell>
                        <TableCell>{row.description}</TableCell>
                        <TableCell>{row.attribute1}</TableCell>
                        <TableCell align="center">
                           <ButtonGroup variant="text" size="small" color="primary" aria-label="text primary button group">
                              <IconButton aria-label="edit equipment" component="span">
                                 <EditIcon/>
                              </IconButton>
                           </ButtonGroup>
                        </TableCell>
                     </TableRow>
                  ))}
               </TableBody>
            </Table>
         </TableContainer>
      </Paper>
   );
};
