import React, { FC, useEffect } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import CommentIcon from '@material-ui/icons/Comment';
import {TaskQL} from "../../../graphql/Maintenance.ql";
import {ISimpleItem} from "../../Assets/Commons/AssetChooser/AssetChooser";

const useStyles = makeStyles((theme: Theme) =>
   createStyles({
      root: {
         width: '100%',
         maxWidth: 360,
         backgroundColor: theme.palette.background.paper,
      },
   }),
);

export interface ITaskItems {
   taskId: number;
   taskName: string;
   eventName: string;
}

export const TaskChooser:FC<{tasks: ITaskItems[], selected: number, onTaskSelected(taskId: number):void}> = ({tasks, selected, onTaskSelected}) => {
   const classes = useStyles();
   const [checked, setChecked] = React.useState<number[]>([selected]);

   useEffect(() => {
      setChecked([selected])
   }, [selected]);

   const handleToggle = (value: number) => () => {
      setChecked([value]);
      onTaskSelected(value);
   };

   if(tasks.length === 0 ) {
      return <div>No task found</div>
   }

   return (
      <List className={classes.root}>
         {tasks.map((value) => {
      const labelId = `checkbox-list-label-${value}`;

      return (
         <ListItem key={value.taskId} role={undefined} dense button onClick={handleToggle(value.taskId)}>
            <ListItemIcon>
               <Checkbox
                  edge="start"
                  checked={checked.indexOf(value.taskId) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{'aria-labelledby': labelId}}
               />
            </ListItemIcon>
            <ListItemText id={labelId} primary={value.taskName}/>
            <ListItemSecondaryAction>
               {value.eventName}
            </ListItemSecondaryAction>
         </ListItem>
      );
         })}
      </List>
);
};
