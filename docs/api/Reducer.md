# `reducer`

[`View source on GitHub`](https://github.com/erikras/redux-form/blob/master/src/reducer.js)

> The form reducer. Should be mounted to your Redux state at `form`.

> If you absolutely must mount it somewhere other than `form`, you may provide a
`getFormState(state)` function to the `reduxForm()` decorator, to get the slice of the Redux 
state where you have mounted the `redux-form` reducer.

> If you're using Immutablejs to manage your Redux state, you MUST import the reducer from 'redux-form/immutable'.

### ES5 Example

```javascript
var redux = require('redux');
var formReducer = require('redux-form').reducer;
// Or with Immutablejs:
// var formReducer = require('redux-form/immutable').reducer;

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
// Or with Immutablejs:
// import { reducer as formReducer } from 'redux-form/immutable';

const reducers = {
  // ... your other reducers here ...
  form: formReducer
};
const reducer = combineReducers(reducers);
const store = createStore(reducer);
```
