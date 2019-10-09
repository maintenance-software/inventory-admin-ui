const _flatten = (object: any): any => {
   return [].concat(...Object.keys(object).map(k => typeof object[k] === 'object' ? _flatten(object[k]) : ({[k]: object[k]})));
};
const flattenObject = (object: any) => Object.assign({}, ..._flatten(object));

const buildFullName = (firstName: string, lastName: string) => {
   return lastName + (firstName? ', ' + firstName : '');
};

export {flattenObject, buildFullName};


