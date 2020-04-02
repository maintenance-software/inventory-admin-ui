import React, {useEffect, useState} from 'react';
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
import {EditEquipmentForm, IEquipmentForm, IEquipmentFormProps} from "./CreateEditEquipmentForm";
import {clearCache} from "../../../../utils/globalUtil";
import {
   GET_EQUIPMENT_BY_ID,
   getDefaultEquipmentInstance,
   IEquipment,
   IEquipments,
   SAVE_EQUIPMENT
} from "../../../../graphql/equipment.type";

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


interface EquipmentMutationRequest {
   equipmentId: number;
   name: string;
   description: string;
   code: string;
   partNumber: string;
   manufacturer: string;
   model: string;
   notes: string;
   status: string;
   images: string[];
   priority: number;
   hoursAverageDailyUse: number;
   outOfService: boolean;
   purchaseDate: string | null;
   parentId: number | null;
}

export const CreateEditEquipmentComp: React.FC =  () => {
   const [t, i18n] = useTranslation();
   const params = useParams();
   const history = useHistory();
   const { path, url } = useRouteMatch();
   const [activeTab, setActiveTab] = useState('1');
   const classes = useStyles();
   const [value, setValue] = React.useState(0);
   const [saveEquipment] = useMutation<{ equipments: IEquipments }, any>(SAVE_EQUIPMENT);
   const [getEquipmentById, { called, loading, data }] = useLazyQuery<{equipments: IEquipments}, any>(GET_EQUIPMENT_BY_ID);
   const [hasError, setHasError] = useState(false);
   const equipmentId = +params.equipmentId;
   const toggle = (tab: string) => {
      if(activeTab !== tab)
         setActiveTab(tab);
   };

   useEffect(() => {
     if(equipmentId && equipmentId > 0) {
        getEquipmentById({variables: { equipmentId }});
     }
  }, []);

   if (loading || (!data && equipmentId > 0))
      return <div>Loading</div>;

   let equipment: IEquipment= getDefaultEquipmentInstance();

   if(data) {
      equipment = data.equipments.equipment;
   }

   const equipmentFormProps: IEquipmentFormProps = {
      equipmentId: equipmentId,
      equipmentForm: {
         name: equipment.name || '',
         description: equipment.description || '',
         code: equipment.code || '',
         partNumber: equipment.partNumber || '',
         manufacturer: equipment.manufacturer || '',
         model: equipment.model || '',
         notes: equipment.notes || '',
         status: equipment.status || EntityStatus.ACTIVE,
         images: equipment.images || [],
         priority: equipment.priority || 0,
         hoursAverageDailyUse: equipment.hoursAverageDailyUse || 0,
         outOfService: equipment.outOfService || false,
         purchaseDate: equipment.purchaseDate || '',
         parentId: !equipment.parent? null : equipment.parent.equipmentId,
         parentName: !equipment.parent? '' : equipment.parent.name
      },
      onSaveEquipmentCallback: async (equipmentForm: IEquipmentForm, resetForm: Function) => {
         const mutationRequest: EquipmentMutationRequest = {
            equipmentId: equipmentId,
            name: equipmentForm.name,
            description: equipmentForm.description,
            code: equipmentForm.code,
            partNumber: equipmentForm.partNumber,
            manufacturer: equipmentForm.manufacturer,
            model: equipmentForm.model,
            notes: equipmentForm.notes,
            status: equipmentForm.status,
            images: equipmentForm.images,
            priority: +equipmentForm.priority,
            hoursAverageDailyUse: +equipmentForm.hoursAverageDailyUse,
            outOfService: equipmentForm.outOfService,
            purchaseDate: equipmentForm.purchaseDate || null,
            parentId: equipmentForm.parentId
         };
         const response = await saveEquipment({
            variables: mutationRequest
            , update: (cache) => {
               // clearCache(cache, 'inventories.inventory');
               // clearCache(cache, 'inventories.list');
            }
         });
         if(!response.data)
            return;
         if(equipmentId > 0) {
            resetForm({});
         } else {
            getEquipmentById({variables: { equipmentId: response.data.equipments.saveEquipment.equipmentId }});
            console.log(history.action);
            history.push(response.data.equipments.saveEquipment.equipmentId.toString());
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
            <Tab label="STOCKS" {...a11yProps(1)} />
            <Tab label="PERMISSION" {...a11yProps(2)} />
            <Tab label="SETTINGS" {...a11yProps(3)} />
         </Tabs>
         <TabPanel value={value} index={0}>
            <EditEquipmentForm {...equipmentFormProps}/>
         </TabPanel>
         <TabPanel value={value} index={1}>
            dev 1
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
