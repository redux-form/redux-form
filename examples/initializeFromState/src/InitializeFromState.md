# Initialize From State

Values provided to the `initialValues` prop or `reduxForm()` config parameter will be loaded into
the form state and treated thereafter as "pristine". They will also be the values that will 
be returned to when `reset()` is dispatched. In addition to saving the "pristine" 
values, initializing your form will overwrite any existing values.

In many applications, these values will be coming from the server and stored in another Redux 
reducer. To get those values into your `redux-form`-decorated component, you will need to 
`connect()` to the Redux state yourself and map from the data reducer to the `initialValues`
prop.

By default, you may only initialize a form component _once_ via `initialValues`. There are two
methods to reinitialize the form component with new "pristine" values:

1. Pass a `enableReinitialize` prop or `reduxForm()` config parameter set to `true` to allow the
form the reinitialize with new "pristine" values every time the `initialValues` prop changes. To
keep dirty form values when it reinitializes, you can set `keepDirtyOnReinitialize` to true. By
default, reinitializing the form replaces all dirty values with "pristine" values.

2. Dispatch the `INITIALIZE` action (using the action creator provided by `redux-form`).

The following example references an external `account` reducer, which simply takes an object of
values and saves it in the store under `account.data` when you dispatch the `load` action by
clicking the "Load Account" button.

