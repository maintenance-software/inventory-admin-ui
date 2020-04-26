import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {useFormik} from 'formik';
import * as Yup from "yup";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {createStyles, Theme, Dialog, DialogContent, Stepper, StepLabel, Step, DialogTitle, DialogActions, FormLabel} from "@material-ui/core";
import TextField from "@material-ui/core/TextField/TextField";
import Radio from '@material-ui/core/Radio';
import Grid from "@material-ui/core/Grid/Grid";
import Button from "@material-ui/core/Button/Button";
import { useMutation } from "@apollo/react-hooks";
import {useHistory} from "react-router";
import {IItem} from "../../../../../graphql/item.type";
import {ITaskResource} from "../../../../../graphql/Maintenance.type";
import {AssetChooserComp} from "../../../../Assets/Commons/AssetSelectable/AssetChooserComp";

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
   taskResource: ITaskResource;
   open: boolean;
   setOpen(open: boolean): void;
   onAccept() : void;
}

export const TaskResourceDialog: React.FC<IInventoryFormProps> =  ({taskResource, open, setOpen, onAccept}) => {
   const steps = ['Resource Type', 'Resource', 'Details'];
   const history = useHistory();
   const formClasses = useFormStyles();
   const buttonClasses = useButtonStyles();
   const [selectedItems, setSelectedItems] = useState<IItem[]>([]);
   const [activeStep, setActiveStep] = useState(0);
   const [skipped, setSkipped] = React.useState(new Set<number>());
   const [resourceType, setResourceType] = React.useState(taskResource.resourceType);

   useEffect(() => {
      setActiveStep(0);
      setResourceType(taskResource.resourceType);
   }, [taskResource]);

   const isStepSkipped = (step: number) => {
      return skipped.has(step);
   };

   const handleNext = async () => {
      if(activeStep + 1 === 3) {
         console.log('end step');
      } else {
         setActiveStep(activeStep + 1);
      }
   };

   const handleBack = () => {
      setActiveStep(prevActiveStep => prevActiveStep - 1);
   };

   const handleSelectItem = (items: IItem[]) => {
      setSelectedItems(items);
   };

   // const getItemSelectableComp = () => {
   //    return <InventoryItemAvailableComp inventoryId={inventoryId} onSelectItem={handleSelectItem}/>
   // };
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

   const stepComp = (index: number) => {
      switch (index) {
         case 0: return InventoryTypeComp;
         case 1: return <AssetChooserComp
            disableItems={[]}
            filters={[{field: "status",operator: "=", value: "ACTIVE"}, {field: "itemType", operator: "in", value: "SPARE_PARTS,TOOLS,SUPPLIES"}]}
            multiple={false}
            onSelectItem={() => {}}
         />;
      }
      return (<></>);
   };



  return (
     <>
        <Dialog maxWidth="md" onClose={()=>setOpen(false)} aria-labelledby="customized-dialog-title" open={open}>
           <DialogTitle>
              Add / Edit Resource
           </DialogTitle>
           <DialogContent dividers>
              <Stepper activeStep={activeStep}>
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
              <Grid container  spacing={2}>
                 { stepComp(activeStep) }
              </Grid>
           </DialogContent>
           <DialogActions>
              <div style={{padding: '.5rem', display: 'flex', justifyContent: 'space-between'}}>
                 <Button variant="contained" color="secondary" onClick={()=> setOpen(false)}>
                    Cancel
                 </Button>
                 <div>
                    <Button disabled={activeStep === 0} onClick={handleBack}>
                       Back
                    </Button>
                    <Button
                       variant="contained"
                       color="primary"
                       onClick={handleNext}
                    >
                       {activeStep === 2 ? 'Save' : 'Next'}
                    </Button>
                 </div>
              </div>
           </DialogActions>
        </Dialog>



        </>
  );
};
