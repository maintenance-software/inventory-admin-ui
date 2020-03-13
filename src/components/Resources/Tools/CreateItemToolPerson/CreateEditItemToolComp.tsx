import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useParams} from 'react-router-dom';
import {useLazyQuery, useMutation, useQuery} from "@apollo/react-hooks";
import {useHistory} from "react-router";
import Typography from "@material-ui/core/Typography/Typography";
import Box from "@material-ui/core/Box/Box";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {Theme} from "@material-ui/core";
import Tabs from "@material-ui/core/Tabs/Tabs";
import Tab from "@material-ui/core/Tab/Tab";
import Grid from "@material-ui/core/Grid/Grid";
import {
   FETCH_CATEGORIES,
   FETCH_UNITS,
   GET_ITEM_TOOL_BY_ID,
   FETCH_ITEMS_GQL,
   getItemDefaultInstance,
   ICategory,
   IItem,
   IItems,
   ItemType, IUnit,
   SAVE_ITEM_TOOL
} from "../../../../graphql/item.type";
import {EditItemToolForm, IItemForm, IItemFormProps} from "./CreateEditItemToolForm";
import {EntityStatus} from "../../../../graphql/users.type";

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


interface ItemMutationRequest {
   itemId: number;
   code: string;
   defaultPrice: number;
   description: string;
   images: string[];
   itemType: ItemType;
   manufacturer: string;
   model: string;
   name: string;
   notes: string;
   partNumber: string;
   status: EntityStatus;
   unitId: number;
   categoryId: number;
}

export const CreateEditItemToolComp: React.FC =  () => {
   const [t, i18n] = useTranslation();
   const params = useParams();
   const history = useHistory();
   const [activeTab, setActiveTab] = useState('1');
   const classes = useStyles();
   const [value, setValue] = React.useState(0);
   const [saveItem, mutation] = useMutation<{ saveItem: IItem }, any>(SAVE_ITEM_TOOL);
   const [getItemToolById, { called, loading, data }] = useLazyQuery<{items: IItems}, any>(GET_ITEM_TOOL_BY_ID);
   const categoryQL = useQuery<{categories: ICategory[]}, any>(FETCH_CATEGORIES);
   const unitQL = useQuery<{units: IUnit[]}, any>(FETCH_UNITS);
   const [hasError, setHasError] = useState(false);
   const itemId = +params.itemId;
   const toggle = (tab: string) => {
      if(activeTab !== tab)
         setActiveTab(tab);
   };

  useEffect(() => {
     if(itemId && itemId > 0) {
        getItemToolById({variables: { itemId }});
     }
  }, []);

   useEffect(() => {
      if(mutation.data && mutation.data.saveItem) {
         if(itemId <= 0) {
            getItemToolById({variables: { itemId: mutation.data.saveItem.itemId}});
            history.push(mutation.data.saveItem.itemId.toString());
         }
      } else {
         // setHasError(true);
      }
   }, [mutation.data]);

   if (loading || (!data && itemId > 0))
      return <div>Loading</div>;

   let item: IItem = getItemDefaultInstance();

   if(data) {
      item = data.items.item;
   }

   const itemFormProps: IItemFormProps = {
      itemForm: {
         code: item.code,
         defaultPrice: item.defaultPrice,
         description: item.description,
         images: item.images,
         manufacturer: item.manufacturer || '',
         model: item.model || '',
         name: item.name || '',
         notes: item.notes || '',
         partNumber: item.partNumber || '',
         status: EntityStatus[item.status],
         unitId: item.unit.unitId,
         categoryId: item.category.categoryId
      },
      categories: (categoryQL.data && categoryQL.data.categories) || [],
      units: (unitQL.data && unitQL.data.units) || [],
      onSaveItemToolCallback: (itemForm: IItemForm, resetForm: Function) => {
         const mutationRequest: ItemMutationRequest = {
            itemId: item.itemId,
            code: itemForm.code,
            defaultPrice: +itemForm.defaultPrice || 0.0,
            description: itemForm.description,
            images: itemForm.images || [],
            itemType: ItemType.TOOLS,
            manufacturer: itemForm.manufacturer,
            model: itemForm.model,
            name: itemForm.name,
            notes: itemForm.notes,
            partNumber: itemForm.partNumber,
            status: itemForm.status as EntityStatus,
            unitId: itemForm.unitId,
            categoryId: itemForm.categoryId
         };
         onSaveItem(mutationRequest);
         resetForm({values: itemForm});
      }
   };

   const onSaveItem = (request: ItemMutationRequest) => {
      const refetchQueries: any = [{query: FETCH_ITEMS_GQL, variables: {filters: [{field: "itemType",operator: "=", value: "TOOLS"}]}}];
      if(item.itemId > 0) {
         refetchQueries.push({query: GET_ITEM_TOOL_BY_ID, variables: {itemId: item.itemId}});
      }
      saveItem({ variables: request, refetchQueries:refetchQueries});
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
            <Tab label="ASSIGNMENT" {...a11yProps(1)} />
            <Tab label="PERMISSION" {...a11yProps(2)} />
            <Tab label="SETTINGS" {...a11yProps(3)} />
         </Tabs>
         <TabPanel value={value} index={0}>
            <EditItemToolForm {...itemFormProps}/>
         </TabPanel>
         <TabPanel value={value} index={1}>
            {/*<UserRoleComp userRoles={user.roles} onSaveUserRoles = {onSaveUserRoles}/>*/}
         </TabPanel>
         <TabPanel value={value} index={2}>
            In develop 1
         </TabPanel>
         <TabPanel value={value} index={3}>
            In develop 2
         </TabPanel>
      </Grid>
  );
};
