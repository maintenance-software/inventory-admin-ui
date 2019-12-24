import {IPerson} from "./persons.type";

export interface IUsers {
   user: IUser;
   list: IUser[];
}

export interface IUser {
   status: EntityStatus;
   language: string;
   expiration: boolean;
   userId: number;
   username: string;
   password: string;
   email: string;
   privileges: string[];
   roles: string[];
   person: IPerson;
}


export enum EntityStatus {
   ACTIVE = 'ACTIVE',
   INACTIVE = 'INACTIVE'
}
