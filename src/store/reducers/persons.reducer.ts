import { Reducer } from 'redux';
import { AppActionType } from '../actions';
import { FETCH_PERSONS, GET_PERSON_BY_ID } from '../actions/persons.action';
import { IPersonScope, INITIAL_STATE } from '..';

export const personsReducer: Reducer<IPersonScope, AppActionType> = (state: IPersonScope = INITIAL_STATE.personScope, action: AppActionType): IPersonScope => {
  switch (action.type) {
    case GET_PERSON_BY_ID: {
      return {
        person: Object.assign({}, action.payload),
        persons: state.persons.concat()
      };
    }

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