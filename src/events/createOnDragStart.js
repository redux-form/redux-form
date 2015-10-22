export const dataKey = 'value';
const createOnDragStart =
  (name, getValue) =>
    event => {
      const value = getValue();
      console.info('value', value);
      event.dataTransfer.setData(dataKey, value);
    };

export default createOnDragStart;
