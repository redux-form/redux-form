# FAQ

Below is a list of common problems that people have using `redux-form`.

## 1) My submit function isn't being called! Help?

Possible causes:

* Your synchronous validation function is not returning `{}`. Probably because:
  * You are upgrading from a previous version of `redux-form` that required that `{valid: true}` be returned.
  * You have removed a field from your form, but forgotten to remove it from your validation function.
* Your asynchronous validation function is returning a rejected promise for some reason.

## 2) What's the difference between `handleSubmit` and `onSubmit`?

From what I can tell from every example I have seen, there is an unwritten – until now! – rule in the React community:

> **handleX is what you name the function that you pass to the onX prop.**

```javascript
render() {
  const handleClick = () => console.log('Clicked!');
  return <button onClick={handleClick}>Click me</button>;
}
```

Since the only way that redux-form can provide you with functionality is to pass it as a prop, it passes you a
`handleSubmit` for you to pass to `onSubmit`.

## 3) How can I clear my form after my submission succeeds?

Excellent question. You have several options:

### A) You can call `this.props.resetForm()` from inside your form after your submission succeeds.

```javascript
submitMyForm(data) {
  const {createRecord, resetForm} = this.props;
  return createRecord(data).then(() => {
    resetForm();
    // do other success stuff
  });
}

render() {
  const {handleSubmit, submitMyForm} = this.props;
  return (
    <form onSubmit={handleSubmit(submitMyForm.bind(this))}>
      // inputs
    </form>
  );
}
```

### B) You can dispatch `reset()` from any connected component

> Extremely flexible, but you have to know your form name and have `dispatch` available.

```javascript
import {reset} from 'redux-form';

...

dispatch(reset('myForm'));  // requires form name
```

### C) Simply unmount your form component

> For many use cases, you will want to either hide your form component after submission succeeds or navigate away to 
another page, which will cause `redux-form`'s default behavior of destroying the form data in the reducer in 
`componentWillUnmount`.

### D) You can use [the `plugin()` API](#/api/reducer/plugin) to teach the `redux-form` reducer to respond to the action dispatched when your submission succeeds.

> This has the benefit of not dispatching another action, but is complicated and requires knowledge of the internal 
state of the `redux-form` store. **NOT RECOMMENDED**

```javascript
import {createStore, combineReducers} from 'redux';
import {reducer as formReducer} from 'redux-form';
import {ACCOUNT_SAVE_SUCCESS} from '../actions/actionTypes';

const reducers = {
  // ... your other reducers here ...
  form: formReducer.plugin({
    account: (state, action) => { // <------ 'account' is name of form given to reduxForm()
      switch(action.type) {
        case ACCOUNT_SAVE_SUCCESS:
          return undefined;       // <--- blow away form data
        default:
          return state;
      }
    }
  })
}
const reducer = combineReducers(reducers);
const store = createStore(reducer);
```
