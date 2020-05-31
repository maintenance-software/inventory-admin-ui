import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {useFormik} from 'formik';
import * as Yup from "yup";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {createStyles, Theme, Dialog, DialogContent, Stepper, StepLabel, Step} from "@material-ui/core";
import TextField from "@material-ui/core/TextField/TextField";
import Grid from "@material-ui/core/Grid/Grid";
import Button from "@material-ui/core/Button/Button";
import { useMutation } from "@apollo/react-hooks";
import {useHistory} from "react-router";
import {ItemQL} from "../../../graphql/Item.ql";
import {InventoryItemAvailableComp} from "../../Assets/Commons/AssetChooser/InventoryItemAvailableComp";
import {InventoriesQL, SAVE_INVENTORY, SAVE_INVENTORY_ITEMS} from "../../../graphql/Inventory.ql";
import {clearCache} from "../../../utils/globalUtil";

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

const useSelectFormStyles = makeStyles((theme: Theme) =>
   createStyles({
      formControl: {
         margin: theme.spacing(1),
         minWidth: 120,
      },
      selectEmpty: {
         marginTop: theme.spacing(2),
      },
   }),
);

const useButtonStyles = makeStyles(theme => ({
   button: {
      margin: theme.spacing(1),
   },
}));

export interface IInventoryFormProps {
   inventoryId: number;
   inventoryItemForm?: IInventoryItemForm;
   onCancelSaveInventoryItem?() : void;
   onSaveInventoryItem?(inventoryItemForm?: IInventoryItemForm) : void;
}

export interface IInventoryItemForm {
   level: number;
   maxLevelAllowed: number;
   minLevelAllowed: number;
   price: number;
   location: string;
   dateExpiry: string;
}

export const EditInventoryItemForm: React.FC<IInventoryFormProps> =  ({inventoryId, inventoryItemForm, onSaveInventoryItem, onCancelSaveInventoryItem}) => {
   const history = useHistory();
   const formClasses = useFormStyles();
   const buttonClasses = useButtonStyles();
   const [selectedItems, setSelectedItems] = useState<ItemQL[]>([]);
   const { values, resetForm, getFieldProps, getFieldMeta, handleSubmit, errors, dirty, isValid } = useFormik<IInventoryItemForm>({
    initialValues: inventoryItemForm || {
       level: 0,
       maxLevelAllowed: 0,
       minLevelAllowed: 0,
       price: 0,
       location: '',
       dateExpiry: ''
    },
    validationSchema: Yup.object().shape({
       level: Yup.number(),
       maxLevelAllowed: Yup.number(),
       minLevelAllowed: Yup.number(),
       price: Yup.number()
    }),
    onSubmit: (values, bag) => {
       onSaveInventoryItem && onSaveInventoryItem(values);
    }
  });
   const [saveInventoryItems] = useMutation<{ inventories: InventoriesQL }, any>(SAVE_INVENTORY_ITEMS);
   const [activeStep, setActiveStep] = useState(0);
   const [skipped, setSkipped] = React.useState(new Set<number>());
   const isStepSkipped = (step: number) => {
      return skipped.has(step);
   };

   const handleNext = async () => {
      if(activeStep + 1 === 2) {
         const response = await saveInventoryItems({
            variables: {
               inventoryId: inventoryId,
               itemIds: selectedItems.map(item => item.itemId),
               level: level.value,
               maxLevelAllowed: maxLevelAllowed.value,
               minLevelAllowed: minLevelAllowed.value,
               price: price.value,
               location: location.value,
               dateExpiry: dateExpiry.value
            },
            update: (cache) => {
               clearCache(cache, 'inventories.inventory[\\s\\S]+inventoryItems');
               clearCache(cache, 'inventories.inventory[\\s\\S]+availableItems');
            }
         }).then(response => {
            onSaveInventoryItem && onSaveInventoryItem(inventoryItemForm);
         });
      } else {
         setActiveStep(activeStep + 1);
      }
   };

   const handleBack = () => {
      setActiveStep(prevActiveStep => prevActiveStep - 1);
   };

   const handleSelectItem = (items: ItemQL[]) => {
      setSelectedItems(items);
   };

   const getInventoryItemForm = () => {
      return (
         <form className={formClasses.root} noValidate autoComplete="off" onSubmit={handleSubmit}>
            <Grid container>
               <Grid container  spacing={2}>
                  <Grid item xs={4}>
                     <TextField  id="level" label="Level" {...level}/>
                  </Grid>
                  <Grid item xs={4}>
                     <TextField  id="max-level-allowed" label="Max Level Allowed" {...maxLevelAllowed}/>
                  </Grid>
                  <Grid item xs={4}>
                     <TextField  id="min-level-allowed" label="Max Level Allowed" {...minLevelAllowed}/>
                  </Grid>

                  <Grid item xs={6}>
                     <TextField  id="Price" label="Price" {...price}/>
                  </Grid>
                  <Grid item xs={6}>
                     <TextField
                        id="date-expiry"
                        label="Date Expiry"
                        type="date"
                        InputLabelProps={{
                           shrink: true,
                        }}
                     />
                  </Grid>
                  <Grid item xs={12}>
                     <TextField  id="location" label="Localtion" {...location}/>
                  </Grid>
               </Grid>
            </Grid>
         </form>
      );
   };

   const getItemSelectableComp = () => {
      return <InventoryItemAvailableComp inventoryId={inventoryId} onSelectItem={handleSelectItem}/>
   };

   const level = getFieldProps('level');
   const levelField = getFieldMeta('level');
   const maxLevelAllowed = getFieldProps('maxLevelAllowed');
   const maxLevelAllowedField = getFieldMeta('maxLevelAllowed');
   const minLevelAllowed = getFieldProps('minLevelAllowed');
   const minLevelAllowedField = getFieldMeta('minLevelAllowed');
   const price = getFieldProps('price');
   const priceField = getFieldMeta('price');
   const location = getFieldProps('location');
   const locationField = getFieldMeta('location');
   const dateExpiry = getFieldProps('dateExpiry');
   const dateExpiryField = getFieldMeta('dateExpiry');
   // const descriptionField = getFieldMeta('description');

  return (
     <>
             <Stepper activeStep={activeStep}>
                {[0,1].map((step, index) => {
                   const stepProps: { completed?: boolean } = {};
                   const labelProps: { optional?: React.ReactNode } = {};
                   if (isStepSkipped(index)) {
                      stepProps.completed = false;
                   }
                   return (
                      <Step key={index} {...stepProps}>
                         <StepLabel {...labelProps}>{step === 0? 'Items' : 'Details'}</StepLabel>
                      </Step>
                   );
                })}
             </Stepper>

             { (activeStep === 0) ? getItemSelectableComp() : getInventoryItemForm() }

             <div style={{padding: '.5rem', display: 'flex', justifyContent: 'space-between'}}>
                <Button variant="contained" color="secondary" onClick={()=> onCancelSaveInventoryItem && onCancelSaveInventoryItem()}>
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
                      {activeStep === 1 ? 'Save' : 'Next'}
                   </Button>
                </div>
             </div>
        </>
  );
};
