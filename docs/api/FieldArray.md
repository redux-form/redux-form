# `FieldArray`

[`View source on GitHub`](https://github.com/erikras/redux-form/blob/master/src/FieldArray.js)

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

#### `withRef : boolean` [optional]

If `true`, the rendered component will be available with the `getRenderedComponent()` method.
Defaults to `false`. **Cannot be used if your component is a stateless function component.**

#### `props : object` [optional]

Object with custom props to pass through the `FieldArray` component into a component provided
to `component` prop. This props will be merged to props provided by `FieldArray` itself.

## Instance API

The following properties and methods are available on an instance of a `FieldArray` component.

#### `name : String`

> The `name` prop that you passed in.

#### `valid : boolean`

> `true` if this field passes validation, `false` otherwise.

#### `getRenderedComponent()`

> Returns the instance of the rendered component. For this to work, you must provide a
`withRef` prop, and your component must not be a stateless function component.

## Props

These are props that `FieldArray` will pass to your wrapped component. **All the props provided
to your component by `redux-form` are divided into `fields` and `meta` objects.**

Any additional props that you pass to your `FieldArray` will be in the root of the `props` 
object, alongside `fields` and `meta`.
 
### Fields Props

The `fields` object is a "pseudo-array", in that it has many of the same properties and methods 
as a javascript `Array`, providing both reading and writing functionality.

#### `fields.forEach(callback) : Function`

> A method to iterate over each value of the array. See the section on [Iteration](#iteration)
for more details.

#### `fields.insert(index:Integer, value:Any) : Function`

> A function to insert a new value into the array at any arbitrary index.

#### `fields.length : Number`

> The current length of the array.

#### `fields.map(callback) : Function`

> A method to iterate over each value of the array. Returns an array of the results of each call
to the callback. See the section on [Iteration](#iteration) for more details.

#### `fields.move(from:Integer, to:Integer) : Function`

> Moves an element from one index in the array to another.

> This is not a mutator; it dispatches an action which updates the state in Redux, which will
cause your component to rerender.

#### `fields.pop() : Function`

> Removes an item from the end of the array. Returns the item removed.

> This is not a mutator; it dispatches an action which updates the state in Redux, which will
cause your component to rerender.

#### `fields.push(value:Any) : Function`

> Adds a value to the end of the array. Returns nothing.

> This is not a mutator; it dispatches an action which updates the state in Redux, which will
cause your component to rerender.

#### `fields.remove(index:Integer) : Function`

> Removes an item from the array at an arbitrary index. Returns nothing.

> This is not a mutator; it dispatches an action which updates the state in Redux, which will
cause your component to rerender.

#### `fields.removeAll() : Function`

> Removes all the values from the array.

> This is not a mutator; it dispatches an action which updates the state in Redux, which will
cause your component to rerender.

#### `fields.shift() : Function`

> Removes an item from beginning of the array. Returns the item removed..

> This is not a mutator; it dispatches an action which updates the state in Redux, which will
cause your component to rerender.

#### `fields.swap(indexA:Integer, indexB:Integer) : Function`

> Swaps two items in the array at the given indexes. Returns nothing.

> This is not a mutator; it dispatches an action which updates the state in Redux, which will
cause your component to rerender.

#### `fields.unshift(value:Any) : Function`

> Adds an item to the beginning of the array. Returns nothing.

> This is not a mutator; it dispatches an action which updates the state in Redux, which will
cause your component to rerender.

### Meta Props

The props under the `meta` key are metadata about the state of this field array that `redux-form`
is tracking for you.

#### `meta.dirty : boolean`

> `true` if the any of the fields in the field array have changed from their initialized value.
Opposite of `pristine`.

#### `meta.error : String` [optional]

> The error for this field array if its value is not passing validation. Both synchronous,
asynchronous, and submit validation errors will be reported here. Array-specific errors should be
returned from the validation function as an `_error` key on the array.

#### `meta.warning : String` [optional]

> The warning for this field array if its value is not passing warning validation. Array-specific
errors should be returned from the validation function as an `_warning` key on the array.

#### `meta.invalid : boolean`

> `true` if the field array value fails validation (has a validation error). Opposite of `valid`.

#### `meta.pristine : boolean`

> `true` if the all of the fields in the field array are the same as their initialized
value. Opposite of `dirty`.

#### `meta.submitting : boolean`

> `true` if the field is currently being submitted

#### `meta.valid : boolean`

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

#### `fields : Object`

> A reference to the [`fields` prop](#fields-props) to allow for the access to `swap`, `remove`,
`pop`, etc., without requiring closure scoping.
```javascript
const renderSubFields = (member, index, fields) => (
    <li key={index}>
      <button
        type="button"
        title="Remove Member"
        onClick={() => fields.remove(index)}/>
      <h4>Member #{index + 1}</h4>
      <Field
        name={`${member}.firstName`}
        type="text"
        component={renderField}
        label="First Name"/>
      <Field
        name={`${member}.lastName`}
        type="text"
        component={renderField}
        label="Last Name"/>
    </li>
)
const renderMembers = ({ fields }) => (
  <ul>
    <button type="button" onClick={() => fields.push({})}>Add Member</button>
    {fields.map(renderSubFields)}
  </ul>
)
```
