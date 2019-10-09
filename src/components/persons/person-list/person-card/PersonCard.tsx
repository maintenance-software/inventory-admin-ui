import React from 'react';
import './PersonCard.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IPerson } from '../../../../api/person/persons.api';
import { buildFullName } from '../../../../utils/globalUtil';

export interface IPersonCardProps {
   person: IPerson;
};

const PersonCard: React.FC<IPersonCardProps> =  (props) => {
   const {person} = props;
    return (
      <div className="user-card">
        <div className="user-card-body">
           <div className="user-avatar">
              <h6>AV</h6>
           </div>
           <div className="d-flex flex-column flex-grow-1">
              <h5 className="card-title">{buildFullName(person.firstName, person.lastName)}</h5>
              <a href="#" className="btn btn-primary">{person.lastName}</a>
           </div>
           <div>
              <a href="#" className="user-options">
                 <FontAwesomeIcon icon="ellipsis-v"/>
              </a>
           </div>

        </div>
      </div>
    );
};
export default PersonCard;
