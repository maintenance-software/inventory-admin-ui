import React, {FC, FormEvent, useState, useEffect} from 'react';
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
import { getSubTaskDefaultInstance, ISubTask } from "../../../../../graphql/Maintenance.type";
import TableFooter from '@material-ui/core/TableFooter';
import Modal from '@material-ui/core/Modal';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import { useQuery } from '@apollo/react-hooks';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import {SubTaskDialog} from "./SubTaskDialog";
import {FETCH_CATEGORIES, ICategory} from "../../../../../graphql/item.type";

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

export const SubTask: FC<{subtasks: ISubTask[]}> = ({subtasks}) => {
   const history = useHistory();
   const classes = useStyles2();
   const bottomNoneBoder = useBottomNoneBorder();
   const [open, setOpen] = React.useState(false);
   const [subTask, setSubTask] = useState<ISubTask>(getSubTaskDefaultInstance());
   const subtaskKindsData = useQuery<{categories: ICategory[]}, any>(FETCH_CATEGORIES, {variables: {scope: 'SUBTASK_CATEGORY'}});

   // useEffect(() => {
   // }, [subTask]);

   const handleAddEditSubTask = (subTask: ISubTask) => {
      setOpen(true);
      setSubTask(subTask);
   };

   const handleSaveSubTask = (kind: ICategory, description: string, mandatory: boolean) => {
      if(subTask.subTaskId === 0) {
         subTask.order = subtasks.length + 1;
         subTask.description = description;
         subTask.mandatory = mandatory;
         subTask.subTaskCategory = Object.assign({}, kind);
         subTask.subTaskId = -1 * subTask.order;
         subtasks.push(subTask);
      } else {
         subtasks.forEach(s => {
            if(s.subTaskId === subTask.subTaskId) {
               s.description = description;
               s.mandatory = mandatory;
               s.subTaskCategory = Object.assign({}, kind);
            }
         });
      }
      setOpen(false);
   };

   return (
      <>
         <TableContainer className={classes.container}>
            <Table size="small">
               <TableHead>
                  <TableRow>
                     <TableCell>Order</TableCell>
                     <TableCell>Description</TableCell>
                     <TableCell>Type</TableCell>
                     <TableCell align="center">Options</TableCell>
                  </TableRow>
               </TableHead>
               <TableBody>
                  {subtasks.sort((t1, t2) => t1.order - t2.order).map((row: ISubTask, index) => (
                     <TableRow key={index} hover>
                        <TableCell>{row.order}</TableCell>
                        <TableCell>{row.description}</TableCell>
                        <TableCell>{row.subTaskCategory.name}</TableCell>
                        <TableCell align="center">
                           <ButtonGroup variant="text" size="small" color="primary" aria-label="text primary button group">
                              <IconButton
                                 aria-label="edit equipment"
                                 onClick={()=> handleAddEditSubTask(row)}>
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
                           onClick={() => handleAddEditSubTask(getSubTaskDefaultInstance())}
                        >
                           Add
                        </Button>
                     </TableCell>
                  </TableRow>
               </TableFooter>
            </Table>
         </TableContainer>

         <SubTaskDialog
            setOpen={setOpen}
            open={open}
            subTaskCategories={subtaskKindsData.data?subtaskKindsData.data.categories:[]}
            subTask={subTask}
            onSaveSubTask={handleSaveSubTask}
         />
      </>
   );
};
