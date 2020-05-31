import React, {FC, FormEvent, useState} from 'react';
import makeStyles from "@material-ui/core/styles/makeStyles";
import TableContainer from "@material-ui/core/TableContainer/TableContainer";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import {useHistory} from "react-router";
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import {getTaskDefaultInstance, TaskQL} from "../../../../../graphql/Maintenance.ql";
import TableFooter from '@material-ui/core/TableFooter';
import {appendToPath} from "../../../../../utils/globalUtil";
import { useRouteMatch } from 'react-router-dom';

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
      height: '31rem',
   },
   title: {
      flex: '1 1 100%',
   }
});

interface TaskProps {
   maintenanceId: number;
   tasks: TaskQL[];
}

export const Task: FC<TaskProps> = ({maintenanceId, tasks}) => {
   const history = useHistory();
   const classes = useStyles2();
   const bottomNoneBoder = useBottomNoneBorder();
   const { path, url } = useRouteMatch();
   return (
      <>
         <Paper className={classes.root}>
            <TableContainer className={classes.container}>
               <Table size="small">
                  <TableHead>
                     <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Category</TableCell>
                        <TableCell>Priority</TableCell>
                        <TableCell align="center">Options</TableCell>
                     </TableRow>
                  </TableHead>
                  <TableBody>
                     {tasks.sort((t1, t2) => t1.taskId - t2.taskId).map((row: TaskQL, index) => (
                        <TableRow key={row.taskId} hover>
                           <TableCell>{row.name}</TableCell>
                           <TableCell>{row.taskCategory? row.taskCategory.name : ''}</TableCell>
                           <TableCell>{row.priority}</TableCell>
                           <TableCell align="center">
                              <ButtonGroup variant="text" size="small" color="primary" aria-label="text primary button group">
                                 <IconButton aria-label="edit equipment" onClick={()=> history.push(appendToPath(url, row.taskId.toString()))}>
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
                              onClick={() => history.push(appendToPath(url, '0'))}
                           >
                              Add
                           </Button>
                        </TableCell>
                     </TableRow>
                  </TableFooter>
               </Table>
            </TableContainer>
         </Paper>
      </>
   );
};
