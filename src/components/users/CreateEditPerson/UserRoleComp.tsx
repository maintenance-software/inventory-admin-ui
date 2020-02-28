import React, {useEffect, useState} from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { gql } from 'apollo-boost';
import {useLazyQuery, useMutation, useQuery} from "@apollo/react-hooks";
import "react-toggle/style.css"
import {EntityStatus, IRole, IUser, IUsers} from "../../../graphql/users.type";
import EditUserForm, {UserForm} from "./CreateEditUserForm";
import {useHistory} from "react-router";
import Select from 'react-select';
import {boolean} from "yup";
import {Button, Card, CardTitle, Col, Form, FormGroup, Input, Label, ListGroup, ListGroupItem, Row} from "reactstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Toggle from "react-toggle";

export const GET_ROLES = gql`
  query fetchRoles{
    roles {
      list {
         roleId
         key
         name
      }
    }
  }
`;

interface IUserRoleProps {
   userRoles: IRole[];
}


const UserRoleComp: React.FC<IUserRoleProps> =  (props) => {
   const [t, i18n] = useTranslation();
   const params = useParams();
   const history = useHistory();
   const { called, loading, data } = useQuery<{roles: {list: IRole[]}}, any>(GET_ROLES);

   const [ownRoles, setOwnRoles] = useState(props.userRoles.map(r => ({ value: r.roleId, label: r.name})));
   const [selectedOwnRole, setSelectedOwnRole] = useState<{ value: number, label: string} | null>(null);
   const [availableRoles, setAvailableRoles] = useState<{ value: number, label: string}[]>([]);
   const [selectedAvailableRole, setSelectedAvailableRole] = useState<{ value: number, label: string} | null>(null);

   const handleOwnRoleChange = (selectedOption: any) => setSelectedOwnRole(selectedOption);
   const handleAvailableChange = (selectedOption: any) => setSelectedAvailableRole(selectedOption);

   const onAssignAllRoles = () => {
      setAvailableRoles([]);
      if(data) {
         setOwnRoles(data.roles.list.map(r => ({ value: r.roleId, label: r.name})));
      }
   };

   const onUnassignAllRoles = () => {
      setOwnRoles([]);
      if (data) {
         setAvailableRoles(data.roles.list.map(r => ({ value: r.roleId, label: r.name})));
      }
   };

   const onAssignSingleRole = () => {
      if(data && selectedAvailableRole) {
         const tempOwnRoles = ownRoles.concat(selectedAvailableRole);
         setOwnRoles(tempOwnRoles);
         setAvailableRoles(data.roles.list.filter(r => !tempOwnRoles.find(ur => ur.value === r.roleId)).map(r => ({ value: r.roleId, label: r.name})));
         setSelectedAvailableRole(null);
      }
   };

   const onUnassignSingleRole = () => {
      if(data && selectedOwnRole) {
         const tempOwnRoles = ownRoles.filter(r => r.value !== selectedOwnRole.value);
         setOwnRoles(tempOwnRoles);
         setAvailableRoles(data.roles.list.filter(r => !tempOwnRoles.find(ur => ur.value === r.roleId)).map(r => ({ value: r.roleId, label: r.name})));
         setSelectedOwnRole(null);
      }
   };

  useEffect(() => {
     if(data) {
        setAvailableRoles(data.roles.list.filter(r => !props.userRoles.find(ur => ur.roleId === r.roleId)).map(r => ({ value: r.roleId, label: r.name})));
     }
  }, [data]);


   if (loading || !data)
      return <div>Loading</div>;



   // const availableRoles = data.roles.list.filter(r => !props.userRoles.find(ur => ur.roleId === r.roleId)).map(r => ({ value: r.roleId, label: r.name}));
   // const ownRoles = props.userRoles.map(r => ({ value: r.roleId, label: r.name}));

   const customControlStyles = (base: any) => ({
      fontSize: '1.4rem'
   });

  return (
    <div>
       <Form>
          <Row className='flex-nowrap' style={{height: '25rem', width:'50rem'}}>
             <Col>
                <FormGroup>
                   <Label for="exampleEmail">Roles</Label>
                   <Select
                      options={availableRoles}
                      onChange={handleAvailableChange}
                      menuIsOpen
                      isSearchable
                   />
                </FormGroup>
             </Col>
             <Col md='auto' xs='auto' className='d-flex flex-column my-auto mx-0 px-0'>
                <Button disabled={availableRoles.length === 0} onClick={onAssignAllRoles} color="light" className='mb-1' size="sm"><FontAwesomeIcon icon="angle-double-right"/></Button>
                <Button disabled={!selectedAvailableRole} onClick={onAssignSingleRole} color="light" className='mb-1' size="sm"><FontAwesomeIcon icon="angle-right"/></Button>
                <Button disabled={!selectedOwnRole} onClick={onUnassignSingleRole} color="light" className='mb-1' size="sm"><FontAwesomeIcon icon="angle-left"/></Button>
                <Button disabled={ownRoles.length === 0} onClick={onUnassignAllRoles} color="light" className='mb-1' size="sm"><FontAwesomeIcon icon="angle-double-left"/></Button>
             </Col>
             <Col>
                <FormGroup>
                   <Label for="exampleEmail">Assigned Roles</Label>
                   <Select
                      options={ownRoles}
                      onChange={handleOwnRoleChange}
                      menuIsOpen
                      isSearchable
                   />
                </FormGroup>
             </Col>
          </Row>

       </Form>

    </div>
  );
};
export default UserRoleComp;
