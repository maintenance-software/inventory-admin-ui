import React from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './index.scss';
import { useTranslation } from 'react-i18next';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import Items from './list/Items';


const ItemPage: React.FC =  () => {
  const [t, i18n] = useTranslation();
  const { path, url } = useRouteMatch();

  return (
    <div className="container-fluid h-100">
      <Switch>
        <Route exact path={path} component={Items}/>
      </Switch>
    </div>
  );
};
export default ItemPage;
