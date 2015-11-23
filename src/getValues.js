import write from './write';

const getValues = (fields, form) => fields.reduce((accumulator, field) => {
  write(field, form[field] ? form[field].value : undefined, accumulator);
  return accumulator;
}, {});

export default getValues;
