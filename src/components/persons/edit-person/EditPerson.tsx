import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';


const EditPerson: React.FC =  () => {
  const [t, i18n] = useTranslation();
  //const dispatch = useDispatch();
  //useEffect(() => {
  //  dispatch(fetchPersonsThunk)
  // }, []);
  return (
    <div>
      Edit person page          
    </div>            
  );
};
export default EditPerson;