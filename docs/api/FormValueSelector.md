# `formValueSelector(form:String, [getFormState:Function])`

[`View source on GitHub`](https://github.com/erikras/redux-form/blob/master/src/formValueSelector.js)

> `formValueSelector` is a "selector" API to make it easier to `connect()` to
> form values. It _creates_ a selector function that accepts field names and
> returns corresponding values from the named form.

## Importing

```javascript
var formValueSelector = require('redux-form').formValueSelector // ES5
```

```javascript
import { formValueSelector } from 'redux-form' // ES6
```

## Parameters

### `form : String` [required]

> The name of the form you are connecting to. Must be the same as the `form`
> config value you gave to
> [`reduxForm()`](https://redux-form.com/8.0.0/docs/api/ReduxForm.md/).

### `getFormState : Function` [optional]

> If you are using the `getFormState()` config parameter to keep the
> `redux-form` reducer at a place in your Redux store other than `state.form`,
> you must also provide the same function here to get the slice of Redux store
> where the `redux-form` reducer is mounted. Defaults to `state => state.form`.

## Selector

The function returned from `formValueSelector()` has the following structure:

### selector(state:Object, ...field:String)

#### `state : Object` [required]

> The global Redux state given to `mapStateToProps`.

#### `...field : String` [required]

> The field, or fields, you want to select. If you provide only one field name,
> the function will return the value of that field. If you provide more than one
> field name, it will return an object mapping fields to values. If your field
> are "deep" (i.e. has one or more `.` in the name), the structure you get back
> will also be deep. e.g. If your fields are `'a.b'` and `'a.c'`, the resulting
> structure will be `{ a: { b: 'bValue', c: 'cValue' } }`.

## Usage

The first thing you do is create a selector for your form name.

```javascript
const selector = formValueSelector('myFormName')
```

Then, there are several ways to use the selector that was created.

### 1. Select fields individually

```javascript
connect(state => ({
  firstValue: selector(state, 'first'),
  secondValue: selector(state, 'second')
}))(MyFormComponent)
```

### 2. Select multiple fields as a group into a grouped prop

```javascript
connect(state => ({
  myValues: selector(state, 'first', 'second')
}))(MyFormComponent)
```

### 3. Use the selector as `mapStateToProps`

If you don't need any other props from the state, the selector itself works just
fine as `mapStateToProps` if you are selecting multiple fields.

```javascript
connect(state => selector(state, 'first', 'second'))(MyFormComponent)
```

## Example

See the
[Selecting Form Values](https://redux-form.com/8.0.0/examples/selectingFormValues/)
example.
