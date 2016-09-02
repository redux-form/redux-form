# Field Arrays Example

This example demonstrates how to have arrays of fields, both an array of one field or of a group 
of fields. In this form, each member of the club has a first name, last name, and a list of 
hobbies. The following array manipulation actions are available, as raw action creators, as bound
actions to your form under the `this.props.array` object, and as actions bound to both the form 
and array on the object provided by the `FieldArray` component: `insert`, `pop`, `push`, `remove`,
`shift`, `swap`, and `unshift`. More detail can be found under the
[`FieldArray` docs](http://redux-form.com/6.0.2/docs/api/FieldArray.md).

Notice that array-specific errors are available if set on the array structure itself under the 
`_error` key. (Hint: Add more than five hobbies to see an error.)
