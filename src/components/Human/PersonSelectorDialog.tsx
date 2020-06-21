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
import {FETCH_EMPLOYEES, IEmployeesQL} from "../../graphql/Person.ql";
import { useLazyQuery } from '@apollo/react-hooks';
import {buildFullName} from "../../utils/globalUtil";

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

export interface ISimpleSelectorOption {
   value: string | number;
   label: string;
   selected?: boolean
}

interface ISimpleSelectorPros {
   value: ISimpleSelectorOption;
   readonly?: boolean;
   onChange?(v: string | number, label: string): void;
}

export const PersonPaginatorSelector: FC<ISimpleSelectorPros> = ({value, readonly, onChange}) => {
   const classes = useStyles();
   const [open, setOpen] = useState(false);
   const [searchInput, setSearchInput] = React.useState<string>( '');
   const [selectedOption, setSelectedOption] = useState<ISimpleSelectorOption>(value);
   const [options, setOptions] = useState<ISimpleSelectorOption[]>([]);
   const [pageIndex, setPageIndex] = React.useState(0);
   const [pageSize, setPageSize] = React.useState(10);
   const [searchString, setSearchString] = React.useState<string>('');
   const [fetchEmployees, { called, loading, data }] = useLazyQuery<{employees: IEmployeesQL}, any>(FETCH_EMPLOYEES);

   useEffect(() => {
      setSelectedOption(value);
   }, [value]);

   useEffect(() => {
      if(open) {
         fetchEmployees({variables: { searchString, pageIndex: pageIndex, pageSize: pageSize}});
      }
   }, [open]);

   useEffect(() => {
      if(open) {
         fetchEmployees({variables: { searchString, pageIndex: pageIndex, pageSize: pageSize}});
      }
   }, [pageIndex, pageSize, searchString]);

   useEffect(() => {
      if(data) {
         const tempOptions: ISimpleSelectorOption[] = data.employees.page.content.map(p => ({
            value: p.employeeId,
            label: buildFullName(p.firstName, p. lastName),
            selected: false
         }));
         setOptions(tempOptions);
      }
   }, [called, loading, data]);

   const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
      setPageIndex(newPage);
   };

   const onSearch = (event: FormEvent) => {
      event.preventDefault();
      setSearchString(searchInput);
   };

   const handOnleSelect = (v: ISimpleSelectorOption) => {
      setSelectedOption(v);
      onChange && onChange(v.value, v.label);
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
               {selectedOption.label? selectedOption.label : <h6>&nbsp;</h6>}
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
                     <MenuItem key={o.value} onClick={() => handOnleSelect(o)}>
                        <Typography variant="inherit">{o.label}</Typography>
                     </MenuItem>
                  ))}
               </MenuList>
               {data && data.employees.page.totalCount >= 10 ?
                  <TablePagination
                     className={classes.pagination}
                     component="div"
                     labelRowsPerPage=''
                     rowsPerPageOptions={[]}
                     count={data.employees.page.totalCount}
                     rowsPerPage={data.employees.page.pageInfo.pageSize}
                     page={data.employees.page.pageInfo.pageIndex}
                     onChangePage={handleChangePage}
                     ActionsComponent={TablePaginationActions}
                  />
                  : ''
               }
            </DialogContent>
         </Dialog>
      </>
   );
};
