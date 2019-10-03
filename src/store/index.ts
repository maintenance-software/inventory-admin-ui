import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import {rootReducer} from './reducers';
import { RootAction } from './actions';
import { IUser } from '../api/users.api';

export interface IRootState {
  appName: string;
  users: IUser[];
}

export const INITIAL_STATE: IRootState = {
  appName: 'Test App',
  users: []
};

export const configureStore = (initialState = INITIAL_STATE) => {
 return createStore<IRootState, RootAction, any, any>(
   rootReducer,
   initialState,
   applyMiddleware(thunk)
 );
};