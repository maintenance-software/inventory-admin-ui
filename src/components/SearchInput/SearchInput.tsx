import React from 'react';
import './SearchInput.scss';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export const SearchInput: React.FC = ()=> {
   return (
      <>
         <div className="custom-input-text px-2">
            <input placeholder="placeholder"></input>
            <div className="input-text-icon">
               <FontAwesomeIcon icon='search'/>
            </div>
         </div>
      </>
   );
};
