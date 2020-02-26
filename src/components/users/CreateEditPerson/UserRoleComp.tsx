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
import {Button, Card, CardTitle, Col, ListGroup, ListGroupItem, Row} from "reactstrap";
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
   const [selectedOptions, setSelectedOptions] = useState(props.userRoles.map(r => ({ value: r.roleId, label: r.name})));
   const handleChange = (selectedOption: any) => {
      setSelectedOptions(selectedOption);
   };

  useEffect(() => {}, []);

   if (loading || !data)
      return <div>Loading</div>;

   const options = data.roles.list.map(r => ({ value: r.roleId, label: r.name}));

  return (
    <div>



       <ListGroup flush>
             {data.roles.list.map(r => {
               return (
                  <ListGroupItem>
                     <Row>
                        <Col md='3'>{r.name}</Col>
                        <Col md='3' className='d-flex justify-content-end'>
                           <Toggle icons={false}/>
                        </Col>
                     </Row>
                  </ListGroupItem>
               )
             })}
       </ListGroup>
    </div>
  );
};
export default UserRoleComp;
