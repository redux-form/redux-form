# Simple Form Example

This is a simple demonstration of how to connect all the standard HTML form elements to
`redux-form`.

For the most part, it is a matter of wrapping each form control in a `<Field>` component, 
specifying which type of `React.DOM` component you wish to be rendered.

The `Field` component will provide your input with `onChange`, `onBlur`, `onFocus`, `onDrag`, and
`onDrop` props to listen to the events, as well as a `value` prop to make each input a 
[controlled component](http://facebook.github.io/react/docs/forms.html#controlled-components). 
Notice that the `SimpleForm` component has no state; in fact, it uses the functional stateless 
component syntax.

The delay between when you click "Submit" and when the alert dialog pops up is intentional, to 
simulate server latency.

This form does no validation. To learn about how to do client-side validation, see the 
[Synchronous Validation](synchronous-validation) example.
