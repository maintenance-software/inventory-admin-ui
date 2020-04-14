import React, {FC, FormEvent} from 'react';
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
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import {useHistory} from "react-router";
import {useRouteMatch} from "react-router-dom";
import Button from '@material-ui/core/Button';
import {SearchInput} from '../../SearchInput/SearchInput';
import {TablePaginationActions} from '../../../utils/TableUtils';
import IconButton from '@material-ui/core/IconButton';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import {IMaintenancePlan} from "../../../graphql/Maintenance.type";

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
   title: {
      flex: '1 1 100%',
   }
});

interface EquipmentProps {
   maintenances: IMaintenancePlan[];
   pageIndex: number;
   pageSize: number;
   totalCount: number;
   searchString?: string;
   onChangePage?(event: React.MouseEvent<HTMLButtonElement> | null, newPage: number): void;
   onChangeRowsPerPage?(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void;
   onSearchMaintenancePlan?(searchString: string) : void;
   onAddMaintenancePlan?(): void;
   onEditMaintenancePlan?(maintenance: IMaintenancePlan): void;
}

export const MaintenancePlanComp_: FC<EquipmentProps> = ({maintenances, pageIndex, pageSize, totalCount, searchString, onChangePage, onChangeRowsPerPage, onSearchMaintenancePlan, onAddMaintenancePlan, onEditMaintenancePlan}) => {
   const history = useHistory();
   const classes = useStyles2();
   const buttonClasses = useButtonStyles();
   const [searchInput, setSearchInput] = React.useState<string>(searchString || '');
   const onSearch = (event: FormEvent) => {
      event.preventDefault();
      onSearchMaintenancePlan && onSearchMaintenancePlan(searchInput);
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
                  onClick={onAddMaintenancePlan}
               >
                  Add
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
            <Table stickyHeader size="small">
               <TableHead>
                  <TableRow>
                     <TableCell>Name</TableCell>
                     <TableCell>Description</TableCell>
                     <TableCell>Status</TableCell>
                     <TableCell align="center">Options</TableCell>
                  </TableRow>
               </TableHead>
               <TableBody>
                  {maintenances.map((row: IMaintenancePlan, index) => (
                     <TableRow key={row.maintenanceId} hover>
                        <TableCell>{row.name}</TableCell>
                        <TableCell>{row.description}</TableCell>
                        <TableCell>{row.status}</TableCell>
                        <TableCell align="center">
                           <ButtonGroup variant="text" size="small" color="primary" aria-label="text primary button group">
                              <IconButton onClick={() => onEditMaintenancePlan && onEditMaintenancePlan(row)} aria-label="edit equipment" component="span">
                                 <EditIcon/>
                              </IconButton>
                           </ButtonGroup>
                        </TableCell>
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
