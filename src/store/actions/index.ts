
export const SET_APP_NAME = 'SET_APP_NAME';

export interface RootAction {
    type: typeof SET_APP_NAME;
    payload: string;
}

export const setAppName = (appName: string): RootAction => ({
    type: SET_APP_NAME,
    payload: appName
});