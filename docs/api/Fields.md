# `Fields`

[`View source on GitHub`](https://github.com/erikras/redux-form/blob/master/src/Fields.js)

The `Fields` component is similar to the
[`Field`](https://redux-form.com/6.1.1/docs/api/Field.md/) component, but operates on multiple
fields at a time. Rather than passing a single `name` prop, `Fields` takes an array of names in 
the `names` prop.

**IMPORTANT: Connecting to multiple fields should be used sparingly, as it will require the 
entire `<Fields>` component to re-render every time any of the fields it is connected to change. 
This can be a performance bottleneck. Unless you absolutely need to, you should connect to your 
fields individually with `<Field>`.**

## Importing

```javascript
var Fields = require('redux-form').Fields;  // ES5
```
```javascript
import { Fields } from 'redux-form';  // ES6
```

## Props you can pass to `Fields`

#### `names : Array<String>` [required]

An array of strings (or the pseudo-array `fields` provided by
[`FieldArray`](https://redux-form.com/6.1.1/docs/api/FieldArray.md/)),
in dot-and-bracket notation, corresponding to form values. They may
be as simple as `'firstName'` or as complicated as
`contact.billing.address[2].phones[1].areaCode`. See the [Usage](#usage) section below for details.

#### `component : Component|Function` [required]

A `Component` or stateless function that will be given all the props necessary to render the 
field inputs. See the [Usage](#usage) section below for details.

#### `format : (value, name) => formattedValue` [optional]

Formats the value from the Redux store to be displayed in the field input. Common use cases are 
to format `Number`s into currencies or `Date`s into a localized date format.

`format` is called with the field `value` and `name` as arguments and should return the
new formatted value to be displayed in the field input.

#### `props : object` [optional]

Object with custom props to pass through the `Fields` component into a component provided
to `component` prop. This props will be merged to props provided by `Fields` itself. This _may_ be
useful if you are using TypeScript. This construct is completely optional; the primary way of 
passing props along to your `component` is to give them directly to the `Fields` component, but 
if, for whatever reason, you prefer to bundle them into a separate object, you may do so by 
passing them into `props`.

#### `parse : (value, name) => parsedValue` [optional]

Parses the value given from the field input component to the type that you want stored in the 
Redux store. Common use cases are to parse currencies into `Number`s into currencies or 
localized date formats into `Date`s.

`parse` is called with the field `value` and `name` as arguments and should return the new
parsed value to be stored in the Redux store.

#### `withRef : boolean` [optional]

If `true`, the rendered component will be available with the `getRenderedComponent()` method.
Defaults to `false`. **Cannot be used if your component is a stateless function component.**

## Usage

The `component` prop will be passed to
[`React.createElement()`](http://facebook.github.io/react/docs/top-level-api.html#react.createelement),
which accepts one of two possible things:

### 1. A component

This can be any component class that you have written or have imported from a third party library.

To learn what props will be passed to your component, see the [Props](#props) section below.

### 2. A stateless function

This is the most flexible way to use `<Fields>`, as it gives you complete control over how the
inputs is rendered. It is especially useful for displaying validation errors. It will also be the
most familiar to people migrating from previous versions of `redux-form`. **You must define the
stateless function outside of your `render()` method, or else it will be recreated on every
render and will force the `Fields` to rerender because its `component` prop will be different.**
If you are defining your stateless function inside of `render()`, it will not only be slower, but
your input will lose focus whenever the entire form component rerenders.

```js
// outside your render() method
const renderFields = (fields) => (
  <div>
    <div className="input-row">
      <input {...fields.firstName.input} type="text"/>
      {fields.firstName.meta.touched && fields.firstName.meta.error && 
       <span className="error">{fields.firstName.meta.error}</span>}
    </div>
    <div className="input-row">
      <input {...fields.lastName.input} type="text"/>
      {fields.lastName.meta.touched && fields.lastName.meta.error && 
       <span className="error">{fields.lastName.meta.error}</span>}
    </div>
  </div>
)

// inside your render() method
<Fields names={[ 'firstName', 'lastName' ]} component={renderFields}/>
```

To learn what props will be passed to your stateless function, see the [Props](#props) section
below.

## Instance API

The following properties and methods are available on an instance of a `Field` component.

#### `dirty : boolean`

> `true` if the current value of any of the fields is different from the initialized value, 
`false` otherwise.

#### `names : Array<String>`

> The `names` prop that you passed in.

#### `pristine : boolean`

> `true` if the all of the current values are the same as the initialized values, `false` otherwise.

#### `values : any`

> The current values of the fields. If they are nested, the values will duplicate the structure. 
For example, if your `names` are `[ 'name.first', 'name.last', 'email' ]`, the `values` will be
`{ name: { first: 'John', last: 'Smith' }, email: 'john@email.com' }`

#### `getRenderedComponent()`

> Returns the instance of the rendered component. For this to work, you must provide a
`withRef` prop, and your component must not be a stateless function component.

####

## Props

The props that `Fields` will pass to your component are [the same `input` and `meta` structures 
that `Field` generates](https://redux-form.com/6.1.1/docs/api/Field.md/#props), except that
they are broken up into the structure of the fields you gave as `names`. 

Any additional props that you pass to `Field` will be included at the root of the props structure
given to your component

For example, if the fields you gave are...
```jsx
<Fields 
  names={[ 
    'name',
    'email',
    'address.street', 
    'address.city', 
    'address.postalCode' 
  ]}
  component={MyMultiFieldComponent}
  anotherCustomProp="Some other information"/>
```
...the props given to your component would be of the structure:
```jsx
{
  name: { input: { ... }, meta: { ... } },
  email: { input: { ... }, meta: { ... } },
  address: {
    street: { input: { ... }, meta: { ... } },
    city: { input: { ... }, meta: { ... } },
    postalCode: { input: { ... }, meta: { ... } }
  },
  anotherCustomProp: 'Some other information'
}
```
