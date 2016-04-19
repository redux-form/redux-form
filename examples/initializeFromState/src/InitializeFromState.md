# Initialize From State

Values provided to the `initialValues` prop or `reduxForm()` config parameter will be loaded into
the form state and treated thereafter as "pristine". They will also be the values that will 
be returned to when `reset()` is dispatched. In addition to saving the "pristine" 
values, initializing your form will overwrite any existing alues.

In many applications, these values will be coming from the server and stored in another Redux 
reducer. To get those values into your `redux-form`-decorated component, you will need to 
`connect()` to the Redux state yourself and map from the data reducer to the `initialValues`
prop.

You may only initialize a form component _once_ via `initialValues`. If you wish to change the 
"pristine" values again, you will need to dispatch the `INITIALIZE` action yourself (using the 
action creator provided by `redux-form`).

The following example references an external `account` reducer, which simply takes an object of
values and saves it in the store under `account.data` when you dispatch the `load` action by
clicking the "Load Account" button.

