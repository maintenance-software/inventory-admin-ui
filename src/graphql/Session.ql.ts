import { gql } from 'apollo-boost';

export interface SessionQL{
   authId: string;
   username: string;
   email: string;
   firstName: string;
   lastName: string;
   locale: string;
   permissions: string[];
}

export const GET_USER_SESSION_GQL = gql`
  query userSession{
    session {
      authId
      username
      email
      firstName
      lastName
      locale
      permissions
    }
  }
`;


export const getSessionDefaultInstance = ():SessionQL => ({
   authId: '',
   username: '',
   email: '',
   firstName: '',
   lastName: '',
   locale: '',
   permissions: [],
});
