import React, {useEffect, useState, useCallback, useRef, FC } from 'react';
import { useLazyQuery, useMutation, useQuery } from "@apollo/react-hooks";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";
import makeStyles from "@material-ui/core/styles/makeStyles";
import update from "immutability-helper";
import EditIcon from '@material-ui/icons/Edit';
import VisibilityIcon from '@material-ui/icons/Visibility';
import DeleteIcon from '@material-ui/icons/Delete';
import PrintIcon from '@material-ui/icons/Print';
import EventIcon from '@material-ui/icons/Event';
import ApartmentIcon from '@material-ui/icons/Apartment';
import CloseIcon from '@material-ui/icons/Close';
import {useHistory} from "react-router";
import {useRouteMatch} from "react-router-dom";
import {buildFullName, clearCache} from "../../../utils/globalUtil";
import moment from 'moment';
import {GET_USER_SESSION_GQL, SessionQL} from "../../../graphql/Session.ql";
import {EntityStatusQL} from "../../../graphql/User.ql";
import {EquipmentQL, EquipmentsQL} from "../../../graphql/Equipment.ql";
import {
   FETCH_WORK_ORDERS_QL,
   FETCH_WORK_QUEUES_QL, WORK_ORDER_CHANGE_STATUS_QL,
   WorkOrderQL,
   WorkOrdersQL,
   WorkQueueQL
} from "../../../graphql/WorkOrder.ql";
import {IWorkOrder, IWorkOrderEquipment, IWorkOrderResource} from "./WorkOrderTypes";
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import {TablePaginationActions} from "../../../utils/TableUtils";
import TablePagination from '@material-ui/core/TablePagination';
import Avatar from '@material-ui/core/Avatar';
import ListItem from '@material-ui/core/ListItem';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import IconButton from '@material-ui/core/IconButton';
import CardHeader from '@material-ui/core/CardHeader';

// type WorkOrderStatus = 'IN_PROGRESS' | 'COMPLETED' | 'CLOSED';

export enum WorkOrderStatus {
   IN_PROGRESS =  'In-Progress',
   COMPLETED = 'Completed',
   CLOSED =  'Closed',
   UNKNOWN =  'Unknown',
}

interface IWorkOrderCard {
   workOrderId: number;
   code: string;
   responsibleFullName: string;
   status: WorkOrderStatus;
   percentage: number;
   equipments: string;
   createdDate: string;
   modifiedDate: string;
}

const toWorkOrderStatusEnum = (status: string): WorkOrderStatus => {
   switch (status) {
      case 'IN_PROGRESS': return WorkOrderStatus.IN_PROGRESS;
      case 'COMPLETED': return WorkOrderStatus.COMPLETED;
      case 'CLOSED': return WorkOrderStatus.CLOSED;
   }
   return WorkOrderStatus.UNKNOWN;
};

const useStyles = makeStyles(theme => ({
   board: {
      display: "flex",
      flex: 1,
      margin: "0 auto",
      fontFamily: 'Arial, "Helvetica Neue", sans-serif'
   },
   column: {
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      margin: "0 auto",
      backgroundColor: "#e9e4ec"
   },
   columnHead: {
      textAlign: "center",
      padding: 10,
      fontSize: "1.2em",
      borderRadius: '.5rem .5rem .1rem .1rem',
      backgroundColor: "#3f51b5",
      color: 'white'
   },
   columnBodyCards: {
      display: 'flex',
      flex: 1,
      flexDirection: 'column',
   },
   item: {
      padding: '.5rem',
      margin: '.5rem',
      fontSize: "0.8em",
      cursor: "pointer",
      boxShadow: '0 0 0.1rem #77797b',
      borderRadius: '.5rem',
      backgroundColor: "#fff"
   }
}));

