function SubmissionError(opts) {
  if (!opts) {
    throw new ReferenceError('missing field keys or _error key');
  }
  if (!Object.keys(opts).length) {
    opts._error = 'Form submission failed';
  }
  Object.assign(this, opts);
}
SubmissionError.prototype = Object.create(Error.prototype);
SubmissionError.prototype.constructor = SubmissionError;
export default SubmissionError;
