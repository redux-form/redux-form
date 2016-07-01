import { globalErrorKey } from './reducer'
import initializeState from './initializeState';

const createInitializeState = (data, fields, state, overwriteValues = true, markInitialized = true) => {
  return {
    ...initializeState(data, fields, state, overwriteValues),
    _asyncValidating: false,
    _active: undefined,
    [globalErrorKey]: undefined,
    _initialized: markInitialized,
    _submitting: false,
    _submitFailed: false
  }
}

export default createInitializeState
