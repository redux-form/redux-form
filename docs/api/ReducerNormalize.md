# `reducer.normalize(Object<String, Object<String, Function>>)`

> Returns a form reducer that will also pass each form value through the normalizing functions provided. The 
parameter is an object mapping from `formName` to an object mapping from `fieldName` to a normalizer function. The 
normalizer function is given four parameters and expected to return the normalized value of the field.

> The parameters passed to each normalizer function will be:

#### `value : String`

> The current value of the field.

#### `previousValue : String`

> The previous value of the field before the current action was dispatched.

#### `allValues : Object<String, String>`

> All the values of the current form.

#### `previousAllValues : Object<String, String>`

> All the values of the form before the current change. Useful to change one field based on a change in another.

## Explanation

Let's say that you have a form field that only accepts uppercase letters and another one where you want the value to 
be formatted in the `999-999-9999` United States phone number format. `redux-form` gives you a way to normalize your
data on every action to the reducer by calling the `normalize()` function on the default reducer.

## Example

See [Normalizing Form Values](../../examples/normalizing) example for more information.

