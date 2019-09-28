import { combineReducers, Reducer } from 'redux';
import { RootAction, SET_APP_NAME } from '../actions';
import { RootState, INITIAL_STATE } from '..';

export const rootReducer: Reducer<RootState, RootAction> = (state: RootState = INITIAL_STATE, action: RootAction): RootState => {
  switch (action.type) {
    case SET_APP_NAME: {
        return {
            appName: action.payload
          }
    }
    default:
        return state;
   }
}


