import React, {createContext} from 'react';
import { useTranslation } from 'react-i18next';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import {Redirect} from "react-router";
import {MaintenancePlanComp} from "./Plan";
import {CreateEditMaintenancePlanComp} from "./Plan/CreateEditEquipment/CreateEditMaintenancePlanComp";

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

export const MaintenanceResourceRoutes: React.FC =  () => {
  const [t, i18n] = useTranslation();
  const { path, url } = useRouteMatch();
  return (
     <Switch>
        <Route path={`${path}/plans`} component={MaintenancePlanRoutes}/>
        <Redirect exact from={`${path}/`} to="/invalidRoute" />
     </Switch>
  );
};
