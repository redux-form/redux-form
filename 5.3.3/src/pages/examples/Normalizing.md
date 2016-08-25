If you need to perform some operation on your data _as it is being entered_ into your form, you may do that using
`redux-form`'s [`normalize()` API](#/api/reducer/normalize), which lets you 
provide a function for each form field that takes the current value, the previous value, all the form values, and all
the previous form values, and lets you return the value that should be assigned to the field. This lets you flexibly 
maintain your form values within any parameters you wish, from something as simple as making sure that only digits 
are entered into a numeric field to keeping the lat-long coordinates of a mapping input within a given radius.

The form below demonstrates four normalized fields.

### `upper`

> Will keep the input in uppercase. The normalization function is literally just
`value => value && value.toUppercase()`.

### `phone`

> Formats the numeric-only input into a US phone number as you type.

### `min` and `max`

> If `min` goes above `max`, `max` will adjust, and vice versa. You cannot set them such that `min > max`.

The way these normalizers are assigned to the `redux-form` reducer is by adding them with the 
[`normalize()` API](#/api/reducer/normalize).

```javascript
import {createStore, combineReducers} from 'redux';
import {reducer as form} from 'redux-form';

const reducer = combineReducers({
  // other reducers
  form: form.normalize({
    normalizing: {                                    // <--- name of the form
      upper: value => value && value.toUpperCase(),   // normalizer for 'upper' field
      phone: normalizePhone,                          // normalizer for 'phone' field
      min: normalizeMin,                              // normalizer for 'min' field
      max: normalizeMax                               // normalizer for 'max' field
    }
  })
});
const store = getCreateStore()(reducer);
```
