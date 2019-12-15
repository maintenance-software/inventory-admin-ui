export interface IUser {
   active: boolean;
   userId: number;
   username: string;
   password: string;
   email: string;
   privileges: string[];
   roles: string[];
}
