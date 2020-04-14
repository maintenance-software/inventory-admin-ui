import React, {useState} from 'react';
import './index.scss';
import { useTranslation } from 'react-i18next';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import {
   Button,
   ButtonDropdown,
   DropdownItem,
   DropdownMenu,
   DropdownToggle, ListGroup, ListGroupItem,
   Navbar,
   UncontrolledDropdown
} from "reactstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {buildFullName} from "../../utils/globalUtil";

const UserSettings: React.FC<{firstName: string, lastName: string}> =  (props) => {
  const [t, i18n] = useTranslation();
  const { path, url } = useRouteMatch();
   const [dropdownOpen, setOpen] = useState(false);

   const toggle = () => setOpen(!dropdownOpen);

   return (
      <ListGroup flush>
         <ListGroupItem disabled tag="a" href="#">User Settins</ListGroupItem>
         <ListGroupItem tag="a" href="#">Dapibus ac facilisis in</ListGroupItem>
         <ListGroupItem tag="a" href="#">Morbi leo risus</ListGroupItem>
         <ListGroupItem tag="a" href="#">Porta ac consectetur ac</ListGroupItem>
         <ListGroupItem tag="a" href="#">Vestibulum at eros</ListGroupItem>
      </ListGroup>
   );
};
export default UserSettings;
