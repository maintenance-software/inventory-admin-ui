import { IUser, fetchUsers } from "../../api/users.api";
import { Dispatch } from "redux";
import { IRootState } from "..";

export const FETCH_USERS = 'FETCH_USERS';

export interface FetchUsersAction {
    type: typeof FETCH_USERS;
    payload: IUser[];
}

export const fetchUsersAction = (users: IUser[]): FetchUsersAction => ({
    type: FETCH_USERS,
    payload: users
});

export const fetchUsersThunk = (dispatch: Dispatch<FetchUsersAction>, getState: () => IRootState) => {
//    console.log(getState());
//    console.log('async fetch');
    return fetchUsers().then(users => {
//      console.log(users);
        dispatch(fetchUsersAction(users));
    });
};