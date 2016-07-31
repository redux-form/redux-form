# React Widgets Example

This is a demonstration of how to connect
[react-widgets](https://github.com/jquense/react-widgets) form elements to `redux-form`.

Very few modifications are needed. All of these can be done as props to the `Field` component.

* `Multiselect`
  * Needs `onBlur` to be rewritten ignoring the parameter
  * Needs `defaultValue` of `[]` to be provided
* `SelectList`
  * Needs `onBlur` to be rewritten ignoring the parameter
  
For more information, see the `react-widgets` docs.

The delay between when you click "Submit" and when the alert dialog pops up is intentional,
to simulate server latency.
