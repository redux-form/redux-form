export const dataKey = 'redux-form-drag-value';
const createOnDrag =
  (name, getValue) =>
    event => event.dataTransfer.setData(dataKey, getValue());

export default createOnDrag;
