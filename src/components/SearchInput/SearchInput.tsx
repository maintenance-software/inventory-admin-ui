import React from 'react';
import './SearchInput.scss';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import SearchIcon from '@material-ui/icons/Search';

export const SearchInput: React.FC<{placeholder?:string, value?:string}> = (props)=> {
   return (
      <>
         <div className="custom-input-text px-2">
            <input placeholder={props.placeholder || 'placeholder'} value={props.value}/>
            <div className="input-text-icon">
               <SearchIcon/>
            </div>
         </div>
      </>
   );
};
