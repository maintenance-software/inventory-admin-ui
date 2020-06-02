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
import {getTaskResourceDefaultInstance, TaskResourceQL} from "../../../graphql/Maintenance.ql";
import CloseIcon from '@material-ui/icons/Close';
import {WorkOrderResourceQL} from "../../../graphql/WorkOrder.ql";
import {EmployeeChooserComp} from "../../Assets/Commons/PersonChooser/EmployeeChooserComp";
import {ISimplePerson} from "../../Assets/Commons/PersonChooser/PersonChooser";


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
      width: '35rem',
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

export interface IWorkOrderResource {
   resourceId: number;
   description: string;
   resource: string;
   itemId: number;
   inventoryItemId: number;
   employeeCategoryId: number;
   personId: number;
   resourceType: string;
   amount: number;
}


interface IWorkOrderResourceProds {
   resources: IWorkOrderResource[];
   open: boolean;
   setOpen(open: boolean): void;
   onAccept(t: TaskResourceQL) : void;
}

export const WorkOrderResourceDialog: React.FC<IWorkOrderResourceProds> =  ({resources, open, setOpen, onAccept}) => {
   const history = useHistory();
   const dialogClasses = useDialogStyles();
   const [employeeChooserOpen, setEmployeeChooserOpen] = React.useState(false);
   const [employeeSelected, setEmployeeSelected] = React.useState<ISimplePerson | null>(null);
   const [resourceSelected, setResourceSelected] = React.useState<IWorkOrderResource | null>(null);

   const [workOrderResources, setWorkOrderResources] = React.useState(resources);
   useEffect(() => {
      setWorkOrderResources(resources);
   }, [resources]);

   const handleAcceptWorkOrderResource = () => {
      console.log('set resoruce');
   };

   const handleAddWorkOrderResource = (resource: IWorkOrderResource) => {
      setResourceSelected(resource);
      if(resource.resourceType === 'HUMAN') {
         setEmployeeChooserOpen(true)
      }
   };

   const handleRemoveWorkOrderResource = (resourceId: number) => {
      const newResources = workOrderResources.filter(r => r.resourceId !== resourceId);
      setWorkOrderResources(newResources);
   };

   const handleSelectedEmployee = ([person] : ISimplePerson[]) => {
      setEmployeeSelected(person);
   };

   const handleAcceptSelectedEmployee = () => {
      if(resourceSelected && resourceSelected.resourceType === 'HUMAN' && employeeSelected) {
         const newWorkOrderResources = workOrderResources.concat();
         newWorkOrderResources.forEach(r => {
            if(r.resourceId === resourceSelected.resourceId) {
               r.resource = employeeSelected.fullName;
               r.personId = employeeSelected.personId;
            }
         });
         setWorkOrderResources(newWorkOrderResources);
         setEmployeeChooserOpen(false);
         setEmployeeSelected(null);
         setResourceSelected(null);
      }
   };

  return (
     <>
        <Dialog onClose={()=>setOpen(false)} aria-labelledby="customized-dialog-title" open={open}>
           <DialogTitle disableTypography className={dialogClasses.dialogTittle}>
              <h4>Edit Resource</h4>
              <IconButton onClick={()=> setOpen(false)}><CloseIcon/></IconButton>
           </DialogTitle>
           <DialogContent dividers className={dialogClasses.dialogContent}>
              <TableContainer>
                 <Table size="small">
                    <TableHead>
                       <TableRow>
                          <TableCell>Description</TableCell>
                          <TableCell>Resource</TableCell>
                          <TableCell>Amount</TableCell>
                          <TableCell align="center">Options</TableCell>
                       </TableRow>
                    </TableHead>
                    <TableBody>
                       {workOrderResources.map((row: IWorkOrderResource, index) => (
                          <TableRow key={row.resourceId} hover>
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
                      onClick={handleAcceptWorkOrderResource}
              >
                 Accept
              </Button>
           </DialogActions>
        </Dialog>


        <Dialog onClose={()=>setEmployeeChooserOpen(false)} aria-labelledby="customized-dialog-title" open={employeeChooserOpen}>
           <DialogTitle disableTypography className={dialogClasses.dialogTittle}>
              <h4>Select Employee Resource</h4>
              <IconButton onClick={()=> setEmployeeChooserOpen(false)}><CloseIcon/></IconButton>
           </DialogTitle>
           <DialogContent dividers className={dialogClasses.dialogContent}>
              <EmployeeChooserComp multiple={false} filters={[]} disableItems={[]} onSelectPersons={handleSelectedEmployee}/>
           </DialogContent>
           <DialogActions className={dialogClasses.dialogFooter}>
              <Button variant="outlined"
                      color="primary"
                      size="small"
                      disabled={!employeeSelected}
                      onClick={handleAcceptSelectedEmployee}
              >
                 Accept
              </Button>
           </DialogActions>
        </Dialog>
        </>
  );
};
