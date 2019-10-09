import { Reducer } from 'redux';
import { AppActionType } from '../actions';
import { FETCH_PERSONS } from '../actions/persons.action';
import { IPersonScope, INITIAL_STATE } from '..';

export const personsReducer: Reducer<IPersonScope, AppActionType> = (state: IPersonScope = INITIAL_STATE.personScope, action: AppActionType): IPersonScope => {
  switch (action.type) {
    case FETCH_PERSONS: {
        return {
          person: Object.assign({}, state.person),
          persons: action.payload
        };
    }
    default:
        return state;
   }
};