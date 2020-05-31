import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {useFormik} from 'formik';
import * as Yup from "yup";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {createStyles, Theme, Dialog, DialogContent, Stepper, StepLabel, Step, DialogTitle, DialogActions, FormLabel, MenuItem} from "@material-ui/core";
import TextField from "@material-ui/core/TextField/TextField";
import Grid from "@material-ui/core/Grid/Grid";
import Button from "@material-ui/core/Button/Button";
import Radio from '@material-ui/core/Radio';
import {ISimpleItem} from "../../Assets/Commons/AssetChooser/AssetChooser";
import {EquipmentChooserComp} from "./EquipmentChooserComp";
import {
   FETCH_TASKS_FOR_EQUIPMENT_QL,
   getTaskDefaultInstance,
   TaskQL,
   ITaskTriggerQL
} from "../../../graphql/Maintenance.ql";
import { useLazyQuery, useQuery } from '@apollo/react-hooks';
import {FETCH_CATEGORIES, CategoryQL} from "../../../graphql/Item.ql";
import {ITaskItems, TaskChooser} from "./TaskChooser";

const useDateStyles = makeStyles((theme: Theme) =>
   createStyles({
      container: {
         // display: 'flex',
         // flexWrap: 'wrap',
         width: '100%'
      },
      textField: {
         marginLeft: theme.spacing(1),
         marginRight: theme.spacing(1),
         width: 200,
      },
   }),
);

const useButtonStyles = makeStyles(theme => ({
   button: {
      margin: theme.spacing(1),
   },
}));

interface ITaskAvailableProps {
   open: boolean;
   setOpen(open: boolean): void;
   onAccept(equipmentId: number, taskId: number, triggerId: number, maintenanceId: number | null, hasAssetFailure: boolean, incidentDate: string) : void;
}

