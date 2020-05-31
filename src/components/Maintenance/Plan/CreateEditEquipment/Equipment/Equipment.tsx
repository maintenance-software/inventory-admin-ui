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
import IconButton from '@material-ui/core/IconButton';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import {TablePaginationActions} from "../../../../../utils/TableUtils";
import {TaskQL} from "../../../../../graphql/Maintenance.ql";
import TableFooter from '@material-ui/core/TableFooter';
import {EquipmentQL} from "../../../../../graphql/Equipment.ql";

const useBottomNoneBorder = makeStyles({
   root: {
      borderBottom: "none"
   }
});

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
   equipments: EquipmentQL[];
   onAddEquipment(): void;
   // onChangePage?(event: React.MouseEvent<HTMLButtonElement> | null, newPage: number): void;
   // onChangeRowsPerPage?(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void;
   // onSearchMaintenancePlan?(searchString: string) : void;
   // onAddMaintenancePlan?(): void;
   // onEditMaintenancePlan?(maintenance: IMaintenancePlan): void;
}

export const Equipment: FC<EquipmentProps> = ({equipments, onAddEquipment }) => {
   const history = useHistory();
   const classes = useStyles2();
   const bottomNoneBoder = useBottomNoneBorder();
   const buttonClasses = useButtonStyles();

   return (
      <Paper className={classes.root}>
         <TableContainer className={classes.container}>
            <Table size="small">
               <TableHead>
                  <TableRow>
                     <TableCell>Code</TableCell>
                     <TableCell>Name</TableCell>
                     <TableCell>Description</TableCell>
                  </TableRow>
               </TableHead>
               <TableBody>
                  {equipments.map((row: EquipmentQL, index) => (
                     <TableRow key={row.equipmentId} hover>
                        <TableCell>{row.code}</TableCell>
                        <TableCell>{row.name}</TableCell>
                        <TableCell>{row.description}</TableCell>
                     </TableRow>
                  ))}
               </TableBody>
               <TableFooter>
                  <TableRow>
                     <TableCell  colSpan={4} className={bottomNoneBoder.root}>
                        <Button
                           variant="contained"
                           color="default"
                           size="small"
                           startIcon={<AddIcon/>}
                           onClick={()=> onAddEquipment()}
                        >
                           Add
                        </Button>
                     </TableCell>
                  </TableRow>
               </TableFooter>
            </Table>
         </TableContainer>
      </Paper>
   );
};
