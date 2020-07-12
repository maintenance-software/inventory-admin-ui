import React, {FC, FormEvent} from 'react';
import makeStyles from "@material-ui/core/styles/makeStyles";
import TableContainer from "@material-ui/core/TableContainer/TableContainer";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TablePagination from "@material-ui/core/TablePagination/TablePagination";
import TableRow from '@material-ui/core/TableRow';
import DeleteIcon from '@material-ui/icons/Delete';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import Grid from "@material-ui/core/Grid/Grid";
import EditIcon from '@material-ui/icons/Edit';
import {useHistory} from "react-router";
import VisibilityIcon from '@material-ui/icons/Visibility';
import WorkIcon from '@material-ui/icons/Work';
import AssignmentIcon from '@material-ui/icons/Assignment';
import {SearchInput} from '../../../SearchInput/SearchInput';
import {TablePaginationActions} from '../../../../utils/TableUtils';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import IconButton from '@material-ui/core/IconButton';
import Checkbox from '@material-ui/core/Checkbox';
import {IWorkOrder, IWorkQueueEquipment} from "../WorkOrderTypes";
import ButtonGroup from '@material-ui/core/ButtonGroup';

const useButtonStyles = makeStyles(theme => ({
   button: {
      margin: theme.spacing(0.25),
      // paddingLeft: '.25rem',
      // paddingRight: '.25rem',
   }
}));

const useStyles2 = makeStyles(theme => ({
   root: {
      width: '100%',
      margin: theme.spacing(2),
   },
   container: {
      // margin: theme.spacing(1)
   },
   title: {
      flex: '1 1 100%',
   }
}));

const useRowStyles = makeStyles({
   root: {
      '& > *': {
         borderBottom: 'unset',
      },
   },
   noBorder: {
      border: 'none'
   },
   noBottomBorder: {
      borderBottom: 'none'
   }
});

interface IWorkOrdersProps {
   workOrders: IWorkOrder[];
   pageIndex: number;
   pageSize: number;
   totalCount: number;
   searchString?: string;
   workOrderSelected: number[];
   onChangePage?(event: React.MouseEvent<HTMLButtonElement> | null, newPage: number): void;
   onChangeRowsPerPage?(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void;
   onSearchWorkOrder?(searchString: string) : void;
   onWorkOrder(workOrderId: number): void;
}

export const WorkOrders: FC<IWorkOrdersProps> = ({workOrders, pageIndex, pageSize, totalCount, searchString, workOrderSelected, onChangePage, onChangeRowsPerPage, onSearchWorkOrder, onWorkOrder}) => {
   const history = useHistory();
   const classes = useStyles2();
   const buttonClasses = useButtonStyles();
   const [searchInput, setSearchInput] = React.useState<string>(searchString || '');
   const onSearch = (event: FormEvent) => {
      event.preventDefault();
      onSearchWorkOrder && onSearchWorkOrder(searchInput);
   };

   const CustomRow: FC<IWorkOrder> = (props) => {
      const [open, setOpen] = React.useState(false);
      const classes = useRowStyles();
      return (
         <>
            <TableRow>
               <TableCell style={{paddingLeft: '.5rem'}}>
                  <IconButton size="small" onClick={() => setOpen(!open)}>
                     {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                  </IconButton>
                  {props.workOrderCode}
               </TableCell>
               <TableCell>{props.workOrderStatus}</TableCell>
               <TableCell>{props.responsibleName}</TableCell>
               <TableCell>{props.estimateDuration}</TableCell>
               <TableCell>{props.executionDuration}</TableCell>
               <TableCell>{props.rate}</TableCell>
               <TableCell>{props.percentage}</TableCell>
               <TableCell>
                  <ButtonGroup variant="text" color="primary" aria-label="text primary button group">
                     <IconButton size="small" color="default" onClick={() => onWorkOrder(props.workOrderId)}><VisibilityIcon/></IconButton>
                     <IconButton size="small" color="default"><EditIcon/></IconButton>
                     <IconButton size="small" color="secondary"><DeleteIcon/></IconButton>
                  </ButtonGroup>
               </TableCell>
            </TableRow>
            {open && props.equipments.map((historyRow, index) => (
               <TableRow key={historyRow.equipmentId}>
                  <TableCell colSpan={7} style={{paddingLeft: '2.5rem'}}>{historyRow.name} ({historyRow.code})</TableCell>
               </TableRow>
            ))}
         </>
      );
   };

   return (
      <Grid className={classes.root}>
         <Grid container direction="row" justify="flex-start" wrap='nowrap'>
            <Grid container alignItems='center' justify='flex-end' style={{paddingRight:'.5rem'}}>
               <form  noValidate autoComplete="off" onSubmit={onSearch}>
                  <SearchInput placeholder="Search" value={searchInput} onChange={(event: React.ChangeEvent<{value: string}>) => setSearchInput(event.target.value)}/>
               </form>
            </Grid>
         </Grid>

         <TableContainer className={classes.container}>
            <Table stickyHeader aria-label="collapsible table" size="small">
               <TableHead>
                  <TableRow>
                     <TableCell>Work Order Code</TableCell>
                     <TableCell>Status</TableCell>
                     <TableCell>Responsible</TableCell>
                     <TableCell>E. Duration</TableCell>
                     <TableCell>E. Execution</TableCell>
                     <TableCell>Rate</TableCell>
                     <TableCell>Percentage</TableCell>
                     <TableCell/>
                  </TableRow>
               </TableHead>
               <TableBody>
                  {workOrders.map((row) => (
                     <CustomRow key={row.workOrderId} {...row} />
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
      </Grid>
   );
};
