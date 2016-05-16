# `reducer.syncValidation(Object<String, Object<String, Function>>)`

> Returns a form reducer that will also run the synchronous validation function given for each 
form name. The parameter is an object mapping from `formName` to a synchronous validation function.
The validation function will be given the current form values and expected to return an object of
errors.

**The validation function will be called on every update to your form, so if there is anything 
slow about it, you should consider [memoizing it](https://github.com/erikras/lru-memoize).**

The parameters passed to your validation function will be:

#### `values : Object<String, any>`

> The current values of the form.

## Example

See [Syncronous Validation Example](http://redux-form.com/6.0.0-alpha.13/examples/syncValidation) 
example for more information.

