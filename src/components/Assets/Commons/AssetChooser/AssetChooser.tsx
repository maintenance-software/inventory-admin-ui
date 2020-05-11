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
import { SearchInput } from "../../../SearchInput/SearchInput";
import { TablePaginationActions } from "../../../../utils/TableUtils";
import { useHistory } from "react-router";
import { useRouteMatch } from "react-router-dom";
import {getItemDefaultInstance, IItem, ItemType} from "../../../../graphql/item.type";
import Button from '@material-ui/core/Button';
import {Checkbox, Typography} from '@material-ui/core';

const useButtonStyles = makeStyles(theme => ({
   button: {
      margin: theme.spacing(1),
   }
}));

const useStyles2 = makeStyles({
   root: {
      width: '100%',
      height: '100%'
   },
   container: {
      // height: '100%',
   },
   title: {
      flex: '1 1 100%',
   }
});

export interface ISimpleItem {
   itemId: number;
   code: string;
   description: string;
   name: string;
}

interface _ItemSelectableProps {
   items: ISimpleItem[];
   multiple: boolean;
   disableItems: number[];
   initialSelected: number[];
   pageIndex: number;
   pageSize: number;
   totalCount: number;
   searchString?: string;
   onChangePage?(event: React.MouseEvent<HTMLButtonElement> | null, newPage: number): void;
   onChangeRowsPerPage?(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void;
   onSelectItem?(item: ISimpleItem[]) : void;
   onSearchItem?(searchString: string) : void;
}

export const AssetChooser: FC<_ItemSelectableProps> = ({items, multiple, disableItems, initialSelected, pageIndex, pageSize, totalCount, searchString, onChangePage, onChangeRowsPerPage, onSelectItem, onSearchItem}) => {
   const history = useHistory();
   const classes = useStyles2();
   const buttonClasses = useButtonStyles();
   const [selected, setSelected] = React.useState<ISimpleItem[]>(items.filter(item => !!initialSelected.find(id => id === item.itemId)));
   const [searchInput, setSearchInput] = React.useState<string>(searchString || '');
   const onSearch = (event: FormEvent) => {
      event.preventDefault();
      onSearchItem && onSearchItem(searchInput);
   };

   useEffect(() => {
      setSelected(items.filter(item => !!initialSelected.find(id => id === item.itemId)));
   }, [initialSelected]);

   const handleClick = (event: React.MouseEvent<unknown>, item: ISimpleItem) => {
      const selectedIndex = selected.findIndex(e => e.itemId === item.itemId);

      if(!multiple) {
         if(selectedIndex === -1) {
            setSelected([item]);
            onSelectItem && onSelectItem([item]);
         } else {
            setSelected([]);
            onSelectItem && onSelectItem([]);
         }
         return;
      }

      let newSelected: ISimpleItem[] = [];
      if (selectedIndex === -1) {
         newSelected = selected.concat(item);
      } else {
         newSelected = selected.filter(e => e.itemId !== item.itemId);
      }
      setSelected(newSelected);
      onSelectItem && onSelectItem(newSelected);
   };

   const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.checked) {
         setSelected(items);
         onSelectItem && onSelectItem(items);
         return;
      }
      setSelected([]);
      onSelectItem && onSelectItem([]);
   };

   return (
      <div className={classes.root}>
         <Grid container direction="row" justify="flex-start" wrap='nowrap'>
            <Grid container wrap='nowrap'>
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
            <Table stickyHeader size="small">
               <TableHead>
                  <TableRow>
                     <TableCell padding="checkbox">
                        <Checkbox
                           hidden={!multiple}
                           indeterminate={selected.length > 0 && selected.length < items.length}
                           checked={items.length > 0 && selected.length === items.length}
                           onChange={handleSelectAllClick}
                           inputProps={{ 'aria-label': 'select all desserts' }}
                        />
                     </TableCell>
                     <TableCell>Code</TableCell>
                     <TableCell>Name</TableCell>
                     <TableCell>Description</TableCell>
                  </TableRow>
               </TableHead>
               <TableBody>
                  {items.map((row: ISimpleItem, index) => (
                     <TableRow
                        hover
                        onClick={event => (!disableItems.find(itemId => itemId === row.itemId)) && handleClick(event, row)}
                        role="checkbox"
                        aria-checked={!!selected.find(item => item.itemId === row.itemId)}
                        tabIndex={-1}
                        key={row.itemId}
                        selected={!!selected.find(item => item.itemId === row.itemId)}
                     >
                        <TableCell padding="checkbox">
                           <Checkbox
                              color='default'
                              disabled={!!disableItems.find(itemId => itemId === row.itemId)}
                              checked={!!selected.find(item => item.itemId === row.itemId)}
                              inputProps={{ 'aria-labelledby': row.itemId.toString() }}
                           />
                        </TableCell>
                        <TableCell>{row.code}</TableCell>
                        <TableCell>{row.name}</TableCell>
                        <TableCell>{row.description}</TableCell>
                     </TableRow>
                  ))}
               </TableBody>
            </Table>
         </TableContainer>
         <TablePagination
            component="div"
            rowsPerPageOptions={[5, 10, 25, 50, 100]}
            count={totalCount}
            rowsPerPage={pageSize}
            page={pageIndex}
            SelectProps={{
               inputProps: { 'aria-label': 'rows per page' },
               native: true,
            }}
            onChangePage={onChangePage || (() =>{})}
            onChangeRowsPerPage={onChangeRowsPerPage}
            ActionsComponent={TablePaginationActions}
         />
      </div>
   );
};
