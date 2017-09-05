# `formValues(options:Object<String, String> | name1:String, name2:String, ...)`

[`View source on GitHub`](https://github.com/erikras/redux-form/blob/master/src/formValues.js)

> A decorator to read a selection of the current form values. This is useful for subforms that change depending on the current values in the form.

## Importing

```javascript
var formValues = require('redux-form').formValues;  // ES5
```
```javascript
import { formValues } from 'redux-form';  // ES6
```

## Parameters

### name

The path to the field, exactly like the `name` parameter of [`<Field/>`](https://redux-form.com/7.0.4/docs/api/Field.md/).

### options: {prop: name, ...}

If you use the first form with the options object, the keys of the object will be the names of the props passed.

## Usage

```javascript
const ItemList = formValues('withVat')(MyItemizedList)
```
```javascript
const ItemList = formValues({showVat: 'withVat'})(MyItemizedList)
```

These decorated components will now get the props `withVat` and `showVat`, respectively.

## A note on performance

This decorator causes the component to `render()` every time one of the selected values changes. If you have a large form, this can cause some UI lag. (This is the reason that `<Field/>` components are attached to single form values)

Therefore, use this sparingly; perhaps you can solve your problem with a more specialized input component.
