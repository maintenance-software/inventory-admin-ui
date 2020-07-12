import {gql} from 'apollo-boost';
import {getPersonDefaultInstance, PersonQL} from "./Person.ql";
import {
   getTaskDefaultInstance,
   getTaskTriggerDefaultInstance,
   ITaskTriggerQL,
   SubTaskQL,
   TaskQL
} from "./Maintenance.ql";
import {EquipmentQL, getDefaultEquipmentInstance} from "./Equipment.ql";
import {InventoryItemQL} from "./Inventory.ql";
import {PageQL} from "./Common.ql";

export interface WorkOrdersQL {
   workOrder: WorkOrderQL;
   page: PageQL<WorkOrderQL>;
   createUpdateWorkOrder: WorkOrderQL;
   changeStatus: boolean;
   saveWorkOrderProgress: boolean;
}

export interface WorkOrderQL {
   workOrderId: number;
   workOrderCode: string;
   workOrderStatus: string;
   estimateDuration: number;
   executionDuration: number;
   rate: number;
   totalCost: number;
   percentage: number;
   notes: string;
   generatedBy: PersonQL;
   responsible: PersonQL;
   parent?: WorkOrderQL;
   workQueues: WorkQueueQL[];
   createdDate: string;
   modifiedDate: string;
}

export interface WorkQueuesQL {
   fetchPendingWorkQueues: PageQL<WorkQueueQL>;
   addWorkQueueDate: boolean;
   addWorkQueueEvent: boolean;
}

export interface WorkQueueQL {
   workQueueId: number;
   rescheduledDate: string;
   scheduledDate: string;
   incidentDate: string;
   rescheduled: boolean;
   status: string;
   workType: string;
   equipment: EquipmentQL;
   task: TaskQL;
   taskTrigger: ITaskTriggerQL;
   startWorkDate: string;
   finishedWorkDate: string;
   notes: string;
   outOfServiceInterval: number;
   workOrderResources: WorkOrderResourceQL[];
   workOrderSubTask: WorkOrderSubTaskQL[];
   createdDate: string;
   modifiedDate: string;
}

export interface WorkOrderResourceQL {
   workOrderResourceId: number;
   amount: number;
   humanResource: PersonQL;
   inventoryItem: InventoryItemQL;
   workQueue: WorkQueueQL;
   createdDate: string;
   modifiedDate: string;
}

export interface WorkOrderSubTaskQL {
   workOrderSubTaskId: number;
   value: string;
   subTask: SubTaskQL;
   workQueue: WorkQueueQL;
   createdDate: string;
   modifiedDate: string;
}

export const getWorkOrderDefaultInstance = ():WorkOrderQL => ({
   workOrderId: 0,
   workOrderCode: '',
   workOrderStatus: '',
   estimateDuration: 0,
   executionDuration: 0,
   rate: 0,
   totalCost: 0,
   percentage: 0,
   notes: '',
   generatedBy: getPersonDefaultInstance(),
   responsible: getPersonDefaultInstance(),
   workQueues: [],
   createdDate: '',
   modifiedDate: '',
});

export const getWorkQueueDefaultInstance = ():WorkQueueQL => ({
   workQueueId: 0,
   rescheduledDate: '',
   scheduledDate: '',
   incidentDate: '',
   rescheduled: false,
   status: '',
   workType: '',
   equipment: getDefaultEquipmentInstance(),
   task: getTaskDefaultInstance(),
   taskTrigger: getTaskTriggerDefaultInstance(),
   startWorkDate: '',
   finishedWorkDate: '',
   notes: '',
   outOfServiceInterval: 0,
   workOrderResources: [],
   workOrderSubTask: [],
   createdDate: '',
   modifiedDate: '',
});

export const SAVE_TASK_ACTIVITY_DATE_GQL = gql`
   mutation saveTaskActivityDate(
      $lastMaintenanceDate: String!
      $assetId: Int!
      $maintenanceId: Int!
   ) {
      workQueues {
         addWorkQueueDate(lastMaintenanceDate: $lastMaintenanceDate, assetId: $assetId, maintenanceId: $maintenanceId)
      }
   }
`;

export const SAVE_TASK_ACTIVITY_EVENT_GQL = gql`
   mutation saveTaskActivityEvent(
      $taskTriggerId: Int!
      $taskId: Int!
      $maintenanceId: Int
      $assetId: Int!
      $hasAssetFailure: Boolean!
      $incidentDate: String
      $reportedById: Int!
   ) {
      workQueues {
         addWorkQueueEvent(
            taskTriggerId: $taskTriggerId,
            taskId: $taskId,
            maintenanceId: $maintenanceId,
            assetId: $assetId,
            hasAssetFailure: $hasAssetFailure,
            incidentDate: $incidentDate,
            reportedById: $reportedById
         )
      }
   }
`;

export const FETCH_WORK_QUEUES_QL = gql`
   query fetchWorkQueues($searchString: String, $pageIndex: Int, $pageSize: Int, $filters: [Predicate!]) {
      workQueues {
         fetchPendingWorkQueues(searchString: $searchString, pageIndex: $pageIndex, pageSize: $pageSize, filters: $filters) {
            content {
               workQueueId
               rescheduledDate
               scheduledDate
               incidentDate
               status
               workType
               equipment {
                  equipmentId
                  name
                  code
               }
               task {
                  taskId
                  name
                  taskCategory {
                     categoryId
                     name
                  }
               }
               taskTrigger {
                  taskTriggerId
                  description
                  triggerType
               }
            }
            totalCount
            pageInfo {
               hasNext
               hasPreview
               pageSize
               pageIndex
            }
         }
      }
   }
`;

