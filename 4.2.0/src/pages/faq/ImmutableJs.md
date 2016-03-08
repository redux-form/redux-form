<ol class="breadcrumb">
  <li><a href="#/">Redux Form</a></li>
  <li><a href="#/faq">FAQ</a></li>
  <li class="active">Does `redux-form` work ImmutableJS?</li>
</ol>

# Does `redux-form` work ImmutableJS?
  
Yes!

In an attempt to be both as light and unopinionated as possible, `redux-form` uses standard javascript data 
structures in its reducer. However, if your project is using
[redux-immutablejs](https://github.com/indexiatech/redux-immutablejs) to maintain your entire Redux store as an 
[ImmutableJS](https://facebook.github.io/immutable-js/) structure, you may still use `redux-form` by wrapping the
`redux-form` reducer in a function to convert to the ImmutableJS structure, and then use the `getFormState` 
configuration option to read the state into your form. Like so:

```javascript
// reducer.js
import {reducer as formReducer} from 'redux-form';
import { combineReducers } from 'redux-immutablejs';
import Immutable from 'immutable';

export const reducer = combineReducers({
  // ...your other reducers
  form: (state = Immutable.fromJS({}), action) => Immutable.fromJS(formReducer(state.toJS(), action));  // <--- IMPORTANT PART
});
```

```javascript
// SimpleForm.js
@reduxForm({
  form: 'simple',
  fields: ['firstName'],
  getFormState: (state, reduxMountPoint) => state.get(reduxMountPoint).toJS() // <--- IMPORTANT PART
})
export default class SimpleForm extends Component {
  // render form
}
```

## Demo

Ian Taylor has graciously published [a demo app](https://github.com/itaylor/redux-form-immutablejs-example) 
using this technique.
