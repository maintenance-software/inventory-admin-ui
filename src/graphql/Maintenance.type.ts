import {gql} from 'apollo-boost';
import {IPage, IPageInfo} from "./page.type";
import {EntityStatus} from "./users.type";
import {IItem, IUnit} from "./item.type";
import {IEquipment} from "./equipment.type";
import {IEmployee, IEmployeeJob} from "./persons.type";

export interface IMaintenancePlans {
   maintenance: IMaintenancePlan;
   task: ITask;
   page: IPage<IMaintenancePlan>;
   saveMaintenance: IMaintenancePlan;
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
   taskCategory: ITaskCategory | null;
   subTasks: ISubTask[];
   taskTriggers: ITaskTrigger[];
   taskResources: ITaskResource[];
}

export interface ITaskTrigger {
   taskTriggerId: number;
   kind: string;
   description: string;
   fixedSchedule: boolean;
   frequency: number;
   readType: string;
   limit: string;
   repeat: boolean;
   operator: string;
   value: string;
   unit?: IUnit;
   eventTrigger?: IEventTrigger;
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

export interface IEventTrigger {
   eventTriggerId: number;
   name: string;
   description: string;
   createdDate: string;
   modifiedDate: string;
}

export interface ITaskResource {
   taskResourceId: number;
   order: number;
   amount: number;
   resourceType: string;
   unit: IUnit;
   employeeJob?: IEmployeeJob;
   humanResource?: IEmployee;
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
   subTaskKind: ISubTaskKind;
}

export interface ISubTaskKind {
   subTaskKindId: number;
   name: string;
   description: string;
   createdDate: string;
   modifiedDate: string;
}

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
   kind: 'EVENT',
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
   subTaskKind: {
      subTaskKindId: 0,
      name: '',
      description: '',
      createdDate: '',
      modifiedDate: ''
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
                  taskCategoryId
                  name
                  description   
               }
            }
            
            equipments {
               equipmentId
               code
               name
               description
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
               taskCategoryId
               name
               description
            }
            taskTriggers {
               taskTriggerId
               kind
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
               eventTrigger {
                  eventTriggerId
                  name
               }
            }
            subTasks {
               subTaskId
               description
               group
               mandatory
               order
               subTaskKind {
                  subTaskKindId
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
               humanResource {
                  employeeId
                  firstName
                  lastName
               }
               employeeJob {
                  employeeJobId
                  tittle
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

export const FETCH_TASK_CATEGORIES = gql`
   query fetchTaskCategories{
      taskCategories {
         taskCategoryId
         name
      }
   }
`;

export const FETCH_SUBTASK_KINDS = gql`
   query fetchSubtaskKinds{
      subTaskKinds {
         subTaskKindId
         name
      }
   }
`;

export const FETCH_EVENT_TRIGGERS = gql`
   query fetchEventTriggers{
      maintenances {
         eventTriggers {
            eventTriggerId
            name
         }
      }
   }
`;
