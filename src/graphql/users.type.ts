import {IPerson} from "./persons.type";

export interface IUsers {
   user: IUser;
   list: IUser[];
}

export interface ISessionUser {
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


export interface IUser {
   status: EntityStatus;
   language: string;
   expiration: boolean;
   userId: number;
   username: string;
   password: string;
   email: string;
   person: IPerson;
   privileges: IPrivilege[];
   roles: IRole[];
}


export interface IRole {
   roleId: number;
   key: number;
   name: string;
   privileges: IPrivilege[];
}

export interface IPrivilege{
   privilegeId: number;
   key: number;
   name: string;
}

export enum EntityStatus {
   ACTIVE = 'ACTIVE',
   INACTIVE = 'INACTIVE'
}
