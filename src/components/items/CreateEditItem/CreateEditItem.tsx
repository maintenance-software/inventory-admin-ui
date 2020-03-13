import React, {useEffect, useState} from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { gql } from 'apollo-boost';
import {useLazyQuery, useMutation, useQuery} from "@apollo/react-hooks";

import EditUserForm, {ItemForm} from "./CreateEditItemForm";
import {useHistory} from "react-router";
import { IItem, IItems, getItemDefaultInstance, ICategory } from '../../../graphql/item.type';
import { GET_ITEMS_GQL } from '../list/Items';

export const GET_ITEM_BY_ID = gql`
  query getItemById($itemId: Int!){
    items {
      item(entityId: $itemId) {
         itemId
         name
         unit
         defaultPrice
         description
         images
         category {
            categoryId
         }
      }
    }
  }
`;

export const FETCH_CATEGORIES = gql`
query fetchCategories{
    categories {
      categoryId
      name
    }
  }
`;


const SAVE_ITEM = gql`
  mutation saveItem($item: ItemArg!) {
   saveItem(item: $item) {
      itemId
      name
      unit
      defaultPrice
      description
      images
      category {
      categoryId
      }
   }
  }
`;

interface IEditProps {
   user: IItem;
}

const CreateEditItem: React.FC<IEditProps> =  (props) => {
   const [t, i18n] = useTranslation();
   const params = useParams();
   const history = useHistory();
   const [saveItem, mutation] = useMutation<{ saveItem: IItem }, any>(SAVE_ITEM);
   const [getItemById, { called, loading, data }] = useLazyQuery<{items: IItems}, any>(GET_ITEM_BY_ID);
   const [fetchCategories, categoryData] = useLazyQuery<{categories: [ICategory]}, any>(FETCH_CATEGORIES);
   const [hasError, setHasError] = useState(false);
   const itemId = +params.itemId;

  useEffect(() => {
     if(itemId && itemId > 0) {
        getItemById({variables: { itemId: itemId }});
     }
     fetchCategories();
  }, []);

   useEffect(() => {
      if(mutation.data && mutation.data.saveItem) {
         if(itemId <= 0) {
            getItemById({variables: { itemId: mutation.data.saveItem.itemId}});
            history.push(mutation.data.saveItem.itemId.toString());
         }
      }
   }, [mutation.data]);

   if (loading || (!data && itemId > 0))
      return <div>Loading</div>;

   let item: IItem = getItemDefaultInstance();
   let categories: ICategory[] = [];
   if(data) {
      item = data.items.item
   }

   if(categoryData.data) {
      categories = categoryData.data.categories;
   }

   const itemForm: ItemForm = {
      name: item.name,
      description: item.description,
      unit: item.unit.key,
      defaultPrice: item.defaultPrice,
      categoryId: item.category.categoryId
   };

   const callback = (itemForm: ItemForm, resetForm: Function) => {
      const itemRequest = { 
         itemId: item.itemId,
         name: itemForm.name,
         description: itemForm.description,
         unit: itemForm.unit,
         defaultPrice: +itemForm.defaultPrice,         
         images: [],
         categoryId: +itemForm.categoryId
       };
      const refetchQueries = [{query: GET_ITEMS_GQL, variables: {}}];
      if(item.itemId > 0) {
         refetchQueries.push({query: GET_ITEM_BY_ID, variables: {itemId: item.itemId}});
      }
      saveItem({ variables: {item: itemRequest}, refetchQueries:refetchQueries});
      resetForm({values: itemForm});
   };

  return (
    <div>
      <EditUserForm userForm={itemForm} categories={categories} callback={callback}/>
    </div>
  );
};
export default CreateEditItem;
