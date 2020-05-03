import React, {useState} from 'react';
import './index.scss';
import { useTranslation } from 'react-i18next';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import {buildFullName} from "../../utils/globalUtil";
import {useLazyQuery, useQuery} from "@apollo/react-hooks";
import {GET_USER_SESSION_GQL, ISession} from "../../graphql/session.type";
import {IUsers} from "../../graphql/users.type";
import {GET_USER_BY_ID} from "../users/CreateEditPerson/CreateEditUser";
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import LanguageIcon from '@material-ui/icons/Language';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';

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
      <>
         <Container maxWidth="sm">
            <Paper elevation={0} >
               <List component="nav"
                     aria-label="main mailbox folders"
                     subheader={
                        <ListSubheader component="div" id="nested-list-subheader">PROFILE</ListSubheader>
                     }
               >
                  <ListItem>
                     <Grid container spacing={3}>
                        <Grid item xs={3}>PHOTO</Grid>
                        <Grid item xs={9}>A photo helps personalize your account</Grid>
                     </Grid>
                     <ListItemSecondaryAction>
                        <IconButton edge="end" aria-label="comments"><EditIcon/></IconButton>
                     </ListItemSecondaryAction>
                  </ListItem>

                  <ListItem>
                     <Grid container spacing={3}>
                        <Grid item xs={3}>FIRST NAME</Grid>
                        <Grid item xs={9}>{user && user.person.firstName }</Grid>
                     </Grid>
                     <ListItemSecondaryAction>
                        <IconButton edge="end" aria-label="comments"><EditIcon/></IconButton>
                     </ListItemSecondaryAction>
                  </ListItem>

                  <ListItem>
                     <Grid container spacing={3}>
                        <Grid item xs={3}>LAST NAME</Grid>
                        <Grid item xs={9}>{user && user.person.lastName}</Grid>
                     </Grid>
                     <ListItemSecondaryAction>
                        <IconButton edge="end" aria-label="comments"><EditIcon/></IconButton>
                     </ListItemSecondaryAction>
                  </ListItem>

                  <ListItem>
                     <Grid container spacing={3}>
                        <Grid item xs={3}>USERNAME</Grid>
                        <Grid item xs={9}>{(user && user.username)}</Grid>
                     </Grid>
                     <ListItemSecondaryAction>
                        <IconButton edge="end" aria-label="comments"><EditIcon/></IconButton>
                     </ListItemSecondaryAction>
                  </ListItem>

                  <ListItem>
                     <Grid container spacing={3}>
                        <Grid item xs={3}>PASSWORD</Grid>
                        <Grid item xs={9}>{(user && user.password) || '**********'}</Grid>
                     </Grid>
                     <ListItemSecondaryAction>
                        <IconButton edge="end" aria-label="comments"><EditIcon/></IconButton>
                     </ListItemSecondaryAction>
                  </ListItem>
               </List>
            </Paper>
            <Divider/>

            <Paper elevation={0} >
               <List component="nav"
                     aria-label="main mailbox folders"
                     subheader={
                        <ListSubheader component="div" id="nested-list-subheader">CONTACT INFO</ListSubheader>
                     }
               >
                  <ListItem>
                     <Grid container spacing={3}>
                        <Grid item xs={3}>Email</Grid>
                        <Grid item xs={9}>{user && user.email}</Grid>
                     </Grid>
                     <ListItemSecondaryAction>
                        <IconButton edge="end" aria-label="comments"><EditIcon/></IconButton>
                     </ListItemSecondaryAction>
                  </ListItem>

                  <ListItem>
                     <Grid container spacing={3}>
                        <Grid item xs={3}>Cell Phone</Grid>
                        <Grid item xs={9}>323-488484</Grid>
                     </Grid>
                     <ListItemSecondaryAction>
                        <IconButton edge="end" aria-label="comments"><EditIcon/></IconButton>
                     </ListItemSecondaryAction>
                  </ListItem>


                  <ListItem>
                     <Grid container spacing={3}>
                        <Grid item xs={3}>Work Phone</Grid>
                        <Grid item xs={9}>34234234-342</Grid>
                     </Grid>
                     <ListItemSecondaryAction>
                        <IconButton edge="end" aria-label="comments"><EditIcon/></IconButton>
                     </ListItemSecondaryAction>
                  </ListItem>
               </List>
            </Paper>
         </Container>
      </>
   );
};
export default UserProfile;
