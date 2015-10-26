export const dataKey = 'value';
const createOnDragStart =
  (name, getValue) =>
    event => {
      event.dataTransfer.setData(dataKey, getValue());
    };

export default createOnDragStart;
