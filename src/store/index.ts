import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import {rootReducer} from './reducers';
import { RootAction } from './actions';

export interface RootState {
  appName: string;
}

export const INITIAL_STATE: RootState = {appName: 'Test App'};

export const configureStore = (initialState = INITIAL_STATE) => {
 return createStore<RootState, RootAction, any, any>(
   rootReducer,
   initialState,
   applyMiddleware(thunk)
 );
};

