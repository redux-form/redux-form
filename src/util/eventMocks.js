// @flow
const getEvent = (rest: Object) => ({
  stopPropagation: id => id,
  preventDefault: id => id,
  ...rest
})

export function valueMock(value: any) {
  return getEvent({ target: { value } })
}

export function dragStartMock(setData: Function) {
  return getEvent({
    dataTransfer: { setData }
  })
}

export function dropMock(getData: Function) {
  return getEvent({
    dataTransfer: { getData }
  })
}
