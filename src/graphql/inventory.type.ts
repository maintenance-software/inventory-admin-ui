import {gql} from 'apollo-boost';
import {IPage, IPageInfo} from "./page.type";
import {EntityStatus} from "./users.type";
import {IItem} from "./item.type";

export interface IInventories {
   inventory: IInventory;
   list: IInventory[];
   saveInventory: IInventory;
}

export interface IInventory{
   inventoryId: number;
   name: string;
   description: string;
   allowNegativeStocks: boolean;
   status: EntityStatus;
   inventoryItems: IPage<IInventoryItem>;
   createdDate: string;
   modifiedDate: string;
}

export interface IInventoryItem{
   inventoryItemId: number;
   level: number;
   maxLevelAllowed: number;
   minLevelAllowed: number;
   price: number;
   location: string;
   dateExpiry: number;
   item: IItem;
   createdDate: string;
   modifiedDate: string;
}


export const getInventoryDefaultInstance = ():IInventory => ({
   inventoryId: 0,
   name: '',
   description: '',
   allowNegativeStocks: false,
   status: EntityStatus.INACTIVE,
   inventoryItems: {
      totalCount: 0,
      content: [],
      pageInfo: {
         pageIndex: 0,
         pageSize: 0,
         hasNext: false,
         hasPreview: false
      }
   },
   createdDate: '',
   modifiedDate: ''
});

export const FETCH_INVENTORIES_GQL = gql`
   query fetchInventories {
      inventories {
         list {
            inventoryId
            name
            description
            allowNegativeStocks
            status
         }         
      }
   }
`;


export const GET_INVENTORY_BY_ID = gql`
   query getInventoryById($inventoryId: Int!) {
      inventories {
         inventory(entityId: $inventoryId) {
            inventoryId
            name
            description
            allowNegativeStocks
            status
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


export const SAVE_INVENTORY = gql`
   mutation saveInventory(
      $inventoryId: Int!
      $name: String!
      $description: String!
      $allowNegativeStocks: Boolean! 
      $status: String!
   ) {
      inventories {
         saveInventory(
            inventoryId: $inventoryId
            name: $name
            description: $description
            allowNegativeStocks: $allowNegativeStocks
            status: $status         
         ) {
            inventoryId         
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
