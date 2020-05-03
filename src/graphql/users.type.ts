import {IPerson} from "./persons.type";
import { gql } from "apollo-boost";

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
   description: string;
   privileges: IPrivilege[];
}

export interface IPrivilege{
   privilegeId: number;
   key: number;
   name: string;
   description: string;
}

export enum EntityStatus {
   ACTIVE = 'ACTIVE',
   INACTIVE = 'INACTIVE'
}


export const GET_USERS_GQL = gql`
   query listUsers{
      users {
         list(searchString: "") {
            userId
            username
            email
            status
            person {
               personId
               firstName
               lastName
            }
         }
      }
   }
`;
