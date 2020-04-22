import React, {useEffect, useState, useContext} from 'react';
import {useTranslation} from 'react-i18next';
import {useParams, useRouteMatch, Switch, Route} from 'react-router-dom';
import {useLazyQuery, useMutation} from "@apollo/react-hooks";
import {useHistory} from "react-router";
import Typography from "@material-ui/core/Typography/Typography";
import Box from "@material-ui/core/Box/Box";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {Theme} from "@material-ui/core";
import Tabs from "@material-ui/core/Tabs/Tabs";
import Tab from "@material-ui/core/Tab/Tab";
import Grid from "@material-ui/core/Grid/Grid";
import {EntityStatus} from "../../../../graphql/users.type";
import {EditEquipmentForm, IMaintenancePlanForm, IMaintenancePlanFormProps} from "./CreateEditMaintenancePlanForm";
import {clearCache} from "../../../../utils/globalUtil";
import {MaintenancePlanContext} from "../../Routes";
import {
   GET_MAINTENANCE_PLAN_BY_ID, getMaintenancePlanDefaultInstance,
   IMaintenancePlan,
   IMaintenancePlans,
   SAVE_MAINTENANCE_PLAN
} from "../../../../graphql/Maintenance.type";
import {Task} from "./Tasks/Task";
import {Equipment} from "./Equipment/Equipment";
import {MaintenancePlanComp} from "../index";

const useStyles = makeStyles((theme: Theme) => ({
   root: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.paper,
      display: 'flex',
      flexWrap: 'nowrap',
      height: '100%!important',
      width: '100%!important'
   },
   tabs: {
      borderRight: `1px solid ${theme.palette.divider}`,
   },
}));


interface MaintenancePlanMutationRequest {
   maintenanceId: number;
   name: string;
   description: string;
   status: string;
}

export const PlanDetailsComp: React.FC =  () => {
   const [t, i18n] = useTranslation();
   const params = useParams();
   const history = useHistory();
   const { path, url } = useRouteMatch();
   const [activeTab, setActiveTab] = useState('1');
   const classes = useStyles();
   const [value, setValue] = React.useState(0);
   const [saveMaintenance] = useMutation<{ maintenances: IMaintenancePlans }, any>(SAVE_MAINTENANCE_PLAN);
   const [getMaintenancePlanById, { called, loading, data }] = useLazyQuery<{maintenances: IMaintenancePlans}, any>(GET_MAINTENANCE_PLAN_BY_ID);
   const [hasError, setHasError] = useState(false);
   // const {maintenanceId, setMaintenanceId} = useContext(MaintenancePlanContext);
   const maintenanceId = +params.maintenanceId;
   const toggle = (tab: string) => {
      if(activeTab !== tab)
         setActiveTab(tab);
   };

   useEffect(() => {
     if(maintenanceId && maintenanceId > 0) {
        getMaintenancePlanById({variables: { maintenanceId }});
     }
  }, []);

   if (loading || (!data && maintenanceId > 0))
      return <div>Loading</div>;

   let maintenance: IMaintenancePlan = getMaintenancePlanDefaultInstance();

   if(data) {
      maintenance = data.maintenances.maintenance;
   }

   const equipmentFormProps: IMaintenancePlanFormProps = {
      maintenanceForm: {
         name: maintenance.name || '',
         description: maintenance.description || '',
         status: maintenance.status || EntityStatus.ACTIVE,
      },
      onSaveMaintenancePlanCallback: async (maintenanceForm: IMaintenancePlanForm, resetForm: Function) => {
         const mutationRequest: MaintenancePlanMutationRequest = {
            maintenanceId: maintenanceId,
            name: maintenanceForm.name,
            description: maintenanceForm.description,
            status: maintenanceForm.status
         };
         const response = await saveMaintenance({
            variables: mutationRequest
            , update: (cache) => {
               clearCache(cache, 'maintenances.page');
               // clearCache(cache, 'inventories.list');
            }
         });
         if(!response.data)
            return;
         if(maintenanceId > 0) {
            resetForm({});
         } else {
            getMaintenancePlanById({variables: { maintenanceId: response.data.maintenances.saveMaintenance.maintenanceId }});
            //setMaintenanceId(response.data.maintenances.saveMaintenance.maintenanceId);
         }
      }
   };

   return (
      <EditEquipmentForm {...equipmentFormProps}/>
  );
};
