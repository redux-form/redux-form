const getEvent = rest => ({
  stopPropagation: id => id,
  preventDefault: id => id,
  ...rest
})

export function valueMock(value) {
  return getEvent({target: {value}})
}

export function dragStartMock(setData) {
  return getEvent({
    dataTransfer: {setData}
  })
}

export function dropMock(getData) {
  return getEvent({
    dataTransfer: {getData}
  })
}
