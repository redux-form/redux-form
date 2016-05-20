# Action Creators

`redux-form` exports all of its internal action creators, allowing you complete control to dispatch any action
you wish. However, **it is *highly* recommended that you use the actions passed as props to your component
for most of your needs.**

### `autofill(form:String, field:String, value:String)`

> Saves the value to the field and sets its `autofilled` property to `true`.

### `autofillWithKey(form:String, formKey, field:String, value:String)`

> Saves the value to the field in the form under the specified `formKey` and sets its `autofilled` property to `true`. For use when using
[multirecord forms](#/examples/multirecord).

### `blur(form:String, field:String, value:String)`

> Saves the value to the field.

### `change(form:String, field:String, value:String)`

> Saves the value to the field.

### `changeWithKey(form:String, formKey, field:String, value:String)`

> Saves the value to the field in the form under the specified `formKey`. For use when using
[multirecord forms](#/examples/multirecord).

### `focus(form:String, field:String)`

> Marks the given field as `active` and `visited`.

### `initialize(form:String, data:Object, fields:Array<String>)`

> Sets the initial values in the form with which future data values will be compared to calculate
`dirty` and `pristine`. The `data` parameter may contain deep nested array and object values that match the shape of
your form fields. **IMPORTANT:** The fields array passed must be the same as the one given as a [config parameter to
`reduxForm()`](#/api/reduxForm).

### `initializeWithKey(form:String, formKey, data:Object, fields:Array<String>)`

> Used when editing multiple records with the same form component. Useful when
[editing multiple records](#/examples/multirecord).

### `reset(form:String)`

> Resets the values in the form back to the values past in with the most recent `initialize` action.

### `startAsyncValidation(form:String, field:String)`

> Sets `asyncValidating` to `field` if provided, or `true` if not. 

### `startSubmit(form:String)`

> Flips the `submitting` flag `true`.

### `stopSubmit(form:String, errors:Object)`

> Flips the `submitting` flag `false` and populates `submitError` for each field.

### `stopAsyncValidation(form:String, errors:Object)`

> Flips the `asyncValidating` flag `false` and populates `asyncError` for each field.

### `touch(form:String, ...fields:String)`

> Marks all the fields passed in as `touched`.

### `touchWithKey(form:String, formKey, ...fields:String)`

> Marks all the fields passed in as `touched` in the form at the specified `formKey`. For use with
[multirecord forms](#/examples/multirecord).

### `untouch(form:String, ...fields:String)`

> Resets the 'touched' flag for all the fields passed in.

### `untouchWithKey(form:String, formKey, ...fields:String)`

> Resets the `touched` flag for  all the fields passed in on the form at the specified `formKey`. For use
with [multirecord forms](#/examples/multirecord).

### `destroy(form:String)`

> Destroys the form, removing all its state.
