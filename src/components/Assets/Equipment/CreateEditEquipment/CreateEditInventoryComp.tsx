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
import {
   GET_INVENTORY_BY_ID,
   getInventoryDefaultInstance,
   IInventories,
   IInventory,
   SAVE_INVENTORY
} from "../../../../graphql/inventory.type";
import {EntityStatus} from "../../../../graphql/users.type";
import {EditInventoryForm, IInventoryForm, IInventoryFormProps} from "./CreateEditInventoryForm";
import {clearCache} from "../../../../utils/globalUtil";
import {InventoryStockComp} from "./InventoryStockComp";
import {InventoryItemAvailableComp} from "../../../items/ItemSelectable/InventoryItemAvailableComp";

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


interface InventoryMutationRequest {
   inventoryId: number;
   name: string;
   description: string;
   allowNegativeStocks: boolean;
   status: EntityStatus;
}

export const CreateEditInventoryComp: React.FC =  () => {
   const [t, i18n] = useTranslation();
   const params = useParams();
   const history = useHistory();
   const { path, url } = useRouteMatch();
   const [activeTab, setActiveTab] = useState('1');
   const classes = useStyles();
   const [value, setValue] = React.useState(0);
   const [saveInventory] = useMutation<{ inventories: IInventories }, any>(SAVE_INVENTORY);
   const [getInventoryById, { called, loading, data }] = useLazyQuery<{inventories: IInventories}, any>(GET_INVENTORY_BY_ID);
   const [hasError, setHasError] = useState(false);
   const inventoryId = +params.inventoryId;
   const toggle = (tab: string) => {
      if(activeTab !== tab)
         setActiveTab(tab);
   };

   useEffect(() => {
     if(inventoryId && inventoryId > 0) {
        getInventoryById({variables: { inventoryId }});
     }
  }, []);

   if (loading || (!data && inventoryId > 0))
      return <div>Loading</div>;

   let inventory: IInventory= getInventoryDefaultInstance();

   if(data) {
      inventory = data.inventories.inventory;
   }

   const itemFormProps: IInventoryFormProps = {
      inventoryForm: {
         name: inventory.name,
         description: inventory.description,
         allowNegativeStocks: inventory.allowNegativeStocks,
         status: inventory.status
      },
      onSaveInventoryCallback: async (inventoryForm: IInventoryForm, resetForm: Function) => {
         const mutationRequest: InventoryMutationRequest = {
            inventoryId: inventory.inventoryId,
            name: inventoryForm.name,
            description: inventoryForm.description,
            allowNegativeStocks: inventoryForm.allowNegativeStocks,
            status: EntityStatus.ACTIVE
         };
         const response = await saveInventory({
            variables: mutationRequest
            , update: (cache) => {
               clearCache(cache, 'inventories.inventory');
               clearCache(cache, 'inventories.list');
            }
         });
         if(!response.data) return;
         getInventoryById({variables: { inventoryId: response.data.inventories.saveInventory.inventoryId }});
         history.push(response.data.inventories.saveInventory.inventoryId.toString());
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
            <EditInventoryForm {...itemFormProps}/>
         </TabPanel>
         <TabPanel value={value} index={1}>
            <InventoryStockComp/>
         </TabPanel>
         <TabPanel value={value} index={2}>
            {/*<InventoryItemAvailableComp inventoryId={inventoryId}/>*/}
         </TabPanel>
         <TabPanel value={value} index={3}>
            In develop 2
         </TabPanel>
      </Grid>
  );
};
