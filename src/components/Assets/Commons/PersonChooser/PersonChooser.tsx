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
   },
   container: {
      height: '25rem',
   },
   title: {
      flex: '1 1 100%',
   }
});

export interface ISimplePerson {
   personId: number;
   fullName: string;
   documentId: string;
}

interface PersonChooserProps {
   persons: ISimplePerson[];
   multiple: boolean;
   disablePersons: number[];
   pageIndex: number;
   pageSize: number;
   totalCount: number;
   searchString?: string;
   onChangePage?(event: React.MouseEvent<HTMLButtonElement> | null, newPage: number): void;
   onChangeRowsPerPage?(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void;
   onSelectPerson?(person: ISimplePerson[]) : void;
   onSearchPerson?(searchString: string) : void;
}

export const PersonChooser: FC<PersonChooserProps> = ({persons, multiple, disablePersons, pageIndex, pageSize, totalCount, searchString, onChangePage, onChangeRowsPerPage, onSelectPerson, onSearchPerson}) => {
   const history = useHistory();
   const classes = useStyles2();
   const buttonClasses = useButtonStyles();
   const [selected, setSelected] = React.useState<ISimplePerson[]>([]);
   const [searchInput, setSearchInput] = React.useState<string>(searchString || '');
   const onSearch = (event: FormEvent) => {
      event.preventDefault();
      onSearchPerson && onSearchPerson(searchInput);
   };

   const handleClick = (event: React.MouseEvent<unknown>, person: ISimplePerson) => {
      const selectedIndex = selected.findIndex(e => e.personId === person.personId);
      if(!multiple) {
         if(selectedIndex === -1) {
            setSelected([person]);
            onSelectPerson && onSelectPerson([person]);
         } else {
            setSelected([])
         }
         return;
      }

      let newSelected: ISimplePerson[] = [];
      if (selectedIndex === -1) {
         newSelected = selected.concat(person);
      } else {
         newSelected = selected.filter(e => e.personId !== person.personId);
      }
      setSelected(newSelected);
      onSelectPerson && onSelectPerson(newSelected);
   };

   const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.checked) {
         setSelected(persons);
         onSelectPerson && onSelectPerson(persons);
         return;
      }
      setSelected([]);
      onSelectPerson && onSelectPerson([]);
   };

   return (
      <Paper className={classes.root}>
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
                           indeterminate={selected.length > 0 && selected.length < persons.length}
                           checked={persons.length > 0 && selected.length === persons.length}
                           onChange={handleSelectAllClick}
                           inputProps={{ 'aria-label': 'select all desserts' }}
                        />
                     </TableCell>
                     <TableCell>Name</TableCell>
                     <TableCell>Document Id</TableCell>
                  </TableRow>
               </TableHead>
               <TableBody>
                  {persons.map((row: ISimplePerson, index) => (
                     <TableRow
                        hover
                        onClick={event => (!disablePersons.find(personId => personId === row.personId)) && handleClick(event, row)}
                        role="checkbox"
                        aria-checked={!!selected.find(person => person.personId === row.personId)}
                        tabIndex={-1}
                        key={row.personId}
                        selected={!!selected.find(person => person.personId === row.personId)}
                     >
                        <TableCell padding="checkbox">
                           <Checkbox
                              color='default'
                              disabled={!!disablePersons.find(personId => personId === row.personId)}
                              checked={!!selected.find(person => person.personId === row.personId)}
                              inputProps={{ 'aria-labelledby': row.personId.toString() }}
                           />
                        </TableCell>
                        <TableCell>{row.fullName}</TableCell>
                        <TableCell>{row.documentId}</TableCell>
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
      </Paper>
   );
};
