import {IPage} from "./page.type";
import {EntityStatus} from "./users.type";

export interface IItems {
   item: IItem;
   page: IPage<IItem>
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
   unit: string;
   category: ICategory;
   createdDate: string;
   modifiedDate: string;
}

export interface ICategory {
   categoryId: number;
   name: string;
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
   unit: '',
   category: {
      categoryId: 0,
      name: ''
   },
   createdDate: '',
   modifiedDate: ''
});
