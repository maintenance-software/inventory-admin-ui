import React, {useEffect} from 'react';
import { useTranslation } from 'react-i18next';
import makeStyles from "@material-ui/core/styles/makeStyles";
import {createStyles, Theme} from "@material-ui/core";
import TableContainer from "@material-ui/core/TableContainer/TableContainer";
import Table from "@material-ui/core/Table/Table";
import TableBody from "@material-ui/core/TableBody/TableBody";
import TablePagination from "@material-ui/core/TablePagination/TablePagination";
import TableRow from "@material-ui/core/TableRow/TableRow";
import Paper from '@material-ui/core/Paper';

import TableCell from "@material-ui/core/TableCell/TableCell";
import TableHead from "@material-ui/core/TableHead/TableHead";
import {gql} from 'apollo-boost';
import {useLazyQuery} from "@apollo/react-hooks";
import Grid from "@material-ui/core/Grid/Grid";
import Checkbox from "@material-ui/core/Checkbox/Checkbox";
import Button from "@material-ui/core/Button/Button";
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import AddIcon from '@material-ui/icons/Add';
import ListIcon from '@material-ui/icons/List';
import EditIcon from '@material-ui/icons/Edit';
import {SearchInput} from "../../SearchInput/SearchInput";
import { TablePaginationActions } from "../../../utils/TableUtils";
import {FETCH_ITEMS_GQL, IItem, IItems} from "../../../graphql/item.type";

const useButtonStyles = makeStyles(theme => ({
   button: {
      margin: theme.spacing(1),
   }
}));

const useSearchInputStyles = makeStyles((theme: Theme) =>
   createStyles({
      root: {
         padding: '0',
         margin: '0',
         display: 'flex',
         alignItems: 'center',
      },
      input: {
         marginLeft: theme.spacing(1),
         flex: 1,
      },
      iconButton: {
         padding: 10,
      },
      divider: {
         height: 28,
         margin: 4,
      },
   }),
);

const useStyles2 = makeStyles({
   root: {
      width: '100%',
   },
   container: {
      height: '31rem',
   },
});

export const ToolsResourceComp: React.FC = () => {
   const classes = useStyles2();
   const [pageIndex, setPageIndex] = React.useState(0);
   const [pageSize, setPageSize] = React.useState(5);
   const buttonClasses = useButtonStyles();
   const [fetchPersons, { called, loading, data }] = useLazyQuery<{items: IItems}, any>(FETCH_ITEMS_GQL);
   useEffect(() => {
      fetchPersons({variables: { pageIndex: pageIndex, pageSize: pageSize, filters: [{field: "itemType",operator: "=", value: "TOOLS"}]}});
   }, []);

   useEffect(() => {
      fetchPersons({variables: { pageIndex: pageIndex, pageSize: pageSize}});
   }, [pageIndex, pageSize]);

   if (loading || !data) return <div>Loading</div>;

   const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
      setPageIndex(newPage);
   };

   const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setPageSize(parseInt(event.target.value, 10));
      setPageIndex(0);
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
               >
                  Add
               </Button>
               <Button
                  variant="contained"
                  color="default"
                  size="small"
                  startIcon={<EditIcon/>}
                  className={buttonClasses.button}
               >
                  Edit
               </Button>
               <Button
                  variant="contained"
                  color="secondary"
                  size='small'
                  startIcon={<CancelIcon/>}
                  className={buttonClasses.button}
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
               <SearchInput placeholder="Search"/>
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
                        />
                     </TableCell>
                     <TableCell>Code</TableCell>
                     <TableCell>Name</TableCell>
                     <TableCell>Manufacturer</TableCell>
                     <TableCell>Model</TableCell>
                     <TableCell>Part Number</TableCell>
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
                              inputProps={{ 'aria-labelledby': 'checkbox-list-secondary-label-0' }}
                           />
                        </TableCell>
                        <TableCell>{row.code}</TableCell>
                        <TableCell>{row.name}</TableCell>
                        <TableCell>{row.manufacturer}</TableCell>
                        <TableCell>{row.model}</TableCell>
                        <TableCell>{row.partNumber}</TableCell>
                     </TableRow>
                  ))}
               </TableBody>
            </Table>
         </TableContainer>
         <TablePagination
            rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
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
