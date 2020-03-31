import {gql} from 'apollo-boost';
import {IPage} from "./page.type";
import {EntityStatus} from "./users.type";

export interface IEquipments {
   equipment: IEquipment;
   page: IPage<IEquipment>;
   saveEquipment: IEquipment;
}

export interface IEquipment {
   equipmentId: number;
   name: string;
   description: string;
   code: string;
   partNumber: string;
   manufacturer: string;
   model: string;
   notes: string;
   status: EntityStatus;
   images: string[];
   priority: number;
   hoursAverageDailyUse: number;
   outOfService: boolean;
   purchaseDate: string;
   children: IEquipment[];
   parent: IEquipment | null;
   createdDate: string;
   modifiedDate: String;
}

export const getDefaultEquipmentInstance = ():IEquipment => ({
   equipmentId: 0,
   name: '',
   description: '',
   code: '',
   partNumber: '',
   manufacturer: '',
   model: '',
   notes: '',
   status: EntityStatus.ACTIVE,
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
