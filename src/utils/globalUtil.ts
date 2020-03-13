const _flatten = (object: any): any => {
   return [].concat(...Object.keys(object).map(k => typeof object[k] === 'object' ? _flatten(object[k]) : ({[k]: object[k]})));
};
const flattenObject = (object: any) => Object.assign({}, ..._flatten(object));

const buildFullName = (firstName: string, lastName: string) => {
   return lastName + (firstName? ', ' + firstName : '');
};

const buildShortName = (firstName: string, lastName: string) => {
   return (firstName? firstName.toUpperCase().charAt(0) : '') + lastName.toUpperCase().charAt(0)
};

export {flattenObject, buildFullName, buildShortName};

export const clearPageItemCache = (cache: any) => {
   // Loop through all the data in our cache
   // And delete any items that start with "ListItem"
   // This empties the cache of all of our list items and
   // forces a refetch of the data.
   Object.keys(cache.data.data).forEach(key =>
      key.match(/^Page_Item/) && cache.data.delete(key)
   )
};
