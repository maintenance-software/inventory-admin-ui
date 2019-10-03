import { Reducer } from 'redux';
import { SET_APP_NAME, AppActionType } from '../actions';
import { IRootState, INITIAL_STATE } from '..';
import { userReducer } from './users.reducer';

export const rootReducer: Reducer<IRootState, AppActionType> = (state: IRootState = INITIAL_STATE, action: AppActionType): IRootState => {
  switch (action.type) {
    case SET_APP_NAME: {
        return {
            appName: action.payload,
            users: state.users.concat()
          }
    }
    default:
        return {
          appName: state.appName,
          users: userReducer(state.users, action)
        };
   }
};