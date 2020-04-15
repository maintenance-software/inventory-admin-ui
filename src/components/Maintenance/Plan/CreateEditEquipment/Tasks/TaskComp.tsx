import React, {useEffect, useContext} from 'react';
import {useHistory} from "react-router";
import {useRouteMatch} from "react-router-dom";
import {Task} from './Task';
import {ITask} from "../../../../../graphql/Maintenance.type";


export const TaskComp: React.FC<{maintenanceId: number, tasks: ITask[]}> = ({maintenanceId, tasks}) => {
   return <Task tasks={tasks} />;
};
