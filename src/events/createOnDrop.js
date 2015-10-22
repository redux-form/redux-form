import {dataKey} from './createOnDragStart';
const createOnDrop =
  (name, change) =>
    event => {
      const value = event.dataTransfer.getData(dataKey);
      console.info('drop value', value);
      change(name, value);
    }
export default createOnDrop;
