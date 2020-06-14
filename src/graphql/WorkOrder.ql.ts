import {gql} from 'apollo-boost';
import {getPersonDefaultInstance, PersonQL} from "./Person.ql";
import {EntityStatusQL} from "./User.ql";
import {ITaskTriggerQL, TaskQL} from "./Maintenance.ql";

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
   // workOrderResource: WorkOrderResourceQL[];
   createdDate: string;
   modifiedDate: string;
}

export interface WorkQueueQL {
   workQueueId: number;
   rescheduledDate: string;
   scheduledDate: string;
   incidentDate: string;
   rescheduled: boolean;
   status: EntityStatusQL;
   workType: string;
   task: TaskQL;
   taskTrigger: ITaskTriggerQL;
   createdDate: string;
   modifiedDate: string;
}

export interface WorkOrderResourceQL {
   resourceId: number;
   name: string;
   itemId: number;
   inventoryItemId: number;
   employeeCategoryId: number;
   personId: number;
   resourceType: string;
   amount: number;
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
   modifiedDate: ''
});


export const FETCH_WORK_QUEUES_QL = gql`
   query fetchWorkQueues($searchString: String, $pageIndex: Int, $pageSize: Int, $filters: [Predicate!]) {
      equipments {
         fetchWorkQueues(searchString: $searchString, pageIndex: $pageIndex, pageSize: $pageSize, filters: $filters) {
            content {
               equipmentId
               name
               code
               workQueues {
                  workQueueId
                  rescheduledDate
                  scheduledDate
                  incidentDate
                  status
                  workType
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
      maintenances {
         workOrders {
            content {
               workOrderId
               workOrderCode
               workOrderStatus
               responsible {
                  personId
                  firstName
                  lastName
               }
               percentage
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
      maintenances {
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
      maintenances {
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
         }
      }
   }
`;
