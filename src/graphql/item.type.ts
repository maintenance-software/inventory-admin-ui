import {IPage} from "./page.type";

export interface IItems {
   item: IItem;
   page: IPage<IItem>
}

export interface IItem {
   itemId: number;
   name: string;
   description: string;
   unit: string;
   defaultPrice: number;
   images: string[];
   createdDate: string;
   modifiedDate: string;
   category: ICategory;
}

export interface ICategory {
   categoryId: number;
   name: string;
}


export const getItemDefaultInstance = ():IItem => ({
   itemId: 0,
   name: '',
   description: '',
   unit: '',
   defaultPrice: 0,      
   images: [],
   createdDate: '',
   modifiedDate: '',
   category: {
      categoryId: 0,
      name: ''
   }
});

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


