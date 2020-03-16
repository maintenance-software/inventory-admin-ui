import React, {useEffect, FormEvent} from 'react';
import { useTranslation } from 'react-i18next';
import makeStyles from "@material-ui/core/styles/makeStyles";
import TableContainer from "@material-ui/core/TableContainer/TableContainer";
import Table from "@material-ui/core/Table/Table";
import TableBody from "@material-ui/core/TableBody/TableBody";
import TablePagination from "@material-ui/core/TablePagination/TablePagination";
import TableRow from "@material-ui/core/TableRow/TableRow";
import Paper from '@material-ui/core/Paper';

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
import {useRouteMatch} from "react-router-dom";
import IconButton from "@material-ui/core/IconButton/IconButton";
import {EntityStatus} from "../../../graphql/users.type";
import {clearCache} from "../../../utils/globalUtil";
import {grapqhQlClient} from "../../../index";

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

export const ToolsResourceComp: React.FC = () => {
   const history = useHistory();
   const { path } = useRouteMatch();
   const classes = useStyles2();
   const [pageIndex, setPageIndex] = React.useState(0);
   const [pageSize, setPageSize] = React.useState(10);
   const [selectedItems, setSelectedItems] = React.useState<number[]>([]);
   const [searchString, setSearchString] = React.useState<string>('');
   const buttonClasses = useButtonStyles();
   const [fetchItemTools, { called, loading, data }] = useLazyQuery<{items: IItems}, any>(FETCH_ITEMS_GQL);
   const [changeItemStatus, changeStatusResponse] = useMutation<{items: IItems}, any>(CHANGE_ITEM_STATUS);
   const defaultFilters = [{field: "status",operator: "=", value: "ACTIVE"}, {field: "itemType",operator: "=", value: "TOOLS"}];

   useEffect(() => {
      fetchItemTools({variables: { pageIndex: pageIndex, pageSize: pageSize, filters: defaultFilters}});
   }, []);

   useEffect(() => {
      fetchItemTools({variables: { pageIndex: pageIndex, pageSize: pageSize, filters: defaultFilters}});
   }, [pageIndex, pageSize]);

   if (loading || !data) return <div>Loading</div>;

   const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
      setPageIndex(newPage);
   };

   const onDeleteItems = (event: React.MouseEvent<HTMLButtonElement>) => {
      changeItemStatus({variables: {itemIds: selectedItems, status: EntityStatus.INACTIVE }
         , update: (cache) => clearCache(cache, 'items.page')
      }).then((changeStatusResponse) => {
         if(changeStatusResponse.data && changeStatusResponse.data.items.changeItemStatus) {
            fetchItemTools({variables: { pageIndex: pageIndex, pageSize: pageSize, filters: defaultFilters}});
            setSelectedItems([]);
         }
      });
   };

   const onSearch = (event: FormEvent) => {
      event.preventDefault();
      clearCache(grapqhQlClient.cache, 'items.page');
      // fetchItemTools({variables: { searchString, pageIndex: pageIndex, pageSize: pageSize, filters: defaultFilters}});
      fetchItemTools({variables: { searchString, filters: defaultFilters}});
   };

   const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setPageSize(parseInt(event.target.value, 10));
      setPageIndex(0);
   };

   const handleChangeSelectedItem = (event: React.ChangeEvent<HTMLInputElement>) => {
      const itemId = parseInt(event.target.value, 10);
      if (event.target.checked) {
         if (itemId === -1) {
            setSelectedItems(data.items.page.content.map(i => i.itemId));
         } else {
            setSelectedItems(selectedItems.concat(itemId));
         }
      } else {
         if (parseInt(event.target.value, 10) === -1) {
            setSelectedItems([]);
         } else {
            setSelectedItems(selectedItems.filter(i => i !== itemId));
         }
      }
   };

   return (
      <Paper className={classes.root}>
         <Grid container direction="row" justify="flex-start" wrap='nowrap'>
            <Grid container wrap='nowrap'>
               <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  startIcon={<AddIcon/>}
                  className={buttonClasses.button}
                  onClick={() => history.push(path + '/' + 0)}
               >
                  Add
               </Button>
               <Button
                  variant="contained"
                  color="default"
                  size="small"
                  startIcon={<EditIcon/>}
                  disabled={selectedItems.length !== 1}
                  className={buttonClasses.button}
                  onClick={() => history.push(path + '/' + selectedItems[0])}
               >
                  Edit
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
                  <SearchInput placeholder="Search" value={searchString} onChange={(event: React.ChangeEvent<{value: string}>) => setSearchString(event.target.value)}/>
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
                           onChange = {handleChangeSelectedItem}
                        />
                     </TableCell>
                     <TableCell>Code</TableCell>
                     <TableCell>Name</TableCell>
                     <TableCell>Manufacturer</TableCell>
                     <TableCell>Model</TableCell>
                     <TableCell>Part Number</TableCell>
                     <TableCell/>
                  </TableRow>
               </TableHead>
               <TableBody>
                  {data.items.page.content.map((row: IItem) => (
                     <TableRow key={row.itemId}>
                        <TableCell style={{padding: '0'}}>
                           <Checkbox
                              edge="end"
                              color='default'
                              style={{paddingTop: '0', paddingBottom: '0'}}
                              value={row.itemId}
                              checked = {!!selectedItems.find(r => r === row.itemId)}
                              inputProps={{ 'aria-labelledby': 'checkbox-list-secondary-label-0' }}
                              onChange = {handleChangeSelectedItem}
                           />
                        </TableCell>
                        <TableCell>{row.code}</TableCell>
                        <TableCell>{row.name}</TableCell>
                        <TableCell>{row.manufacturer}</TableCell>
                        <TableCell>{row.model}</TableCell>
                        <TableCell>{row.partNumber}</TableCell>
                        <TableCell style={{padding: '0'}}>
                           <IconButton
                              onClick={() => history.push(path + '/' + row.itemId)}
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
            rowsPerPageOptions={[5, 10, 25, 50, 100]}
            colSpan={3}
            count={data.items.page.totalCount}
            rowsPerPage={data.items.page.pageInfo.pageSize}
            page={data.items.page.pageInfo.pageIndex}
            SelectProps={{
               inputProps: { 'aria-label': 'rows per page' },
               native: true,
            }}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
            ActionsComponent={TablePaginationActions}
         />
      </Paper>
   );
};
