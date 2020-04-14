import React, {useState} from 'react';
import './index.scss';
import { useTranslation } from 'react-i18next';
import {Link, Route, Switch, useRouteMatch} from 'react-router-dom';
import {
   Button,
   ButtonDropdown,
   DropdownItem,
   DropdownMenu,
   DropdownToggle,
   Navbar,
   UncontrolledDropdown
} from "reactstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {buildFullName} from "../../utils/globalUtil";

const UserAccount: React.FC<{firstName: string, lastName: string}> =  (props) => {
  const [t, i18n] = useTranslation();
  const { path, url } = useRouteMatch();
   const [dropdownOpen, setOpen] = useState(false);

   const toggle = () => setOpen(!dropdownOpen);

   return (
      <ButtonDropdown isOpen={dropdownOpen} toggle={toggle} className='rounded'>
         <DropdownToggle className='rounded-circle border-0'>
            <FontAwesomeIcon icon='user'/>
         </DropdownToggle>
         <DropdownMenu>
            <DropdownItem header>{buildFullName(props.firstName, props.lastName)}</DropdownItem>
            <DropdownItem><Link to='/session/profile' style={{textDecoration: 'none', color: 'black'}}><FontAwesomeIcon icon='user-edit' fixedWidth />   My Account</Link></DropdownItem>
            <DropdownItem><Link to='/session/settings' style={{textDecoration: 'none', color: 'black'}}><FontAwesomeIcon icon='cogs' fixedWidth />   Settings</Link></DropdownItem>
            <DropdownItem><Link to='/session/profile' style={{textDecoration: 'none', color: 'black'}}><FontAwesomeIcon icon='list' fixedWidth />   Activity Logs</Link></DropdownItem>
            <DropdownItem divider />
            <DropdownItem><a href='/logout' style={{textDecoration: 'none', color: 'black'}}><FontAwesomeIcon icon='sign-out-alt' fixedWidth />   Logout</a></DropdownItem>
         </DropdownMenu>
      </ButtonDropdown>
   );
};
export default UserAccount;
