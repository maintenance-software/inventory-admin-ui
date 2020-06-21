import React, { useState, FC, FormEvent, useEffect } from 'react';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Typography from '@material-ui/core/Typography';
import DraftsIcon from '@material-ui/icons/Drafts';
import SendIcon from '@material-ui/icons/Send';
import PriorityHighIcon from '@material-ui/icons/PriorityHigh';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';
import UnfoldMoreIcon from '@material-ui/icons/UnfoldMore';
import TablePagination from '@material-ui/core/TablePagination';
import { useLazyQuery } from '@apollo/react-hooks';
import {ISimpleSelectorOption} from "../../../common/CommonTypes";
import {ItemsQL} from "../../../../graphql/Item.ql";
import {GET_INVENTORY_ITEMS_BY_ITEM_ID_QL} from "../../../../graphql/WorkOrder.ql";
import {IInventoryResource} from "../WorkOrderResourceDialog";

const useStyles = makeStyles({
   root: {
      width: '100%',
      display: 'flex',
      justifyContent: 'space-between',
      borderTop: 'none!important',
      borderLeft: 'none!important',
      borderRight: 'none!important',
      borderRadius: 0,
      paddingRight: '.5rem',
      paddingLeft: '.5rem',
      '&:focus': {
         outline: 'none',
         borderTop: 'none!important',
         borderLeft: 'none!important',
         borderRight: 'none!important',
      }
   },
   dialogContent: {
      height: '32rem',
      width: '22rem',
      paddingTop: '0!important',
      paddingLeft: '.5rem',
      paddingRight: '.5rem',
      paddingBottom: '.5rem',
      display: 'flex',
      flexDirection: 'column',
   },
   optionContent: {
      flex: 1,
      padding: '0!important'
   },
   pagination: {
      width: '20rem!important'
   }
});

interface ISimpleSelectorPros {
   value: IInventoryResource;
   readonly?: boolean;
   itemId: number;
   onChange?(option: IInventoryResource): void;
}

export const InventorySelectorSelector: FC<ISimpleSelectorPros> = ({value, itemId, readonly, onChange}) => {
   const classes = useStyles();
   const [open, setOpen] = useState(false);
   const [searchInput, setSearchInput] = React.useState<string>( '');

   const [fetchInventorItems, { called, loading, data }] = useLazyQuery<{items: ItemsQL}, any>(GET_INVENTORY_ITEMS_BY_ITEM_ID_QL);
   const [inventoryItems, setInventoryItems] = React.useState<IInventoryResource[]>([]);
   const [selectedInventoryItem, setSelectedInventoryItem] = useState<IInventoryResource>(value);

   useEffect(() => {
      setSelectedInventoryItem(value);
   }, [value]);

   useEffect(() => {
      if(open) {
         fetchInventorItems({variables: {itemId}});
      }
   }, [open]);

   useEffect(() => {
      if(data) {
         const newInventoryItems = data.items.item.inventoryItems.content.map(inventoryItem => ({
            inventoryItemId: inventoryItem.inventoryItemId,
            inventoryId: inventoryItem.inventory.inventoryId,
            name: inventoryItem.inventory.name,
            description: inventoryItem.inventory.description
         }));
         setInventoryItems(newInventoryItems);
      }
   }, [called, loading, data]);

   const handOnleSelect = (option: IInventoryResource) => {
      onChange && onChange(option);
      setOpen(false);
   };

   return (
      <>
            <Button aria-controls="simple-selector"
                    aria-haspopup="true"
                    variant="outlined"
                    size="small"
                    disabled={readonly}
                    onClick={()=> setOpen(true)}
                    endIcon={<UnfoldMoreIcon/>}
                    className={classes.root}
            >
               {selectedInventoryItem.name? selectedInventoryItem.name : <h6>&nbsp;</h6>}
            </Button>
         <Dialog onClose={() => setOpen(false)} aria-labelledby="Simple Selector" open={open}>
            <DialogContent className={classes.dialogContent}>
               <MenuList className={classes.optionContent}>
                  { inventoryItems.length === 0? <h6 style={{paddingLeft:'1rem', paddingRight:'1rem'}}>No results</h6>:
                     inventoryItems.map(o => (
                     <MenuItem key={o.name} onClick={() => handOnleSelect(o)}>
                        <Typography variant="inherit">{o.name}</Typography>
                     </MenuItem>
                  ))}
               </MenuList>
            </DialogContent>
         </Dialog>
      </>
   );
};
