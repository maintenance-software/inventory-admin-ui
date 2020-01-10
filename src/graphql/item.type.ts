import {IPage} from "./page.type";

export interface IItems {
   item: IItem;
   page: IPage<IItem>
}

export interface IItem {
   itemId: number;
   name: string;
   unit: string;
   defaultPrice: number;
   description: number;
   images: string[];
   createdDate: string;
   modifiedDate: string;
   category: ICategory;
}

export interface ICategory {
   categoryId: number;
   name: string;
}


