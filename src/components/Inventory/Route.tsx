import React from 'react';
import { useTranslation } from 'react-i18next';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import {InventoryComp} from "./index";
import {CreateEditInventoryComp} from "./CreateEditInventory/CreateEditInventoryComp";

export const InventoryRoute: React.FC =  () => {
  const [t, i18n] = useTranslation();
  const { path, url } = useRouteMatch();

  return (
     <Switch>
        <Route exact path={path} component={InventoryComp}/>
        <Route path={`${path}/:inventoryId`} component={CreateEditInventoryComp}/>
     </Switch>
  );
};