export const WorkOrderKanban: FC = () => {
   const classes = useStyles();
   const history = useHistory();
   const [workOrders, setWorkOrders] = useState<IWorkOrderCard[]>([]);
   const [inProgressItems, setInProgressItems] = useState<IWorkOrderCard[]>([]);
   const [completedItems, setCompletedItems] = useState<IWorkOrderCard[]>([]);
   const [closedItems, setClosedItems] = useState<IWorkOrderCard[]>([]);
   const [fetchWorkOrders, { called, loading, data }] = useLazyQuery<{workOrders: WorkOrdersQL}, any>(FETCH_WORK_ORDERS_QL);
   const [workOrderChangeStatus] = useMutation<{workOrders: WorkOrdersQL}, any>(WORK_ORDER_CHANGE_STATUS_QL);

   useEffect(() => {
      fetchWorkOrders({variables: { pageIndex: 0, pageSize: 100 }});
   }, []);

   useEffect(() => {
      if(data) {
         const newWorkOrders: IWorkOrderCard[] = data.workOrders.page.content.map(w => ({
            workOrderId: w.workOrderId,
            responsibleFullName: w.responsible? buildFullName(w.responsible.firstName, w.responsible.lastName) : '',
            code: w.workOrderCode,
            status: toWorkOrderStatusEnum(w.workOrderStatus),
            equipments: '',//w.equipments.length === 1 ? w.equipments[0].name : 'Equipments: ' + w.equipments.length,
            createdDate: w.createdDate,
            percentage: w.percentage,
            modifiedDate: w.modifiedDate? 'Last Updated: ' + w.modifiedDate : 'n/a'
         }));
         setWorkOrders(newWorkOrders);
      }
   }, [called, loading, data]);

   const changeTaskStatus = useCallback(async (id : number, status: WorkOrderStatus) => {
         // @ts-ignore
         let [key] = Object.keys(WorkOrderStatus).filter(key => WorkOrderStatus[key] === status);
         const changeStatusQL = await workOrderChangeStatus({variables: {entityIds: [id], status: key}, refetchQueries: [{query: FETCH_WORK_ORDERS_QL, variables: { pageIndex: 0, pageSize: 100 }}],});
         if(changeStatusQL.data && changeStatusQL.data.workOrders.changeStatus) {
            // console.log('dummy change');
            // let [task] = workOrders.filter(task => task.workOrderId === id);
            // const taskIndex = workOrders.indexOf(task);
            // task = { ...task, status };
            // let newTasks = update(workOrders, {
            //    [taskIndex]: { $set: task }
            // });
            // setWorkOrders(newTasks);
         }
      },
      [workOrders]
   );

   const handleWorkOrder = (workOrderId: number) => {
      history.push({pathname: `/maintenances/workOrders/${workOrderId}`});
   };

   const KanbanItem: FC<{id: number}> = ({ id, children }) => {
      const ref = useRef(null);
      const [{ isDragging }, drag] = useDrag({
         item: { type: 'card', id },
         collect: monitor => ({
            isDragging: monitor.isDragging()
         })
      });
      const opacity = isDragging ? 0 : 1;
      drag(ref);
      return (
         <div ref={ref} style={{ opacity }}>{children}</div>
      );
   };

   const KanbanColumn: FC<{status: WorkOrderStatus, changeTaskStatus(id: number, status: WorkOrderStatus): void}> = ({ status, changeTaskStatus, children }) => {
      const ref = useRef(null);
      const [ , drop] = useDrop({
         accept: 'card',
         drop(item: any) {
            changeTaskStatus(item.id, status);
         }
      });
      drop(ref);
      return <div style={{flex: 1, display: 'flex'}} ref={ref}> {children}</div>;
   };

   const WorkOrderCard: FC<IWorkOrderCard> = (item: IWorkOrderCard) =>(
      <>
            <Card className={classes.item}>
               <CardHeader style={{padding: '.5rem'}}
                  avatar={<Avatar alt={item.responsibleFullName}/>}
                  title={item.responsibleFullName}
                  subheader={item.modifiedDate}
                  action={item.code}
               />
               <CardContent style={{padding: '.5rem'}}>
                  <h6><EventIcon fontSize="small"/>{item.createdDate}</h6>
                  <h5><ApartmentIcon fontSize="small"/>{item.equipments}</h5>
               </CardContent>
               <CardActions style={{padding: '.5rem', display: 'flex', justifyContent: 'space-between'}}>
                  <Typography color="textSecondary" gutterBottom>
                     {item.percentage} %
                  </Typography>
                  <ButtonGroup size="small" variant="text" color="primary">
                     <IconButton size="small" color="primary" onClick={() => handleWorkOrder(item.workOrderId)}><EditIcon/></IconButton>
                     <IconButton size="small" color="primary"><PrintIcon/></IconButton>
                     <IconButton size="small" color="secondary"><CloseIcon/></IconButton>
                  </ButtonGroup>
               </CardActions>
            </Card>
      </>
   );

   return (
      <Grid container>
         <DndProvider backend={HTML5Backend}>
            <section className={classes.board}>
               {[WorkOrderStatus.IN_PROGRESS, WorkOrderStatus.COMPLETED, WorkOrderStatus.CLOSED].map( (channel, index) => (
                  <>
                     {!index? '' : <Divider orientation="vertical" flexItem style={{marginTop: '.5rem', backgroundColor: '#3f51b5'}}/>}
                     <KanbanColumn
                        key={channel}
                        status={channel}
                        changeTaskStatus={changeTaskStatus}
                     >
                        <div className={classes.column}>
                           <div className={classes.columnHead}>{channel}</div>
                           <div className={classes.columnBodyCards}>
                              {workOrders.filter(item => item.status === channel).map(item => (
                                 <KanbanItem key={item.workOrderId} id={item.workOrderId}>
                                    <WorkOrderCard {...item}/>
                                 </KanbanItem>
                              ))}
                           </div>

                           <TablePagination
                              component="div"
                              labelRowsPerPage=''
                              rowsPerPageOptions={[]}
                              count={10}
                              rowsPerPage={5}
                              page={0}
                              onChangePage={() =>{}}
                              ActionsComponent={TablePaginationActions}
                           />
                        </div>
                     </KanbanColumn>
                  </>
               ))}
            </section>
         </DndProvider>
      </Grid>
   );
};






