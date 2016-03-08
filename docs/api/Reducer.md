# `reducer`

> The form reducer. Should be given to mounted to your Redux state at `form`.

> If you absolutely must mount it somewhere other than `form`, you must specify the 
[`reduxMountPoint` config property](ReduxForm.md) to all of your decorated form components.
See [Alternate Mount Point Example](../../examples/alternate-mount-point) for more details.

### ES5 Example

```javascript
var redux = require('redux');
var formReducer = require('redux-form').reducer;

var reducers = {
  // ... your other reducers here ...
  form: formReducer
};
var reducer = redux.combineReducers(reducers);
var store = redux.createStore(reducer);
```

### ES6 Example

```javascript
import { createStore, combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

const reducers = {
  // ... your other reducers here ...
  form: formReducer
};
const reducer = combineReducers(reducers);
const store = createStore(reducer);
```

### Addtional Functionality

You can enhance the behavior of the `redux-form` reducer by calling additional methods on it when you mount it to 
the Redux state.

### [`reducer.normalize(Object<String, Object<String, Function>>)`](ReducerNormalize.md)

> Returns a form reducer that will also pass each form value through the normalizing functions provided. The 
parameter is an object mapping from `formName` to an object mapping from `fieldName` to a normalizer function. The 
normalizer function is given four parameters and expected to return the normalized value of the field.
[See details](ReducerNormalize.md).

### [`reducer.plugin(Object<String, Function>)`](ReducerPlugin.md)

> Returns a form reducer that will also pass each action through additional reducers specified. The parameter should 
be an object mapping from `formName` to a `(state, action) => nextState` reducer.
[See details](ReducerPlugin.md).
