<ol class="breadcrumb">
  <li><a href="#/">Redux Form</a></li>
  <li><a href="#/api">API</a></li>
  <li><a href="#/api/reducer">`reducer`</a></li>
  <li class="active">`reducer.normalize`</li>
</ol>

# `reducer.normalize(Object<String, Object<String, Function>>)`

> Returns a form reducer that will also pass each form value through the normalizing functions provided. The 
parameter is an object mapping from `formName` to an object mapping from `fieldName` to a normalizer function. The 
normalizer function is given three parameters and expected to return the normalized value of the field.

> The parameters passed to each normalizer function will be:

#### `value : String`

> The current value of the field.

#### `previousValue : String`

> The previous value of the field before the current action was dispatched.

#### `allValues : Object<String, String>`

> All the values of the current form.

## Explanation

Let's say that you have a form field that only accepts uppercase letters and another one where you want the value to 
be formatted in the `999-999-9999` United States phone number format. `redux-form` gives you a way to normalize your
data on every action to the reducer by calling the `normalize()` function on the default reducer.

## Example

```javascript
import {createStore, combineReducers} from 'redux';
import {reducer as formReducer} from 'redux-form';

const reducers = {
  // ... your other reducers here ...
  form: formReducer.normalize({
    contact: {                                           // <--- the form name
      licensePlate: (value, previousValue, allValues) => // <--- field normalizer
        value && value.toUpperCase(),
      phone: (value, previousValue, allValues) => {      // <--- field normalizer
        if (value) {
          const match = value.match(/(\d{3})-?(\d{3})-?(\d{4})/);
          if (match) {
            return `${match[1]}-${match[2]}-${match[3]}`;
          }
        }
        return value;
      },
      min: (value, previousValue, allValues) =>         // <--- field normalizer
        // keep min <= max
        value > allValues.max ? allValues.max : value,
      max: (value, previousValue, allValues) =>         // <--- field normalizer
        // keep max >= max
        value < allValues.min ? allValues.min : value
    }
  })
}
const reducer = combineReducers(reducers);
const store = createStore(reducer);
```
