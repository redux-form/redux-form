import {dataKey} from './createOnDrag';
const createOnDrop =
  (name, change) =>
    event => change(name, event.dataTransfer.getData(dataKey));
export default createOnDrop;
