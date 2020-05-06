import React, {createContext} from 'react';
import { useTranslation } from 'react-i18next';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import {Redirect} from "react-router";
import { HumanResourceComp } from "../Human";
import CreateEditPersonComp from "../Human/CreateEditPerson/CreateEditPersonComp";
import {ToolsResourceComp} from "./Tools";
import {CreateEditItemToolComp} from "./Tools/CreateItemToolPerson/CreateEditItemToolComp";
import {SparePartsSuppliesItemComp} from "./SparePartsSupplies";
import {CreateEditSparePartsSuppliesItemComp} from "./SparePartsSupplies/CreateSparePartsSuppliesItem/CreateEditSparePartsSuppliesItemComp";
import {EquipmentComp} from "./Equipment";
import {CreateEditEquipmentComp} from "./Equipment/CreateEditEquipment/CreateEditEquipmentComp";
import {IEquipment} from "../../graphql/equipment.type";

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

interface IEquipmentContext {
   pathTree: IEquipment[];
   setPathTree: Function;
}

export const EquipmentContext = createContext<IEquipmentContext>({pathTree: [], setPathTree: ()=>{}});
const EquipmentAssetRoutes: React.FC =  () => {
   const [pathTree, setPathTree] = React.useState<IEquipment[]>([]);
   const { path } = useRouteMatch();
   return (
      <Switch>
         <EquipmentContext.Provider value={{pathTree, setPathTree}}>
            <Route exact path={path} component={EquipmentComp}/>
            <Route path={`${path}/:equipmentId`} component={CreateEditEquipmentComp}/>
         </EquipmentContext.Provider>
      </Switch>
   );
};


const ResourceRoutes: React.FC =  () => {
  const [t, i18n] = useTranslation();
  const { path, url } = useRouteMatch();
  // console.log(url);
  return (
     <Switch>
        <Redirect exact from={path} to={`${path}/equipments`}/>
        <Route path={`${path}/tools`} component={ToolsResourceRoutes}/>
        <Route path={`${path}/supplies`} component={SparePartsSupplieRoutes}/>
        <Route path={`${path}/equipments`} component={EquipmentAssetRoutes}/>
        <Redirect exact from={`${path}/`} to="/invalidRoute" />
     </Switch>
  );
};
export default ResourceRoutes;
