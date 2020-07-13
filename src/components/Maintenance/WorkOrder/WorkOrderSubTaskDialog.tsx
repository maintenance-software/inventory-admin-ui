import React, { useState, useEffect, FC } from 'react';
import { useTranslation } from 'react-i18next';
import {useFormik} from 'formik';
import * as Yup from "yup";
import CloseIcon from '@material-ui/icons/Close';
import { MuiPickersUtilsProvider, DateTimePicker } from '@material-ui/pickers';
import moment, { Moment } from "moment";
import MomentUtils from "@date-io/moment";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {createStyles, Theme, Dialog, DialogContent, Stepper, StepLabel, Step, DialogTitle, DialogActions, FormLabel, MenuItem, FormControl, RadioGroup, FormControlLabel, IconButton} from "@material-ui/core";
import TextField from "@material-ui/core/TextField/TextField";
import Grid from "@material-ui/core/Grid/Grid";
import Button from "@material-ui/core/Button/Button";
import {useHistory} from "react-router";
import {IWorkOrderSubTask, IWorkOrderTask} from "./WorkOrderTypes";
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import Radio from '@material-ui/core/Radio';

const useStyles = makeStyles((theme: Theme) =>
   createStyles({
      root: {
      },
      dialogTittle: {
         display: 'flex',
         justifyContent: 'space-between',
         alignItems: 'center',
         paddingRight: '.25rem',
         paddingTop: '.25rem',
         paddingBottom: '.25rem'
      }
   }),
);

const useButtonStyles = makeStyles(theme => ({
   button: {
      margin: theme.spacing(1),
   },
}));

export interface IWOSubTaskDialogProps {
   task: IWorkOrderTask;
   open: boolean;
   setOpen(open: boolean): void;
   onSaveWorkOrderTask(workOrderTask: IWorkOrderTask, finalize: boolean) : void;
}

