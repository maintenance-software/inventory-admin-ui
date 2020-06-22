import React, {createContext} from 'react';
import { useTranslation } from 'react-i18next';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import {Redirect} from "react-router";
import {MaintenancePlanComp} from "./Plan";
import {CreateEditMaintenancePlanComp} from "./Plan/CreateEditEquipment/CreateEditMaintenancePlanComp";
import {WorkQueueListContainer} from "./WorkQueue/WorkQueueListContainer";
import {WorkOrderContainer} from "./WorkOrder/WorkOrderContainer";
import {WorkOrdersContainer} from "./WorkOrder/WorkOrdersContainer";
import {WorkOrderKanban} from "./WorkOrder/WorkOrderKanban";

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

interface IWorkOrderContext {
   taskActivities: number[];
   setTaskActivities(a: number[]): void;
}

// export const WorkOrderContext = createContext<IWorkOrderContext>({taskActivities: [], setTaskActivities: ()=>{}});

const WorkOrderRoutes: React.FC =  () => {
   const { path } = useRouteMatch();
   return (
      <Switch>
         <Route exact path={path} component={WorkOrdersContainer}/>
         <Route path={`${path}/karban`} component={WorkOrderKanban}/>
         <Route path={`${path}/:workOrderId`} component={WorkOrderContainer}/>
      </Switch>
   );
};

const TaskActivityRoutes: React.FC =  () => {
   const { path } = useRouteMatch();
   return (
      <Switch>
         <Route exact path={path} component={WorkQueueListContainer}/>
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
        <Route path={`${path}/workOrders`} component={WorkOrderRoutes}/>
        <Redirect exact from={`${path}/`} to="/invalidRoute" />
     </Switch>
  );
};
