import React, {useEffect, useState, useContext} from 'react';
import {useTranslation} from 'react-i18next';
import {useParams, useRouteMatch} from 'react-router-dom';
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
   const [activeTab, setActiveTab] = useState('1');
   const classes = useStyles();
   const [value, setValue] = React.useState(0);
   const [saveMaintenance] = useMutation<{ maintenances: IMaintenancePlans }, any>(SAVE_MAINTENANCE_PLAN);
   const [getMaintenancePlanById, { called, loading, data }] = useLazyQuery<{maintenances: IMaintenancePlans}, any>(GET_MAINTENANCE_PLAN_BY_ID);
   const [hasError, setHasError] = useState(false);
   const {maintenanceId, setMaintenanceId} = useContext(MaintenancePlanContext);
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
            setMaintenanceId(response.data.maintenances.saveMaintenance.maintenanceId);
         }
      }
   };

   const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
      setValue(newValue);
   };

   return (
      <Grid container className={classes.root}>
         <Tabs
            orientation="vertical"
            value={value}
            onChange={handleChange}
            aria-label="Vertical tabs example"
            className={classes.tabs}
         >
            <Tab label="GENERAL" {...a11yProps(0)} />
            <Tab label="Tasks" {...a11yProps(1)} />
            <Tab label="PERMISSION" {...a11yProps(2)} />
            <Tab label="SETTINGS" {...a11yProps(3)} />
         </Tabs>
         <TabPanel value={value} index={0}>
            <EditEquipmentForm {...equipmentFormProps}/>
         </TabPanel>
         <TabPanel value={value} index={1}>
            <Task tasks={maintenance.tasks}/>
         </TabPanel>
         <TabPanel value={value} index={2}>
            dev 2
         </TabPanel>
         <TabPanel value={value} index={3}>
            In develop 2
         </TabPanel>
      </Grid>
  );
};
