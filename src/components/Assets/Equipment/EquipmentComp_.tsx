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
import {IEquipment} from "../../../graphql/equipment.type";
import {SearchInput} from '../../SearchInput/SearchInput';
import {TablePaginationActions} from '../../../utils/TableUtils';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import VisibilityIcon from '@material-ui/icons/Visibility';
import Switch from '@material-ui/core/Switch';
import {EntityStatus} from "../../../graphql/users.type";

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
   equipments: IEquipment[];
   pageIndex: number;
   pageSize: number;
   totalCount: number;
   searchString?: string;
   treePath: IEquipment[];
   onChangePage?(event: React.MouseEvent<HTMLButtonElement> | null, newPage: number): void;
   onChangeRowsPerPage?(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void;
   onSearchEquipment?(searchString: string) : void;
   onExpand?(equipment: IEquipment): void;
   onBreadcrumbs?(index: number): void;
   onAddEquipment?(): void;
   onEditEquipment?(equipment: IEquipment): void;
}

export const EquipmentComp_: FC<EquipmentProps> = ({equipments, pageIndex, pageSize, totalCount, searchString, treePath, onChangePage, onChangeRowsPerPage, onSearchEquipment, onExpand, onBreadcrumbs, onAddEquipment, onEditEquipment}) => {
   const history = useHistory();
   const classes = useStyles2();
   const buttonClasses = useButtonStyles();
   const [searchInput, setSearchInput] = React.useState<string>(searchString || '');
   const onSearch = (event: FormEvent) => {
      event.preventDefault();
      onSearchEquipment && onSearchEquipment(searchInput);
   };

   return (
      <Paper className={classes.root}>
         <Grid container direction="row" justify="flex-start" wrap='nowrap'>
            <Breadcrumbs aria-label="breadcrumb">
                  <Button size="small" onClick={()=> onBreadcrumbs && onBreadcrumbs(-1)} color="primary">Home</Button>
                  {treePath.map((e, index) => <Button style={{padding: 0, width: 'auto'}} key={index} size="small" onClick={()=> onBreadcrumbs && onBreadcrumbs(index)} color="primary">{e.name}</Button>)}
            </Breadcrumbs>
         </Grid>
         <Grid container direction="row" justify="flex-start" wrap='nowrap'>
            <Grid container wrap='nowrap'>
               <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  startIcon={<AddIcon/>}
                  className={buttonClasses.button}
                  onClick={onAddEquipment}
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
                     <TableCell>Code</TableCell>
                     <TableCell>Name</TableCell>
                     <TableCell>Description</TableCell>
                     <TableCell align="center">Options</TableCell>
                  </TableRow>
               </TableHead>
               <TableBody>
                  {equipments.map((row: IEquipment, index) => (
                     <TableRow key={row.equipmentId} hover>
                        <TableCell>{row.code}</TableCell>
                        <TableCell>{row.name}</TableCell>
                        <TableCell>{row.description}</TableCell>
                        <TableCell align="center">
                           <ButtonGroup variant="text" size="small" color="primary" aria-label="text primary button group">
                              <IconButton onClick={() => onExpand && onExpand(row)} aria-label="show item" component="span">
                                 <VisibilityIcon/>
                              </IconButton>
                              <IconButton onClick={() => onEditEquipment && onEditEquipment(row)} aria-label="edit equipment" component="span">
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
