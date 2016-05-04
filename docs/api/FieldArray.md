# `FieldArray`

The `FieldArray` component is how you render an array of fields. It works a lot like `Field`. 
With `Field`, you give a `name`, referring to the location of the field in the Redux state, and a 
`component` to render the field, which is given the props to connect the field to the Redux state.

With `FieldArray`, you provide a `name` just like with `Field`, but the `component` you give to 
`FieldArray` will be given a set of props to query, update, and iterate through the field array.

## Importing

```javascript
var FieldArray = require('redux-form').FieldArray;  // ES5
```
```javascript
import { FieldArray } from 'redux-form';  // ES6
```

## Props you can pass to `FieldArray`

#### `name : String` [required]

A string path, in dot-and-bracket notation, corresponding to a value in the form values. It may 
be as simple as `'firstName'` or as complicated as
`contact.billing.address[2].phones[1].areaCode`.

#### `component : Component|Function` [required]

A `Component` or stateless function to render the field array.

## Props

The stateless function `Component` given to the `component` prop will be provided with the 
following props:

#### `dirty : boolean`

> `true` if the any of the fields in the field array have changed from their initialized value. 
Opposite of `pristine`.

#### `error : String` [optional]

> The error for this field array if its value is not passing validation. Both synchronous,
asynchronous, and submit validation errors will be reported here. Array-specific errors should be
returned from the validation function as an `_error` key on the array.

#### `forEach(callback) : Function`

> A method to iterate over each value of the array. See the section on [Iteration](#Iteration) 
for more details.

#### `insert(index, value) : Function`

> A function to insert a new value into the array at any arbitrary index.

#### `invalid : boolean`

> `true` if the field array value fails validation (has a validation error). Opposite of `valid`.

#### `length : Number`

> The current length of the array.

#### `map(callback) : Function`

> A method to iterate over each value of the array. Returns an array of the results of each call 
to the callback. See the section on [Iteration](#Iteration) for more details.

#### `pop() : Function`

> Removes an item from the end of the array. Returns the item removed.

#### `pristine : boolean`

> `true` if the all of the fields in the field array are the same as their initialized 
value. Opposite of `dirty`.

#### `push(value) : Function`

> Adds a value to the end of the array. Returns nothing.

#### `remove(index) : Function`

> Removes an item from the array at an arbitrary index. Returns nothing.

#### `shift() : Function`

> Removes an item from beginning of the array. Returns the item removed..

#### `swap(indexA, indexB) : Function`

> Swaps two items in the array at the given indexes. Returns nothing.

#### `unshift(value) : Function`

> Adds an item to the beginning of the array. Returns nothing.

#### `valid : boolean`

> `true` if the field value passes validation (has no validation errors). Opposite of `invalid`.

## Iteration

When you iterate through a field array with either `forEach()` or `map()`, your callback will be 
passed two parameters:

#### `name : String`

> The name needed to give to `Field` to render the fields in this array. If the `name` prop you 
give to `FieldArray` is `'foo.bar'`, and there are three items in the array, your callback will 
be called three times, with `'foo.bar[0]'`, `'foo.bar[1]'`, and `'foo.bar[2]'`.

#### `index : Number`

> The index of the item in the array.
