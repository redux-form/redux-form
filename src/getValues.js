const getValues = (fields, form) => fields.reduce((accumulator, field) => ({
  ...accumulator,
  [field]: form[field] ? form[field].value : undefined
}), {});

export default getValues;
