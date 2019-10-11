import axios, { AxiosResponse } from 'axios';

export interface IUser {
    active: boolean;
    userId: number;
    username: string;
    password: string;
    email: string;
    privileges: string[];
    roles: string[];    
};

export const fetchUsers = async () => {
  const response: AxiosResponse<IUser[]> = await axios.get<IUser[]>('api/users');
  return response.data;
};