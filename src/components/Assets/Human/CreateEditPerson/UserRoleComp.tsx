import React, {useEffect, useState} from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { gql } from 'apollo-boost';
import {useQuery} from "@apollo/react-hooks";
import {useHistory} from "react-router";
import makeStyles from '@material-ui/core/styles/makeStyles';
import {createStyles, Theme} from "@material-ui/core";
import List from "@material-ui/core/List/List";
import ListItemAvatar from "@material-ui/core/ListItemAvatar/ListItemAvatar";
import ListItem from "@material-ui/core/ListItem/ListItem";
import Avatar from "@material-ui/core/Avatar/Avatar";
import ListItemText from "@material-ui/core/ListItemText/ListItemText";
import Divider from "@material-ui/core/Divider/Divider";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction/ListItemSecondaryAction";
import Checkbox from "@material-ui/core/Checkbox/Checkbox";
import Paper from "@material-ui/core/Paper/Paper";
import IconButton from "@material-ui/core/IconButton/IconButton";
import InputBase from "@material-ui/core/InputBase/InputBase";
import SearchIcon from '@material-ui/icons/Search';
import CancelIcon from '@material-ui/icons/Cancel';
import Grid from "@material-ui/core/Grid/Grid";
import Button from "@material-ui/core/Button/Button";
import SaveIcon from '@material-ui/icons/Save';
import {IRole} from "../../../../graphql/users.type";

export const GET_ROLES = gql`
  query fetchRoles{
    roles {
      list {
         roleId
         key
         name
         description
      }
    }
  }
`;

interface IUserRoleProps {
   userRoles: IRole[];
   onSaveUserRoles: Function;
}

const useStyles = makeStyles((theme: Theme) =>
   createStyles({
      root: {
         width: '100%',
         maxWidth: '40rem',
         padding: '0',
         marginTop: '.5rem',
         backgroundColor: theme.palette.background.paper,
      },
      inline: {
         display: 'inline',
      },
   }),
);

const useButtonStyles = makeStyles(theme => ({
   button: {
      margin: theme.spacing(1),
   },
}));

const useSearchInputStyles = makeStyles((theme: Theme) =>
   createStyles({
      root: {
         padding: '0',
         margin: '0',
         display: 'flex',
         alignItems: 'center',
         // minwidth: '40rem',
      },
      input: {
         marginLeft: theme.spacing(1),
         flex: 1,
      },
      iconButton: {
         padding: 10,
      },
      divider: {
         height: 28,
         margin: 4,
      },
   }),
);

const UserRoleComp: React.FC<IUserRoleProps> =  (props) => {
   const [t, i18n] = useTranslation();
   const params = useParams();
   const history = useHistory();
   const { called, loading, data } = useQuery<{roles: {list: IRole[]}}, any>(GET_ROLES);
   const classes = useStyles();
   const searchInputClasses = useSearchInputStyles();
   const buttonClasses = useButtonStyles();
   const [checked, setChecked] = useState(props.userRoles.map(r => r.roleId));
   const [globalChecked, setGlobalChecked] = useState(false);
   const [searchInput, setSearchInput] = useState('');


   const onChangeSearch = (event: React.ChangeEvent<{ value: string}>) => {
      setSearchInput(event.target.value);
   };

   const onClearInput = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      setSearchInput('');
   };

   const onSubmitSearch = (event: React.FormEvent<HTMLFormElement>) => {
      return false;
   };

   const handleGlobalToggle = (event: React.ChangeEvent<{ checked: boolean}>) => {
      if(event.target.checked) {
         if(data)
            setChecked(data.roles.list.map(r => r.roleId));
      } else {
         setChecked([]);
      }
      setGlobalChecked(event.target.checked);
   };

   const handleToggle = (value: number) => () => {
      const currentIndex = checked.indexOf(value);
      const newChecked = [...checked];
      if (currentIndex === -1) {
         newChecked.push(value);
      } else {
         newChecked.splice(currentIndex, 1);
      }
      setChecked(newChecked);
   };

   const onClearChanges = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      setChecked(props.userRoles.map(r => r.roleId));
      setGlobalChecked(false);
   };

   const onSaveUserRoles = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      props.onSaveUserRoles(checked);
   };

   useEffect(() => { }, []);


   if (loading || !data)
      return <div>Loading</div>;


  return (
     <Grid container direction="column" justify="flex-start" alignItems="flex-start">
        <Grid container direction="row" justify="flex-start" wrap='nowrap'>
           <Paper className={searchInputClasses.root}>
              <InputBase
                 value={searchInput}
                 onChange={onChangeSearch}
                 className={searchInputClasses.input}
                 placeholder="Search Roles"
                 inputProps={{ 'aria-label': 'search roles' }}
              />
              <SearchIcon/>
              <Divider className={searchInputClasses.divider} orientation="vertical" />
              <IconButton onClick={onClearInput} color="secondary" className={searchInputClasses.iconButton} aria-label="directions">
                 <CancelIcon/>
              </IconButton>
           </Paper>
           <Grid container wrap='nowrap'>
              <Checkbox
                 edge="end"
                 onChange={handleGlobalToggle}
                 checked={globalChecked}
                 color='default'
                 inputProps={{ 'aria-labelledby': 'checkbox-list-secondary-label-0' }}
              />
              <Button
                 variant="contained"
                 color="primary"
                 onClick={onSaveUserRoles}
                 className={buttonClasses.button}
                 startIcon={<SaveIcon/>}
              >
                 Save
              </Button>
              <Button
                 variant="contained"
                 color="secondary"
                 onClick={onClearChanges}
                 className={buttonClasses.button}
                 startIcon={<CancelIcon/>}
              >
                 Cancel
              </Button>
           </Grid>
        </Grid>
       <List className={classes.root} style={{maxHeight: '33rem', overflow: 'auto'}}
       >
          {data.roles.list.filter(r => r.name.toUpperCase().indexOf((searchInput || '').toUpperCase().trim()) !== -1).map((r, i) =>(
             <>
                {(i || '') && <Divider variant="inset" component="li"/>}
                <ListItem key={i} alignItems="flex-start">
                   <ListItemAvatar>
                      <Avatar alt={r.name} src="/static/images/avatar/role.jpg" />
                   </ListItemAvatar>
                   <ListItemText
                      primary={r.name}
                      secondary={r.description || '-- None --'}
                   />
                   <ListItemSecondaryAction>
                      <Checkbox
                         edge="end"
                         color='primary'
                         onChange={handleToggle(r.roleId)}
                         checked={checked.indexOf(r.roleId) !== -1}
                         inputProps={{ 'aria-labelledby': `checkbox-list-secondary-label-${r.roleId}` }}
                      />
                   </ListItemSecondaryAction>
                </ListItem>
             </>
          ))}
       </List>
     </Grid>
  );
};
export default UserRoleComp;
