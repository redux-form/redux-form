export const dataKey = 'value'
const createOnDragStart =
  (name, value) =>
    event => {
      event.dataTransfer.setData(dataKey, value)
    }

export default createOnDragStart
