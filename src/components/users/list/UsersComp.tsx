import React, {useEffect, useContext} from 'react';
import { useLazyQuery } from "@apollo/react-hooks";
import {useHistory} from "react-router";
import {useRouteMatch} from "react-router-dom";
import {GET_USERS_GQL, UserQL, UsersQL} from "../../../graphql/User.ql";
import {Users} from "./Users";

export const UserComp: React.FC = () => {
   const history = useHistory();
   const { path } = useRouteMatch();
   const [pageIndex, setPageIndex] = React.useState(0);
   const [pageSize, setPageSize] = React.useState(10);
   const [searchString, setSearchString] = React.useState<string>('');
   const [fetchUsers, { called, loading, data }] = useLazyQuery<{users: UsersQL}, any>(GET_USERS_GQL);

   useEffect(() => {
      fetchUsers({variables: { searchString, pageIndex: pageIndex, pageSize: pageSize }});
   }, []);


   if (loading || !data) return <div>Loading</div>;

   const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
      setPageIndex(newPage);
   };

   const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setPageSize(parseInt(event.target.value, 10));
      setPageIndex(0);
   };

   const handleSearch = (searchString: string) => {
      setSearchString(searchString);
      setPageIndex(0);
   };

   return <Users
      users={data.users.list}
      totalCount={100}
      pageIndex={0}
      pageSize={10}
      searchString={searchString}
      onChangePage={handleChangePage}
      onChangeRowsPerPage={handleChangeRowsPerPage}
      onSearchUser={handleSearch}
      onAddUser={() => history.push(path + '/' + 0)}
      onEditUser={(user: UserQL) => history.push(path + '/' + user.userId)}
   />;
};
