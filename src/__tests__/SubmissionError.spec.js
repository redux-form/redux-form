// @flow

import ExtendableError from 'es6-error'
import { isSubmissionError, SubmissionError } from '../SubmissionError'

class FakeSubmissionError {
  static __FLAG__ = '@@redux-form/submission-error-flag'
}

describe('isSubmissionError', () => {
  it('should return `true` only when argument is instance `SubmissionError`', () => {
    expect(isSubmissionError(new SubmissionError({}))).toBe(true)
    expect(isSubmissionError(new FakeSubmissionError())).toBe(true)
    expect(isSubmissionError(new Error())).toBe(false)
    expect(isSubmissionError(new ExtendableError())).toBe(false)
    expect(isSubmissionError({})).toBe(false)
    expect(isSubmissionError()).toBe(false)
  })
})
