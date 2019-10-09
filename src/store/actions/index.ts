import { FetchUsersAction } from "./users.action";
import { FetchPersonsAction } from "./persons.action";

export const SET_APP_NAME = 'SET_APP_NAME';

export type AppActionType = RootAction | FetchUsersAction | FetchPersonsAction;

export interface RootAction {
    type: typeof SET_APP_NAME;
    payload: string;
}

export const setAppName = (appName: string): RootAction => ({
    type: SET_APP_NAME,
    payload: appName
});