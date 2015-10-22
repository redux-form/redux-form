The recommended way to do server-side validation with `redux-form` is to return a rejected promise from the `onSubmit`
function. There are two ways to give `redux-form` a function to run when your form is submitted:

* Pass it as an `onSubmit` prop to your decorated component. In which case, you would use
`onClick={this.props.handleSubmit}` inside your decorated component to cause it to fire when the submit button is 
clicked.
* Pass it as a parameter to the `this.props.handleSubmit` function _from inside your decorated component_. In which 
case, you would use `onClick={this.props.handleSubmit(mySubmit)}` inside your decorated component to cause it to fire 
when the submit button is clicked.

The errors are displayed in the exact same way as validation errors created by
[Synchronous Validation](#/examples/synchronous-validation).

### How to use the form below:

* Usernames that will pass validation: `john`, `paul`, `george` or `ringo`.
* Valid password for all users: `redux-form`.