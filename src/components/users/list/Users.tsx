import React, { useEffect, FormEvent } from 'react';
import './Users.scss';
import EditIcon from '@material-ui/icons/Edit';
import { useTranslation } from 'react-i18next';
import ListIcon from '@material-ui/icons/List';
import {UserQL, UsersQL, GET_USERS_GQL} from "../../../graphql/User.ql";
import {SearchInput} from "../../SearchInput/SearchInput";
import {useHistory} from "react-router";
import Container from '@material-ui/core/Container';
import {EquipmentQL} from "../../../graphql/Equipment.ql";
import {TablePaginationActions} from "../../../utils/TableUtils";
import Grid from '@material-ui/core/Grid';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import TablePagination from '@material-ui/core/TablePagination';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import makeStyles from "@material-ui/core/styles/makeStyles";
import Table from '@material-ui/core/Table';


const useButtonStyles = makeStyles(theme => ({
   button: {
      margin: theme.spacing(1),
   }
}));

interface IUserProps {
   users: UserQL[];
   pageIndex: number;
   pageSize: number;
   totalCount: number;
   searchString?: string;
   onChangePage?(event: React.MouseEvent<HTMLButtonElement> | null, newPage: number): void;
   onChangeRowsPerPage?(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void;
   onSearchUser?(searchString: string) : void;
   onAddUser?(): void;
   onEditUser?(user: UserQL): void;
}


export const Users: React.FC<IUserProps> =  ({ users
                                    , pageIndex
                                    , pageSize
                                    , totalCount
                                    , searchString
                                    , onChangePage
                                    , onChangeRowsPerPage
                                    , onSearchUser
                                    , onAddUser
                                    , onEditUser
}) => {
   const [t, i18n] = useTranslation();
   const history = useHistory();
   const buttonClasses = useButtonStyles();
   const [searchInput, setSearchInput] = React.useState<string>(searchString || '');
   const onSearch = (event: FormEvent) => {
      event.preventDefault();
      onSearchUser && onSearchUser(searchInput);
   };

  return (
    <>
       <Container maxWidth="md">
          <Grid container direction="row" justify="flex-start" wrap='nowrap'>
             <Grid container wrap='nowrap'>
                <Button
                   variant="contained"
                   color="primary"
                   size="small"
                   startIcon={<AddIcon/>}
                   className={buttonClasses.button}
                   onClick={onAddUser}
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
          <TableContainer>
             <Table stickyHeader size="small">
                <TableHead>
                   <TableRow>
                      <TableCell>User</TableCell>
                      <TableCell>Roles</TableCell>
                      <TableCell>Privilegios</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="center">Options</TableCell>
                   </TableRow>
                </TableHead>
                <TableBody>
                   {users.map((row: UserQL, index) => (
                      <TableRow key={row.userId} hover>
                         <TableCell>{row.username}</TableCell>
                         <TableCell>{row.roles}</TableCell>
                         <TableCell>{row.roles}</TableCell>
                         <TableCell>{row.status}</TableCell>
                         <TableCell align="center">
                            <ButtonGroup variant="text" size="small" color="primary" aria-label="text primary button group">
                               <IconButton onClick={() => onEditUser && onEditUser(row)} aria-label="edit equipment" component="span">
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

       </Container>
    </>
  );
};
