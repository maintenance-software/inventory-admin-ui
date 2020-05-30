import {gql} from 'apollo-boost';
import {IPage, IPageInfo} from "./page.type";
import {EntityStatus} from "./users.type";
import {ICategory, IItem, IUnit} from "./item.type";
import {IEquipment} from "./equipment.type";
import {IEmployee, IEmployeeJob} from "./persons.type";
import {IWorkOrder} from "./WorkOrder.ql";

export interface IMaintenancePlans {
   maintenance: IMaintenancePlan;
   task: ITask;
   page: IPage<IMaintenancePlan>;
   availableEquipments: IPage<IEquipment>;
   saveMaintenance: IMaintenancePlan;
   taskActivities: IPage<ITaskActivity>;
   addTaskActivityDate: boolean;
   createUpdateTasks: ITask[];
   workOrder: IWorkOrder;
   workOrders: IPage<IWorkOrder>;
   createUpdateWorkOrder: IWorkOrder;
}

export interface ITaskActivity{
   taskActivityId: number;
   scheduledDate: string;
   calculatedDate: string;
   rescheduled: boolean;
   status: EntityStatus;
   assetId: number;
   assetName: string;
   assetCode: string;
   maintenanceId: number;
   maintenanceName: string;
   taskId: number;
   taskName: string;
   taskPriority: number;
   taskTriggerId: number;
   triggerDescription: string;
}

export interface IMaintenancePlan{
   maintenanceId: number;
   name: string;
   description: string;
   status: EntityStatus;
   createdDate: string;
   modifiedDate: string;
   tasks: ITask[];
   equipments: IEquipment[];
}

export interface ITask{
   taskId: number;
   name: string;
   description: string;
   priority: number;
   duration: number;
   downTimeDuration: number;
   attribute1: string;
   attribute2: string;
   createdDate: string;
   modifiedDate: string;
   maintenanceId: number;
   taskCategory?: ICategory | null;
   subTasks: ISubTask[];
   taskTriggers: ITaskTrigger[];
   taskResources: ITaskResource[];
}

export interface ITaskTrigger {
   taskTriggerId: number;
   triggerType: string;
   description: string;
   fixedSchedule: boolean;
   frequency: number;
   readType: string;
   limit: string;
   repeat: boolean;
   operator: string;
   value: string;
   unit?: IUnit;
   eventTriggerCategory?: ICategory;
   createdDate: string;
   modifiedDate: string;

}

export interface ITaskCategory {
   taskCategoryId: number;
   name: string;
   description: string;
   createdDate: string;
   modifiedDate: string;
}

// export interface IEventTrigger {
//    eventTriggerId: number;
//    name: string;
//    description: string;
//    createdDate: string;
//    modifiedDate: string;
// }

export interface ITaskResource {
   taskResourceId: number;
   order: number;
   amount: number;
   resourceType: string;
   unit: IUnit;
   employeeCategory?: ICategory;
   inventoryResource?: IItem;
   createdDate: string;
   modifiedDate: string;
}

export interface ISubTask {
   subTaskId: number;
   order: number;
   group: string;
   description: string;
   mandatory: boolean;
   createdDate: string;
   modifiedDate: string;
   subTaskCategory: ICategory;
}

// export interface ISubTaskKind {
//    subTaskKindId: number;
//    name: string;
//    description: string;
//    createdDate: string;
//    modifiedDate: string;
// }

export const getMaintenancePlanDefaultInstance = ():IMaintenancePlan => ({
   maintenanceId: 0,
   name: '',
   description: '',
   status: EntityStatus.ACTIVE,
   createdDate: '',
   modifiedDate: '',
   tasks: [],
   equipments: [],
});

export const getTaskDefaultInstance = ():ITask => ({
   taskId: 0,
   name: '',
   description: '',
   priority: 5,
   duration: 0,
   downTimeDuration: 0,
   attribute1: '',
   attribute2: '',
   createdDate: '',
   modifiedDate: '',
   taskCategory: null,
   maintenanceId: 0,
   subTasks: [],
   taskTriggers: [],
   taskResources: []
});

export const getTaskResourceDefaultInstance = ():ITaskResource => ({
   taskResourceId: 0,
   order: 0,
   amount: 1,
   resourceType: 'INVENTORY',
   unit: {
      unitId: 0,
      label: '',
      key: ''
   },
   createdDate: '',
   modifiedDate: ''
});

export const getTaskTriggerDefaultInstance = ():ITaskTrigger => ({
   taskTriggerId: 0,
   triggerType: '',
   description: '',
   fixedSchedule: false,
   frequency: 0,
   readType: '',
   limit: '',
   repeat: false,
   operator: '',
   value: '',
   createdDate: '',
   modifiedDate: ''
});

export const getSubTaskDefaultInstance = ():ISubTask => ({
   subTaskId: 0,
   order: 0,
   group: '',
   description: '',
   mandatory: false,
   createdDate: '',
   modifiedDate: '',
   subTaskCategory: {
      categoryId: 0,
      name: '',
      description: ''
   },
});

