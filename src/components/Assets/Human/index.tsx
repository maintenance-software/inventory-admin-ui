import React, {useEffect} from 'react';
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
import {gql} from 'apollo-boost';
import {useLazyQuery} from "@apollo/react-hooks";
import {IUsers} from "../../../graphql/users.type";
import {IPerson} from "../../../graphql/persons.type";
import {IPage} from "../../../graphql/page.type";
import Grid from "@material-ui/core/Grid/Grid";
import Checkbox from "@material-ui/core/Checkbox/Checkbox";
import Button from "@material-ui/core/Button/Button";
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import AddIcon from '@material-ui/icons/Add';
import ListIcon from '@material-ui/icons/List';
import EditIcon from '@material-ui/icons/Edit';
import InputBase from "@material-ui/core/InputBase/InputBase";
import SearchIcon from '@material-ui/icons/Search';
import Divider from "@material-ui/core/Divider/Divider";
import {SearchInput} from "../../SearchInput/SearchInput";




export const FETCH_PERSONS_GQL = gql`
  query fetchPersons($pageIndex: Int, $pageSize: Int){
    persons {
      page(searchString: "", pageIndex: $pageIndex, pageSize: $pageSize) {
         totalCount
         content {
            personId
            documentId
            firstName
            lastName
         }
         pageInfo {
            hasNext
            hasPreview
            pageSize
            pageIndex
         }
      }
    }
  }
`;

const useStyles1 = makeStyles((theme: Theme) =>
   createStyles({
      root: {
         flexShrink: 0,
         marginLeft: theme.spacing(2.5),
      },
   }),
);

const useButtonStyles = makeStyles(theme => ({
   button: {
      margin: theme.spacing(1),
   },
}));

const useSearchInputStyles = makeStyles((theme: Theme) =>
   createStyles({
      root: {
         padding: '0',
         margin: '0',
         display: 'flex',
         alignItems: 'center',
         // width: '30rem',
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

const useStyles2 = makeStyles({
   root: {
      width: '100%',
   },
   container: {
      height: '31rem',
   },
});

export const HumanResourceComp: React.FC = () => {
   const classes = useStyles2();
   const [pageIndex, setPageIndex] = React.useState(0);
   const [pageSize, setPageSize] = React.useState(5);
   const buttonClasses = useButtonStyles();
   const searchInputClasses = useSearchInputStyles();
   const [fetchPersons, { called, loading, data }] = useLazyQuery<{persons: {page: IPage<IPerson>}}, any>(FETCH_PERSONS_GQL);
   useEffect(() => {
      fetchPersons({variables: { pageIndex: pageIndex, pageSize: pageSize}});
   }, []);

   useEffect(() => {
      fetchPersons({variables: { pageIndex: pageIndex, pageSize: pageSize}});
   }, [pageIndex, pageSize]);

   if (loading || !data) return <div>Loading</div>;

   // const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

   const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
      setPageIndex(newPage);
   };

   const handleChangeRowsPerPage = (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
   ) => {
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
                     <TableCell>Document Id</TableCell>
                     <TableCell>First Name</TableCell>
                     <TableCell>Last Name</TableCell>
                     <TableCell component="th">CARGO</TableCell>
                  </TableRow>
               </TableHead>
               <TableBody>
                  {data.persons.page.content.map(row => (
                     <TableRow key={row.personId}>
                        <TableCell style={{padding: '0'}}>
                           <Checkbox
                              edge="end"
                              color='default'
                              style={{paddingTop: '0', paddingBottom: '0'}}
                              inputProps={{ 'aria-labelledby': 'checkbox-list-secondary-label-0' }}
                           />
                        </TableCell>
                        <TableCell>{row.documentId}</TableCell>
                        <TableCell>{row.firstName}</TableCell>
                        <TableCell>{row.lastName}</TableCell>
                        <TableCell>{'Optional'}</TableCell>
                     </TableRow>
                  ))}
               </TableBody>
            </Table>
         </TableContainer>
         <TablePagination
            rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
            colSpan={3}
            count={data.persons.page.totalCount}
            rowsPerPage={data.persons.page.pageInfo.pageSize}
            page={data.persons.page.pageInfo.pageIndex}
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
