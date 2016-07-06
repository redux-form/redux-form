import { isEqualWith } from 'lodash'

const customizer = (obj, other) => {
  if (obj == other) return true
  if (obj == null && other === '') return true
  if (obj === '' && other == null) return true
  if (obj && other && obj._error !== other._error) return false
}

const deepEqual = (a, b) => isEqualWith(a, b, customizer)

export default deepEqual
