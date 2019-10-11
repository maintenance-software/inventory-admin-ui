import { Dispatch } from "redux";
import { IRootState } from "..";
import { IPerson, fetchPersons, getPersonById, savePersonW$ } from "../../api/person/persons.api";

export const FETCH_PERSONS = 'FETCH_PERSONS';
export const GET_PERSON_BY_ID = 'GET_PERSON_BY_ID';

export interface FetchPersonsAction {
    type: typeof FETCH_PERSONS;
    payload: IPerson[];
};

export interface GetPersonByIdAction {
    type: typeof GET_PERSON_BY_ID;
    payload: IPerson;
};

export const fetchPersonsAction = (persons: IPerson[]): FetchPersonsAction => ({
    type: FETCH_PERSONS,
    payload: persons
});

export const getPersonByIdAction = (person: IPerson): GetPersonByIdAction => ({
    type: GET_PERSON_BY_ID,
    payload: person
});

export const fetchPersonsThunk = (dispatch: Dispatch<FetchPersonsAction>, getState: () => IRootState) => {
    return fetchPersons().then(persons => {
        dispatch(fetchPersonsAction(persons));
    });
};

export const getPersonByIdThunk = (personId: number) => (dispatch: Dispatch<GetPersonByIdAction>, getState: () => IRootState) => {
    return getPersonById(personId).then(person => {
        dispatch(getPersonByIdAction(person));
    });
};

export const savePersonThunk = (person: IPerson) => (dispatch: Dispatch<GetPersonByIdAction>, getState: () => IRootState) => {
    return savePersonW$(person).then(person => {
        dispatch(getPersonByIdAction(person));
    });
};