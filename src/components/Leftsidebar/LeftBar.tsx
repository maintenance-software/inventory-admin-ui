import React from 'react';
import ImageIcon from '@material-ui/icons/Image';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import HistoryIcon from '@material-ui/icons/History';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import PeopleIcon from '@material-ui/icons/People';
import HomeIcon from '@material-ui/icons/Home';
import AcUnitIcon from '@material-ui/icons/AcUnit';
import BuildIcon from '@material-ui/icons/Build';
import HomeWorkIcon from '@material-ui/icons/HomeWork';
import StoreIcon from '@material-ui/icons/Store';
import RestoreIcon from '@material-ui/icons/Restore';
import PermDataSettingIcon from '@material-ui/icons/PermDataSetting';
import WatchLaterIcon from '@material-ui/icons/WatchLater';
import WorkIcon from '@material-ui/icons/Work';
import InsertChartIcon from '@material-ui/icons/InsertChart';
import SettingsIcon from '@material-ui/icons/Settings';
import Popover from '@material-ui/core/Popover';
import { Link, useLocation, useParams } from 'react-router-dom';
import {useTranslation} from "react-i18next";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MailIcon from '@material-ui/icons/Mail';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import ListSubheader from '@material-ui/core/ListSubheader';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import StarBorder from '@material-ui/icons/StarBorder';
import Collapse from '@material-ui/core/Collapse';
import { OverridableComponent } from '@material-ui/core/OverridableComponent';
import { SvgIconTypeMap } from '@material-ui/core/SvgIcon';
import Divider from '@material-ui/core/Divider';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import {ISession} from "../../graphql/session.type";
import {buildFullName} from "../../utils/globalUtil";
import FormControl from '@material-ui/core/FormControl';
import InputAdornment from '@material-ui/core/InputAdornment';
import Button from '@material-ui/core/Button';
import Popper from '@material-ui/core/Popper';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';

interface IMenuProps {
   label: string,
   icon: OverridableComponent<SvgIconTypeMap<{}, "svg">>,
   path: string,
   submenus?: IMenuProps[]
}

const useContainerStyle = makeStyles((theme: Theme) =>
   createStyles({
      root: {
         padding: 0,
         margin: 0
      }
   }),
);

const useStyles = makeStyles((theme: Theme) =>
   createStyles({
      root: {
         width: '100%',
         maxWidth: 360,
         backgroundColor: theme.palette.background.paper,
      },
      nested: {
         paddingLeft: theme.spacing(4),
      },
   }),
);

const MENUS = [
   {
      label: 'Home',
      icon: () => <HomeIcon/>,
      path: '/Home'
   },
   {
      label: 'Human Resources',
      icon: () => <PeopleIcon/>,
      path: '/humans'
   },
   {
      label: 'Assets',
      icon: () => <AcUnitIcon/>,
      path: '/assets',
      submenus: [
         {
            label: 'Equipments',
            icon: () => <HomeWorkIcon/>,
            path: '/equipments'
         },
         {
            label: 'Tools',
            icon: () => <BuildIcon/>,
            path: '/tools'
         },
         {
            label: 'Supplies',
            icon: () => <InboxIcon/>,
            path: '/supplies'
         }
      ]
   },
   {
      label: 'Stores',
      icon: () => <StoreIcon/>,
      path: '/inventories',
   },
   {
      label: 'Maintenances',
      icon: () => <PermDataSettingIcon/>,
      path: '/maintenances',
      submenus: [
         {
            label: 'Plans',
            icon: () => <RestoreIcon/>,
            path: '/plans'
         },
         {
            label: 'Pending Work',
            icon: () => <WatchLaterIcon/>,
            path: '/taskActivities'
         },
         {
            label: 'Work Orders',
            icon: () => <WorkIcon/>,
            path: '/work-orders'
         }
      ]
   },
   {
      label: 'Reports',
      icon: () => <InsertChartIcon/>,
      path: '/reports',
   },
   {
      label: 'Settings',
      icon: () => <SettingsIcon/>,
      path: '/settings',
   }
];

export const Leftbar: React.FC<{session: ISession}> = ({session}) => {
  const [t, i18n] = useTranslation();
  let location = useLocation();
   const classes = useStyles();
   const containerStyle = useContainerStyle();
   const [options, setOptions] = React.useState<string[]>([]);
   const handleExpand = (option: string) => {
      const index = options.findIndex(o => o === option);
      if(index === -1) {
         setOptions(options.concat(option));
      } else {
         setOptions(options.filter(o => o !== option));
      }
   };

   const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

   const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
   };

   const handleClose = () => {
      setAnchorEl(null);
   };

   const open = Boolean(anchorEl);
   const id = open ? 'simple-popover' : undefined;

   return (
        <>

           <div>
              <Button
                 aria-describedby={id}
                 startIcon={<Avatar alt={buildFullName(session.firstName, session.lastName)}src="/static/images/avatar/2.jpg"/>}
                 endIcon={<ExpandMore/>}
                 onClick={handleClick}
                 style={{width: '100%'}}
              >
                 <Typography noWrap>{buildFullName(session.firstName, session.lastName)}</Typography>
              </Button>
              <Popover
                 id={id}
                 open={open}
                 anchorEl={anchorEl}
                 onClose={handleClose}
                 anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                 }}
                 transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                 }}
              >
                 <Container className={containerStyle.root}>
                    <MenuList>
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

                       <MenuItem onClick={handleClose} component='a' href="/logout">
                          <ListItemIcon style={{minWidth: '2rem'}}><ExitToAppIcon/></ListItemIcon>
                          <ListItemText primary="Logout" />
                       </MenuItem>
                    </MenuList>

                 </Container>
              </Popover>
           </div>



           <Divider/>
           <List component="nav"
              aria-labelledby="nested-list-subheader"
              className={classes.root}
           >
              {MENUS.map((m, index) => (
                 <>
                    { m.submenus && m.submenus.length > 0?
                       <>
                          <ListItem button onClick={() => handleExpand(index.toString())}>
                             <ListItemIcon style={{minWidth: '2rem'}}>
                                {<m.icon/>}
                             </ListItemIcon>
                             <ListItemText primary={m.label}/>
                             {m.submenus && m.submenus.length > 0 ? !!options.find(o => o === index.toString()) ? <ExpandLess /> : <ExpandMore /> : '' }
                          </ListItem>
                          <Collapse in={!!options.find(o => o === index.toString())} timeout="auto" unmountOnExit>
                             <List component="div" disablePadding>
                                { m.submenus.map(sm => (
                                   <ListItem button component={Link} to={m.path + sm.path} className={classes.nested}>
                                      <ListItemIcon style={{minWidth: '2rem'}}>{<sm.icon/>}</ListItemIcon>
                                      <ListItemText primary={sm.label}/>
                                   </ListItem>
                                ))}
                             </List>
                          </Collapse>
                       </>
                       :
                       <ListItem button component={Link} to={m.path}>
                          <ListItemIcon style={{minWidth: '2rem'}}>
                             {<m.icon/>}
                          </ListItemIcon>
                          <ListItemText primary={m.label}/>
                       </ListItem>
                    }
                 </>
              ))}
           </List>
        </>

    );
};
