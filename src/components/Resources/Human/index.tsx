import React from 'react';
import { useTranslation } from 'react-i18next';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import makeStyles from "@material-ui/core/styles/makeStyles";
import {createStyles, Theme} from "@material-ui/core";
import useTheme from "@material-ui/core/styles/useTheme";
import IconButton from "@material-ui/core/IconButton/IconButton";
import {KeyboardArrowLeft, KeyboardArrowRight} from "@material-ui/icons";
import TableContainer from "@material-ui/core/TableContainer/TableContainer";
import Table from "@material-ui/core/Table/Table";
import TableBody from "@material-ui/core/TableBody/TableBody";
import TablePagination from "@material-ui/core/TablePagination/TablePagination";
import TableRow from "@material-ui/core/TableRow/TableRow";
import Paper from '@material-ui/core/Paper';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import LastPageIcon from '@material-ui/icons/LastPage';
import TableCell from "@material-ui/core/TableCell/TableCell";
import TableFooter from "@material-ui/core/TableFooter/TableFooter";
import TableHead from "@material-ui/core/TableHead/TableHead";

export const HumanResourceComp1: React.FC =  () => {
   const [t, i18n] = useTranslation();
   const { path, url } = useRouteMatch();
   return (
      <div>test page 2</div>
   );
};



const useStyles1 = makeStyles((theme: Theme) =>
   createStyles({
      root: {
         flexShrink: 0,
         marginLeft: theme.spacing(2.5),
      },
   }),
);

interface TablePaginationActionsProps {
   count: number;
   page: number;
   rowsPerPage: number;
   onChangePage: (event: React.MouseEvent<HTMLButtonElement>, newPage: number) => void;
}

function TablePaginationActions(props: TablePaginationActionsProps) {
   const classes = useStyles1();
   const theme = useTheme();
   const { count, page, rowsPerPage, onChangePage } = props;

   const handleFirstPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      onChangePage(event, 0);
   };

   const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      onChangePage(event, page - 1);
   };

   const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      onChangePage(event, page + 1);
   };

   const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
   };

   return (
      <div className={classes.root}>
         <IconButton
            onClick={handleFirstPageButtonClick}
            disabled={page === 0}
            aria-label="first page"
         >
            {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
         </IconButton>
         <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
            {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
         </IconButton>
         <IconButton
            onClick={handleNextButtonClick}
            disabled={page >= Math.ceil(count / rowsPerPage) - 1}
            aria-label="next page"
         >
            {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
         </IconButton>
         <IconButton
            onClick={handleLastPageButtonClick}
            disabled={page >= Math.ceil(count / rowsPerPage) - 1}
            aria-label="last page"
         >
            {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
         </IconButton>
      </div>
   );
}

function createData(name: string, calories: number, fat: number) {
   return { name, calories, fat };
}

const rows = [
   createData('Cupcake', 305, 3.7),
   createData('Donut', 452, 25.0),
   createData('Eclair', 262, 16.0),
   createData('Frozen yoghurt', 159, 6.0),
   createData('Gingerbread', 356, 16.0),
   createData('Honeycomb', 408, 3.2),
   createData('Ice cream sandwich', 237, 9.0),
   createData('Jelly Bean', 375, 0.0),
   createData('KitKat', 518, 26.0),
   createData('Lollipop', 392, 0.2),
   createData('Marshmallow', 318, 0),
   createData('Nougat', 360, 19.0),
   createData('Oreo', 437, 18.0),
].sort((a, b) => (a.calories < b.calories ? -1 : 1));

const useStyles2 = makeStyles({
   table: {
      minWidth: 500,
   },
});

export const HumanResourceComp: React.FC = () => {
   const classes = useStyles2();
   const [page, setPage] = React.useState(0);
   const [rowsPerPage, setRowsPerPage] = React.useState(5);

   const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

   const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
      setPage(newPage);
   };

   const handleChangeRowsPerPage = (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
   ) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
   };

   return (
      <TableContainer component={Paper}>
         <Table className={classes.table} aria-label="custom pagination table">
            <TableHead>
               <TableRow>
                  <TableCell>Dessert (100g serving)</TableCell>
                  <TableCell align="right">Calories</TableCell>
                  <TableCell align="right">Fat&nbsp;(g)</TableCell>
               </TableRow>
            </TableHead>
            <TableBody>
               {(rowsPerPage > 0
                     ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                     : rows
               ).map(row => (
                  <TableRow key={row.name}>
                     <TableCell>{row.name}</TableCell>
                     <TableCell align="right">{row.calories}</TableCell>
                     <TableCell align="right">{row.fat}</TableCell>
                  </TableRow>
               ))}
               {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                     <TableCell colSpan={6} />
                  </TableRow>
               )}
            </TableBody>
            <TableFooter>
               <TableRow>
                  <TablePagination
                     rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                     colSpan={3}
                     count={rows.length}
                     rowsPerPage={rowsPerPage}
                     page={page}
                     SelectProps={{
                        inputProps: { 'aria-label': 'rows per page' },
                        native: true,
                     }}
                     onChangePage={handleChangePage}
                     onChangeRowsPerPage={handleChangeRowsPerPage}
                     ActionsComponent={TablePaginationActions}
                  />
               </TableRow>
            </TableFooter>
         </Table>
      </TableContainer>
   );
};
