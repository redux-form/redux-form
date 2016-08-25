import { dataKey } from './createOnDragStart'
const createOnDrop =
  (name, change) =>
    event => {
      change(event.dataTransfer.getData(dataKey))
      event.preventDefault()
    }
export default createOnDrop
