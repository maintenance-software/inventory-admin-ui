import React, {ChangeEvent} from 'react';
import './SearchInput.scss';
import SearchIcon from '@material-ui/icons/Search';

export const SearchInput: React.FC<{placeholder?:string, value?:string, type?:string, onChange?: (event: ChangeEvent<HTMLInputElement>) => void}> = (props)=> {
   return (
      <>
         <div className="custom-input-text px-2">
            <input placeholder={props.placeholder || 'placeholder'} value={props.value} type={props.type || 'text'} onChange={props.onChange}/>
            <div className="input-text-icon">
               <SearchIcon/>
            </div>
         </div>
      </>
   );
};
