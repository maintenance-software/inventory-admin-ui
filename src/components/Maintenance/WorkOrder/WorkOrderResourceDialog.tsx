import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {useFormik} from 'formik';
import * as Yup from "yup";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {createStyles, Theme, Dialog, DialogContent, Stepper, StepLabel, Step, DialogTitle, DialogActions, FormLabel, MenuItem, IconButton, TableContainer, Table, TableHead, TableRow, TableCell, TableBody} from "@material-ui/core";
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import Button from "@material-ui/core/Button/Button";
import {useHistory} from "react-router";
import CloseIcon from '@material-ui/icons/Close';
import {IWorkOrderResource} from "./WorkOrderTypes";
import {PersonPaginatorSelector} from "../../Human/PersonPaginatorSelector";
import {InventorySelectorSelector} from "./components/InventorySelectorSelector";

const useDialogStyles = makeStyles((theme: Theme) => createStyles({
   root: {
      // backgroundColor: 'blue',
      height: '50%',
      width: '100%',
      '& > *': {
         margin: theme.spacing(1),
         // width: 200,
      },
   },
   dialogTittle: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingRight: '.25rem',
      paddingTop: '.25rem',
      paddingBottom: '.25rem'
   },
   dialogFooter: {
      paddingTop: '.5rem',
      paddingBottom: '.5rem',
      justifyContent: 'center'
   },
   dialogContent: {
      height: '30rem',
      width: '40rem',
      padding: '.5rem'
   },
   selectMandatory: {
      borderBottomWidth: '1px',
      borderBottomColor: 'red',
      borderBottomStyle: 'solid',
      paddingLeft: '.5rem'
   }
   }),
);

export interface IInventoryResource {
   inventoryItemId: number;
   inventoryId: number;
   name: string;
   description: string;
}

interface IWorkOrderResourceProds {
   resources: IWorkOrderResource[];
   open: boolean;
   setOpen(open: boolean): void;
   onSaveWorkOrderResources(resources: IWorkOrderResource[]) : void;
}

export const WorkOrderResourceDialog: React.FC<IWorkOrderResourceProds> =  ({resources, open, setOpen, onSaveWorkOrderResources}) => {
   const history = useHistory();
   const dialogClasses = useDialogStyles();
   const [workOrderResources, setWorkOrderResources] = React.useState(resources.concat());

   useEffect(() => {
      setWorkOrderResources(resources.concat());
   }, [resources]);

   const handleAcceptWorkOrderResource = () => {
      onSaveWorkOrderResources(workOrderResources);
   };

   const handleRemoveWorkOrderResource = (resourceId: number) => {
      const newResources = workOrderResources.filter(r => r.workOrderResourceId !== resourceId);
      setWorkOrderResources(newResources);
   };

   const handleSelectedEmployee = (workOrderResourceId: number, value: number, label: string) => {
         const newWorkOrderResources = workOrderResources.map(resource => ({...resource}));
         newWorkOrderResources.forEach(r => {
            if(r.workOrderResourceId === workOrderResourceId) {
               r.resourceName = label;
               r.humanResourceId = value;
            }
         });
         setWorkOrderResources(newWorkOrderResources);
   };

   const handleSelectedInventory = (inventoryResourceId: number, inventory: IInventoryResource) => {
         const newWorkOrderResources = workOrderResources.map(resource => ({...resource}));
         newWorkOrderResources.forEach(r => {
            if(r.workOrderResourceId === inventoryResourceId) {
               r.resourceName = inventory.name;
               r.inventoryItemId = inventory.inventoryItemId;
            }
         });
         setWorkOrderResources(newWorkOrderResources);
   };

   const handleCloseDialog = () => {
      setWorkOrderResources(resources.map(resource => ({...resource})));
      setOpen(false);
   };

   const isInvalid = () => {
      return !workOrderResources.length || workOrderResources.find(r => (r.resourceType === 'HUMAN' && !r.humanResourceId) || (r.resourceType === 'INVENTORY' && !r.inventoryItemId))
   };

  return (
     <>
        <Dialog onClose={handleCloseDialog} aria-labelledby="customized-dialog-title" open={open}>
           <DialogTitle disableTypography className={dialogClasses.dialogTittle}>
              <h4>Edit Resource</h4>
              <IconButton onClick={handleCloseDialog}><CloseIcon/></IconButton>
           </DialogTitle>
           <DialogContent dividers className={dialogClasses.dialogContent}>
              <TableContainer>
                 <Table size="small">
                    <TableHead>
                       <TableRow>
                          <TableCell>Resource Type</TableCell>
                          <TableCell>Resource Name</TableCell>
                          <TableCell>Resource</TableCell>
                          <TableCell>Amount</TableCell>
                          <TableCell align="center">Options</TableCell>
                       </TableRow>
                    </TableHead>
                    <TableBody>
                       {workOrderResources.map((row: IWorkOrderResource, index) => (
                          <TableRow key={row.workOrderResourceId} hover>
                             <TableCell>{row.resourceType}</TableCell>
                             <TableCell>{row.resourceName}</TableCell>
                             <TableCell>
                                { row.resourceType === 'HUMAN'?
                                   <PersonPaginatorSelector
                                      value={{
                                         value: row.humanResourceId,
                                         label: row.resourceName,
                                         selected: false
                                      }}
                                      onChange={(value: number, label: string) => handleSelectedEmployee(row.workOrderResourceId, value, label)}
                                   />:
                                   <InventorySelectorSelector
                                       value={{
                                          inventoryItemId: row.inventoryItemId,
                                          inventoryId: 0,
                                          name: row.resourceName,
                                          description: ''
                                       }}
                                       itemId={row.itemId}
                                       onChange={option => {handleSelectedInventory(row.workOrderResourceId, option)}}
                                   />
                                }
                             </TableCell>
                             <TableCell>{row.resourceType === 'INVENTORY'?row.amount : ''}</TableCell>
                             <TableCell align="center">
                                <IconButton aria-label="Remove resource" size='small' color='secondary' onClick={() => handleRemoveWorkOrderResource(row.workOrderResourceId)}>
                                   <DeleteForeverIcon/>
                                </IconButton>
                             </TableCell>
                          </TableRow>
                       ))}
                    </TableBody>
                 </Table>
              </TableContainer>
           </DialogContent>
           <DialogActions className={dialogClasses.dialogFooter}>
              <Button variant="contained"
                      color="secondary"
                      size="small"
                      onClick={handleCloseDialog}
              >
                 Cancel
              </Button>
              <Button variant="contained"
                      color="primary"
                      size="small"
                      disabled={!!isInvalid()}
                      onClick={handleAcceptWorkOrderResource}
              >
                 Save
              </Button>
           </DialogActions>
        </Dialog>
        </>
  );
};
