import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {useFormik} from 'formik';
import * as Yup from "yup";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {createStyles, Theme, Dialog, DialogContent, Stepper, StepLabel, Step, DialogTitle, DialogActions, FormLabel, MenuItem, IconButton, TableContainer, Table, TableHead, TableRow, TableCell, TableBody} from "@material-ui/core";
import TextField from "@material-ui/core/TextField/TextField";
import Radio from '@material-ui/core/Radio';
import UnfoldMoreIcon from '@material-ui/icons/UnfoldMore';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import Button from "@material-ui/core/Button/Button";
import {useHistory} from "react-router";
import CloseIcon from '@material-ui/icons/Close';
import {EmployeeChooserComp} from "../../Assets/Commons/PersonChooser/EmployeeChooserComp";
import {ISimplePerson} from "../../Assets/Commons/PersonChooser/PersonChooser";
import {
   FETCH_INVENTORIES_FOR_ITEM_GQL,
   InventoriesQL,
   InventoryItemQL,
   InventoryQL
} from "../../../graphql/Inventory.ql";
import { useLazyQuery } from '@apollo/react-hooks';
import {InventoryChooser} from "./InventoryChooser";
import {GET_INVENTORY_ITEMS_BY_ITEM_ID_QL} from "../../../graphql/WorkOrder.ql";
import {ItemsQL} from "../../../graphql/Item.ql";
import {IWorkOrderResource} from "./WorkOrderTypes";

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
   onAccept(resources: IWorkOrderResource[]) : void;
}

