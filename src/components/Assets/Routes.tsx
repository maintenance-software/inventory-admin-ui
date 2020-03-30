import React from 'react';
import { useTranslation } from 'react-i18next';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import {Redirect} from "react-router";
import { HumanResourceComp } from "./Human";
import CreateEditPersonComp from "./Human/CreateEditPerson/CreateEditPersonComp";
import {ToolsResourceComp} from "./Tools";
import {CreateEditItemToolComp} from "./Tools/CreateItemToolPerson/CreateEditItemToolComp";
import {SparePartsSuppliesItemComp} from "./SparePartsSupplies";
import {CreateEditSparePartsSuppliesItemComp} from "./SparePartsSupplies/CreateSparePartsSuppliesItem/CreateEditSparePartsSuppliesItemComp";
import {EquipmentComp} from "./Equipment";


const HumanResourceRoutes: React.FC =  () => {
   const [t, i18n] = useTranslation();
   const { path, url } = useRouteMatch();
   return (
      <Switch>
         <Route exact path={path} component={HumanResourceComp}/>
         <Route path={`${path}/:personId`} component={CreateEditPersonComp}/>
      </Switch>
   );
};

const ToolsResourceRoutes: React.FC =  () => {
   const { path } = useRouteMatch();
   return (
      <Switch>
         <Route exact path={path} component={ToolsResourceComp}/>
         <Route path={`${path}/:itemId`} component={CreateEditItemToolComp}/>
      </Switch>
   );
};

const SparePartsSupplieRoutes: React.FC =  () => {
   const { path } = useRouteMatch();
   return (
      <Switch>
         <Route exact path={path} component={SparePartsSuppliesItemComp}/>
         <Route path={`${path}/:itemId`} component={CreateEditSparePartsSuppliesItemComp}/>
      </Switch>
   );
};

const EquipmentAssetRoutes: React.FC =  () => {
   const { path } = useRouteMatch();
   return (
      <Switch>
         <Route exact path={path} component={EquipmentComp}/>
         <Route path={`${path}/:equipmentId`} component={EquipmentComp}/>
      </Switch>
   );
};


const ResourceRoutes: React.FC =  () => {
  const [t, i18n] = useTranslation();
  const { path, url } = useRouteMatch();
  // console.log(url);
  return (
     <Switch>
        <Route path={`${path}/human`} component={HumanResourceRoutes}/>
        <Route path={`${path}/tools`} component={ToolsResourceRoutes}/>
        <Route path={`${path}/spare-parts`} component={SparePartsSupplieRoutes}/>
        <Route path={`${path}/equipment`} component={EquipmentAssetRoutes}/>
        <Redirect exact from={`${path}/`} to="/invalidRoute" />
     </Switch>
  );
};
export default ResourceRoutes;
