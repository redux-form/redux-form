# Can I submit my form using websockets?
  
Yes. `redux-form` has built-in support for managing `submitting` state and errors using promises, but you can easily 
replicate its behavior using any other asynchronous paradigm. All you need do is to dispatch the `START_SUBMIT` and
`STOP_SUBMIT` actions yourself using the exported [Action Creators](#/api/action-creators).

```javascript
import {startSubmit, stopSubmit} from 'redux-form';

function submitForm(data, dispatch) {
  // tell redux-form that the submission has started
  dispatch(startSubmit('myFormName'));
  
  channels.methods.push('submit:myFormName', {data})
    receive('ok', () => {
      // tell redux-form that the submission has stopped
      dispatch(stopSubmit('myFormName'));
      // ^ not necessary if you are redirecting or doing something
      //   else that will result in the form state being destroyed
    })
    .receive('error', response => {
      const {errors} = response;
      // tell redux-form that the submission has stopped with errors
      dispatch(stopSubmit('myFormName', errors));
    });
}
```

The `submitForm` function can then be passed either as an `onSubmit` prop to your decorated form or as a parameter to
`handleSubmit()` inside your form component. For more on this, look at [the `handleSubmit()` docs](#/api/props).

---

Thanks to [Vlad Shcherbin](https://github.com/VladShcherbin) for presenting
[his solution](https://github.com/erikras/redux-form/issues/450#issuecomment-166457681), from which this answer was 
modeled.