export const WorkOrderResourceDialog: React.FC<IWorkOrderResourceProds> =  ({resources, open, setOpen, onAccept}) => {
   const history = useHistory();
   const dialogClasses = useDialogStyles();
   const [employeeChooserOpen, setEmployeeChooserOpen] = React.useState(false);
   const [inventoryChooserOpen, setInventoryChooserOpen] = React.useState(false);
   const [resourceSelected, setResourceSelected] = React.useState<IWorkOrderResource | null>(null);
   const [fetchInventorItems, inventoryItemsResponse] = useLazyQuery<{items: ItemsQL}, any>(GET_INVENTORY_ITEMS_BY_ITEM_ID_QL);
   const [inventoryItems, setInventoryItems] = React.useState<IInventoryResource[]>([]);
   const [workOrderResources, setWorkOrderResources] = React.useState(resources.concat());

   useEffect(() => {
      if(inventoryChooserOpen && resourceSelected) {
         fetchInventorItems({variables: {itemId: resourceSelected.itemId}});
      }
   }, [inventoryChooserOpen]);

   useEffect(() => {
      setWorkOrderResources(resources.concat());
   }, [resources]);

   useEffect(() => {
      if(inventoryItemsResponse.data) {
         const newInventoryItems = inventoryItemsResponse.data.items.item.inventoryItems.content.map(inventoryItem => ({
            inventoryItemId: inventoryItem.inventoryItemId,
            inventoryId: inventoryItem.inventory.inventoryId,
            name: inventoryItem.inventory.name,
            description: inventoryItem.inventory.description
         }));
         setInventoryItems(newInventoryItems);
      }
   }, [inventoryItemsResponse, inventoryItemsResponse.data]);

   const handleAcceptWorkOrderResource = () => {
      onAccept(workOrderResources);
   };

   const handleAddWorkOrderResource = (resource: IWorkOrderResource) => {
      setResourceSelected(resource);
      if(resource.resourceType === 'HUMAN') {
         setEmployeeChooserOpen(true)
      } else if(resource.resourceType === 'INVENTORY') {
         setInventoryChooserOpen(true);
      }
   };

   const handleRemoveWorkOrderResource = (resourceId: number) => {
      const newResources = workOrderResources.filter(r => r.resourceId !== resourceId);
      setWorkOrderResources(newResources);
   };

   const handleSelectedEmployee = ([person] : ISimplePerson[]) => {
      if(resourceSelected && resourceSelected.resourceType === 'HUMAN') {
         const newWorkOrderResources = workOrderResources.map(resource => ({...resource}));
         newWorkOrderResources.forEach(r => {
            if(r.resourceId === resourceSelected.resourceId) {
               r.resource = person.fullName;
               r.personId = person.personId;
            }
         });
         setWorkOrderResources(newWorkOrderResources);
         setEmployeeChooserOpen(false);
         setResourceSelected(null);
      }
   };

   const handleSelectedInventory = (inventory: IInventoryResource) => {
      if(resourceSelected && resourceSelected.resourceType === 'INVENTORY') {
         const newWorkOrderResources = workOrderResources.map(resource => ({...resource}));
         newWorkOrderResources.forEach(r => {
            if(r.resourceId === resourceSelected.resourceId) {
               r.resource = inventory.name;
               r.inventoryItemId = inventory.inventoryItemId;
            }
         });
         setWorkOrderResources(newWorkOrderResources);
         setInventoryChooserOpen(false);
         setResourceSelected(null);
      }
   };

   const handleCloseDialog = () => {
      setWorkOrderResources(resources.map(resource => ({...resource})));
      setOpen(false);
   };

   const isInvalid = () => {
      return workOrderResources.find(r => (r.resourceType === 'HUMAN' && !r.personId) || (r.resourceType === 'INVENTORY' && !r.inventoryItemId))
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
                          <TableCell>Description</TableCell>
                          <TableCell>Resource</TableCell>
                          <TableCell>Amount</TableCell>
                          <TableCell align="center">Options</TableCell>
                       </TableRow>
                    </TableHead>
                    <TableBody>
                       {workOrderResources.map((row: IWorkOrderResource, index) => (
                          <TableRow key={row.resourceId} hover>
                             <TableCell>{row.resourceType}</TableCell>
                             <TableCell>{row.description}</TableCell>
                             <TableCell>
                                <div className={!row.resource? dialogClasses.selectMandatory : ''} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                   {row.resource || 'Select Resource'}
                                   <IconButton aria-label="Remove resource" size='small' color='primary' onClick={() => handleAddWorkOrderResource(row)}>
                                      <UnfoldMoreIcon/>
                                   </IconButton>
                                </div>
                             </TableCell>
                             <TableCell>{row.resourceType === 'INVENTORY'?row.amount : ''}</TableCell>
                             <TableCell align="center">
                                <IconButton aria-label="Remove resource" size='small' color='secondary' onClick={() => handleRemoveWorkOrderResource(row.resourceId)}>
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
              <Button variant="outlined"
                      color="primary"
                      size="small"
                      disabled={!!isInvalid()}
                      onClick={handleAcceptWorkOrderResource}
              >
                 Accept
              </Button>
           </DialogActions>
        </Dialog>


        <Dialog onClose={()=>setEmployeeChooserOpen(false)} aria-labelledby="customized-dialog-title" open={employeeChooserOpen}>
           <DialogTitle disableTypography className={dialogClasses.dialogTittle}>
              <h4>Person Dialog</h4>
              <IconButton onClick={()=> setEmployeeChooserOpen(false)}><CloseIcon/></IconButton>
           </DialogTitle>
           <DialogContent dividers className={dialogClasses.dialogContent}>
              <EmployeeChooserComp multiple={false} filters={[]} disableItems={[]} onSelectPersons={handleSelectedEmployee}/>
           </DialogContent>
        </Dialog>


        <Dialog onClose={()=>setInventoryChooserOpen(false)} aria-labelledby="customized-dialog-title" open={inventoryChooserOpen}>
           <DialogTitle disableTypography className={dialogClasses.dialogTittle}>
              <h4>Select Inventory Resource</h4>
              <IconButton onClick={()=> setInventoryChooserOpen(false)}><CloseIcon/></IconButton>
           </DialogTitle>
           <DialogContent dividers className={dialogClasses.dialogContent}>
              <InventoryChooser
                 inventories={inventoryItems}
                 onSelectInventory={handleSelectedInventory}
              />
           </DialogContent>
        </Dialog>
        </>
  );
};
