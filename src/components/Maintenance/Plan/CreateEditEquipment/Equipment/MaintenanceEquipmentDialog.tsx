import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {useFormik} from 'formik';
import * as Yup from "yup";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {createStyles, Theme, Dialog, DialogContent, Stepper, StepLabel, Step, DialogTitle, DialogActions, FormLabel, MenuItem} from "@material-ui/core";
import TextField from "@material-ui/core/TextField/TextField";
import Grid from "@material-ui/core/Grid/Grid";
import Button from "@material-ui/core/Button/Button";
import {useHistory} from "react-router";
import {EquipmentAvailableChooserComp} from "./EquipmentAvailableChooserComp";
import {ISimpleItem} from "../../../../Assets/Commons/AssetChooser/AssetChooser";


const useDateStyles = makeStyles((theme: Theme) =>
   createStyles({
      container: {
         display: 'flex',
         flexWrap: 'wrap',
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

export interface IInventoryFormProps {
   maintenanceIds: number[];
   open: boolean;
   setOpen(open: boolean): void;
   onSaveTaskActivity(equipmentId: number, date: String) : void;
}

export const MaintenanceEquipmentDialog: React.FC<IInventoryFormProps> =  ({maintenanceIds, open, setOpen, onSaveTaskActivity}) => {
   const steps = ['Equipments', 'Details'];
   const buttonClasses = useButtonStyles();
   const dateStyle = useDateStyles();
   const [activeStep, setActiveStep] = useState(0);
   const [skipped, setSkipped] = React.useState(new Set<number>());
   const [equipmentId, setEquipmentId] = React.useState(0);
   const [selectedDate, setSelectedDate] = React.useState('');

   useEffect(() => {
      setActiveStep(0);
   }, [open]);

   const isStepSkipped = (step: number) => {
      return skipped.has(step);
   };

   const handleNext = async () => {
      if(activeStep + 1 === 2) {
         onSaveTaskActivity(equipmentId, selectedDate);
      } else {
         setActiveStep(activeStep + 1);
      }
   };

   const handleBack = () => {
      setActiveStep(prevActiveStep => prevActiveStep - 1);
   };

   const LastMaintenanceDateComp = (
      <>
         <Grid item xs={6}>
            <form className={dateStyle.container}>
               <TextField
                  id="date"
                  label="Last Maintenance Date"
                  type="date"
                  value={selectedDate}
                  onChange={(event) => setSelectedDate(event.target.value)}
                  className={dateStyle.textField}
                  InputLabelProps={{
                     shrink: true,
                  }}
               />
            </form>
         </Grid>
      </>
   );

   const stepComp = (index: number) => {
      switch (index) {
         case 0: return (<EquipmentAvailableChooserComp
               disableItems={[]}
               initialSelected={equipmentId? [equipmentId] : []}
               filters={[]}
               multiple={false}
               onSelectItems={(items: ISimpleItem[]) => {
                  if(!items || items.length === 0) return;
                  setEquipmentId(items[0].itemId);
               }}
         />);
         case 1: return LastMaintenanceDateComp;
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
                      disabled={activeStep === 1 && (!equipmentId || !selectedDate)}
                      onClick={handleNext}
              >
                 {activeStep === 1 ? 'Accept' : 'Next'}
              </Button>
           </DialogActions>
        </Dialog>
        </>
  );
};
