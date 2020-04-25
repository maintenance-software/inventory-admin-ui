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
import {appendToPath, clearCache} from "../../../../utils/globalUtil";
import {
   GET_MAINTENANCE_PLAN_BY_ID, getMaintenancePlanDefaultInstance,
   IMaintenancePlan,
   IMaintenancePlans,
   SAVE_MAINTENANCE_PLAN
} from "../../../../graphql/Maintenance.type";
import {PlanDetailsComp} from "./PlanDetailsComp";
import {PlanEquipmentComp} from "./Equipment/EquipmentComp";
import {TaskComp} from "./Tasks/TaskComp";
import {TaskRComp} from "./Tasks/TaskRComp";

interface TabPanelProps {
   children?: React.ReactNode;
   index: any;
   value: any;
}

const TabPanel = (props: TabPanelProps) => {
   const { children, value, index, ...other } = props;
   return (
      <Typography
         component="div"
         role="tabpanel"
         hidden={value !== index}
         id={`vertical-tabpanel-${index}`}
         aria-labelledby={`vertical-tab-${index}`}
         style={{display: 'flex', flex: 1}}
         {...other}
      >
         {value === index && <Box display='flex' flexGrow={1} p={1}>{children}</Box>}
      </Typography>
   );
};

const a11yProps = (index: any) => {
   return {
      id: `vertical-tab-${index}`,
      'aria-controls': `vertical-tabpanel-${index}`,
   };
};

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

export const CreateEditMaintenancePlanComp: React.FC =  () => {
   const [t, i18n] = useTranslation();
   const params = useParams();
   const history = useHistory();
   const { path, url } = useRouteMatch();
   // const [activeTab, setActiveTab] = useState('1');
   const classes = useStyles();
   const [saveMaintenance] = useMutation<{ maintenances: IMaintenancePlans }, any>(SAVE_MAINTENANCE_PLAN);
   const [getMaintenancePlanById, { called, loading, data }] = useLazyQuery<{maintenances: IMaintenancePlans}, any>(GET_MAINTENANCE_PLAN_BY_ID);
   const [hasError, setHasError] = useState(false);
   // const {maintenanceId, setMaintenanceId} = useContext(MaintenancePlanContext);
   const maintenanceId = +params.maintenanceId;
   // const toggle = (tab: string) => {
   //    if(activeTab !== tab)
   //       setActiveTab(tab);
   // };

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

   const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
      history.push(appendToPath(url, newValue === 'home'? '' : newValue));
   };
   // const option = history.location.pathname.substr(url.toString().length, history.location.pathname.length - 1).replace(/[\/]+/g, '');
   let value = 'home';
      if(history.location.pathname.includes('equipments')) {
         value = 'equipments';
      } else if (history.location.pathname.includes('tasks')) {
         value = 'tasks';
      }

   return (
      <Grid container className={classes.root}>
         <Tabs
            orientation="vertical"
            value={value}
            onChange={handleChange}
            aria-label="Vertical tabs example"
            className={classes.tabs}
         >
            <Tab value="home" label="GENERAL" {...a11yProps('home')} />
            <Tab value="tasks" label="TASKS" {...a11yProps('tasks')} />
            <Tab value="equipments" label="EQUIPMENT" {...a11yProps('equipments')} />
         </Tabs>
            <TabPanel value={value} index="home">
               <PlanDetailsComp/>
            </TabPanel>
            <TabPanel value={value} index="tasks">
               <Switch>
                  <Route exact path={`${path}/tasks`} component={TaskComp}/>
                  <Route path={`${path}/tasks/:taskId`} component={TaskRComp}/>
               </Switch>
            </TabPanel>
            <TabPanel value={value} index="equipments">
               <PlanEquipmentComp/>
            </TabPanel>
      </Grid>
  );
};
