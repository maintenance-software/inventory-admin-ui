import { Reducer } from 'redux';
import { IUser } from '../../api/users.api';
import { FETCH_USERS } from '../actions/users.action';
import { AppActionType } from '../actions';

export const userReducer: Reducer<IUser[], AppActionType> = (state: IUser[] = [], action: AppActionType): IUser[] => {
  switch (action.type) {
    case FETCH_USERS: {
        return action.payload;
    }
    default:
        return state;
   }
};