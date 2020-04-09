// @flow
import ExtendableError from 'es6-error'

const __FLAG__ = '@@redux-form/submission-error-flag'

class SubmissionError extends ExtendableError {
  /** @private */
  static __FLAG__ = __FLAG__

  constructor(errors: Object) {
    super('Submit Validation Failed')
    this.errors = errors
  }
}

export default SubmissionError

export function isSubmissionError(error: any): boolean {
  return (
    (error && error.constructor && error.constructor.__FLAG__ === __FLAG__) ===
    true
  )
}
