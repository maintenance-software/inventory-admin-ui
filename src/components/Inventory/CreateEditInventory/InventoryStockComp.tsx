import React, {useEffect, FormEvent} from 'react';
import { useTranslation } from 'react-i18next';
import makeStyles from "@material-ui/core/styles/makeStyles";
import TableContainer from "@material-ui/core/TableContainer/TableContainer";
import Table from "@material-ui/core/Table/Table";
import TableBody from "@material-ui/core/TableBody/TableBody";
import TablePagination from "@material-ui/core/TablePagination/TablePagination";
import TableRow from "@material-ui/core/TableRow/TableRow";
import Paper from '@material-ui/core/Paper';
import {useParams, useRouteMatch} from 'react-router-dom';
import TableCell from "@material-ui/core/TableCell/TableCell";
import TableHead from "@material-ui/core/TableHead/TableHead";
import { useLazyQuery, useMutation } from "@apollo/react-hooks";
import Grid from "@material-ui/core/Grid/Grid";
import Checkbox from "@material-ui/core/Checkbox/Checkbox";
import Button from "@material-ui/core/Button/Button";
import VisibilityIcon from '@material-ui/icons/Visibility';
import CancelIcon from '@material-ui/icons/Cancel';
import AddIcon from '@material-ui/icons/Add';
import ListIcon from '@material-ui/icons/List';
import EditIcon from '@material-ui/icons/Edit';
import {SearchInput} from "../../SearchInput/SearchInput";
import { TablePaginationActions } from "../../../utils/TableUtils";
import {CHANGE_ITEM_STATUS, FETCH_ITEMS_GQL, IItem, IItems} from "../../../graphql/item.type";
import {useHistory} from "react-router";
import IconButton from "@material-ui/core/IconButton/IconButton";
import {EntityStatus} from "../../../graphql/users.type";
import {clearCache} from "../../../utils/globalUtil";
import {grapqhQlClient} from "../../../index";
import {FETCH_INVENTORY_ITEMS, IInventories, IInventoryItem} from "../../../graphql/inventory.type";
import {EditInventoryItemForm, IInventoryItemForm} from "./CreateInventoryItemForm";
import Dialog from '@material-ui/core/Dialog';
import {DialogContent} from '@material-ui/core';

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
      height: '31rem',
   },
});

