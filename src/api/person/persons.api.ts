import axios, { AxiosResponse } from 'axios';
import { IUser } from '../users.api';

export interface IPerson {
  personId: number;
  firstName: string;
  lastName: string;
  documentType: string;
  documentId: string;  
  address: any;
  contactInfo: any[];
  account: IUser;
};

export const fetchPersons = async () => {
  const response: AxiosResponse<IPerson[]> = await axios.get<IPerson[]>('api/persons');
  return response.data;
};

export const getPersonById = async (personId: number) => {
  const response: AxiosResponse<IPerson> = await axios.get<IPerson>('api/persons/' + personId);
  return response.data;
};