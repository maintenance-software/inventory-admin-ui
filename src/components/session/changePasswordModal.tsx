import React, {useState} from 'react';
import './index.scss';
import { useTranslation } from 'react-i18next';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import {
   Button,
   ButtonDropdown,
   Card,
   CardText,
   CardTitle,
   Col,
   DropdownItem,
   DropdownMenu,
   DropdownToggle,
   Form,
   FormFeedback,
   FormGroup, FormText,
   Input,
   Label,
   ListGroup,
   ListGroupItem,
   Modal,
   ModalBody,
   ModalFooter,
   ModalHeader,
   Navbar,
   Row,
   UncontrolledDropdown
} from "reactstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {buildFullName} from "../../utils/globalUtil";
import {useLazyQuery, useMutation, useQuery} from "@apollo/react-hooks";
import {GET_USER_SESSION_GQL, ISession} from "../../graphql/session.type";
import {IUser, IUsers} from "../../graphql/users.type";
import {GET_USER_BY_ID} from "../users/CreateEditPerson/CreateEditUser";
import {faPencilRuler} from "@fortawesome/free-solid-svg-icons";
import {gql} from 'apollo-boost';
import {date} from "yup";

const CHANGE_PASSWORD = gql`
  query changePassword($userId: Int!, $password: String!, $newPassword: String!) {
    users {
      changePassword(userId: $userId, password: $password, newPassword: $newPassword)
    }
  }
`;

const ChangePasswordModal: React.FC<{authId: number, modal: boolean, setModal: Function}> =  ({authId, modal, setModal}) => {
   const [t, i18n] = useTranslation();
   const { path, url } = useRouteMatch();
   const [changePassword, response] = useLazyQuery<{users: {changePassword: boolean}}, any>(CHANGE_PASSWORD);
   const [password, setPassword] = useState('');
   const [newPassword, setNewPassword] = useState('');
   const [confirmNewPassword, setConfirmNewPassword] = useState('');

   const toggle = () => setModal(!modal);
   const onUpdatePassword = () => {
      changePassword({ variables: {userId: authId, password, newPassword}});
   };
   if(response && response.data && response.data.users.changePassword ) {
      toggle();
   }
   // const { called, loading, data } = useQuery<{users: IUsers}, any>(GET_USER_BY_ID, {variables: { userId: authId}});
   return (
      <Modal isOpen={modal} toggle={toggle}>
         <ModalHeader toggle={toggle}>Change Password</ModalHeader>
         <ModalBody>
            <Form>
               <FormGroup>
                  <Label for="password">Current Password</Label>
                  <Input type='password' value={password} onChange={e => setPassword(e.target.value)}/>
               </FormGroup>
               <FormGroup>
                  <Label for="new-password">New Password</Label>
                  <Input type='password' value={newPassword} onChange={e => setNewPassword(e.target.value)}/>
               </FormGroup>
               <FormGroup>
                  <Label for="confirm-new-password">Confirm New Password</Label>
                  <Input type='password' invalid={!!newPassword && !!confirmNewPassword && (newPassword !== confirmNewPassword)} value={confirmNewPassword} onChange={e => setConfirmNewPassword(e.target.value)}/>
                  <FormFeedback>Password does not match</FormFeedback>
               </FormGroup>
            </Form>
         </ModalBody>
         <ModalFooter>
            {response && response.data && !response.data.users.changePassword ? <p className='text-danger'>An error occurred</p>:''}
            <Button
               color="success"
               disabled={!password || !newPassword || !confirmNewPassword || (newPassword != confirmNewPassword)}
               onClick={onUpdatePassword}
            >Save</Button>{' '}
            <Button color="danger" onClick={toggle}>Cancel</Button>
         </ModalFooter>
      </Modal>
   );
};
export default ChangePasswordModal;