export const GET_INVENTORY_ITEMS_BY_ITEM_ID_QL = gql`
   query getInventoryItemByItemId($itemId: Int!) {
      items {
         item (entityId: $itemId) {
            inventoryItems {
               content {
                  inventoryItemId
                  inventory {
                     inventoryId
                     name
                  }
               }
            }
         }
      }
   }
`;

export const FETCH_WORK_ORDERS_QL = gql`
   query fetchWorkOrders {
      workOrders {
         page {
            content {
               workOrderId
               workOrderCode
               workOrderStatus
               estimateDuration
               executionDuration
               rate
               totalCost
               percentage
               notes
               generatedBy {
                  personId
                  firstName
                  lastName
               }
               responsible {
                  personId
                  firstName
                  lastName
               }
               workQueues {
                  equipment {
                     equipmentId
                     name
                     code
                  }
                  task {
                     taskId
                     name
                  }
                  taskTrigger {
                     taskTriggerId
                     description
                     triggerType
                  }
               }
               createdDate
               modifiedDate
            }
            totalCount
            pageInfo {
               hasNext
               hasPreview
               pageSize
               pageIndex
            }
         }
         
      }
   }
`;

export const GET_WORK_ORDER_BY_ID_QL = gql`
   query getWorkOrderById($workOrderId: Int!) {
      workOrders {
         workOrder(entityId: $workOrderId) {
            workOrderId
            workOrderCode
            workOrderStatus
            estimateDuration
            executionDuration
            rate
            totalCost
            percentage
            notes
            generatedBy {
               personId
               firstName
               lastName
            }
            responsible {
               personId
               firstName
               lastName
            }
            workQueues {
               workQueueId
               workType
               scheduledDate
               status
               startWorkDate
               finishedWorkDate
               notes
               equipment {
                  equipmentId
                  name
                  code
               }
               task {
                  taskId
                  name
                  priority
                  duration
                  taskCategory {
                     categoryId
                     name
                  }
               }
               taskTrigger {
                  taskTriggerId
                  triggerType
               }
               workOrderResources {
                  workOrderResourceId
                  amount
                  humanResource {
                     personId
                     firstName
                     lastName
                  }
                  inventoryItem {
                     inventoryItemId
                     item {
                        itemId
                        name
                     }
                  }
               }
               workOrderSubTask {
                  workOrderSubTaskId
                  value
                  subTask {
                     subTaskId
                     subTaskCategory {
                        categoryId
                        name
                        key
                     }
                     description
                  }
               }
            }
            createdDate
            modifiedDate
         }
      }
   }
`;

export const SAVE_WORK_ORDER_QL = gql`
   mutation saveWorkOrder(
      $workOrderId: Int!
      $estimateDuration: Int!
      $rate: Int!
      $notes: String!
      $generatedById: Int!
      $responsibleId: Int!
      $workQueueIds: [Int!]!
      $resources: [WorkOrderResourceArg!]!
   ) {
      workOrders {
         createUpdateWorkOrder(
            workOrderId: $workOrderId
            estimateDuration: $estimateDuration
            rate: $rate
            notes: $notes
            generatedById: $generatedById
            responsibleId: $responsibleId
            workQueueIds: $workQueueIds
            resources: $resources
         ) {
            workOrderId
            workOrderCode
         }
      }
   }
`;

export const WORK_ORDER_CHANGE_STATUS_QL = gql`
   mutation workOrderChangeStatus(
      $entityIds: [Int!]!
      $status: String!
   ) {
      workOrders {
         changeStatus(entityIds: $entityIds, status: $status)
      }
   }
`;

export const SAVE_WORK_ORDER_PROGRESS_GQL = gql`
   mutation saveWorkOrderProgress(
       $workQueueId: Int!,
       $workOrderId: Int!,
       $startWorkDate: String!,
       $finishedWorkDate: String!,
       $notes: String!,
       $status: String!,
       $workOrderSubTasks: [WorkOrderSubTaskArg!]!
   ) {
      workOrders {
         saveWorkOrderProgress(
            workQueueId: $workQueueId
            workOrderId: $workOrderId
            startWorkDate: $startWorkDate
            finishedWorkDate: $finishedWorkDate
            notes: $notes
            status: $status
            workOrderSubTasks: $workOrderSubTasks
         )
      }
   }
`;

export const GET_TASK_RESOURCE_BY_ID_QL = gql`
   query getTaskForWorkOrderById($taskId: Int!) {
      maintenances {
         task(entityId: $taskId) {
            taskResources {
               taskResourceId
               order
               amount
               resourceType
               unit {
                  unitId
                  label
               }
               employeeCategory {
                  categoryId
                  name
                  description
               }
               inventoryResource {
                  itemId
                  code
                  name
               }
            }
            subTasks {
               subTaskId
               order
               description
               mandatory
               subTaskCategory {
                  categoryId
                  name
                  key
               }
            }
         }
      }
   }
`;
