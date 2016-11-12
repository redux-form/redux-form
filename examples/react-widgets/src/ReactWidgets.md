# React Widgets Example

This is a demonstration of how to connect
[react-widgets](https://github.com/jquense/react-widgets) form elements to `redux-form`.

Very few modifications are needed. All of these can be done as props to the `Field` component.

* `Multiselect`
  * Needs `onBlur` to be rewritten ignoring the parameter
  * Needs value to be an array, so default it to `[]`
* `SelectList`
  * Needs `onBlur` to be rewritten ignoring the parameter
* `DateTimePicker`
  * Needs value to be a date or null.

For more information, see the `react-widgets` docs.

The delay between when you click "Submit" and when the alert dialog pops up is intentional,
to simulate server latency.

## Running this example locally

To run this example locally on your machine clone the `redux-form` repository,
then `cd redux-form` to change to the repo directory, and run `npm install`.

Then run `npm run example:react-widgets` or manually run the
following commands:
```
cd ./examples/react-widgets
npm install
npm start
```

Then open [`localhost:3030`](http://localhost:3030) in your
browser to view the example running locally on your machine.

