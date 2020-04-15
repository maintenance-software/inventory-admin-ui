import {gql} from 'apollo-boost';
import {IPage, IPageInfo} from "./page.type";
import {EntityStatus} from "./users.type";
import {IItem} from "./item.type";
import {IEquipment} from "./equipment.type";

export interface IMaintenancePlans {
   maintenance: IMaintenancePlan;
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
   taskCategoryArg: ITaskCategory;
   subTasks: ISubTask[];
}

export interface ITaskCategory {
   taskCategoryId: number;
   name: string;
   description: string;
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
         }
      }
   }
`;

export const FETCH_INVENTORY_ITEMS = gql`
   query getInventoryItems($inventoryId: Int!) {
      inventories {
         inventory(entityId: $inventoryId) {
            inventoryItems {
               totalCount
               content {
               inventoryItemId
                  level
                  maxLevelAllowed
                  minLevelAllowed
                  price
                  location
                  dateExpiry
                  item {
                     itemId
                     name
                     itemType
                  }
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
   }
`;

export const FETCH_AVAILABLE_ITEMS = gql`
   query fetchAvaillableItems($inventoryId: Int!, $searchString: String, $pageIndex: Int, $pageSize: Int, $filters: [Predicate!] ) {
      inventories {
         inventory(entityId: $inventoryId) {
            availableItems(searchString: $searchString, pageIndex: $pageIndex, pageSize: $pageSize, filters: $filters) {
               totalCount
               content {
                  itemId
                  code
                  name
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

export const SAVE_INVENTORY_ITEMS = gql`
   mutation saveInventoryItems(
      $inventoryId: Int!
      $itemIds: [Int!]!
      $level: Int!
      $maxLevelAllowed: Int!
      $minLevelAllowed: Int!
      $price: Float!
      $location: String!
      $dateExpiry: String!
   ) {
      inventories {
         saveInventoryItems(
            inventoryId: $inventoryId
            itemIds: $itemIds
            level: $level
            maxLevelAllowed: $maxLevelAllowed
            minLevelAllowed: $minLevelAllowed
            price: $price
            location: $location
            dateExpiry: $dateExpiry         
         ) {
            inventoryItemId
         }
      }
   }
`;
