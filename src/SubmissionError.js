// @flow
import ExtendableError from 'es6-error'

const __FLAG__ = '@@redux-form/submission-error-flag'

export class SubmissionError extends ExtendableError {
  /** @private */
  static __FLAG__ = __FLAG__
  errors: Object

  constructor(errors: Object) {
    super('Submit Validation Failed')
    this.errors = errors
  }
}

export function isSubmissionError(error: any): boolean {
  return (error && error.constructor && error.constructor.__FLAG__ === __FLAG__) === true
}
