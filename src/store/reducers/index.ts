import { Reducer } from 'redux';
import { SET_APP_NAME, AppActionType } from '../actions';
import { IRootState, INITIAL_STATE } from '..';
import { userReducer } from './users.reducer';
import { personsReducer } from './persons.reducer';

export const rootReducer: Reducer<IRootState, AppActionType> = (state: IRootState = INITIAL_STATE, action: AppActionType): IRootState => {
  switch (action.type) {
    case SET_APP_NAME: {
        return {
            appName: action.payload,
            users: state.users.concat(),
            personScope: Object.assign({}, state.personScope)
          }
    }
    default:
        return {
          appName: state.appName,
          users: userReducer(state.users, action),
          personScope: personsReducer(state.personScope, action)
        };
   }
};