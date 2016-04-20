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

You can enhance the behavior of the `redux-form` reducer by calling additional methods on it
when you mount it to the Redux state. You may call as many of these on it as you wish, and each 
will return a new copy of the reducer with the additional functionality.

### [`reducer.syncValidation(Object<String, Object<String, Function>>)`](ReducerSyncValidation.md)

> Returns a form reducer that will also run the synchronous validation function given for each 
form name.

---

The old `v5` functionality of `normalize()` and `plugin()` have not yet been implemented in `v6`.
