import React, {useState} from 'react';
import './index.scss';
import { useTranslation } from 'react-i18next';
import {Link, Route, Switch, useRouteMatch} from 'react-router-dom';
import SettingsIcon from '@material-ui/icons/Settings';
import HistoryIcon from '@material-ui/icons/History';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import {buildFullName} from "../../utils/globalUtil";
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Popper from '@material-ui/core/Popper';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import MenuList from '@material-ui/core/MenuList';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';

const UserAccount: React.FC<{firstName: string, lastName: string}> =  (props) => {
  const [t, i18n] = useTranslation();
  const { path, url } = useRouteMatch();
   const [open, setOpen] = React.useState(false);
   const anchorRef = React.useRef<HTMLButtonElement>(null);

   const handleToggle = () => {
      setOpen((prevOpen) => !prevOpen);
   };

   const handleClose = (event: React.MouseEvent<EventTarget>) => {
      if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
         return;
      }
      setOpen(false);
   };

   function handleListKeyDown(event: React.KeyboardEvent) {
      if (event.key === 'Tab') {
         event.preventDefault();
         setOpen(false);
      }
   }

   return (
      <>
         <IconButton ref={anchorRef}
                     aria-controls={open ? 'menu-list-grow' : undefined}
                     aria-haspopup="true"
                     size="small"
                     onClick={handleToggle}>
            <AccountCircleIcon fontSize="large" />
         </IconButton>
         <Popper open={open}
                 anchorEl={anchorRef.current}
                 role={undefined}
                 transition
                 disablePortal
         >
            {({ TransitionProps, placement }) => (
               <Grow
                  {...TransitionProps}
                  style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
               >
                  <Paper elevation={24}>
                     <ClickAwayListener onClickAway={handleClose}>
                        <MenuList subheader={<ListSubheader>{buildFullName(props.firstName, props.lastName)}</ListSubheader>} autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                           <MenuItem onClick={handleClose} component={Link} to="/session/profile">
                              <ListItemIcon style={{minWidth: '2rem'}}><AccountCircleIcon/></ListItemIcon>
                              <ListItemText primary="My Account" />
                           </MenuItem>
                           <MenuItem onClick={handleClose} component={Link} to="/session/settings">
                              <ListItemIcon style={{minWidth: '2rem'}}><SettingsIcon/></ListItemIcon>
                              <ListItemText primary="Settings" />
                           </MenuItem>
                           <MenuItem onClick={handleClose} component={Link} to="/session/profile">
                              <ListItemIcon style={{minWidth: '2rem'}}><HistoryIcon/></ListItemIcon>
                              <ListItemText primary="Activity Logs" />
                           </MenuItem>
                           <MenuItem onClick={handleClose} component={Link} to="/logout">
                              <ListItemIcon style={{minWidth: '2rem'}}><ExitToAppIcon/></ListItemIcon>
                              <ListItemText primary="Logout" />
                           </MenuItem>
                        </MenuList>
                     </ClickAwayListener>
                  </Paper>
               </Grow>
            )}
         </Popper>
         </>
   );
};
export default UserAccount;
