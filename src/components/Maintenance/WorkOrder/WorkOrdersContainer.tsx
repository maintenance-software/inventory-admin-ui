import React, {useEffect, useContext} from 'react';
import { useLazyQuery, useMutation, useQuery } from "@apollo/react-hooks";
import {useHistory} from "react-router";
import {useRouteMatch} from "react-router-dom";
import {WorkOrders} from './components/WorkOrders';
import {buildFullName, clearCache} from "../../../utils/globalUtil";
import {GET_USER_SESSION_GQL, SessionQL} from "../../../graphql/Session.ql";
import {
   FETCH_WORK_ORDERS_QL,
   FETCH_WORK_QUEUES_QL,
   WorkOrderQL,
   WorkOrdersQL,
   WorkQueueQL
} from "../../../graphql/WorkOrder.ql";
import {IWorkOrder, IWorkQueueEquipment, IWorkOrderResource} from "./WorkOrderTypes";
import {workQueuesConverter} from "./converter";

export const WorkOrdersContainer: React.FC = () => {
   const history = useHistory();
   const { path } = useRouteMatch();
   const [open, setOpen] = React.useState(false);
   const [workQueueEquipmentSelected, setWorkQueueEquipmentSelected] = React.useState<IWorkQueueEquipment[]>([]);
   const [pageIndex, setPageIndex] = React.useState(0);
   const [pageSize, setPageSize] = React.useState(10);
   const [searchString, setSearchString] = React.useState<string>('');
   const sessionQL = useQuery<{session: SessionQL}, any>(GET_USER_SESSION_GQL);
   const [fetchWorkOrders, { called, loading, data }] = useLazyQuery<{workOrders: WorkOrdersQL}, any>(FETCH_WORK_ORDERS_QL);
   // const [saveTaskActivityEvent, saveActivityStatus] = useMutation<{ maintenances: MaintenancesQL }, any>(SAVE_TASK_ACTIVITY_EVENT_GQL);
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
      equipments:  workQueuesConverter(workOrder.workQueues)
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
