Some use cases require the shape of a form – the fields it contains – to change dynamically at runtime. That is 
what we mean by "dynamic form". In `redux-form`, every config property given to `reduxForm` can also be supplied as a 
`prop` to the decorated component. _This includes the `fields` array!_

Below is the simplest possible example of a form that has its fields defined at runtime by state in its container. 
Note that when you remove a field, its value is not removed from the Redux store, so it will retain its value when 
you add it back. _However_, when you click "Submit", it will only submit the values for the fields the form currently
has.

You could easily a more complex example that included a `type` value or a special input renderer for each field just 
like the `labels` are provided in this example.