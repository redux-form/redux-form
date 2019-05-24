# Field Arrays Example

This example demonstrates how to have arrays of fields, both an array of one
field or of a group of fields. In this form, each member of the club has a first
name, last name, and a list of hobbies. The following array manipulation actions
are available, as raw action creators, as bound actions to your form under the
`this.props.array` object, and as actions bound to both the form and array on
the object provided by the `FieldArray` component: `insert`, `pop`, `push`,
`remove`, `shift`, `swap`, and `unshift`. More detail can be found under the
[`FieldArray` docs](https://redux-form.com/8.2.1/docs/api/FieldArray.md).

Notice that array-specific errors are available if set on the array structure
itself under the `_error` key. (Hint: Add more than five hobbies to see an
error.)

## Running this example locally

To run this example locally on your machine clone the `redux-form` repository,
then `cd redux-form` to change to the repo directory, and run `npm install`.

Then run `npm run example:fieldArrays` or manually run the following commands:

```
cd ./examples/fieldArrays
npm install
npm start
```

Then open [`localhost:3030`](http://localhost:3030) in your browser to view the
example running locally on your machine.
