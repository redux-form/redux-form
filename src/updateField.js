import isPristine from './isPristine';
import isValid from './isValid';

/**
 * Updates a field object from the store values
 */
const updateField = (field, formField, active, syncError) => {
  const diff = {};

  // update field value
  if (field.value !== formField.value) {
    diff.value = formField.value;
    diff.checked = typeof formField.value === 'boolean' ? formField.value : undefined;
  }

  // update dirty/pristine
  const pristine = isPristine(formField.value, formField.initial);
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

  return Object.keys(diff).length ? {
    ...field,
    ...diff
  } : field;
};
export default updateField;
