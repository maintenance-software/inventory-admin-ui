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
import {useLazyQuery, useQuery} from "@apollo/react-hooks";
import {GET_USER_SESSION_GQL, ISession} from "../../graphql/session.type";
import {IUsers} from "../../graphql/users.type";
import {GET_USER_BY_ID} from "../users/CreateEditPerson/CreateEditUser";
import {faPencilRuler} from "@fortawesome/free-solid-svg-icons";
import ChangePasswordModal from "./changePasswordModal";

const UserProfile: React.FC<{firstName: string, lastName: string}> =  (props) => {
   const [t, i18n] = useTranslation();
   const { path, url } = useRouteMatch();
   const sessionQL = useQuery<{session: ISession}, any>(GET_USER_SESSION_GQL);
   const authId = sessionQL && sessionQL.data && +sessionQL.data.session.authId;
   const { called, loading, data } = useQuery<{users: IUsers}, any>(GET_USER_BY_ID, {variables: { userId: authId}});
   const [modal, setModal] = useState(false);

   if (loading)
      return <div>Loading</div>;
   const user = data && data.users.user;
   return (
      <div className='w-100'>
         <Card body className='mb-1'>
            <CardTitle className='font-weight-bold'>PROFILE</CardTitle>
            <ListGroup flush>
               <ListGroupItem>
                  <Row className='w-100'>
                     <Col md='3'>PHOTO</Col>
                     <Col>A photo helps personalize your account</Col>
                     <Col md='3' className='d-flex justify-content-end'>change</Col>
                  </Row>
               </ListGroupItem>
               <ListGroupItem>
                  <Row className='w-100'>
                     <Col md='3'>FIRST NAME</Col>
                     <Col className='font-weight-bold'>{user && user.person.firstName }</Col>
                     <Col md='3' className='d-flex justify-content-end'><Button color='light'><FontAwesomeIcon icon='edit'/></Button></Col>
                  </Row>
               </ListGroupItem>
               <ListGroupItem>
                  <Row className='w-100'>
                     <Col md='3'>LAST NAME</Col>
                     <Col className='font-weight-bold'>{user && user.person.lastName}</Col>
                     <Col md='3' className='d-flex justify-content-end'><Button color="light"><FontAwesomeIcon icon='edit'/></Button></Col>
                  </Row>
               </ListGroupItem>
               <ListGroupItem>
                  <Row className='w-100'>
                     <Col md='3'>USERNAME</Col>
                     <Col>{(user && user.username)}</Col>
                     <Col md='3' className='d-flex justify-content-end'><Button disabled color="light"><FontAwesomeIcon icon='edit'/></Button></Col>
                  </Row>
               </ListGroupItem>
               <ListGroupItem>
                  <Row className='w-100'>
                     <Col md='3'>PASSWORD</Col>
                     <Col>{(user && user.password) || '**********'}</Col>
                     <Col md='3' className='d-flex justify-content-end'>
                        <Button color="light" onClick={() => setModal(true)}><FontAwesomeIcon icon='edit'/></Button>
                     </Col>
                  </Row>
               </ListGroupItem>

            </ListGroup>
         </Card>
         <Card body>
            <CardTitle className='font-weight-bold'>CONTACT INFO</CardTitle>
            <ListGroup flush>
               <ListGroupItem>
                  <Row className='w-100'>
                     <Col md='3'>Email</Col>
                     <Col className='font-weight-bold'>{user && user.email}</Col>
                     <Col md='3' className='d-flex justify-content-end'><Button color="light"><FontAwesomeIcon icon='edit'/></Button></Col>
                  </Row>
               </ListGroupItem>
               <ListGroupItem>
                  <Row className='w-100'>
                     <Col md='3'>Cell Phone</Col>
                     <Col className='font-weight-bold'>{user && user.email}</Col>
                     <Col md='3' className='d-flex justify-content-end'><Button color="light"><FontAwesomeIcon icon='edit'/></Button></Col>
                  </Row>
               </ListGroupItem>
               <ListGroupItem>
                  <Row className='w-100'>
                     <Col md='3'>Work Phone</Col>
                     <Col className='font-weight-bold'>{user && user.email}</Col>
                     <Col md='3' className='d-flex justify-content-end'><Button color="light"><FontAwesomeIcon icon='edit'/></Button></Col>
                  </Row>
               </ListGroupItem>
            </ListGroup>
         </Card>
         <ChangePasswordModal authId={authId || 0} modal={modal} setModal={setModal}/>
      </div>


   );
};
export default UserProfile;
