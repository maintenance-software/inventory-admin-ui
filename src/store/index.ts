import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import {rootReducer} from './reducers';
import { RootAction } from './actions';
import { IUser } from '../api/users.api';
import { IPerson } from '../api/person/persons.api';

export interface IRootState {
  appName: string;
  users: IUser[];
  personScope: IPersonScope;
};

export interface IPersonScope {
  person: IPerson;
  persons: IPerson[];
};

export const INITIAL_STATE: IRootState = {
  appName: 'Test App',
  users: [],
  personScope: {
    person: {
      personId: 0,
      firstName: '',
      lastName: '',
      documentType: '',
      documentId: '',
      address: '',
      contactInfo: [],
      account: {
        userId: 0,
        active: false,        
        username: '',
        password: '',
        email: '',
        privileges: [],
        roles: []    
      }
    },
    persons:[]
  }
};

export const configureStore = (initialState = INITIAL_STATE) => {
 return createStore<IRootState, RootAction, any, any>(
   rootReducer,
   initialState,
   applyMiddleware(thunk)
 );
};