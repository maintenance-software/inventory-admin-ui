import React, {FC, useState, useEffect} from 'react';
import Button from '@material-ui/core/Button';
import Radio from '@material-ui/core/Radio';
import { ITaskTrigger } from "../../../../../graphql/Maintenance.type";
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import {ICategory, IUnit} from "../../../../../graphql/item.type";
import FormLabel from '@material-ui/core/FormLabel';

interface ITriggerDialogProps {
   open: boolean;
   setOpen(open: boolean): void;
   triggerTypes: string[],
   trigger: ITaskTrigger;
   triggerEvents: ICategory[];
   units: IUnit[];
   onSaveTrigger(trigger: ITaskTrigger): void;
}

export const TriggerDialog: FC<ITriggerDialogProps> = ({open, setOpen, triggerTypes, trigger, triggerEvents, units, onSaveTrigger}) => {
   const [triggerEventId, setTriggerEventId] = useState(trigger.eventTriggerCategory? trigger.eventTriggerCategory.categoryId : 0);
   const [triggerType, setTriggerType] = useState(trigger.triggerType);
   const [frequency, setFrequency] = useState(trigger.frequency);
   const [frequencyUnitId, setFrequencyUnitId] = useState(trigger.unit? trigger.unit.unitId : 0);
   const [repeat, setRepeat] = useState(trigger.repeat);
   const [limit, setLimit] = useState(trigger.limit);
   const [readType, setReadType] = useState(trigger.readType || 'WHEN');
   const [operator, setOperator] = useState(trigger.operator);
   const [value, setValue] = useState(trigger.value);

   useEffect(() => {
      setTriggerEventId(trigger.eventTriggerCategory? trigger.eventTriggerCategory.categoryId : 0);
      setTriggerType(trigger.triggerType);
      setFrequency(trigger.frequency);
      setFrequencyUnitId(trigger.unit? trigger.unit.unitId : 0);
      setRepeat(trigger.repeat);
      setLimit(trigger.limit);
      setReadType(trigger.readType || 'WHEN');
      setOperator(trigger.operator);
      setValue(trigger.value);
   }, [trigger]);

   const handleSave = () => {
      const eventTrigger = triggerEvents.find(k => k.categoryId === triggerEventId) || {
         eventTriggerId: 0,
         name: '',
         description: '',
         createdDate: '',
         modifiedDate: '',
      };
      const unit = units.find(k => k.unitId === frequencyUnitId) || {
         unitId: 0,
         key: '',
         label: ''
      };
      onSaveTrigger(Object.assign({}, trigger, {
         triggerType: triggerType,
         frequency: frequency,
         readType: readType,
         limit: limit,
         repeat: repeat,
         operator: operator,
         value: value,
         unit: unit,
         eventTriggerCategory: eventTrigger
      }));
   };

   const eventSelector = (
      <Grid item xs={12}>
         <TextField
            style={{width: '100%'}}
            id="trigger-type"
            select
            label="Events"
            value={triggerEventId}
            onChange={(event => setTriggerEventId(+event.target.value))}
         >
            {triggerEvents.map((option) => (
               <MenuItem key={option.categoryId} value={option.categoryId}>
                  {option.name}
               </MenuItem>
            ))}
         </TextField>
      </Grid>
   );

   const dateTriggerSelector = (
      <>
         <Grid item xs={6}>
            <TextField
               style={{width: '100%'}}
               id="frecuency"
               label="Frecuency"
               value={frequency}
               onChange={(event => setFrequency(+event.target.value))}
            >
            </TextField>
         </Grid>
         <Grid item xs={6}>
            <TextField
               style={{width: '100%'}}
               id="frecuency-unit"
               select
               label="Frecuency Unit"
               value={frequencyUnitId}
               onChange={(event => setFrequencyUnitId(+event.target.value))}
            >
               {units.map((option) => (
                  <MenuItem key={option.unitId} value={option.unitId}>
                     {option.label}
                  </MenuItem>
               ))}
            </TextField>
         </Grid>
         <Grid item xs={6}>
            <FormControlLabel
               control={<Checkbox checked={repeat} onChange={(event => setRepeat(event.target.checked))} name="repeat" />}
               label="Repeat Always"
            />
         </Grid>
         <Grid item xs={6}>
            <TextField
               style={{width: '100%'}}
               id="limit"
               label="Repeat Until"
               value={limit}
               hidden={repeat}
               onChange={(event => setLimit(event.target.value))}
            >
            </TextField>
         </Grid>
      </>
   );

   const measureTriggerSelector = (
      <>
         <Grid item xs={1}>
            <FormLabel component="legend">When</FormLabel>
         </Grid>
         <Grid item xs={2}>
            <Radio
               checked={readType === 'WHEN'}
               onChange={(event => setReadType(event.target.value))}
               value="WHEN"
               name="radio-button-demo"
               inputProps={{ 'aria-label': 'when' }}
            />
         </Grid>
         <Grid item xs={3}>
            <TextField
               style={{width: '100%'}}
               id="frecuency-unit"
               select
               label="Frecuency Unit"
               value={frequencyUnitId}
               disabled={readType !== 'WHEN'}
               onChange={(event => setFrequencyUnitId(+event.target.value))}
            >
               {units.map((option) => (
                  <MenuItem key={option.unitId} value={option.unitId}>
                     {option.label}
                  </MenuItem>
               ))}
            </TextField>
         </Grid>

         <Grid item xs={3}>
            <TextField
               style={{width: '100%'}}
               id="operator"
               select
               label="Operator"
               value={operator}
               disabled={readType !== 'WHEN'}
               onChange={(event => setOperator(event.target.value))}
            >
               <MenuItem key="equal" value="equal">Equal to</MenuItem>
               <MenuItem key="lessThan" value="lessThan">Less than</MenuItem>
               <MenuItem key="moreThan" value="moreThan">More than</MenuItem>
            </TextField>
         </Grid>

         <Grid item xs={3}>
            <TextField
               style={{width: '100%'}}
               id="value"
               label="Value"
               value={value}
               disabled={readType !== 'WHEN'}
               onChange={(event => setValue(event.target.value))}
            >
            </TextField>
         </Grid>

         <Grid item xs={1}>
            <FormLabel component="legend">Every</FormLabel>
         </Grid>
         <Grid item xs={2}>
            <Radio
               checked={readType === 'EVERY'}
               onChange={(event => setReadType(event.target.value))}
               value="EVERY"
               name="radio-button-demo"
               inputProps={{ 'aria-label': 'every' }}
            />
         </Grid>
         <Grid item xs={3}>
            <TextField
               style={{width: '100%'}}
               id="frecuency"
               label="Frecuency"
               value={frequency}
               disabled={readType !== 'EVERY'}
               onChange={(event => setFrequency(+event.target.value))}
            >
            </TextField>
         </Grid>
         <Grid item xs={3}>
            <TextField
               style={{width: '100%'}}
               id="frecuency-unit"
               select
               label="Frecuency Unit"
               value={frequencyUnitId}
               disabled={readType !== 'EVERY'}
               onChange={(event => setFrequencyUnitId(+event.target.value))}
            >
               {units.map((option) => (
                  <MenuItem key={option.unitId} value={option.unitId}>
                     {option.label}
                  </MenuItem>
               ))}
            </TextField>
         </Grid>
         <Grid item xs={3}>
            <TextField
               style={{width: '100%'}}
               id="until-limit"
               label="Until"
               value={limit}
               disabled={readType !== 'EVERY'}
               onChange={(event => setLimit(event.target.value))}
            >
            </TextField>
         </Grid>
      </>
   );

   return (
      <>
         <Dialog maxWidth="xs" onClose={()=>setOpen(false)} aria-labelledby="customized-dialog-title" open={open}>
            <DialogTitle>
               Add / Edit Trigger
            </DialogTitle>
            <DialogContent dividers>
               <Grid container  spacing={2}>
                  <Grid item xs={12}>
                     <TextField
                        style={{width: '100%'}}
                        id="subtask-kind"
                        select
                        label="Kind"
                        value={triggerType}
                        onChange={(event => setTriggerType(event.target.value))}
                     >
                        {
                           ['EVENT', 'MEASURING', 'DATE'].filter(k => k === triggerType || !triggerTypes.find(t => t === k)).map(k => (
                              <MenuItem key={k} value={k}>{k}</MenuItem>
                           ))
                        }
                     </TextField>
                  </Grid>
                  {triggerType === 'EVENT'? eventSelector : ''}
                  {triggerType === 'MEASURING'? measureTriggerSelector : ''}
                  {triggerType === 'DATE'? dateTriggerSelector : ''}
               </Grid>
            </DialogContent>
            <DialogActions>
               <Button variant="contained" size="small" autoFocus onClick={() => setOpen(false)} color="secondary">
                  Cancel
               </Button>
               <Button variant="contained" size="small" autoFocus onClick={handleSave} color="default">
                  Add
               </Button>
            </DialogActions>
         </Dialog>
      </>
   );
};
