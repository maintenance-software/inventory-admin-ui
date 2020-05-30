import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import {useFormik} from 'formik';
import * as Yup from "yup";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {createStyles, Theme, Dialog, DialogContent, Stepper, StepLabel, Step, DialogTitle, DialogActions, FormLabel, MenuItem} from "@material-ui/core";
import TextField from "@material-ui/core/TextField/TextField";
import Grid from "@material-ui/core/Grid/Grid";
import Button from "@material-ui/core/Button/Button";
import Radio from '@material-ui/core/Radio';
import IconButton from "@material-ui/core/IconButton/IconButton";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';
import { useLazyQuery, useQuery } from '@apollo/react-hooks';
import {useHistory} from "react-router";
import {useParams, useRouteMatch} from 'react-router-dom';
import {GET_WORK_ORDER_BY_ID_QL, getWorkOrderDefaultInstance, IWorkOrder} from "../../../graphql/WorkOrder.ql";

const useDateStyles = makeStyles((theme: Theme) =>
   createStyles({
      container: {
         // display: 'flex',
         // flexWrap: 'wrap',
         width: '100%'
      },
      textField: {
         marginLeft: theme.spacing(1),
         marginRight: theme.spacing(1),
         width: 200,
      },
   }),
);

const useButtonStyles = makeStyles(theme => ({
   button: {
      margin: theme.spacing(1),
   },
}));

export const WorkOrderContainer: React.FC =  () => {
   const history = useHistory();
   const { path } = useRouteMatch();
   const params = useParams();
   const buttonClasses = useButtonStyles();
   const dateStyle = useDateStyles();
   const [workOrder, setWorOrder] = React.useState<IWorkOrder>(getWorkOrderDefaultInstance());
   const [getWorkOrderById, { called, loading, data }] = useLazyQuery<{maintenances: {workOrder: IWorkOrder}}, any>(GET_WORK_ORDER_BY_ID_QL);
   const workOrderId = +params.workOrderId;
   const taskActivityIds: number[] = history.location.state? history.location.state.taskActivityIds : [53, 52, 54, 56];

   useEffect(() => {
      if(workOrderId) {
         getWorkOrderById({variables: {workOrderId}})
      }
   }, []);

   useEffect(() => {
      if(called && !loading && data) {
         setWorOrder(data.maintenances.workOrder);
      }
   }, [called, loading, data]);

   console.log(taskActivityIds);
  return (
     <>
        <Grid container spacing={1}>

           <Grid container wrap='nowrap'>
              <Button
                 variant="contained"
                 color="primary"
                 size="small"
                 startIcon={<SaveIcon/>}
                 className={buttonClasses.button}
                 disabled={false}
                 type="submit"
              >
                 Save
              </Button>
              <Button
                 variant="contained"
                 color="secondary"
                 size='small'
                 startIcon={<CancelIcon/>}
                 className={buttonClasses.button}
                 onClick={() => {}}
                 disabled={false}
              >
                 Reset
              </Button>
           </Grid>

           <Grid container  spacing={2}>
              <Grid item xs={6}>
                 <TextField  id="responsible" label="Responsible"/>
              </Grid>

              <Grid item xs={6}>
                 <Grid container  spacing={2}>
                    <Grid item xs={4}>
                       Estimate duration
                    </Grid>
                    <Grid item xs={2}>
                       <TextField  id="downtimeDurationDD" label="DD" style={{width: '100%'}}/>
                    </Grid>
                    <Grid item xs={2}>
                       <TextField  id="downtimeDurationHH" label="HH" style={{width: '100%'}}/>
                    </Grid>
                    <Grid item xs={2}>
                       <TextField  id="downtimeDurationMM" label="MM" style={{width: '100%'}}/>
                    </Grid>
                 </Grid>
              </Grid>

           </Grid>
        </Grid>
     </>
  );
};
