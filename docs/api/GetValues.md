# `getValues()`

> `redux-form` exports a `getValues(state)` function that will allow you to read the form values from 
the Redux state manually. _This is an advanced maneuver and should be approached with caution._

> **IMPORTANT: You are responsible for isolating the proper state slice that corresponds to your form!**

## Example

Let's say your form is set up like this:

```javascript
import React, {Component} from 'react';
import {reduxForm} from 'redux-form';

@reduxForm({
  form: 'myForm'
})
class MyFormComponent extends Component {
  // ...
}

```

In some other component, or in an action creator where you have access to _the full Redux state_...

```javascript
import {getValues} from 'redux-form';

// ...

const myFormValues = getValues(fullState.form.myForm);
//                                       ^ default redux mount point for redux-form
//                                            ^ name of form given to reduxForm()
```

If you are doing something fancy, like [using ImmutableJS](#/faq/immutable-js), you are responsible for providing
a plain javascript object to `getValues()`.