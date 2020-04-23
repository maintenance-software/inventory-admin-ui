import React, {FC, useState, useEffect} from 'react';
import Button from '@material-ui/core/Button';
import {
   ISubTask, ISubTaskKind
} from "../../../../../graphql/Maintenance.type";
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

interface ISubTaskDialogProps {
   open: boolean;
   setOpen(open: boolean): void;
   subTask: ISubTask;
   subTaskKinds: ISubTaskKind[];
   onSaveSubTask(taskKind: ISubTaskKind, description: string, mandatory: boolean): void;
}

export const SubTaskDialog: FC<ISubTaskDialogProps> = ({open, setOpen, subTask, subTaskKinds, onSaveSubTask}) => {
   const [mandatory, setMandatory] = useState(subTask.mandatory);
   const [description, setDescription] = useState(subTask.description);
   const [kind, setKind] = useState(subTask.subTaskKind.subTaskKindId);

   useEffect(() => {
      setDescription(subTask.description);
      setKind(subTask.subTaskKind.subTaskKindId);
      setMandatory(subTask.mandatory);
   }, [subTask]);

   const handleSave = () => {
      onSaveSubTask(subTaskKinds.find(k => k.subTaskKindId === kind) || {
         subTaskKindId: 0,
         name: '',
         description: '',
         modifiedDate: '',
         createdDate: ''
      }, description, mandatory);
   };
   return (
      <>
         <Dialog maxWidth="xs" onClose={()=>setOpen(false)} aria-labelledby="customized-dialog-title" open={open}>
            <DialogTitle>
               Add / Edit Subtask
            </DialogTitle>
            <DialogContent dividers>
               <Grid container  spacing={2}>
                  <Grid item xs={12}>
                     <TextField
                        style={{width: '100%'}}
                        id="subtask-kind"
                        select
                        label="Kind"
                        value={kind}
                        onChange={(event => setKind(+event.target.value))}
                     >
                        {subTaskKinds.map((option) => (
                           <MenuItem key={option.subTaskKindId} value={option.subTaskKindId}>
                              {option.name}
                           </MenuItem>
                        ))}
                     </TextField>
                  </Grid>
                  <Grid item xs={12}>
                     <TextField
                        style={{width: '100%'}}
                        id="standard-multiline-static"
                        label="Description"
                        multiline
                        rows={3}
                        value={description}
                        onChange={(event => setDescription(event.target.value))}
                     />
                  </Grid>
                  <Grid item xs={12}>
                     <FormControlLabel
                        control={<Checkbox checked={mandatory} onChange={(event => setMandatory(event.target.checked))} name="mandatory" />}
                        label="Mandatory"
                     />
                  </Grid>
               </Grid>
            </DialogContent>
            <DialogActions>
               <Button variant="contained" size="small" autoFocus onClick={() => setOpen(false)} color="secondary">
                  Cancel
               </Button>
               <Button variant="contained" size="small" autoFocus onClick={handleSave} color="default">
                  Add
               </Button>
            </DialogActions>
         </Dialog>
      </>
   );
};