export const InventoryStockComp: React.FC = () => {
   const history = useHistory();
   const { path } = useRouteMatch();
   const params = useParams();
   const classes = useStyles2();
   const [pageIndex, setPageIndex] = React.useState(0);
   const [pageSize, setPageSize] = React.useState(10);
   const [selectedInventoryItems, setSelectedInventoryItems] = React.useState<number[]>([]);
   const [searchInput, setSearchInput] = React.useState<string>('');
   const [searchString, setSearchString] = React.useState<string>('');
   const [open, setOpen] = React.useState(false);
   const [selectedItems, setSelectedItems] = React.useState<number[]>([]);
   const buttonClasses = useButtonStyles();
   const [fetchInventoryItems, { called, loading, data }] = useLazyQuery<{inventories: IInventories}, any>(FETCH_INVENTORY_ITEMS);
   // const [changeItemStatus] = useMutation<{items: IItems}, any>(CHANGE_ITEM_STATUS);
   // const defaultFilters = [{field: "status",operator: "=", value: "ACTIVE"}, {field: "itemType",operator: "=", value: "TOOLS"}];
   const inventoryId = +params.inventoryId;

   useEffect(() => {
      fetchInventoryItems({variables: {inventoryId }});
   }, []);

   useEffect(() => {
      fetchInventoryItems({variables: {inventoryId }});
   }, [open, pageIndex, pageSize, searchString]);

   if (loading || !data) return <div>Loading</div>;

   const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
      setPageIndex(newPage);
   };

   const onDeleteItems = (event: React.MouseEvent<HTMLButtonElement>) => {
      // changeItemStatus({variables: {itemIds: selectedItems, status: EntityStatus.INACTIVE }
      //    , update: (cache) => clearCache(cache, 'items.page')
      // }).then((changeStatusResponse) => {
      //    if(changeStatusResponse.data && changeStatusResponse.data.items.changeItemStatus) {
      //       fetchItemTools({variables: { pageIndex: pageIndex, pageSize: pageSize, filters: defaultFilters}});
      //       setSelectedItems([]);
      //    }
      // });
   };

   const onSearch = (event: FormEvent) => {
      event.preventDefault();
      clearCache(grapqhQlClient.cache, 'items.page');
      // fetchItemTools({variables: { searchString, pageIndex: 0, pageSize: pageSize, filters: defaultFilters}});
      setPageIndex(0);
      setSearchString(searchInput);
      // fetchItemTools({variables: { searchString, filters: defaultFilters}});
   };

   const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setPageSize(parseInt(event.target.value, 10));
      setPageIndex(0);
   };

   const handleChangeSelectedInventoryItem = (event: React.ChangeEvent<HTMLInputElement>) => {
      const itemId = parseInt(event.target.value, 10);
      if (event.target.checked) {
         if (itemId === -1) {
            setSelectedInventoryItems(data.inventories.inventory.inventoryItems.content.map(i => i.inventoryItemId));
         } else {
            setSelectedInventoryItems(selectedInventoryItems.concat(itemId));
         }
      } else {
         if (parseInt(event.target.value, 10) === -1) {
            setSelectedInventoryItems([]);
         } else {
            setSelectedInventoryItems(selectedInventoryItems.filter(i => i !== itemId));
         }
      }
   };

   const handleSelectItems = (items: IItem[]) => {
      setSelectedItems(items.map(item => item.itemId));
   };

   const handleSaveInventoryItem = (inventoryItemForm?: IInventoryItemForm) => {
       // console.log(inventoryId);
       // console.log(selectedItems);
      setOpen(false);
       console.log(inventoryItemForm);
   };

   return (
      <>
         <Paper className={classes.root}>
            <Grid container direction="row" justify="flex-start" wrap='nowrap'>
               <Grid container wrap='nowrap'>
                  <Button
                     variant="contained"
                     color="primary"
                     size="small"
                     startIcon={<AddIcon/>}
                     className={buttonClasses.button}
                     onClick={() => setOpen(true)}
                  >
                     Add
                  </Button>
                  <Button
                     variant="contained"
                     color="secondary"
                     size='small'
                     startIcon={<CancelIcon/>}
                     className={buttonClasses.button}
                     disabled={selectedItems.length === 0}
                     onClick={onDeleteItems}
                  >
                     Delete
                  </Button>
                  <Button
                     variant="contained"
                     color="default"
                     size='small'
                     startIcon={<ListIcon/>}
                     className={buttonClasses.button}
                  >
                     Options
                  </Button>
               </Grid>
               <Grid container alignItems='center' justify='flex-end' style={{paddingRight:'.5rem'}}>
                  <form  noValidate autoComplete="off" onSubmit={onSearch}>
                     <SearchInput placeholder="Search" value={searchInput} onChange={(event: React.ChangeEvent<{value: string}>) => setSearchInput(event.target.value)}/>
                  </form>
               </Grid>
            </Grid>

            <TableContainer className={classes.container}>
               <Table stickyHeader>
                  <TableHead>
                     <TableRow style={{padding: '0'}}>
                        <TableCell style={{padding: '0'}}>
                           <Checkbox
                              edge="end"
                              color='default'
                              style={{paddingTop: '0', paddingBottom: '0'}}
                              inputProps={{ 'aria-labelledby': 'checkbox-list-secondary-label-0' }}
                              value={-1}
                              onChange = {handleChangeSelectedInventoryItem}
                           />
                        </TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Level</TableCell>
                        <TableCell>Max Level</TableCell>
                        <TableCell>Min Level</TableCell>
                        <TableCell>Location</TableCell>
                        <TableCell/>
                     </TableRow>
                  </TableHead>
                  <TableBody>
                     {data.inventories.inventory.inventoryItems.content.map((row: IInventoryItem) => (
                        <TableRow key={row.inventoryItemId}>
                           <TableCell style={{padding: '0'}}>
                              <Checkbox
                                 edge="end"
                                 color='default'
                                 style={{paddingTop: '0', paddingBottom: '0'}}
                                 value={row.inventoryItemId}
                                 checked = {!!selectedItems.find(r => r === row.inventoryItemId)}
                                 inputProps={{ 'aria-labelledby': 'checkbox-list-secondary-label-0' }}
                                 onChange = {handleChangeSelectedInventoryItem}
                              />
                           </TableCell>
                           <TableCell>{row.item.name}</TableCell>
                           <TableCell>{row.item.itemType}</TableCell>
                           <TableCell>{row.level}</TableCell>
                           <TableCell>{row.maxLevelAllowed}</TableCell>
                           <TableCell>{row.minLevelAllowed}</TableCell>
                           <TableCell>{row.location}</TableCell>
                           <TableCell style={{padding: '0'}}>
                              <IconButton
                                 onClick={() => history.push(path + '/' + row.inventoryItemId)}
                                 aria-label="view-item-tool" size="small" className={buttonClasses.button}>
                                 <VisibilityIcon/>
                              </IconButton>
                           </TableCell>
                        </TableRow>
                     ))}
                  </TableBody>
               </Table>
            </TableContainer>
            <TablePagination
               component="div"
               rowsPerPageOptions={[5, 10, 25, 50, 100]}
               colSpan={3}
               count={data.inventories.inventory.inventoryItems.totalCount}
               rowsPerPage={data.inventories.inventory.inventoryItems.pageInfo.pageSize}
               page={data.inventories.inventory.inventoryItems.pageInfo.pageIndex}
               SelectProps={{
                  inputProps: { 'aria-label': 'rows per page' },
                  native: true,
               }}
               onChangePage={handleChangePage}
               onChangeRowsPerPage={handleChangeRowsPerPage}
               ActionsComponent={TablePaginationActions}
            />
         </Paper>
         <Dialog
            open={open}
            onClose={()=> setOpen(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
         >
            <DialogContent>
               <EditInventoryItemForm inventoryId={inventoryId} onSaveInventoryItem={handleSaveInventoryItem} onCancelSaveInventoryItem={() => setOpen(false)}/>
            </DialogContent>
         </Dialog>
      </>
   );
};
