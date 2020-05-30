import { gql } from 'apollo-boost';

export interface ISession{
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

