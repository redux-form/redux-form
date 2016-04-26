import isPristine from './isPristine';
import isValid from './isValid';

/**
 * Updates a field object from the store values
 */
const updateField = (field, formField, active, syncError) => {
  const diff = {};
  const formFieldValue = formField.value === undefined ? '' : formField.value;

  // update field value
  if (field.value !== formFieldValue) {
    diff.value = formFieldValue;
    diff.checked = typeof formFieldValue === 'boolean' ? formFieldValue : undefined;
  }

  // update dirty/pristine
  const pristine = isPristine(formFieldValue, formField.initial);
  if (field.pristine !== pristine) {
    diff.dirty = !pristine;
    diff.pristine = pristine;
  }

  // update field error
  const error = syncError || formField.submitError || formField.asyncError;
  if (error !== field.error) {
    diff.error = error;
  }
  const valid = isValid(error);
  if (field.valid !== valid) {
    diff.invalid = !valid;
    diff.valid = valid;
  }

  if (active !== field.active) {
    diff.active = active;
  }
  const touched = !!formField.touched;
  if (touched !== field.touched) {
    diff.touched = touched;
  }
  const visited = !!formField.visited;
  if (visited !== field.visited) {
    diff.visited = visited;
  }
  const autofilled = !!formField.autofilled;
  if (autofilled !== field.autofilled) {
    diff.autofilled = autofilled;
  }

  if ('initial' in formField && formField.initial !== field.initialValue) {
    field.initialValue = formField.initial;
  }

  return Object.keys(diff).length ? {
    ...field,
    ...diff
  } : field;
};
export default updateField;
