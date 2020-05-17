import React, {createContext} from 'react';
import { useTranslation } from 'react-i18next';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import {Redirect} from "react-router";
import {MaintenancePlanComp} from "./Plan";
import {CreateEditMaintenancePlanComp} from "./Plan/CreateEditEquipment/CreateEditMaintenancePlanComp";
import {TaskActivityListContainer} from "./TaskActivity/TaskActivityListContainer";

interface IMaintenancePlanContext {
   maintenanceId: number;
   setMaintenanceId(a: number): void;
}

export const MaintenancePlanContext = createContext<IMaintenancePlanContext>({maintenanceId: 0, setMaintenanceId: ()=>{}});

const MaintenancePlanRoutes: React.FC =  () => {
   const [maintenanceId, setMaintenanceId] = React.useState<number>(0);
   const { path } = useRouteMatch();
   return (
      <Switch>
         <MaintenancePlanContext.Provider value={{maintenanceId, setMaintenanceId}}>
            <Route exact path={path} component={MaintenancePlanComp}/>
            <Route path={`${path}/:maintenanceId`} component={CreateEditMaintenancePlanComp}/>
         </MaintenancePlanContext.Provider>
      </Switch>
   );
};

const TaskActivityRoutes: React.FC =  () => {
   const { path } = useRouteMatch();
   return (
      <Switch>
         <Route exact path={path} component={TaskActivityListContainer}/>
      </Switch>
   );
};

export const MaintenanceResourceRoutes: React.FC =  () => {
  const [t, i18n] = useTranslation();
  const { path, url } = useRouteMatch();
  return (
     <Switch>
        <Redirect exact from={path} to={`${path}/plans`}/>
        <Route path={`${path}/plans`} component={MaintenancePlanRoutes}/>
        <Route path={`${path}/taskActivities`} component={TaskActivityRoutes}/>
        <Redirect exact from={`${path}/`} to="/invalidRoute" />
     </Switch>
  );
};
