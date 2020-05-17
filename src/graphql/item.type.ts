import {gql} from 'apollo-boost';
import {IPage} from "./page.type";
import {EntityStatus} from "./users.type";

export interface IItems {
   item: IItem;
   page: IPage<IItem>;
   saveItem: IItem;
   changeItemStatus: boolean;
}

export interface IItem {
   itemId: number;
   code: string;
   defaultPrice: number;
   description: string;
   images: string[];
   itemType: ItemType;
   manufacturer: string;
   model: string;
   name: string;
   notes: string;
   partNumber: string;
   status: EntityStatus;
   category: ICategory;
   unit: IUnit;
   createdDate: string;
   modifiedDate: string;
}

export interface ICategory {
   categoryId: number;
   name: string;
   description: string;
}

export interface IUnit {
   unitId: number;
   key: string;
   label: string;
}


export enum Units {
   BOX,
   CM,
   DZ,
   FT,
   G,
   IN,
   KG,
   M,
   PCS,
   MG,
}

export enum ItemType {
   SPARE_PARTS = 'SPARE_PARTS',
   TOOLS = 'TOOLS',
   SUPPLIES = 'SUPPLIES',
   EQUIPMENTS = 'EQUIPMENTS',
   NONE = 'NONE'
}

export const getItemDefaultInstance = ():IItem => ({
   itemId: 0,
   code: '',
   defaultPrice: 0,
   description: '',
   images: [],
   itemType: ItemType.NONE,
   manufacturer: '',
   model: '',
   name: '',
   notes: '',
   partNumber: '',
   status: EntityStatus.INACTIVE,
   unit: {
      unitId: 0,
      key: '',
      label: ''
   },
   category: {
      categoryId: 0,
      name: '',
      description: ''
   },
   createdDate: '',
   modifiedDate: ''
});

export const FETCH_ITEMS_GQL = gql`
   query fetchToolsItems($searchString: String, $pageIndex: Int, $pageSize: Int, $filters: [Predicate!]){
      items {
         page(searchString: $searchString, pageIndex: $pageIndex, pageSize: $pageSize, filters: $filters) {
            totalCount
            content {
               itemId
               code
               name
               description
               partNumber
               manufacturer
               model
               itemType
               category {
                  categoryId
                  name
               }
               unit {
                  unitId
                  key
                  label
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
`;


export const GET_ITEM_TOOL_BY_ID = gql`
   query getItemToolById($itemId: Int!) {
      items {
         item (entityId: $itemId) {
            itemId
            code
            defaultPrice
            description
            images
            itemType
            manufacturer
            model
            name
            notes
            partNumber
            status
            unit {
               unitId
               key
               label
            }
            category {
               categoryId
               name
            }
         }
      }
   }
`;

export const SAVE_ITEM_TOOL = gql`
   mutation saveItem(
      $itemId: Int!,
      $code: String!,
      $defaultPrice: Float!,
      $description: String,
      $images: [String!]!,
      $itemType: String!,
      $manufacturer: String,
      $model: String,
      $name: String!,
      $notes: String,
      $partNumber: String,
      $status: String!,
      $unitId: Int!,
      $categoryId: Int!,
   ) {
      items {
         saveItem(itemId: $itemId
         , categoryId: $categoryId
         , code: $code
         , defaultPrice: $defaultPrice
         , description: $description
         , images: $images
         , itemType: $itemType
         , manufacturer: $manufacturer
         , model: $model
         , name: $name
         , notes: $notes
         , partNumber: $partNumber
         , status: $status
         , unitId: $unitId
         ) {
            itemId
            category {
               categoryId
            }
         }
      }
   }
`;

export const CHANGE_ITEM_STATUS = gql`
   mutation changeItemStatus(
      $itemIds: [Int!]!,
      $status: String!
   ) {
      items {
         changeItemStatus(entityIds: $itemIds, status: $status)
      }
   }
`;

export const FETCH_CATEGORIES = gql`
   query fetchCategories($scope: String!) {
      categories(scope: $scope) {
         categoryId
         name
      }
   }
`;

export const FETCH_UNITS = gql`
   query fetchUnits {
      units {
         unitId
         key
         label
      }
   }
`;