export const WorkOrderSubTaskDialog: React.FC<IWOSubTaskDialogProps> = ({task, open, setOpen, onSaveWorkOrderTask}) => {
   const styles = useStyles();
   const steps = ['Task Details', 'Sub Tasks'];
   const history = useHistory();
   const buttonClasses = useButtonStyles();
   const [activeStep, setActiveStep] = useState(0);
   const [skipped, setSkipped] = React.useState(new Set<number>());
   const [locale, setLocale] = useState("fr");
   const [subTasks, setSubTasks] = React.useState<IWorkOrderSubTask[]>([]);
   const [taskName, setTaskName] = useState('');
   const [notes, setNotes] = useState('');
   const [startTaskDate, setStartTaskDate] = useState(moment());
   const [endTaskDate, setEndTaskDate] = useState(moment());
   const [durationDD, setDurationDD] = useState(0);
   const [durationHH, setDurationHH] = useState(0);
   const [durationMM, setDurationMM] = useState(0);

   useEffect(() => {
      setNotes(task.notes || '');
      setTaskName(task.taskName);
      if(!task.startDate && !task.endDate) {
         const startDate = moment();
         const endDate = startDate.clone().add(task.taskDuration, 'minutes');
         setStartTaskDate(startDate);
         setEndTaskDate(endDate);
         setDuration(task.taskDuration);
      } else {
         const startDate = moment(task.startDate, 'YYYY-MM-DD HH:mm:ss.SSSSSS UTC');
         const endDate = moment(task.endDate, 'YYYY-MM-DD HH:mm:ss.SSSSSS UTC');
         setStartTaskDate(startDate);
         setEndTaskDate(endDate);
         setWorkOrderTaskDuration(startDate, endDate);
      }
      setSubTasks(task.subTasks);
      setActiveStep(0);
   }, [task]);

   const setDuration = (duration: number) => {
      const durationDD_ = Math.floor(duration / 1440);
      const durationHH_ = Math.floor((duration % 1440) / 60);
      const durationMM_ = Math.round(duration % 60);
      setDurationDD(durationDD_);
      setDurationHH(durationHH_);
      setDurationMM(durationMM_);
   };

   const setWorkOrderTaskDuration = (startDate_: Moment, endDate_: Moment) => {
      if(startDate_.isBefore(endDate_)) {
         const duration = endDate_.diff(startDate_, 'minutes');
         const durationDD_ = Math.floor(duration / 1440);
         const durationHH_ = Math.floor((duration % 1440) / 60);
         const durationMM_ = Math.round(duration % 60);
         setDurationDD(durationDD_);
         setDurationHH(durationHH_);
         setDurationMM(durationMM_);
      } else {
         setDurationDD(0);
         setDurationHH(0);
         setDurationMM(0);
      }
   };

   const isStepSkipped = (step: number) => {
      return skipped.has(step);
   };

   const handleNext = () => {
      if(activeStep + 1 === 2) {
         onSaveWorkOrderTask({...task
               , notes
               , startDate: startTaskDate.format('YYYY-MM-DD HH:mm:ss.SSSSSS UTC')
               , endDate: endTaskDate.format('YYYY-MM-DD HH:mm:ss.SSSSSS UTC')
               , subTasks
            }
            , false
         );
      } else {
         setActiveStep(activeStep + 1);
      }
   };

   const handleBack = () => {
      setActiveStep(prevActiveStep => prevActiveStep - 1);
   };

   const handleFinishTask = () => {
         onSaveWorkOrderTask({...task
               , notes
               , startDate: startTaskDate.format('YYYY-MM-DD HH:mm:ss.SSSSSS UTC')
               , endDate: endTaskDate.format('YYYY-MM-DD HH:mm:ss.SSSSSS UTC')
               , subTasks
            }
            , true
         );
   };

   const onChangeStartDate = (date: any) => {
      const startDate_ = date as Moment;
      setWorkOrderTaskDuration(startDate_, endTaskDate);
      setStartTaskDate(date);
   };

   const onChangeEndDate = (date: any) => {
      const endDate_ = date as Moment;
      setWorkOrderTaskDuration(startTaskDate, endDate_);
      setEndTaskDate(date);
   };

   const VerificationComp: FC<{index: number}> = (props) => {
      const [alignment, setAlignment] = React.useState('');
      const [refresh, setRefresh] = useState(0);
      const handleChange = (event: React.MouseEvent<HTMLElement>, newAlignment: string) => {
         setAlignment(newAlignment);
      };
      return <>
         <Grid container  spacing={2}>
            <Grid item xs={12} style={{paddingBottom: 0, fontWeight: 'bold'}}>{(1 + props.index) + '. ' + subTasks[props.index].subTaskDescription}</Grid>
            <Grid item xs={12} style={{paddingTop: 0}}>
               <ToggleButtonGroup size="small" value={alignment} exclusive onChange={handleChange}>
                  <ToggleButton
                     value="GOOD"
                     selected={subTasks[props.index].value === 'GOOD'}
                     onClick={() => {subTasks[props.index].value = 'GOOD'; setRefresh(Math.random)}}
                     style={{width: '5rem'}}>Good</ToggleButton>
                  <ToggleButton
                     value="REGULAR"
                     selected={subTasks[props.index].value === 'REGULAR'}
                     onClick={() => {subTasks[props.index].value = 'REGULAR'; setRefresh(Math.random)}}
                     style={{width: '5rem'}}>Regular</ToggleButton>
                  <ToggleButton
                     value="POOR"
                     selected={subTasks[props.index].value === 'POOR'}
                     onClick={() => {subTasks[props.index].value = 'POOR'; setRefresh(Math.random)}}
                     style={{width: '5rem'}}>Poor</ToggleButton>
               </ToggleButtonGroup>
            </Grid>
         </Grid>
      </>;
   };

   const YesNoComp: FC<{index: number}> = (props) => {
      const [refresh, setRefresh] = useState(0);
      return <>
         <Grid container  spacing={2}>
            <Grid item xs={12} style={{paddingBottom: 0, fontWeight: 'bold'}}>{(1 + props.index) + '. ' + subTasks[props.index].subTaskDescription}</Grid>
            <Grid item xs={12} style={{paddingTop: 0}}>
               <FormControl component="fieldset">
                  <RadioGroup row aria-label="position" name="position" defaultValue="top">
                     <FormControlLabel
                        control={<Radio
                           color="primary"
                           checked={subTasks[props.index].value === 'YES'}
                           onChange={event => {subTasks[props.index].value = event.target.checked ? 'YES' : 'NO'; setRefresh(Math.random)}}
                        />}
                        label="Yes"
                        labelPlacement="start"
                     />
                     <FormControlLabel
                        control={<Radio
                           color="primary"
                           checked={subTasks[props.index].value === 'NO'}
                           onChange={event => {subTasks[props.index].value = event.target.checked ? 'NO' : 'YES'; setRefresh(Math.random)}}
                        />}
                        label="No"
                        labelPlacement="start"
                     />
                  </RadioGroup>
               </FormControl>
            </Grid>
         </Grid>
      </>;
   };

   const InputComp: FC<{index: number}> = (props) => {
      const [refresh, setRefresh] = useState(0);
      return <>
         <Grid container  spacing={2}>
            <Grid item xs={12} style={{paddingBottom: 0, fontWeight: 'bold'}}>{(1 + props.index) + '. ' + subTasks[props.index].subTaskDescription}</Grid>
            <Grid item xs={12} style={{paddingTop: 0}}>
               { subTasks[props.index].subTaskCategoryKey === 'NUMBER'?
                  <TextField
                     id={"input-" + subTasks[props.index].workOrderSubTaskId}
                     InputProps={{ readOnly: false}}
                     style={{width: '100%'}}
                     value={subTasks[props.index].value}
                     onChange={event => {subTasks[props.index].value = event.target.value; setRefresh(Math.random)}}
                  />:
                  <TextField
                     id={"input-" + subTasks[props.index].workOrderSubTaskId}
                     InputProps={{ readOnly: false}}
                     style={{width: '100%'}}
                     value={subTasks[props.index].value}
                     onChange={event => {subTasks[props.index].value = event.target.value; setRefresh(Math.random)}}
                     multiline
                     rows={2}
                     rowsMax={4}
                  />
               }
            </Grid>
         </Grid>
      </>;
   };

   const SubTaskComp = <>
      <div>
         {
            subTasks.map((st, index) => {
               switch (st.subTaskCategoryKey) {
                  case 'VERIFICATION': return <VerificationComp key={index} index={index}/>;
                  case 'YES_NO': return <YesNoComp key={index} index={index}/>;
                  case 'TEXT':
                  case 'NUMBER': return <InputComp key={index} index={index}/>;
               }
               return '';
            })
         }
      </div>
   </>;


   const TaskDetailForm = <>
      <Grid container  spacing={2}>
         <Grid item xs={12}>
            <TextField
               id="taskName"
               label="Task Name"
               InputProps={{ readOnly: true}}
               style={{width: '100%'}}
               value={taskName}
            />
         </Grid>
         <Grid item xs={12}>
            <TextField
               id="taskNote"
               label="Task Note"
               multiline
               style={{width: '100%'}}
               value={notes}
               onChange={event => setNotes(event.target.value)}
               rows={2}
               rowsMax={4}
            />
         </Grid>

         <Grid item xs={6}>
            <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils}>
               <DateTimePicker
                  value={startTaskDate}
                  onChange={onChangeStartDate}
                  id="work-task-start-date"
                  format="DD/MM/YYYY HH:mm"
                  disablePast
                  label="Start Task Date"
                  showTodayButton
               />
            </MuiPickersUtilsProvider>
         </Grid>

         <Grid item xs={6}>
            <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils}>
               <DateTimePicker
                  value={endTaskDate}
                  onChange={onChangeEndDate}
                  id="work-task-end-date"
                  format="DD/MM/YYYY HH:mm"
                  disablePast
                  label="End Task Date"
                  showTodayButton
               />
            </MuiPickersUtilsProvider>
         </Grid>

         <Grid item xs={6}>
            <Grid container  spacing={2}>
               <Grid item xs={4} style={{marginTop:'auto', marginBottom: 'auto'}}>
                  Duration
               </Grid>
               <Grid item xs={2}>
                  <TextField  id="durationDD" label="DD" style={{width: '100%'}} value={durationDD}/>
               </Grid>
               <Grid item xs={2}>
                  <TextField  id="durationHH" label="HH" style={{width: '100%'}} value={durationHH}/>
               </Grid>
               <Grid item xs={2}>
                  <TextField  id="durationMM" label="MM" style={{width: '100%'}} value={durationMM}/>
               </Grid>
            </Grid>
         </Grid>
      </Grid>
   </>;

   const stepComp = (index: number) => {
      switch (index) {
         case 0: return TaskDetailForm;
         case 1: return SubTaskComp;
      }
      return (<></>);
   };

  return (
     <>
        <Dialog onClose={()=>setOpen(false)} aria-labelledby="customized-dialog-title" open={open}>
           <DialogTitle disableTypography className={styles.dialogTittle}>
              <h4>Task</h4>
              <IconButton onClick={() => setOpen(false)}><CloseIcon/></IconButton>
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
                      color="primary"
                      size="small"
                      className={buttonClasses.button}
                      disabled={activeStep === 0}
                      onClick={handleBack}
              >
                 Back
              </Button>
              <Button variant="outlined"
                      color="default"
                      size="small"
                      className={buttonClasses.button}
                      onClick={handleNext}
              >
                 {activeStep === 1 ? 'Save' : 'Next'}
              </Button>
              <Button
                 variant="contained"
                 color="primary"
                 size="small"
                 className={buttonClasses.button}
                 disabled={activeStep !== 1}
                 onClick={handleFinishTask}
              >Finish</Button>
           </DialogActions>
        </Dialog>
        </>
  );
};