export const FETCH_MAINTENANCE_PLAN_GQL = gql`
   query fetchMaintenancePlans {
      maintenances {
         page {
            totalCount
            content {
               maintenanceId
               name
               description
               status
            }
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

export const FETCH_EQUIPMENTS_AVAILABLE_GQL = gql`
   query fetchEquipmentsAvailable($searchString: String, $pageIndex: Int, $pageSize: Int, $filters: [Predicate!]) {
      maintenances {
         availableEquipments(searchString: $searchString, pageIndex: $pageIndex, pageSize: $pageSize, filters: $filters) {
            totalCount
            content {
               equipmentId
               code
               name
               description
               status
            }
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

export const FETCH_TASKS_FOR_EQUIPMENT_QL = gql`
   query fetchTasksForEquipment($equipmentId: Int!) {
      maintenances {
         equipmentTasks(entityId: $equipmentId) {
            taskId
            name
            maintenanceId
            taskTriggers {
               taskTriggerId
               triggerType
               eventTriggerCategory {
                  categoryId
                  name
               }
            }
         }
      }
   }
`;

export const FETCH_TASK_ACTIVITIES_GQL = gql`
   query fetchTaskActivities($searchString: String, $pageIndex: Int, $pageSize: Int, $filters: [Predicate!]) {
      maintenances {
         taskActivities(searchString: $searchString, pageIndex: $pageIndex, pageSize: $pageSize, filters: $filters) {
            totalCount
            content {
               taskActivityId
               scheduledDate
               calculatedDate
               rescheduled
               status
               assetId
               assetName
               assetCode
               maintenanceId
               maintenanceName
               taskId
               taskName
               taskPriority
               taskTriggerId
               triggerDescription
            }
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

export const GET_MAINTENANCE_PLAN_BY_ID = gql`
   query getMaintenancePlanById($maintenanceId: Int!) {
      maintenances {
         maintenance(entityId: $maintenanceId) {
            maintenanceId
            name
            description
            status
            tasks {
               taskId
               name
               description
               priority
               duration
               downTimeDuration
               attribute1
               attribute2
               createdDate
               modifiedDate
               taskCategory {
                  categoryId
                  name
                  description   
               }
            }
            
            equipments {
               equipmentId
               code
               name
               description
               createdDate
            }
         }
      }
   }
`;

export const GET_TASK_BY_ID = gql`
   query getTaskById($taskId: Int!) {
      maintenances {
         task(entityId: $taskId) {
            taskId
            name
            description
            priority
            duration
            downTimeDuration
            attribute1
            attribute2
            createdDate
            modifiedDate
            taskCategory {
               categoryId
               name
               description
            }
            taskTriggers {
               taskTriggerId
               triggerType
               description
               fixedSchedule
               frequency
               readType
               limit
               repeat
               operator
               value
               unit {
                  unitId
                  key
                  label
               }
               eventTriggerCategory {
                  categoryId
                  name
               }
            }
            subTasks {
               subTaskId
               description
               group
               mandatory
               order
               subTaskCategory {
                  categoryId
                  name
                  description
               }
            }

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

export const SAVE_MAINTENANCE_PLAN = gql`
   mutation saveMaintenancePlan(
      $maintenanceId: Int!
      $name: String!
      $description: String! 
      $status: String!
   ) {
      maintenances {
         saveMaintenance(
            maintenanceId: $maintenanceId
            name: $name
            description: $description
            status: $status         
         ) {
            maintenanceId
         }
      }
   }
`;

export const SAVE_TASK_ACTIVITY_DATE_GQL = gql`
   mutation saveTaskActivityDate(
   $lastMaintenanceDate: String!
   $assetId: Int!
   $maintenanceId: Int!
   ) {
      maintenances {
         addTaskActivityDate(lastMaintenanceDate: $lastMaintenanceDate, assetId: $assetId, maintenanceId: $maintenanceId)
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
      maintenances {
         addTaskActivityEvent(
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

export const SAVE_MAINTENANCE_TASKS = gql`
   mutation saveMaintenanceTasks(
      $maintenanceId: Int!
      $tasks: [TaskArg!]!
   ) {
      maintenances {
         createUpdateTasks(maintenanceId: $maintenanceId, tasks: $tasks) {
            taskId
         }
      }
   }
`;

// export const FETCH_TASK_CATEGORIES = gql`
//    query fetchTaskCategories{
//       taskCategories {
//          taskCategoryId
//          name
//       }
//    }
// `;

// export const FETCH_SUBTASK_KINDS = gql`
//    query fetchSubtaskKinds{
//       subTaskKinds {
//          subTaskKindId
//          name
//       }
//    }
// `;

// export const FETCH_EVENT_TRIGGERS = gql`
//    query fetchEventTriggers{
//       maintenances {
//          eventTriggers {
//             eventTriggerId
//             name
//          }
//       }
//    }
// `;