export const TaskAvailableDialog: React.FC<ITaskAvailableProps> =  ({open, setOpen, onAccept}) => {
   const steps = ['Equipments', 'Tasks', 'Details'];
   const buttonClasses = useButtonStyles();
   const dateStyle = useDateStyles();
   const [activeStep, setActiveStep] = useState(0);
   const [skipped, setSkipped] = React.useState(new Set<number>());
   const [equipmentId, setEquipmentId] = React.useState(0);
   const [taskId, setTaskId] = React.useState(0);
   const [incidentDate, setIncidentDate] = React.useState('');
   const [hasFailure, setHasFailure] = React.useState(true);
   const [taskItems, setTaskItems] = React.useState<ITaskItems[]>([]);
   const [fetchTasks, { called, loading, data }] = useLazyQuery<{maintenances: {equipmentTasks: TaskQL[]}}, any>(FETCH_TASKS_FOR_EQUIPMENT_QL);
   const eventTriggersData = useQuery<{categories: CategoryQL[]}, any>(FETCH_CATEGORIES, {variables: {scope: 'EVENT_CATEGORY'}});

   useEffect(() => {
      setActiveStep(0);
   }, [open]);

   useEffect(() => {
      if(called && !loading && data) {
         const taskItems: ITaskItems[] = data.maintenances.equipmentTasks
            .filter(t => t.taskTriggers.find(tr => tr.triggerType === 'EVENT'))
            .map(t => ({
               taskId: t.taskId,
               taskName: t.name,
               eventName: t.taskTriggers.filter(tr => tr.triggerType === 'EVENT').map(tr => tr.eventTriggerCategory? tr.eventTriggerCategory.name : '').join()
            }));
         setTaskItems(taskItems);
      }
   }, [called, loading, data]);

   const isStepSkipped = (step: number) => {
      return skipped.has(step);
   };

   const handleNext = async () => {
      if(activeStep === 0) {
         fetchTasks({variables: {equipmentId}})
      }

      if(activeStep + 1 === steps.length) {
         const selectedTask = data? data.maintenances.equipmentTasks.find(t => t.taskId === taskId) : null;
         if(selectedTask) {
            const trigger = selectedTask.taskTriggers.find(tr => tr.triggerType === 'EVENT');
            onAccept(equipmentId, taskId, trigger? trigger.taskTriggerId : 0, selectedTask.maintenanceId, hasFailure, incidentDate);
         }
      } else {
         setActiveStep(activeStep + 1);
      }
   };

   const handleBack = () => {
      setActiveStep(prevActiveStep => prevActiveStep - 1);
   };

   const TaskActivityDetails = (
      <>
            <Grid item xs={12}>
               <FormLabel component="legend">Is an Incident?</FormLabel>
            </Grid>
            <Grid item xs={6}>
               Yes
               <Radio
                  checked={hasFailure}
                  onChange={(event => setHasFailure(event.target.checked))}
                  name="radio-button-demo"
                  inputProps={{'aria-label': 'yes-failure'}}
               />
            </Grid>
            <Grid item xs={6}>
               No
               <Radio
                  checked={!hasFailure}
                  onChange={(event => setHasFailure(!event.target.checked))}
                  name="radio-button-demo"
                  inputProps={{'aria-label': 'no-failure'}}
               />
            </Grid>

            {
               hasFailure?
                  <Grid item xs={12}>
                     <TextField
                        id="incident-date"
                        label="Incident Date"
                        type="date"
                        className={dateStyle.textField}
                        value={incidentDate}
                        onChange={(event) => setIncidentDate(event.target.value)}
                        InputLabelProps={{
                           shrink: true,
                        }}
                     />
                  </Grid>
                  :
                  ''
            }
      </>
   );

   const TaskAvaialbleForEquipmentComp = (
      <>
         <TaskChooser tasks={taskItems}
                      selected={taskId}
                      onTaskSelected={(taskId: number)=> { setTaskId(taskId)}}/>
      </>
   );

   const stepComp = (index: number) => {
      switch (index) {
         case 0: return (<EquipmentChooserComp
               disableItems={[]}
               initialSelected={equipmentId? [equipmentId] : []}
               filters={[]}
               multiple={false}
               onSelectItems={(items: ISimpleItem[]) => {
                  if(!items || items.length === 0) return;
                  setEquipmentId(items[0].itemId);
               }}
         />);
         case 1: return TaskAvaialbleForEquipmentComp;
         case 2: return TaskActivityDetails;
      }
      return (<></>);
   };


  return (
     <>
        <Dialog onClose={()=>setOpen(false)} aria-labelledby="customized-dialog-title" open={open}>
           <DialogTitle>
              Add Equipment
           </DialogTitle>
           <DialogContent dividers style={{height: '30rem', width: '35rem'}}>
              <Stepper activeStep={activeStep} style={{padding: '.5rem'}}>
                 {steps.map((step, index) => {
                    const stepProps: { completed?: boolean } = {};
                    const labelProps: { optional?: React.ReactNode } = {};
                    if (isStepSkipped(index)) {
                       stepProps.completed = false;
                    }
                    return (
                       <Step key={index} {...stepProps}>
                          <StepLabel {...labelProps}>{step}</StepLabel>
                       </Step>
                    );
                 })}
              </Stepper>
              <Grid container spacing={2} style={{marginTop: '1rem'}}>
                 { stepComp(activeStep) }
              </Grid>
           </DialogContent>
           <DialogActions disableSpacing style={{justifyContent: 'center'}}>
              <Button variant="outlined"
                      color="secondary"
                      size="small"
                      className={buttonClasses.button}
                      onClick={()=> setOpen(false)}
              >
                 Cancel
              </Button>
              <Button variant="outlined"
                      color="primary"
                      size="small"
                      className={buttonClasses.button}
                      disabled={activeStep === 0}
                      onClick={handleBack}
              >
                 Back
              </Button>
              <Button variant="outlined"
                      color="primary"
                      size="small"
                      className={buttonClasses.button}
                      onClick={handleNext}
              >
                 {activeStep === steps.length - 1 ? 'Accept' : 'Next'}
              </Button>
           </DialogActions>
        </Dialog>
        </>
  );
};
