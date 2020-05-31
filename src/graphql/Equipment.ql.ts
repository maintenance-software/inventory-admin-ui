import {gql} from 'apollo-boost';
import {PageQL} from "./Common.ql";
import {EntityStatusQL} from "./User.ql";

export interface EquipmentsQL {
   equipment: EquipmentQL;
   page: PageQL<EquipmentQL>;
   saveEquipment: EquipmentQL;
}

export interface EquipmentQL {
   equipmentId: number;
   name: string;
   description: string;
   code: string;
   partNumber: string;
   manufacturer: string;
   model: string;
   notes: string;
   status: EntityStatusQL;
   images: string[];
   priority: number;
   hoursAverageDailyUse: number;
   outOfService: boolean;
   purchaseDate: string;
   children: EquipmentQL[];
   parent: EquipmentQL | null;
   createdDate: string;
   modifiedDate: String;
}

export const getDefaultEquipmentInstance = ():EquipmentQL => ({
   equipmentId: 0,
   name: '',
   description: '',
   code: '',
   partNumber: '',
   manufacturer: '',
   model: '',
   notes: '',
   status: EntityStatusQL.ACTIVE,
   images: [],
   priority: 0,
   hoursAverageDailyUse: 0,
   outOfService: false,
   purchaseDate: '',
   children: [],
   parent: null,
   createdDate: '',
   modifiedDate: ''
});

export const FETCH_EQUIPMENTS_PAGE_GQL = gql`
query fetchEquipmentPage($searchString: String, $pageIndex: Int, $pageSize: Int, $filters: [Predicate!]){
  equipments {
    page(searchString: $searchString, pageIndex: $pageIndex, pageSize: $pageSize, filters: $filters){
      totalCount
      content {
        equipmentId
        name
        code
        status        
        priority
        outOfService
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

export const GET_EQUIPMENT_BY_ID = gql`
   query getEquipmentById($equipmentId: Int!) {
      equipments {
         equipment(entityId: $equipmentId) {
           equipmentId
           name
           description
           code
           partNumber
           manufacturer
           model
           notes
           status
           images
           priority
           hoursAverageDailyUse
           outOfService
           purchaseDate
           parent {
            equipmentId
            name
           } 
         }
      }
   }
`;

export const SAVE_EQUIPMENT = gql`
mutation saveEquipment(
     $equipmentId: Int!
   , $name: String!
   , $description: String
   , $code: String!
   , $partNumber: String
   , $manufacturer: String
   , $model: String
   , $notes: String
   , $status: String!
   , $images: [String!]!
   , $priority: Int!
   , $hoursAverageDailyUse: Int!
   , $outOfService: Boolean!
   , $purchaseDate: String
   , $parentId: Int
){
  equipments {
      saveEquipment(
           equipmentId: $equipmentId
         , name: $name
         , description: $description
         , code: $code
         , partNumber: $partNumber
         , manufacturer: $manufacturer
         , model: $model
         , notes: $notes
         , status: $status
         , images: $images
         , priority: $priority
         , hoursAverageDailyUse: $hoursAverageDailyUse
         , outOfService: $outOfService
         , purchaseDate: $purchaseDate
         , parentId: $parentId
      ) {
       equipmentId
      }
  }
}
`;

export const SET_MAINTENANCE_GQL = gql`
   mutation setMaintenance(
      $equipmentId: Int!,
      $maintenanceId: Int!
   ){
      equipments {
         setMaintenance(
            equipmentId: $equipmentId,
            maintenanceId: $maintenanceId
         )
      }
   }
`;
