# `reducer.plugin(Object<String, Function>)`

> Returns a form reducer that will also pass each action through additional reducers specified. The parameter should 
be an object mapping from `formName` to a `(state, action) => nextState` reducer. **The `state` passed to each reducer 
will only be the slice that pertains to that form.**

## Explanation

Part of the beauty of the flux architecture is that all the reducers (or "stores", in canonical Flux terminology)
receive all the actions, and they can modify their data based on any of them. For example, say you have a login form,
and when your login submission fails, you want to clear out the password field. Your login submission is part of
another reducer/actions system, but your form can still respond.

Rather than just using the vanilla reducer from `redux-form`, you can augment it to do other things by calling 
the `plugin()` function.

## Example

The example below will clear the `login` form's `password` field when the `AUTH_LOGIN_FAIL` action is dispatched.

```javascript
import {createStore, combineReducers} from 'redux';
import {reducer as formReducer} from 'redux-form';
import {AUTH_LOGIN_FAIL} from '../actions/actionTypes';

const reducers = {
  // ... your other reducers here ...
  form: formReducer.plugin({
    login: (state, action) => { // <------ 'login' is name of form given to reduxForm()
      switch(action.type) {
        case AUTH_LOGIN_FAIL:
          return {
            ...state,
            password: {}        // <----- clear password field
          };
        default:
          return state;
      }
    }
  })
}
const reducer = combineReducers(reducers);
const store = createStore(reducer);
```
