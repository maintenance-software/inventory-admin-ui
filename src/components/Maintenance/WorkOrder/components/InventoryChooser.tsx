import React, {useEffect, FormEvent, FC} from 'react';
import { useTranslation } from 'react-i18next';
import makeStyles from "@material-ui/core/styles/makeStyles";
import TableContainer from "@material-ui/core/TableContainer/TableContainer";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TablePagination from "@material-ui/core/TablePagination/TablePagination";
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import Grid from "@material-ui/core/Grid/Grid";
import ListIcon from '@material-ui/icons/List';
import { useHistory } from "react-router";
import Button from '@material-ui/core/Button';
import {Checkbox, Typography} from '@material-ui/core';
import {InventoryQL} from "../../../../graphql/Inventory.ql";
import {IInventoryResource} from "../WorkOrderResourceDialog";

const useButtonStyles = makeStyles(theme => ({
   button: {
      margin: theme.spacing(1),
   }
}));

const useStyles2 = makeStyles({
   root: {
      width: '100%',
   },
   container: {
      height: '25rem',
   },
   title: {
      flex: '1 1 100%',
   }
});


interface InventoryChooserProps {
   inventories: IInventoryResource[];
   onSelectInventory(invetory: IInventoryResource) : void;
}

export const InventoryChooser: FC<InventoryChooserProps> = ({inventories, onSelectInventory}) => {
   const history = useHistory();
   const classes = useStyles2();
   const handleSelectedInventory = (event: React.MouseEvent<unknown>, inventory: IInventoryResource) => {
         onSelectInventory(inventory);
   };

   return (
      <Paper className={classes.root}>
         <TableContainer className={classes.container}>
            <Table stickyHeader size="small">
               <TableHead>
                  <TableRow>
                     <TableCell>Name</TableCell>
                     <TableCell>Description</TableCell>
                  </TableRow>
               </TableHead>
               <TableBody>
                  {inventories.map((row: IInventoryResource, index) => (
                     <TableRow
                        hover
                        onClick={event => handleSelectedInventory(event, row)}
                        role="checkbox"
                        tabIndex={-1}
                        key={row.inventoryId}
                     >
                        <TableCell>{row.name}</TableCell>
                        <TableCell>{row.description}</TableCell>
                     </TableRow>
                  ))}
               </TableBody>
            </Table>
         </TableContainer>
      </Paper>
   );
};
