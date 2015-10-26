import {dataKey} from './createOnDragStart';
const createOnDrop =
  (name, change) =>
    event => {
      change(name, event.dataTransfer.getData(dataKey));
    };
export default createOnDrop;
