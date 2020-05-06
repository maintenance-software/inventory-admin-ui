import React, {createContext} from 'react';
import { useTranslation } from 'react-i18next';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import {HumanResourceComp} from "./index";
import CreateEditPersonComp from "./CreateEditPerson/CreateEditPersonComp";


export const HumanResourceRoutes: React.FC =  () => {
   const [t, i18n] = useTranslation();
   const { path, url } = useRouteMatch();
   return (
      <Switch>
         <Route exact path={path} component={HumanResourceComp}/>
         <Route path={`${path}/:personId`} component={CreateEditPersonComp}/>
      </Switch>
   );
};
