# Submit Validation Example

The recommended way to do server-side validation with `redux-form` is to return a rejected promise
from the `onSubmit` function. There are two ways to give `redux-form` a function to run when your
form is submitted:

1. Pass it as an `onSubmit` prop to your decorated component. In which case, you would use
`onSubmit={this.props.handleSubmit}` inside your decorated component to cause it to fire when the 
submit button is clicked.
2. Pass it as a parameter to the `this.props.handleSubmit` function _from inside your
decorated component_. In which case, you would use `onClick={this.props.handleSubmit(mySubmit)}`
inside your decorated component to cause it to fire when the submit button is clicked.

The errors are displayed in the exact same way as validation errors created by
[Synchronous Validation](../../syncValidation), but they are returned from the `onSubmit`
function wrapped in a `SubmissionError`. This is to differentiate validation errors from I/O 
errors, like HTTP `400` or `500` errors, which will also cause the submission promise to be
rejected.

Also note that a general form-wide error can be returned via the special `_error` key.

### How to use the form below:

* Usernames that will pass validation: `john`, `paul`, `george`, or `ringo`.
* Valid password for all users: `redux-form`.

