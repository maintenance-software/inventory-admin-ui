import React, {useState} from 'react';
import './index.scss';
import { useTranslation } from 'react-i18next';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import {buildFullName} from "../../utils/globalUtil";
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';

const UserSettings: React.FC<{firstName: string, lastName: string}> =  (props) => {
  const [t, i18n] = useTranslation();
  const { path, url } = useRouteMatch();
   const [dropdownOpen, setOpen] = useState(false);

   const toggle = () => setOpen(!dropdownOpen);

   return (
      <>
         <Container maxWidth="sm">
            <Paper elevation={0}>
               Settings container
            </Paper>
         </Container>
      </>
   );
};
export default UserSettings;
