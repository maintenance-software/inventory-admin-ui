import React, {useEffect, FC} from 'react';
import { useLazyQuery } from "@apollo/react-hooks";
import {useRouteMatch} from "react-router-dom";
import {ISimplePerson, PersonChooser} from './PersonChooser';
import {FETCH_EMPLOYEES, IEmployeesQL, PersonQL} from "../../../../graphql/Person.ql";
import {buildFullName} from "../../../../utils/globalUtil";

interface IEmployeeChooserProps {
   multiple: boolean;
   filters: any[];
   disableItems: number[];
   onSelectPerson?(person: ISimplePerson) : void
   onSelectPersons?(person: ISimplePerson[]) : void
}
export const EmployeeChooserComp: FC<IEmployeeChooserProps> = ({disableItems,multiple, filters, onSelectPersons}) => {
   const { path } = useRouteMatch();
   const [pageIndex, setPageIndex] = React.useState(0);
   const [pageSize, setPageSize] = React.useState(10);
   const [searchString, setSearchString] = React.useState<string>('');
   const [fetchEmployees, { called, loading, data }] = useLazyQuery<{employees: IEmployeesQL}, any>(FETCH_EMPLOYEES);

   useEffect(() => {
      fetchEmployees({variables: { searchString, pageIndex: pageIndex, pageSize: pageSize, filters: filters}});
   }, []);

   useEffect(() => {
      fetchEmployees({variables: { searchString, pageIndex: pageIndex, pageSize: pageSize, filters: filters}});
   }, [pageIndex, pageSize, searchString]);

   if (loading || !data) return <div>Loading</div>;

   const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
      setPageIndex(newPage);
   };

   const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setPageSize(parseInt(event.target.value, 10));
      setPageIndex(0);
   };

   const handleSearchPersons = (searchString: string) => {
      setSearchString(searchString);
      setPageIndex(0);
   };

   const handleSelectPerson = (persons: ISimplePerson[]) => {
      console.log(persons)
   };

   return <PersonChooser
      persons= {data.employees.page.content.map(e => ({
         personId: e.employeeId,
         fullName: buildFullName(e.firstName, e.lastName),
         documentId: e.documentId
      }))}
      multiple={multiple}
      disablePersons={disableItems}
      pageIndex = {data.employees.page.pageInfo.pageIndex}
      pageSize = {data.employees.page.pageInfo.pageSize}
      totalCount = {data.employees.page.totalCount}
      searchString = {searchString}
      onSelectPerson= {onSelectPersons || handleSelectPerson}
      onChangePage = {handleChangePage}
      onChangeRowsPerPage = {handleChangeRowsPerPage}
      onSearchPerson = {handleSearchPersons}
   />;
};
