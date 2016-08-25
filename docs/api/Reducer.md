# `reducer`

> The form reducer. Should be given to mounted to your Redux state at `form`.

> If you absolutely must mount it somewhere other than `form`, you may provide a
`getFormState(state)` function to the `reduxForm()` decorator, to get the slice of the Redux 
state where you have mounted the `redux-form` reducer.

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

---

### Additional Functionality

### [`reducer.normalize(Object<String, Object<String, Function>>)`](ReducerNormalize.md)

> Returns a form reducer that will also pass each form value through the normalizing functions
provided. The parameter is an object mapping from `formName` to an object mapping from
`fieldName` to a normalizer function. The normalizer function is given four parameters and
expected to return the normalized value of the field. [See details](ReducerNormalize.md).
