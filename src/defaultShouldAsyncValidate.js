const defaultShouldAsyncValidate = ({
  initialized,
  trigger,
  // blurredField,  // not used in default implementation
  pristine,
  syncValidationPasses
}) => {
  if (!syncValidationPasses) {
    return false
  }
  switch (trigger) {
    case 'blur':
      // blurring
      return true
    case 'submit':
      // submitting, so only async validate if form is dirty or was never initialized
      // conversely, DON'T async validate if the form is pristine just as it was initialized
      return !pristine || !initialized
    default:
      return false
  }
}

export default defaultShouldAsyncValidate
