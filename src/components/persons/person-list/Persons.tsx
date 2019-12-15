import React, { useEffect, useState } from 'react';
import './Persons.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';
import PersonCard from './person-card/PersonCard';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import {IPersons} from "../../../graphql/persons.type";

export const GET_PERSONS_GQL = gql`
  query {
    persons {
      list(queryString: "") {
         personId
         firstName
         lastName
         account {
            userId
            username
            email
         }
      }
    }
  }
`;


const Persons: React.FC =  () => {
  const [t, i18n] = useTranslation();
  // const dispatch = useDispatch();
  useEffect(() => {
    // dispatch(fetchPersonsThunk)
  }, []);

  // const persons: IPerson[] = useSelector((state: IRootState) => state.personScope.persons);
   //  const [users, setUsers] = useState<IUser[]>([]);
   //  console.log(users);
   // const [lang, setLang] = useState<string>('en');
   const personQL = useQuery<{persons: IPersons}, any>(GET_PERSONS_GQL);
   if (personQL.loading || !personQL.data) return <div>Loading</div>;

   const persons = personQL.data.persons.list;

  return (
    <>
            <div className="row justify-content-between p-2 align-items-center">
                <h6 className="text-primary my-auto">User Management</h6>
                <button className="btn btn-outline-primary btn-sm">
                  {t('user.button.add')}
                  <FontAwesomeIcon icon="plus"/>
                </button>
            </div>
            <div className="user-card-container">
              {persons.map((u, i) => (
                <PersonCard key={i} person={u}/>
              ))}
            </div>            
    </>
  );
};
export default Persons;
