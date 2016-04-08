This is a simple demonstration of how to connect all the standard HTML form elements to `redux-form`.

For the most part, it is a matter of simply giving the provided `field` value as props with the spread operator: 
`{...field}`. Each `field` object contains a `value` prop and `onChange`, `onBlur`, and `onFocus` functions that listen
to the events from the inputs. Notice that the component has no state (in fact it uses the functional stateless
component syntax), and the inputs are just the vanilla `<input>` elements.

This form does no validation. To learn about how to do client-side validation, see the 
[Synchronous Validation](#/examples/synchronous-validation) example.