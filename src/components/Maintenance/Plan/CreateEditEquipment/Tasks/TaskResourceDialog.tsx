import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {useFormik} from 'formik';
import * as Yup from "yup";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {createStyles, Theme, Dialog, DialogContent, Stepper, StepLabel, Step, DialogTitle, DialogActions, FormLabel, MenuItem} from "@material-ui/core";
import TextField from "@material-ui/core/TextField/TextField";
import Radio from '@material-ui/core/Radio';
import Grid from "@material-ui/core/Grid/Grid";
import Button from "@material-ui/core/Button/Button";
import {useHistory} from "react-router";
import {getItemDefaultInstance, CategoryQL, ItemQL, UnitQL} from "../../../../../graphql/Item.ql";
import {TaskResourceQL} from "../../../../../graphql/Maintenance.ql";
import {AssetChooserComp} from "../../../../Assets/Commons/AssetChooser/AssetChooserComp";
import {IEmployeeQL, IEmployeeJobQL} from "../../../../../graphql/Person.ql";

const useFormStyles = makeStyles((theme: Theme) =>
   createStyles({
      root: {
         // backgroundColor: 'blue',
         height: '50%',
         width: '100%',
         '& > *': {
            margin: theme.spacing(1),
            // width: 200,
         },
      },
   }),
);

const useButtonStyles = makeStyles(theme => ({
   button: {
      margin: theme.spacing(1),
   },
}));

export interface IInventoryFormProps {
   taskResource: TaskResourceQL;
   employeeCategories: CategoryQL[];
   units: UnitQL[];
   open: boolean;
   setOpen(open: boolean): void;
   onAccept(t: TaskResourceQL) : void;
}

export const TaskResourceDialog: React.FC<IInventoryFormProps> =  ({taskResource, employeeCategories, units, open, setOpen, onAccept}) => {
   const steps = ['Resource Type', 'Resource', 'Details'];
   const history = useHistory();
   const buttonClasses = useButtonStyles();
   const [activeStep, setActiveStep] = useState(0);
   const [skipped, setSkipped] = React.useState(new Set<number>());

   const [resourceType, setResourceType] = React.useState(taskResource.resourceType);
   const [amount, setAmount] = React.useState(taskResource.amount);
   const [unitId, setUnitId] = React.useState(taskResource.unit.unitId);
   const [employeeJobId, setEmployeeJobId] = React.useState(taskResource.employeeCategory? taskResource.employeeCategory.categoryId : 0);
   const [inventoryResource, setInventoryResource] = React.useState(taskResource.inventoryResource? taskResource.inventoryResource : null);


   useEffect(() => {
      setActiveStep(0);
      setResourceType(taskResource.resourceType);
      setAmount(taskResource.amount);
      setUnitId(taskResource.unit.unitId);
      setEmployeeJobId(taskResource.employeeCategory? taskResource.employeeCategory.categoryId : 0);
      setInventoryResource(taskResource.inventoryResource? taskResource.inventoryResource : null);
   }, [taskResource]);

   const isStepSkipped = (step: number) => {
      return skipped.has(step);
   };

   const handleNext = async () => {
      if(activeStep + 1 === 3) {
         const r: TaskResourceQL = {
            taskResourceId: taskResource.taskResourceId,
            order: taskResource.order,
            amount: amount,
            resourceType: resourceType,
            unit: units.find(u => u.unitId === unitId) || {unitId: 0, key: '', label: ''},
            employeeCategory: employeeCategories.find(e => e.categoryId === employeeJobId),
            inventoryResource: inventoryResource? inventoryResource : undefined,
            createdDate: taskResource.createdDate,
            modifiedDate: taskResource.modifiedDate
         };
         onAccept(r);
      } else {
         setActiveStep(activeStep + 1);
      }
   };

   const handleBack = () => {
      setActiveStep(prevActiveStep => prevActiveStep - 1);
   };

   const TaskResourceSummary = (
      <>
         <Grid item xs={6}>
            <TextField
               style={{width: '100%'}}
               id="amount-resource"
               label="Amount"
               value={amount}
               onChange={(event => setAmount(+event.target.value))}
            >
            </TextField>
         </Grid>
         <Grid item xs={6}>
            <TextField
               style={{width: '100%'}}
               id="human-resource-unit"
               select
               label="Unit"
               value={unitId}
               disabled={resourceType === 'INVENTORY'}
               onChange={(event => setUnitId(+event.target.value))}
            >
               {units.map((option) => (
                  <MenuItem key={option.unitId} value={option.unitId}>
                     {option.label}
                  </MenuItem>
               ))}
            </TextField>
         </Grid>
      </>
   );

   const InventoryTypeComp = (
      <>
         <Grid item xs={3}>
            <FormLabel component="legend">Inventory Resource</FormLabel>
         </Grid>
         <Grid item xs={3}>
            <Radio
               checked={resourceType === 'INVENTORY'}
               onChange={(event => setResourceType(event.target.value))}
               value="INVENTORY"
               name="radio-button-demo"
               inputProps={{ 'aria-label': 'inventory' }}
            />
         </Grid>
         <Grid item xs={3}>
            <FormLabel component="legend">Human Resource</FormLabel>
         </Grid>
         <Grid item xs={3}>
            <Radio
               checked={resourceType === 'HUMAN'}
               onChange={(event => setResourceType(event.target.value))}
               value="HUMAN"
               name="radio-button-demo"
               inputProps={{ 'aria-label': 'human' }}
            />
         </Grid>
         </>
   );

   const HumanResourceJob = (
      <>
         <Grid item xs={12}>
            <TextField
               style={{width: '100%'}}
               id="human-resource-job"
               select
               label="Human Resource"
               value={employeeJobId}
               onChange={(event => setEmployeeJobId(+event.target.value))}
            >
               {employeeCategories.map((option) => (
                  <MenuItem key={option.categoryId} value={option.categoryId}>
                     {option.name}
                  </MenuItem>
               ))}
            </TextField>
         </Grid>
      </>
   );

   const stepComp = (index: number) => {
      switch (index) {
         case 0: return InventoryTypeComp;
         case 1: return (resourceType === 'INVENTORY')?
            <AssetChooserComp
               disableItems={[]}
               filters={[{field: "status",operator: "=", value: "ACTIVE"}, {field: "itemType", operator: "in", value: "SPARE_PARTS,TOOLS,SUPPLIES"}]}
               multiple={false}
               initialSelected={inventoryResource? [inventoryResource.itemId] : []}
               onSelectItems={(items: ItemQL[]) => {
                  if(items.length === 1) {
                     setInventoryResource(items[0]);
                     setUnitId(items[0].unit.unitId)
                  } else {
                     setInventoryResource(null);
                     setUnitId(0);
                  }
               }}
         /> : HumanResourceJob;
         case 2: return TaskResourceSummary;
      }
      return (<></>);
   };



  return (
     <>
        <Dialog onClose={()=>setOpen(false)} aria-labelledby="customized-dialog-title" open={open}>
           <DialogTitle>
              Add / Edit Resource
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
                      disabled={activeStep === 2 && !unitId}
                      onClick={handleNext}
              >
                 {activeStep === 2 ? 'Accept' : 'Next'}
              </Button>
           </DialogActions>
        </Dialog>
        </>
  );
};
