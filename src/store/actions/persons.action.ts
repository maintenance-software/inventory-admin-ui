import { Dispatch } from "redux";
import { IRootState } from "..";
import { IPerson, fetchPersons } from "../../api/person/persons.api";

export const FETCH_PERSONS = 'FETCH_PERSONS';

export interface FetchPersonsAction {
    type: typeof FETCH_PERSONS;
    payload: IPerson[];
}

export const fetchPersonsAction = (persons: IPerson[]): FetchPersonsAction => ({
    type: FETCH_PERSONS,
    payload: persons
});

export const fetchPersonsThunk = (dispatch: Dispatch<FetchPersonsAction>, getState: () => IRootState) => {
    return fetchPersons().then(persons => {
        dispatch(fetchPersonsAction(persons));
    });
};