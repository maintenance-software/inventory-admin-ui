import React, {useEffect, useContext} from 'react';
import { useLazyQuery, useMutation, useQuery } from "@apollo/react-hooks";
import {useHistory} from "react-router";
import {useRouteMatch} from "react-router-dom";
import {WorkOrders} from './components/WorkOrders';
import {
   FETCH_TASK_ACTIVITIES_GQL,
   MaintenancesQL,
   TaskActivityQL,
   SAVE_TASK_ACTIVITY_EVENT_GQL
} from "../../../graphql/Maintenance.ql";
import {buildFullName, clearCache} from "../../../utils/globalUtil";
import moment from 'moment';
import {GET_USER_SESSION_GQL, SessionQL} from "../../../graphql/Session.ql";
import {EntityStatusQL} from "../../../graphql/User.ql";
import {EquipmentQL, EquipmentsQL} from "../../../graphql/Equipment.ql";
import {
   FETCH_WORK_ORDERS_QL,
   FETCH_WORK_QUEUES_QL,
   WorkOrderQL,
   WorkOrdersQL,
   WorkQueueQL
} from "../../../graphql/WorkOrder.ql";
import {IWorkOrder, IWorkOrderEquipment, IWorkOrderResource} from "./WorkOrderTypes";

// export interface IWorkOrderEquipment {
//    equipmentId: number;
//    name: string;
//    code: string;
//    taskCount: number;
//    maintenanceCount: number;
//    workQueues: IWorkQueues[];
// }
//
// export interface IWorkQueues {
//    workQueueTaskId: number;
//    rescheduledDate: string;
//    scheduledDate: string;
//    status: EntityStatusQL;
//    taskName: string;
//    taskPriority: number;
//    taskCategoryId: number;
//    taskCategoryName: string;
//    triggerDescription: string;
//    taskId: number;
//    taskTriggerId: number;
//    taskResources: IWorkOrderResource[];
//    valid: boolean;
// }

export const WorkOrdersContainer: React.FC = () => {
   const history = useHistory();
   const { path } = useRouteMatch();
   const [open, setOpen] = React.useState(false);
   const [workQueueEquipmentSelected, setWorkQueueEquipmentSelected] = React.useState<IWorkOrderEquipment[]>([]);
   const [pageIndex, setPageIndex] = React.useState(0);
   const [pageSize, setPageSize] = React.useState(10);
   const [searchString, setSearchString] = React.useState<string>('');
   const sessionQL = useQuery<{session: SessionQL}, any>(GET_USER_SESSION_GQL);
   const [fetchWorkOrders, { called, loading, data }] = useLazyQuery<{workOrders: WorkOrdersQL}, any>(FETCH_WORK_ORDERS_QL);
   const [saveTaskActivityEvent, saveActivityStatus] = useMutation<{ maintenances: MaintenancesQL }, any>(SAVE_TASK_ACTIVITY_EVENT_GQL);
   useEffect(() => {
      fetchWorkOrders({variables: { searchString, pageIndex: pageIndex, pageSize: pageSize }});
   }, []);

   useEffect(() => {
      fetchWorkOrders({variables: { searchString, pageIndex, pageSize }});
   }, [pageIndex, pageSize, searchString]);

   if (loading || !data) return <div>Loading</div>;

   const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
      setPageIndex(newPage);
   };

   const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setPageSize(parseInt(event.target.value, 10));
      setPageIndex(0);
   };

   const handleSearch = (searchString: string) => {
      setSearchString(searchString);
      setPageIndex(0);
   };

   const handleWorkOrder = (workOrderId: number) => {
      history.push({pathname: `/maintenances/workOrders/${workOrderId}`});
   };

   const workOrders: IWorkOrder[] = data.workOrders.page.content.map((workOrder: WorkOrderQL) => ({
      workOrderId: workOrder.workOrderId,
      workOrderCode: workOrder.workOrderCode,
      workOrderStatus: workOrder.workOrderStatus,
      estimateDuration: workOrder.estimateDuration,
      executionDuration: workOrder.executionDuration,
      rate: workOrder.rate,
      totalCost: workOrder.totalCost,
      percentage: workOrder.percentage,
      notes: workOrder.notes,
      responsibleId: workOrder.responsible.personId,
      responsibleName: buildFullName(workOrder.responsible.firstName, workOrder.responsible.lastName),
      generatedById: workOrder.generatedBy.personId,
      generatedByName: buildFullName(workOrder.generatedBy.firstName, workOrder.generatedBy.lastName),
      equipments: workOrder.equipments.map(e => ({
         equipmentId: e.equipmentId,
         name: e.name,
         code: e.code,
         taskCount: 0,
         maintenanceCount: 0,
         workOrderTasks: [],
      }))
   }));

   return(
   <>
      <WorkOrders
         workOrders={workOrders}
         totalCount={data.workOrders.page.totalCount}
         pageIndex={data.workOrders.page.pageInfo.pageIndex}
         pageSize={data.workOrders.page.pageInfo.pageSize}
         searchString={searchString}
         onChangePage={handleChangePage}
         onChangeRowsPerPage={handleChangeRowsPerPage}
         onSearchWorkOrder={handleSearch}
         workOrderSelected={[]}
         onWorkOrder={handleWorkOrder}
      />
   </>);
};
