import React, { useState, FC, FormEvent } from 'react';
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
import {EmployeeChooserComp} from "../Assets/Commons/PersonChooser/EmployeeChooserComp";
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import {SearchInput} from "../SearchInput/SearchInput";
import Grid from '@material-ui/core/Grid';
import UnfoldMoreIcon from '@material-ui/icons/UnfoldMore';
import {ISimplePerson} from "../Assets/Commons/PersonChooser/PersonChooser";
import {TablePaginationActions} from "../../utils/TableUtils";
import TablePagination from '@material-ui/core/TablePagination';
import Box from '@material-ui/core/Box';
import {ISimpleSelectorOption} from "./CommonTypes";

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
   value: string | number;
   options: ISimpleSelectorOption[];
   readonly?: boolean;
   onChange?(v: string | number): void;
   paging?: {
      pageIndex: number;
      pageSize: number;
      totalCount: number;
      searchString: string;
      onChangePage(event: React.MouseEvent<HTMLButtonElement> | null, newPage: number): void;
      onSearch(searchString: string) : void;
   };
}

export const SimpleSelector: FC<ISimpleSelectorPros> = ({value, options, readonly, onChange, paging}) => {
   const classes = useStyles();
   const [open, setOpen] = useState(false);
   const [searchInput, setSearchInput] = React.useState<string>( '');
   const calcOption = options.find(o => o.value === value);


   const onSearch = (event: FormEvent) => {
      event.preventDefault();
      paging && paging.onSearch(searchInput);
   };

   const handOnleSelect = (v: string | number) => {
      onChange && onChange(v);
      setOpen(false);
   };

   return (
      <>
            <Button aria-controls="simple-selector"
                    aria-haspopup="true"
                    variant="outlined"
                    disabled={readonly}
                    onClick={()=> setOpen(true)}
                    endIcon={<UnfoldMoreIcon/>}
                    className={classes.root}
            >
               {calcOption? calcOption.label : <h6>&nbsp;</h6>}
            </Button>
         <Dialog onClose={() => setOpen(false)} aria-labelledby="Simple Selector" open={open}>
            <DialogContent className={classes.dialogContent}>
               <Grid style={{margin:'1rem'}}>
                  <form  noValidate autoComplete="off" onSubmit={onSearch}>
                     <SearchInput placeholder="Search" value={searchInput} onChange={(event: React.ChangeEvent<{value: string}>) => setSearchInput(event.target.value)}/>
                  </form>
               </Grid>
               <MenuList className={classes.optionContent}>
                  { options.length === 0? <h6 style={{paddingLeft:'1rem', paddingRight:'1rem'}}>No results</h6>:
                     options.map(o => (
                     <MenuItem onClick={() => handOnleSelect(o.value)}>
                        <Typography variant="inherit">{o.label}</Typography>
                     </MenuItem>
                  ))}
               </MenuList>
               {paging && paging.totalCount >= 10 ?
                  <TablePagination
                     className={classes.pagination}
                     component="div"
                     labelRowsPerPage=''
                     rowsPerPageOptions={[]}
                     count={paging.totalCount}
                     rowsPerPage={paging.pageSize}
                     page={paging.pageIndex}
                     onChangePage={paging.onChangePage || (() =>{})}
                     ActionsComponent={TablePaginationActions}
                  />
                  : ''
               }
            </DialogContent>
         </Dialog>
      </>
   );
};