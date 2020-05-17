import React, { useEffect, FC } from 'react';
import { useTranslation } from 'react-i18next';
import {FormikHelpers, useFormik} from 'formik';
import * as Yup from "yup";
import { isNumber } from 'util';
import {ITaskCategory} from "../../../../../graphql/Maintenance.type";
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import MenuItem from '@material-ui/core/MenuItem';
import {ICategory} from "../../../../../graphql/item.type";

const useSliderStyles = makeStyles((theme: Theme) =>
   createStyles({
      root: {
         width: 300,
      },
      margin: {
         height: theme.spacing(3),
      },
   }),
);

export const TaskDetailComp: FC<{taskDetailForm: any, taskCategories: ICategory[]}> =  ({taskDetailForm, taskCategories}) => {
   const { values, resetForm, getFieldProps, getFieldMeta, handleSubmit, errors, dirty, isValid, setFieldValue } = taskDetailForm;
   const classes = useSliderStyles();
  //  const { values, resetForm, getFieldProps, getFieldMeta, handleSubmit, errors, dirty, isValid, setFieldValue } = useFormik<ITaskDetail>({
  //   initialValues: taskDetail,
  //   validationSchema: Yup.object().shape({
  //      name: Yup.string().required('Name is required'),
  //      description: Yup.string(),
  //      taskCategoryId: Yup.number().moreThan(0),
  //   }),
  //   onSubmit: (values, bag) => {
  //      // callback(values, bag.resetForm);
  //   }
  // });

   const name = getFieldProps('name'); const nameField = getFieldMeta('name');
   const taskCategoryId = getFieldProps('taskCategoryId');
   const priority = getFieldProps('priority');
   const durationDD = getFieldProps('durationDD');
   const durationDDField = getFieldMeta('durationDD');
   const durationHH = getFieldProps('durationHH');
   const durationHHField = getFieldMeta('durationHH');
   const durationMM = getFieldProps('durationMM');
   const durationMMField = getFieldMeta('durationMM');
   const downTimeDurationDD = getFieldProps('downTimeDurationDD');
   const downTimeDurationDDField = getFieldMeta('downTimeDurationDD');
   const downTimeDurationMM = getFieldProps('downTimeDurationMM');
   const downTimeDurationMMField = getFieldMeta('downTimeDurationMM');
   const downTimeDurationHH = getFieldProps('downTimeDurationHH');
   const downTimeDurationHHField = getFieldMeta('downTimeDurationHH');

  return (
    <>
       <Grid container>
          <Grid container  spacing={2}>
             <Grid item xs={8}>
                <TextField  id="name" label="Name" style={{width: '100%'}} required error={nameField.touched && !!nameField.error} {...name}/>
             </Grid>
             <Grid item xs={4}>
                <TextField  id="taskCategory" label="Task Category" select  style={{width: '100%'}} {...taskCategoryId}>
                   <MenuItem key={-1} value="-1">--Select--</MenuItem>
                   {taskCategories.map(c => (
                      <MenuItem key={c.categoryId} value={c.categoryId}>{c.name}</MenuItem>
                   ))}
                </TextField>
             </Grid>

             <Grid item xs={6}>
                <Grid container  spacing={2}>
                   <Grid item xs={4}>
                      Duration
                   </Grid>
                   <Grid item xs={2}>
                      <TextField  id="durationDD" label="DD" style={{width: '100%'}}  error={durationDDField.touched && !!durationDDField.error} {...durationDD}/>
                   </Grid>
                   <Grid item xs={2}>
                      <TextField  id="durationHH" label="HH" style={{width: '100%'}} error={durationHHField.touched && !!durationHHField.error} {...durationHH}/>
                   </Grid>
                   <Grid item xs={2}>
                      <TextField  id="durationMM" label="MM" style={{width: '100%'}} error={durationMMField.touched && !!durationMMField.error} {...durationMM}/>
                   </Grid>
                </Grid>
             </Grid>
             <Grid item xs={6}>
                <Grid container  spacing={2}>
                   <Grid item xs={4}>
                      Downtime duration
                   </Grid>
                   <Grid item xs={2}>
                      <TextField  id="downtimeDurationDD" label="DD" style={{width: '100%'}} error={downTimeDurationDDField.touched && !!downTimeDurationDDField.error} {...downTimeDurationDD}/>
                   </Grid>
                   <Grid item xs={2}>
                      <TextField  id="downtimeDurationHH" label="HH" style={{width: '100%'}} error={downTimeDurationHHField.touched && !!downTimeDurationHHField.error} {...downTimeDurationHH}/>
                   </Grid>
                   <Grid item xs={2}>
                      <TextField  id="downtimeDurationMM" label="MM" style={{width: '100%'}} error={downTimeDurationMMField.touched && !!downTimeDurationMMField.error} {...downTimeDurationMM}/>
                   </Grid>
                </Grid>
             </Grid>
             <Grid item xs={12}>
                <Typography id="discrete-slider-custom">
                   Priority
                </Typography>
                <Slider
                   aria-labelledby="discrete-slider-custom"
                   step={null}
                   valueLabelDisplay="auto"
                   max={10}
                   marks={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(s => ({label: s, value: s}))}
                   {...priority}
                   onChange={(event, value) => setFieldValue('priority', value)}
                />
             </Grid>
          </Grid>
       </Grid>
    </>
  );
};
