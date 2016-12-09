const getEvent = (target) => ({
  stopPropagation: id => id,
  preventDefault: id => id,
  target
})

export function valueMock(value) {
  return getEvent({ value })
}
