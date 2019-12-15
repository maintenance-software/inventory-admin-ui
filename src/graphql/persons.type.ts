import {IUser} from "./users.type";


export interface IPersons {
   person: IPerson;
   list: IPerson[];
}

export interface IPerson {
   personId: number;
   firstName: string;
   lastName: string;
   documentType: string;
   documentId: string;
   address: any;
   contactInfo: any[];
   account: IUser;
}
