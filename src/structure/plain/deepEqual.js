import isEqualWith from 'lodash/isEqualWith'

const customizer = (obj, other) => {
  if (obj === undefined && other === '') return true
  if (obj === '' && other === undefined) return true
}

const deepEqual = (a, b) => {
  return isEqualWith(a, b, customizer)
}

export default deepEqual
