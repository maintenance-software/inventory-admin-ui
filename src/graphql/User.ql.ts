import {PersonQL} from "./Person.ql";
import { gql } from "apollo-boost";

export interface UsersQL {
   user: UserQL;
   list: UserQL[];
}

export interface SessionUserQL {
   language: string;
   expiration: boolean;
   userId: number;
   username: string;
   password: string;
   email: string;
   privileges: string[];
   roles: string[];
   person: PersonQL;
}


export interface UserQL {
   status: EntityStatusQL;
   language: string;
   expiration: boolean;
   userId: number;
   username: string;
   password: string;
   email: string;
   person: PersonQL;
   privileges: PrivilegeQL[];
   roles: RoleQL[];
}


export interface RoleQL {
   roleId: number;
   key: number;
   name: string;
   description: string;
   privileges: PrivilegeQL[];
}

export interface PrivilegeQL{
   privilegeId: number;
   key: number;
   name: string;
   description: string;
}

export enum EntityStatusQL {
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
